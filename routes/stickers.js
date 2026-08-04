const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { getRuntimeUploadDir } = require('../services/storageLocation');

const router = express.Router();
router.use(authRequired);

// 表情包文件：动图/静态图统一存到 USER_ID/stickers/ 子目录，支持 GIF/PNG/JPG/WebP
const stickerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(getRuntimeUploadDir(), String(req.user.id), 'stickers');
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.gif';
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname + String(req.user.id)).digest('hex').slice(0, 12);
    cb(null, `stk_${Date.now()}_${hash}${ext}`);
  }
});

const stickerUpload = multer({
  storage: stickerStorage,
  limits: { fileSize: (parseInt(process.env.MAX_STICKER_SIZE, 10) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const allowedExt = ['.gif', '.png', '.jpg', '.jpeg', '.webp'];
    const mimeOk = /^image\/(gif|png|jpeg|jpg|webp)$/.test(file.mimetype || '');
    if (mimeOk || allowedExt.includes(ext)) cb(null, true);
    else cb(new Error('表情包仅支持 GIF / PNG / JPG / WEBP 格式（GIF 动图可直接上传）'));
  }
});

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function checkStickerStorage(user, addSize) {
  const row = db.prepare('SELECT storage_limit, status FROM users WHERE id = ?').get(user.id);
  if (!row) throw new Error('用户不存在');
  if (row.status === 'disabled') throw new Error('账户已被停用');
  const used = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM files WHERE user_id = ?').get(user.id).s;
  if (used + addSize > row.storage_limit) {
    throw new Error('存储空间不足，剩余 ' + formatBytes(Math.max(0, row.storage_limit - used)) + '，本次需要 ' + formatBytes(addSize));
  }
}

// 表情包列表（全站表情包：上传者信息 + 文件信息；mine 标识当前用户上传的）
router.get('/', (req, res) => {
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 200));
  const rows = db.prepare(
    `SELECT s.id, s.user_id, s.name, s.emoji, s.is_public, s.created_at,
            u.username AS uploader_username, u.nickname AS uploader_nickname, u.avatar AS uploader_avatar,
            f.id AS file_id, f.kind, f.filename, f.original_name, f.mime_type, f.size, f.url
     FROM stickers s
     JOIN users u ON u.id = s.user_id
     JOIN files f ON f.id = s.file_id
     ORDER BY s.created_at DESC
     LIMIT ?`
  ).all(limit);
  const items = rows.map(r => ({
    id: r.id,
    user_id: r.user_id,
    name: r.name,
    emoji: r.emoji,
    is_public: !!r.is_public,
    created_at: r.created_at,
    mine: r.user_id === req.user.id,
    uploader: { id: r.user_id, username: r.uploader_username, nickname: r.uploader_nickname, avatar: r.uploader_avatar },
    file: { id: r.file_id, kind: r.kind, filename: r.filename, original_name: r.original_name, mime_type: r.mime_type, size: r.size, url: r.url }
  }));
  const total = db.prepare('SELECT COUNT(*) AS c FROM stickers').get().c;
  res.json({ items, total });
});

// 上传新表情包（multipart: file + name + emoji）
router.post('/', stickerUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到表情包文件' });
  try {
    checkStickerStorage(req.user, req.file.size);
  } catch (e) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  const name = (req.body.name || '').toString().trim().slice(0, 50);
  const emoji = (req.body.emoji || '').toString().trim().slice(0, 16);
  const originalName = (req.body.originalName || req.file.originalname || '表情包').toString().slice(0, 200);
  const url = `/uploads/${req.user.id}/stickers/${req.file.filename}`;
  const fileId = db.prepare(
    `INSERT INTO files (user_id, kind, filename, original_name, mime_type, size, url, folder)
     VALUES (?, 'image', ?, ?, ?, ?, ?, 'stickers')`
  ).run(req.user.id, req.file.filename, originalName, req.file.mimetype || 'image/gif', req.file.size, url).lastInsertRowid;
  const sid = db.prepare(
    'INSERT INTO stickers (user_id, file_id, name, emoji) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, fileId, name, emoji).lastInsertRowid;
  res.status(201).json({
    id: sid,
    file_id: fileId,
    name,
    emoji,
    url,
    size: req.file.size,
    mime_type: req.file.mimetype || '',
    mine: true
  });
});

// 删除表情包（上传者本人或管理员）
router.delete('/:id', (req, res) => {
  const sid = parseInt(req.params.id, 10);
  if (!sid) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT user_id, file_id FROM stickers WHERE id = ?').get(sid);
  if (!row) return res.status(404).json({ error: '表情包不存在' });
  const isAdmin = !!db.prepare('SELECT is_admin FROM users WHERE id = ?').get(req.user.id).is_admin;
  if (row.user_id !== req.user.id && !isAdmin) {
    return res.status(403).json({ error: '只能删除自己上传的表情包' });
  }
  const file = db.prepare('SELECT filename, url FROM files WHERE id = ?').get(row.file_id);
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM stickers WHERE id = ?').run(sid);
    // 若该文件未被消息引用，同时删除文件记录与磁盘文件；否则保留（历史消息仍需展示）
    const used = db.prepare('SELECT 1 FROM messages WHERE file_id = ? LIMIT 1').get(row.file_id);
    if (!used) {
      db.prepare('DELETE FROM files WHERE id = ?').run(row.file_id);
    }
  });
  tx();
  if (file && !db.prepare('SELECT 1 FROM messages WHERE file_id = ? LIMIT 1').get(row.file_id)) {
    try {
      const abs = path.join(getRuntimeUploadDir(), String(row.user_id), 'stickers', file.filename);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch (_) {}
  }
  res.json({ message: '表情包已删除' });
});

module.exports = router;

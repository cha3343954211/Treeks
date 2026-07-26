const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { getRuntimeUploadDir } = require('../services/storageLocation');

const router = express.Router();

// 图片上传配置
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(getRuntimeUploadDir(), String(req.user.id));
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname).digest('hex').slice(0, 12);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    cb(null, `${dateStr}_${hash}${ext}`);
  }
});

// PDF 上传配置（用 pdf/ 子目录，扩展名固定为 .pdf）
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(getRuntimeUploadDir(), String(req.user.id), 'pdf');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname + (req.user.id || '')).digest('hex').slice(0, 12);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    cb(null, `${dateStr}_${hash}.pdf`);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 10) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp|svg\+xml/;
    const ok = allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) cb(null, true);
    else cb(new Error('仅支持 jpeg/jpg/png/gif/webp/bmp/svg 格式'));
  }
});

// PDF 限制：单文件最大 50MB
const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: (parseInt(process.env.MAX_PDF_SIZE, 10) || 50) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('仅支持 PDF 格式'));
    }
  }
});

router.use(authRequired);

// 检查用户存储配额
function checkStorage(user, addSize) {
  const row = db.prepare('SELECT storage_limit, status FROM users WHERE id = ?').get(user.id);
  if (!row) throw new Error('用户不存在');
  if (row.status === 'disabled') throw new Error('账户已被停用');
  const used = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM images WHERE user_id = ?').get(user.id).s;
  if (used + addSize > row.storage_limit) {
    throw new Error(`存储空间不足，剩余 ${formatBytes(Math.max(0, row.storage_limit - used))}，本次需要 ${formatBytes(addSize)}`);
  }
  return row.storage_limit;
}

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// 上传单张图片
router.post('/image', imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到图片文件' });
  try {
    checkStorage(req.user, req.file.size);
  } catch (e) {
    // 删除已落盘文件
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  const url = `/uploads/${req.user.id}/${req.file.filename}`;
  const result = db.prepare(
    'INSERT INTO images (user_id, filename, original_name, size, url) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, req.file.filename, req.file.originalname, req.file.size, url);
  res.status(201).json({
    id: result.lastInsertRowid,
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    markdown: `![${req.file.originalname}](${url})`
  });
});

// 上传多张图片
router.post('/images', imageUpload.array('images', 9), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '未接收到图片文件' });
  }
  const totalSize = req.files.reduce((s, f) => s + f.size, 0);
  try {
    checkStorage(req.user, totalSize);
  } catch (e) {
    for (const f of req.files) { try { fs.unlinkSync(f.path); } catch (_) {} }
    return res.status(400).json({ error: e.message });
  }
  const insertStmt = db.prepare(
    'INSERT INTO images (user_id, filename, original_name, size, url) VALUES (?, ?, ?, ?, ?)'
  );
  const items = req.files.map(f => {
    const url = `/uploads/${req.user.id}/${f.filename}`;
    const info = insertStmt.run(req.user.id, f.filename, f.originalname, f.size, url);
    return {
      id: info.lastInsertRowid,
      url,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      markdown: `![${f.originalname}](${url})`
    };
  });
  res.status(201).json({ items });
});

// 获取用户的图片列表
router.get('/images', (req, res) => {
  const rows = db.prepare(
    'SELECT id, filename, original_name, size, url, created_at FROM images WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json({ items: rows });
});

// 获取存储空间使用情况
router.get('/storage', (req, res) => {
  const row = db.prepare('SELECT storage_limit, status FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  const used = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM images WHERE user_id = ?').get(req.user.id).s;
  const count = db.prepare('SELECT COUNT(*) as c FROM images WHERE user_id = ?').get(req.user.id).c;
  res.json({
    used,
    limit: row.storage_limit,
    count,
    available: Math.max(0, row.storage_limit - used),
    percent: row.storage_limit > 0 ? Math.min(100, (used / row.storage_limit) * 100) : 100
  });
});

// 删除图片
router.delete('/images/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM images WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: '图片不存在' });

  const filePath = path.join(getRuntimeUploadDir(), String(req.user.id), row.filename);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) { console.error('删除文件失败', e.message); }
  }
  db.prepare('DELETE FROM images WHERE id = ?').run(req.params.id);
  res.json({ message: '已删除' });
});

// ============ PDF 上传与服务 ============

// 上传 PDF（仅返回 url 与原始文件名，不绑定日记；绑定由前端在创建/更新日记时写入 pdf_filename）
router.post('/pdf', pdfUpload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到 PDF 文件' });
  try {
    checkStorage(req.user, req.file.size);
  } catch (e) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  // 使用 /api/upload/pdf/:filename 接口提供 PDF 文件（带鉴权 + 范围请求支持），
  // 避免被 /uploads 静态服务无鉴权暴露
  const url = `/api/upload/pdf/${req.file.filename}`;
  res.status(201).json({
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// PDF 文件服务（带鉴权 + 范围请求支持）
// 注意：必须放在通用 /uploads 静态服务之前，因为通用服务不做鉴权
router.get('/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  // 防路径穿越
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: '无效的文件名' });
  }
  const filePath = path.join(getRuntimeUploadDir(), String(req.user.id), 'pdf', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'private, max-age=300');
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10) || 0;
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunksize);
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Length', fileSize);
    fs.createReadStream(filePath).pipe(res);
  }
});

module.exports = router;

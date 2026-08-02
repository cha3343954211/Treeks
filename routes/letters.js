const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { isFriend } = require('../services/permissions');

const router = express.Router();
router.use(authRequired);

// 发送信件
router.post('/', (req, res) => {
  const { recipientId, subject, content, diaryId, fileId } = req.body || {};
  const rid = parseInt(recipientId, 10);
  if (!rid) return res.status(400).json({ error: '请指定收件人' });
  if (rid === req.user.id) return res.status(400).json({ error: '不能给自己写信' });

  // 仅限好友之间
  if (!isFriend(req.user.id, rid)) return res.status(403).json({ error: '只能给好友发送信件' });

  const recipient = db.prepare('SELECT id, status FROM users WHERE id = ?').get(rid);
  if (!recipient) return res.status(404).json({ error: '收件人不存在' });
  if (recipient.status !== 'active') return res.status(400).json({ error: '收件人已被停用' });
  if (typeof subject !== 'undefined' && typeof subject !== 'string') return res.status(400).json({ error: '主题格式无效' });
  if (typeof content !== 'string' || !content.trim()) return res.status(400).json({ error: '信件内容不能为空' });
  if (content.length > 100000) return res.status(413).json({ error: '信件内容过长' });

  // 可选附带日记：必须是自己的日记，或被授权可见/协作的
  let diaryIdVal = null;
  if (diaryId) {
    const did = parseInt(diaryId, 10);
    const diary = db.prepare('SELECT id, user_id, visibility FROM diaries WHERE id = ?').get(did);
    if (!diary) return res.status(404).json({ error: '附带的日记不存在' });
    const canShare = diary.user_id === req.user.id
      || !!db.prepare('SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').get(did, req.user.id)
      || !!db.prepare('SELECT 1 FROM diary_visible_to WHERE diary_id = ? AND user_id = ?').get(did, req.user.id);
    if (!canShare) return res.status(403).json({ error: '无权分享该日记' });
    diaryIdVal = did;
  }

  // 可选附带文件附件：校验当前发送者是否拥有该文件
  let fileIdVal = null;
  if (fileId) {
    const fid = parseInt(fileId, 10);
    const fileItem = db.prepare('SELECT id, user_id FROM files WHERE id = ?').get(fid);
    if (!fileItem) return res.status(404).json({ error: '附件文件不存在' });
    if (fileItem.user_id !== req.user.id) return res.status(403).json({ error: '无权发送此文件' });
    fileIdVal = fid;
  }

  const result = db.prepare(
    'INSERT INTO letters (sender_id, recipient_id, diary_id, file_id, subject, content) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, rid, diaryIdVal, fileIdVal, (subject || '').slice(0, 200), content);

  res.status(201).json({ id: result.lastInsertRowid, message: '信件已发送' });
});

// 收件箱
router.get('/inbox', (req, res) => {
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 200));
  const rows = db.prepare(
    `SELECT l.id, l.subject, l.content, l.is_read, l.created_at, l.read_at, l.diary_id, l.file_id,
            u.id AS sender_id, u.username AS sender_username, u.nickname AS sender_nickname, u.avatar AS sender_avatar,
            d.title AS diary_title,
            f.filename AS file_name, f.original_name AS file_orig_name, f.url AS file_url, f.size AS file_size, f.kind AS file_kind
     FROM letters l
     JOIN users u ON u.id = l.sender_id
     LEFT JOIN diaries d ON d.id = l.diary_id
     LEFT JOIN files f ON f.id = l.file_id
     WHERE l.recipient_id = ?
     ORDER BY l.is_read ASC, l.created_at DESC
     LIMIT ?`
  ).all(req.user.id, limit);
  const total = db.prepare('SELECT COUNT(*) AS c FROM letters WHERE recipient_id = ?').get(req.user.id).c;
  res.json({ items: rows, total });
});

// 发件箱
router.get('/sent', (req, res) => {
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 200));
  const rows = db.prepare(
    `SELECT l.id, l.subject, l.content, l.created_at, l.diary_id, l.file_id,
            u.id AS recipient_id, u.username AS recipient_username, u.nickname AS recipient_nickname, u.avatar AS recipient_avatar,
            d.title AS diary_title,
            f.filename AS file_name, f.original_name AS file_orig_name, f.url AS file_url, f.size AS file_size, f.kind AS file_kind
     FROM letters l
     JOIN users u ON u.id = l.recipient_id
     LEFT JOIN diaries d ON d.id = l.diary_id
     LEFT JOIN files f ON f.id = l.file_id
     WHERE l.sender_id = ?
     ORDER BY l.created_at DESC
     LIMIT ?`
  ).all(req.user.id, limit);
  const total = db.prepare('SELECT COUNT(*) AS c FROM letters WHERE sender_id = ?').get(req.user.id).c;
  res.json({ items: rows, total });
});

// 查看信件详情（标记已读）
router.get('/:id', (req, res) => {
  const lid = parseInt(req.params.id, 10);
  const letter = db.prepare(
    `SELECT l.*, u.username AS sender_username, u.nickname AS sender_nickname, u.avatar AS sender_avatar,
            d.title AS diary_title, d.content AS diary_content,
            f.filename AS file_name, f.original_name AS file_orig_name, f.url AS file_url, f.size AS file_size, f.kind AS file_kind
     FROM letters l
     JOIN users u ON u.id = l.sender_id
     LEFT JOIN diaries d ON d.id = l.diary_id
     LEFT JOIN files f ON f.id = l.file_id
     WHERE l.id = ?`
  ).get(lid);
  if (!letter) return res.status(404).json({ error: '信件不存在' });
  if (letter.recipient_id !== req.user.id && letter.sender_id !== req.user.id) {
    return res.status(403).json({ error: '无权查看此信件' });
  }

  // 收件人查看时标记已读
  if (letter.recipient_id === req.user.id && !letter.is_read) {
    db.prepare("UPDATE letters SET is_read = 1, read_at = datetime('now') WHERE id = ?").run(lid);
  }

  res.json({
    id: letter.id,
    subject: letter.subject,
    content: letter.content,
    is_read: !!letter.is_read,
    created_at: letter.created_at,
    read_at: letter.read_at,
    sender: {
      id: letter.sender_id,
      username: letter.sender_username,
      nickname: letter.sender_nickname,
      avatar: letter.sender_avatar
    },
    diary: letter.diary_id ? {
      id: letter.diary_id,
      title: letter.diary_title,
      content: letter.recipient_id === req.user.id ? letter.diary_content : undefined
    } : null,
    file: letter.file_id ? {
      id: letter.file_id,
      filename: letter.file_name,
      original_name: letter.file_orig_name,
      url: letter.file_url,
      size: letter.file_size,
      kind: letter.file_kind
    } : null
  });
});

// 删除信件（仅收件人/发件人可删自己的副本）
router.delete('/:id', (req, res) => {
  const lid = parseInt(req.params.id, 10);
  const letter = db.prepare('SELECT sender_id, recipient_id FROM letters WHERE id = ?').get(lid);
  if (!letter) return res.status(404).json({ error: '信件不存在' });
  if (letter.sender_id !== req.user.id && letter.recipient_id !== req.user.id) {
    return res.status(403).json({ error: '无权删除此信件' });
  }
  db.prepare('DELETE FROM letters WHERE id = ?').run(lid);
  res.json({ message: '已删除' });
});

// 未读数
router.get('/unread/count', (req, res) => {
  const c = db.prepare('SELECT COUNT(*) AS c FROM letters WHERE recipient_id = ? AND is_read = 0').get(req.user.id).c;
  res.json({ unread: c });
});

module.exports = router;

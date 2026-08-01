const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { pushToUser } = require('../services/collab');

const router = express.Router();
router.use(authRequired);

// 获取会话伙伴信息（好友信息）
function peerInfo(uid) {
  const u = db.prepare('SELECT id, username, nickname, avatar, status FROM users WHERE id = ?').get(uid);
  if (!u) return null;
  return {
    id: u.id,
    username: u.username,
    nickname: u.nickname || u.username,
    avatar: u.avatar || '',
    status: u.status
  };
}

// 会话列表（最近聊过的好友，按最后一条消息时间倒序）
router.get('/conversations', (req, res) => {
  // 找出所有和我互相发过消息的用户
  const rows = db.prepare(
    `SELECT peer AS peer_id, latest_at, unread FROM (
        SELECT
          CASE WHEN sender_id = ? THEN recipient_id ELSE sender_id END AS peer,
          MAX(created_at) AS latest_at,
          SUM(CASE WHEN recipient_id = ? AND is_read = 0 THEN 1 ELSE 0 END) AS unread
        FROM messages
        WHERE sender_id = ? OR recipient_id = ?
        GROUP BY peer
      ) t
     ORDER BY latest_at DESC`
  ).all(req.user.id, req.user.id, req.user.id, req.user.id);
  const items = rows.map(r => {
    const peer = peerInfo(r.peer_id);
    if (!peer) return null;
    // 取最后一条消息预览
    const last = db.prepare(
      `SELECT id, content, file_id, sender_id, created_at FROM messages
       WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at DESC LIMIT 1`
    ).get(req.user.id, r.peer_id, r.peer_id, req.user.id);
    return {
      peer,
      latest_at: r.latest_at,
      unread: r.unread || 0,
      last_message: last ? {
        id: last.id,
        content: last.content || '',
        file_id: last.file_id,
        sender_id: last.sender_id,
        created_at: last.created_at
      } : null
    };
  }).filter(Boolean);
  res.json({ items });
});

// 与某用户的历史消息（分页，可选 before 消息 ID）
router.get('/with/:peerId', (req, res) => {
  const peerId = parseInt(req.params.peerId, 10);
  if (!peerId) return res.status(400).json({ error: '参数错误' });
  if (peerId === req.user.id) return res.status(400).json({ error: '不能查询自己' });
  // 仅限好友
  const isFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(req.user.id, peerId);
  if (!isFriend) return res.status(403).json({ error: '只能与好友聊天' });
  const limit = Math.min(100, Math.max(20, parseInt(req.query.limit, 10) || 50));
  const before = req.query.before ? parseInt(req.query.before, 10) : null;
  // 注意：m.file_id 与 f.id 在 JOIN 后值相同（或都为 NULL），统一用 m.file_id 即可
  // 避免 SELECT 中出现两个 file_id 列导致结果集列名冲突
  const selectCols = `m.id, m.sender_id, m.recipient_id, m.content, m.file_id, m.is_read, m.created_at, m.read_at,
              f.kind AS file_kind, f.filename AS file_filename, f.original_name AS file_original_name,
              f.size AS file_size, f.url AS file_url`;
  let rows;
  if (before) {
    rows = db.prepare(
      `SELECT ${selectCols}
       FROM messages m
       LEFT JOIN files f ON f.id = m.file_id
       WHERE ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))
         AND m.id < ?
       ORDER BY m.id DESC
       LIMIT ?`
    ).all(req.user.id, peerId, peerId, req.user.id, before, limit);
  } else {
    rows = db.prepare(
      `SELECT ${selectCols}
       FROM messages m
       LEFT JOIN files f ON f.id = m.file_id
       WHERE (m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?)
       ORDER BY m.id DESC
       LIMIT ?`
    ).all(req.user.id, peerId, peerId, req.user.id, limit);
  }
  // 聚合反应 Emoji
  const msgIds = rows.map(r => r.id);
  const reactMap = {};
  if (msgIds.length > 0) {
    const reactRows = db.prepare(`
      SELECT message_id, emoji, COUNT(*) as count, MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as mine
      FROM message_reactions WHERE message_id IN (${msgIds.map(()=>'?').join(',')}) GROUP BY message_id, emoji
    `).all(req.user.id, ...msgIds);
    for (const r of reactRows) {
      if (!reactMap[r.message_id]) reactMap[r.message_id] = [];
      reactMap[r.message_id].push({ emoji: r.emoji, count: r.count, mine: !!r.mine });
    }
  }

  const items = rows.reverse().map(r => ({
    ...r,
    reactions: reactMap[r.id] || []
  }));
  res.json({ items });
});

// 发送消息（body: { peerId, content, fileId }）
router.post('/', (req, res) => {
  const { peerId, content, fileId } = req.body || {};
  const rid = parseInt(peerId, 10);
  if (!rid) return res.status(400).json({ error: '请指定收件人' });
  if (rid === req.user.id) return res.status(400).json({ error: '不能给自己发消息' });
  const isFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(req.user.id, rid);
  if (!isFriend) return res.status(403).json({ error: '只能给好友发消息' });
  const recipient = db.prepare('SELECT status FROM users WHERE id = ?').get(rid);
  if (!recipient) return res.status(404).json({ error: '收件人不存在' });
  if (recipient.status !== 'active') return res.status(400).json({ error: '收件人已被停用' });
  if (content != null && typeof content !== 'string') return res.status(400).json({ error: '消息内容格式无效' });
  const text = (content || '').slice(0, 4000);
  let fid = null;
  if (fileId) {
    fid = parseInt(fileId, 10);
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(fid, req.user.id);
    if (!file) return res.status(404).json({ error: '文件不存在或不属于你' });
  }
  if (!text && !fid) return res.status(400).json({ error: '消息内容不能为空' });
  const info = db.prepare(
    'INSERT INTO messages (sender_id, recipient_id, content, file_id) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, rid, text, fid);
  // 实时推送给收件人
  pushToUser(rid, {
    type: 'message',
    data: {
      id: info.lastInsertRowid,
      sender_id: req.user.id,
      recipient_id: rid,
      content: text,
      file_id: fid,
      created_at: new Date().toISOString()
    }
  });
  res.status(201).json({ id: info.lastInsertRowid, message: '已发送' });
});

// 全部未读数
router.get('/unread/count', (req, res) => {
  const c = db.prepare('SELECT COUNT(*) AS c FROM messages WHERE recipient_id = ? AND is_read = 0').get(req.user.id).c;
  res.json({ unread: c });
});

// 标记与某人的消息全部已读
router.post('/read/:peerId', (req, res) => {
  const peerId = parseInt(req.params.peerId, 10);
  if (!peerId) return res.status(400).json({ error: '参数错误' });
  db.prepare("UPDATE messages SET is_read = 1, read_at = datetime('now') WHERE recipient_id = ? AND sender_id = ? AND is_read = 0")
    .run(req.user.id, peerId);
  res.json({ message: '已标记为已读' });
});

// 切换消息 Emoji 表情回应（点赞/添加/取消）
router.post('/:id/reactions', (req, res) => {
  const mid = parseInt(req.params.id, 10);
  const { emoji } = req.body || {};
  if (!mid || !emoji) return res.status(400).json({ error: '参数错误' });

  const msg = db.prepare('SELECT sender_id, recipient_id FROM messages WHERE id = ?').get(mid);
  if (!msg || (msg.sender_id !== req.user.id && msg.recipient_id !== req.user.id)) {
    return res.status(403).json({ error: '无权操作此消息' });
  }

  const existing = db.prepare('SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?').get(mid, req.user.id, emoji);
  if (existing) {
    db.prepare('DELETE FROM message_reactions WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)').run(mid, req.user.id, emoji);
  }

  const reactions = db.prepare(`
    SELECT emoji, COUNT(*) as count, MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as mine
    FROM message_reactions WHERE message_id = ? GROUP BY emoji
  `).all(req.user.id, mid);

  res.json({ messageId: mid, reactions });
});

module.exports = router;

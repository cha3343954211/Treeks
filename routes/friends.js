const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// 用户公开信息字段
const USER_FIELDS = 'id, username, nickname, avatar, bio, created_at';

// 发送好友请求
router.post('/requests', (req, res) => {
  const { toUserId, message } = req.body || {};
  const toId = parseInt(toUserId, 10);
  if (!toId) return res.status(400).json({ error: '请指定目标用户' });
  if (toId === req.user.id) return res.status(400).json({ error: '不能添加自己为好友' });

  const target = db.prepare('SELECT id, status FROM users WHERE id = ?').get(toId);
  if (!target) return res.status(404).json({ error: '目标用户不存在' });
  if (target.status !== 'active') return res.status(400).json({ error: '目标用户已被停用' });

  // 已是好友？
  const already = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(req.user.id, toId);
  if (already) return res.status(400).json({ error: '已经是好友了' });

  // 已有待处理请求？
  const pending = db.prepare(
    "SELECT id FROM friend_requests WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'"
  ).get(req.user.id, toId);
  if (pending) return res.status(400).json({ error: '已发送过好友请求，等待对方确认' });

  // 对方是否也向我发过请求？若是有则直接互加好友
  const reversePending = db.prepare(
    "SELECT id FROM friend_requests WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'"
  ).get(toId, req.user.id);
  if (reversePending) {
    const addFriend = db.prepare('INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)');
    const now = db.prepare("UPDATE friend_requests SET status = 'accepted', updated_at = datetime('now', 'localtime') WHERE id = ?");
    const tx = db.transaction(() => {
      addFriend.run(req.user.id, toId);
      addFriend.run(toId, req.user.id);
      now.run(reversePending.id);
    });
    tx();
    return res.json({ message: '已互加为好友', becameFriends: true });
  }

  // 否则创建请求
  db.prepare(
    'INSERT INTO friend_requests (from_user_id, to_user_id, message) VALUES (?, ?, ?)'
  ).run(req.user.id, toId, (message || '').slice(0, 200));

  res.status(201).json({ message: '好友请求已发送' });
});

// 收到的好友请求（待处理）
router.get('/requests', (req, res) => {
  const rows = db.prepare(
    `SELECT fr.id, fr.message, fr.created_at, u.id AS from_user_id, u.username AS from_username,
            u.nickname AS from_nickname, u.avatar AS from_avatar
     FROM friend_requests fr
     JOIN users u ON u.id = fr.from_user_id
     WHERE fr.to_user_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`
  ).all(req.user.id);
  res.json({ items: rows });
});

// 发出的好友请求
router.get('/requests/sent', (req, res) => {
  const rows = db.prepare(
    `SELECT fr.id, fr.status, fr.created_at, u.id AS to_user_id, u.username AS to_username,
            u.nickname AS to_nickname, u.avatar AS to_avatar
     FROM friend_requests fr
     JOIN users u ON u.id = fr.to_user_id
     WHERE fr.from_user_id = ?
     ORDER BY fr.created_at DESC`
  ).all(req.user.id);
  res.json({ items: rows });
});

// 接受好友请求
router.post('/requests/:id/accept', (req, res) => {
  const reqRow = db.prepare('SELECT * FROM friend_requests WHERE id = ?').get(req.params.id);
  if (!reqRow) return res.status(404).json({ error: '请求不存在' });
  if (reqRow.to_user_id !== req.user.id) return res.status(403).json({ error: '无权操作此请求' });
  if (reqRow.status !== 'pending') return res.status(400).json({ error: '该请求已处理' });

  const addFriend = db.prepare('INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)');
  const updateReq = db.prepare("UPDATE friend_requests SET status = 'accepted', updated_at = datetime('now', 'localtime') WHERE id = ?");
  const tx = db.transaction(() => {
    addFriend.run(reqRow.from_user_id, reqRow.to_user_id);
    addFriend.run(reqRow.to_user_id, reqRow.from_user_id);
    updateReq.run(reqRow.id);
  });
  tx();
  res.json({ message: '已接受好友请求' });
});

// 拒绝好友请求
router.post('/requests/:id/reject', (req, res) => {
  const reqRow = db.prepare('SELECT * FROM friend_requests WHERE id = ?').get(req.params.id);
  if (!reqRow) return res.status(404).json({ error: '请求不存在' });
  if (reqRow.to_user_id !== req.user.id) return res.status(403).json({ error: '无权操作此请求' });
  if (reqRow.status !== 'pending') return res.status(400).json({ error: '该请求已处理' });

  db.prepare("UPDATE friend_requests SET status = 'rejected', updated_at = datetime('now', 'localtime') WHERE id = ?")
    .run(reqRow.id);
  res.json({ message: '已拒绝好友请求' });
});

// 好友列表
router.get('/', (req, res) => {
  const rows = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, u.bio, u.created_at, f.created_at AS friend_since
     FROM friends f
     JOIN users u ON u.id = f.friend_id
     WHERE f.user_id = ?
     ORDER BY u.nickname, u.username`
  ).all(req.user.id);
  res.json({ items: rows, total: rows.length });
});

// 删除好友（双向）
router.delete('/:friendId', (req, res) => {
  const fid = parseInt(req.params.friendId, 10);
  if (!fid) return res.status(400).json({ error: '参数错误' });
  const del = db.prepare('DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)');
  const result = del.run(req.user.id, fid, fid, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: '该用户不是你的好友' });
  res.json({ message: '已删除好友' });
});

// 搜索用户（用于添加好友）
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 1) return res.json({ items: [] });
  const kw = `%${q}%`;
  const rows = db.prepare(
    `SELECT id, username, nickname, avatar, bio
     FROM users
     WHERE status = 'active' AND id != ?
       AND (username LIKE ? OR nickname LIKE ?)
     LIMIT 20`
  ).all(req.user.id, kw, kw);

  // 标注关系
  const friendIds = new Set(
    db.prepare('SELECT friend_id FROM friends WHERE user_id = ?').all(req.user.id).map(r => r.friend_id)
  );
  const pendingTo = new Set(
    db.prepare("SELECT to_user_id FROM friend_requests WHERE from_user_id = ? AND status = 'pending'")
      .all(req.user.id).map(r => r.to_user_id)
  );

  const items = rows.map(u => ({
    ...u,
    is_friend: friendIds.has(u.id),
    request_pending: pendingTo.has(u.id)
  }));
  res.json({ items });
});

// 好友数量 + 待处理请求数（侧边栏徽标用）
router.get('/summary', (req, res) => {
  const friends = db.prepare('SELECT COUNT(*) AS c FROM friends WHERE user_id = ?').get(req.user.id).c;
  const pending = db.prepare(
    "SELECT COUNT(*) AS c FROM friend_requests WHERE to_user_id = ? AND status = 'pending'"
  ).get(req.user.id).c;
  res.json({ friends, pendingRequests: pending });
});

module.exports = router;

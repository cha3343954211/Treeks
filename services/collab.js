/**
 * 实时协同编辑服务
 * 基于 WebSocket 实现日记的实时编辑同步与在线状态广播。
 *
 * 协议：
 *  客户端 -> 服务端
 *   { type: 'join', diaryId: 123 }
 *   { type: 'leave', diaryId: 123 }
 *   { type: 'edit', diaryId: 123, title: '...', content: '...', field: 'content'|'title' }
 *   { type: 'cursor', diaryId: 123, line: 5, col: 10 }
 *   { type: 'ping' }
 *  服务端 -> 客户端
 *   { type: 'presence', diaryId: 123, users: [{id, username, nickname, avatar}] }
 *   { type: 'update', diaryId: 123, title: '...', content: '...', userId: 1, field: 'content' }
 *   { type: 'cursor', diaryId: 123, userId: 1, line: 5, col: 10 }
 *   { type: 'pong' }
 */
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// diaryId -> Set<ws>
const rooms = new Map();
// ws -> { userId, username, nickname, avatar, diaryIds: Set<number> }
const clients = new WeakMap();

function getUserInfo(userId) {
  return db.prepare('SELECT id, username, nickname, avatar FROM users WHERE id = ?').get(userId);
}

function canEditDiary(diaryId, userId) {
  if (!userId) return false;
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return false;
  if (diary.user_id === userId) return true;
  const c = db.prepare("SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ? AND role = 'editor'").get(diaryId, userId);
  return !!c;
}

function canReadDiary(diaryId, userId) {
  const diary = db.prepare('SELECT user_id, visibility FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return false;
  if (diary.user_id === userId) return true;
  if (db.prepare('SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').get(diaryId, userId)) return true;
  const vis = diary.visibility || 'private';
  if (vis === 'public') return true;
  if (vis === 'friends') {
    return !!db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(diary.user_id, userId);
  }
  if (vis === 'specific') {
    return !!db.prepare('SELECT 1 FROM diary_visible_to WHERE diary_id = ? AND user_id = ?').get(diaryId, userId);
  }
  return false;
}

function broadcastPresence(diaryId) {
  const room = rooms.get(diaryId);
  if (!room) return;
  const users = [];
  const seen = new Set();
  for (const ws of room) {
    const info = clients.get(ws);
    if (info && ws.readyState === 1 && !seen.has(info.userId)) {
      seen.add(info.userId);
      users.push({ id: info.userId, username: info.username, nickname: info.nickname, avatar: info.avatar });
    }
  }
  const msg = JSON.stringify({ type: 'presence', diaryId, users });
  for (const ws of room) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

function handleJoin(ws, diaryId) {
  const info = clients.get(ws);
  if (!info) return;
  if (!canReadDiary(diaryId, info.userId)) {
    if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'error', message: '无权访问此日记' }));
    return;
  }
  if (!rooms.has(diaryId)) rooms.set(diaryId, new Set());
  rooms.get(diaryId).add(ws);
  info.diaryIds.add(diaryId);
  broadcastPresence(diaryId);
}

function handleLeave(ws, diaryId) {
  const info = clients.get(ws);
  const room = rooms.get(diaryId);
  if (room) {
    room.delete(ws);
    if (room.size === 0) rooms.delete(diaryId);
    else broadcastPresence(diaryId);
  }
  if (info) info.diaryIds.delete(diaryId);
}

function handleEdit(ws, data) {
  const info = clients.get(ws);
  if (!info) return;
  const { diaryId, title, content, field } = data;
  if (!canEditDiary(diaryId, info.userId)) {
    if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'error', message: '无权编辑此日记' }));
    return;
  }
  // 持久化到数据库
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return;
  if (field === 'title' && title !== undefined) {
    db.prepare("UPDATE diaries SET title = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(title, diaryId);
  } else if (content !== undefined) {
    db.prepare("UPDATE diaries SET content = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(content, diaryId);
  } else {
    // 全量更新
    db.prepare("UPDATE diaries SET title = COALESCE(?, title), content = COALESCE(?, content), updated_at = datetime('now', 'localtime') WHERE id = ?")
      .run(title ?? null, content ?? null, diaryId);
  }

  // 广播给房间内其他客户端
  const room = rooms.get(diaryId);
  if (!room) return;
  const msg = JSON.stringify({
    type: 'update',
    diaryId,
    title,
    content,
    field: field || 'all',
    userId: info.userId,
    username: info.username
  });
  for (const peer of room) {
    if (peer !== ws && peer.readyState === 1) peer.send(msg);
  }
}

function handleCursor(ws, data) {
  const info = clients.get(ws);
  if (!info) return;
  const { diaryId, line, col } = data;
  const room = rooms.get(diaryId);
  if (!room) return;
  const msg = JSON.stringify({ type: 'cursor', diaryId, userId: info.userId, line, col });
  for (const peer of room) {
    if (peer !== ws && peer.readyState === 1) peer.send(msg);
  }
}

function setupWebSocket(server) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server, path: '/collab' });

  wss.on('connection', (ws, req) => {
    // 从 query 解析 token
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');
    if (!token) {
      ws.close(4001, '未提供 token');
      return;
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      ws.close(4001, 'token 无效');
      return;
    }
    const user = getUserInfo(decoded.id);
    if (!user) {
      ws.close(4003, '用户不存在');
      return;
    }
    clients.set(ws, {
      userId: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      diaryIds: new Set()
    });

    ws.on('message', raw => {
      let data;
      try { data = JSON.parse(raw.toString()); } catch { return; }
      switch (data.type) {
        case 'join': handleJoin(ws, parseInt(data.diaryId, 10)); break;
        case 'leave': handleLeave(ws, parseInt(data.diaryId, 10)); break;
        case 'edit': handleEdit(ws, data); break;
        case 'cursor': handleCursor(ws, data); break;
        case 'ping': if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'pong' })); break;
      }
    });

    ws.on('close', () => {
      const info = clients.get(ws);
      if (info) {
        for (const diaryId of info.diaryIds) {
          const room = rooms.get(diaryId);
          if (room) {
            room.delete(ws);
            if (room.size === 0) rooms.delete(diaryId);
            else broadcastPresence(diaryId);
          }
        }
      }
      clients.delete(ws);
    });

    ws.on('error', () => { /* ignore */ });
  });

  console.log('[Collab] WebSocket 协同服务已就绪 (/collab)');
  return wss;
}

module.exports = { setupWebSocket };

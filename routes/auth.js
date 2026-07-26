const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { signToken, authRequired } = require('../middleware/auth');
const { touchUserActive, isUserOnline } = require('../services/collab');

const router = express.Router();

// 读取平台设置
function getSetting(key, def = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : def;
}

// 用户公开信息字段
const USER_PUBLIC_FIELDS = 'id, username, nickname, avatar, bio, is_admin, status, storage_limit, theme, created_at';

// 注册
router.post('/register', (req, res) => {
  // 检查是否开放注册
  const allow = getSetting('allow_register', '1');
  if (allow !== '1') {
    return res.status(403).json({ error: '平台已关闭注册，请联系管理员' });
  }

  const { username, password, nickname } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: '用户名长度需在 2-20 之间' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码长度至少 6 位' });
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    return res.status(400).json({ error: '用户名只能包含中英文、数字和下划线' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) {
    return res.status(409).json({ error: '用户名已被注册' });
  }

  const storageLimit = parseInt(getSetting('default_storage_limit', '104857600'), 10) || 104857600;
  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password, nickname, storage_limit) VALUES (?, ?, ?, ?)'
  ).run(username, hashed, nickname || username, storageLimit);

  const user = db.prepare(`SELECT ${USER_PUBLIC_FIELDS} FROM users WHERE id = ?`).get(result.lastInsertRowid);

  const token = signToken(user.id, user.username, user.is_admin);
  res.status(201).json({ token, user });
});

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  if (!bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  if (row.status === 'disabled') {
    return res.status(403).json({ error: '账户已被停用，请联系管理员' });
  }

  const user = {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    avatar: row.avatar,
    bio: row.bio,
    is_admin: row.is_admin,
    status: row.status,
    storage_limit: row.storage_limit,
    created_at: row.created_at
  };
  const token = signToken(user.id, user.username, user.is_admin);
  res.json({ token, user });
});

// 获取当前用户信息
router.get('/me', authRequired, (req, res) => {
  const user = db.prepare(`SELECT ${USER_PUBLIC_FIELDS} FROM users WHERE id = ?`).get(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ user });
});

// 更新个人资料
router.put('/profile', authRequired, (req, res) => {
  const { nickname, bio, avatar } = req.body || {};
  // avatar: undefined=不更新；''=清除；其他字符串=更新
  const avatarParam = (avatar === undefined ? null : avatar);
  db.prepare(
    `UPDATE users SET
      nickname = COALESCE(?, nickname),
      bio = COALESCE(?, bio),
      avatar = CASE WHEN ? IS NULL THEN avatar ELSE NULLIF(?, '') END
     WHERE id = ?`
  ).run(nickname || null, bio || null, avatarParam, avatarParam, req.user.id);
  const user = db.prepare(`SELECT ${USER_PUBLIC_FIELDS} FROM users WHERE id = ?`).get(req.user.id);
  res.json({ user });
});

// 修改密码
router.put('/password', authRequired, (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: '请填写原密码和新密码' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: '新密码长度至少 6 位' });
  }
  const row = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(oldPassword, row.password)) {
    return res.status(401).json({ error: '原密码错误' });
  }
  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.user.id);
  res.json({ message: '密码修改成功' });
});

// 设置主题
router.put('/theme', authRequired, (req, res) => {
  const { theme } = req.body || {};
  // 支持新格式 palette:mode（如 green:light, blue:dark）+ 兼容旧值 green/blue/.../dark/auto
  const allowedLegacy = ['green', 'blue', 'purple', 'orange', 'pink', 'dark', 'auto'];
  const palettes = ['green', 'blue', 'purple', 'orange', 'pink', 'rose', 'teal', 'indigo'];
  const modes = ['light', 'dark'];
  let normalized = null;
  if (typeof theme === 'string') {
    if (allowedLegacy.includes(theme)) {
      normalized = theme;
    } else if (theme === 'auto') {
      normalized = 'auto';
    } else {
      const [p, m] = theme.split(':');
      if (palettes.includes(p) && modes.includes(m)) normalized = `${p}:${m}`;
    }
  }
  if (!normalized) {
    return res.status(400).json({ error: '不支持的主题' });
  }
  db.prepare('UPDATE users SET theme = ? WHERE id = ?').run(normalized, req.user.id);
  res.json({ message: '主题已更新', theme: normalized });
});

// 公开接口：平台基本信息（无需登录）
router.get('/site-info', (req, res) => {
  const allowRegister = getSetting('allow_register', '1') === '1';
  const siteName = getSetting('site_name', 'Treeks');
  const siteNotice = getSetting('site_notice', '');
  res.json({ allow_register: allowRegister, site_name: siteName, site_notice: siteNotice });
});

// 心跳：刷新用户活跃时间，用于在线/离线判定
// 客户端每 30 秒调用一次；服务端用 last_active_at 兜底判定
router.post('/heartbeat', authRequired, (req, res) => {
  touchUserActive(req.user.id);
  res.json({ ok: true, online: isUserOnline(req.user.id) });
});

module.exports = router;

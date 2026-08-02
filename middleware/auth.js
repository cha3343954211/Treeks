const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../db');

const DEFAULT_WEAK_SECRET = 'treeks_default_secret';
const ENV_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const IS_PROD = process.env.NODE_ENV === 'production';

// JWT 密钥解析策略（按优先级）：
//  1) 环境变量 JWT_SECRET（非默认值）→ 直接使用，最高优先级
//  2) 数据库 settings 表中的 jwt_secret（首次启动随机生成并持久化）
//  3) 兜底：开发模式下使用默认弱密钥并警告；生产模式下拒绝启动
function resolveJwtSecret() {
  if (ENV_SECRET && ENV_SECRET !== DEFAULT_WEAK_SECRET && ENV_SECRET.length >= 16) {
    return ENV_SECRET;
  }
  // 尝试从数据库读取持久化的随机密钥
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('jwt_secret');
    if (row && row.value && row.value.length >= 32) return row.value;
    // 生成新的随机密钥并持久化
    const newSecret = crypto.randomBytes(48).toString('hex');
    db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime(\'now\'))').run('jwt_secret', newSecret);
    console.warn('[Auth] 未配置 JWT_SECRET 环境变量，已自动生成并持久化随机密钥到数据库。');
    console.warn('[Auth] 生产环境强烈建议通过环境变量 JWT_SECRET 显式配置，且不要使用默认值。');
    return newSecret;
  } catch (e) {
    // 数据库未就绪等极端情况
    if (IS_PROD) {
      throw new Error('生产环境必须配置 JWT_SECRET 环境变量（>=16 字符，且不能使用默认值）');
    }
    console.warn('[Auth] 无法读取/写入 JWT 密钥到数据库，回退到默认弱密钥（仅限开发）：', e.message);
    return DEFAULT_WEAK_SECRET;
  }
}

const JWT_SECRET = resolveJwtSecret();

// 启动时校验：生产环境禁用弱密钥
if (IS_PROD && (JWT_SECRET === DEFAULT_WEAK_SECRET || JWT_SECRET.length < 16)) {
  throw new Error('[Auth] 生产环境禁止使用默认/弱 JWT_SECRET，请通过环境变量配置（>=16 字符）');
}

function signToken(userId, username, isAdmin) {
  return jwt.sign({ id: userId, username, is_admin: !!isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// 从请求中提取 token 的统一方法：
//   1) Authorization: Bearer xxx 头（API 调用）
//   2) ?token=xxx 查询参数（浏览器直接下载链接）
//   3) Cookie: treeks_token=xxx（HTML 中 <img src="/uploads/..."> 等场景，浏览器自动发送）
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (typeof req.query.token === 'string' && req.query.token.length > 0) {
    return req.query.token;
  }
  if (req.headers.cookie) {
    // 简单解析 cookie，避免引入 cookie-parser 中间件
    const m = req.headers.cookie.match(/(?:^|;\s*)treeks_token=([^;]+)/);
    if (m && m[1]) {
      try { return decodeURIComponent(m[1]); } catch { return null; }
    }
  }
  return null;
}

// 校验 token 并返回用户信息（不写入 req.user，不阻断请求）
// 注意：is_admin 从数据库实时读取，而非 token 中的旧值
//   这样即使管理员在登录后被授予/撤销权限，也能立即生效
function verifyToken(req) {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const row = db.prepare('SELECT id, username, is_admin, status FROM users WHERE id = ?').get(decoded.id);
    if (!row || row.status === 'disabled') return null;
    return { id: row.id, username: row.username, is_admin: !!row.is_admin };
  } catch (err) {
    return null;
  }
}

function authRequired(req, res, next) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: '未登录或登录已过期' });
  }
  // 用户状态二次校验已由 verifyToken 完成（不存在/已停用均返回 null）
  req.user = user;
  next();
}

// 管理员校验中间件（需在 authRequired 之后使用）
// 完全依赖数据库实时查询，避免使用 token 中的旧 is_admin 值
function adminRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: '未登录' });
  }
  const row = db.prepare('SELECT is_admin, status FROM users WHERE id = ?').get(req.user.id);
  if (!row || row.is_admin !== 1 || row.status !== 'active') {
    return res.status(403).json({ error: '无权限访问，需要管理员账户' });
  }
  // 同步更新 req.user 中的 is_admin（基于数据库）
  req.user.is_admin = true;
  next();
}

module.exports = { signToken, authRequired, adminRequired, JWT_SECRET, JWT_EXPIRES, extractToken, verifyToken };

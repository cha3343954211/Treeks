const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'treeks_default_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(userId, username, isAdmin) {
  return jwt.sign({ id: userId, username, is_admin: !!isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authRequired(req, res, next) {
  // 优先使用 Authorization 头；其次支持 query token（用于浏览器直接下载场景）
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (typeof req.query.token === 'string' && req.query.token.length > 0) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ error: '未登录或登录已过期' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username, is_admin: !!decoded.is_admin };
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录令牌无效，请重新登录' });
  }
}

// 管理员校验中间件（需在 authRequired 之后使用）
function adminRequired(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: '无权限访问，需要管理员账户' });
  }
  // 二次校验数据库状态
  const row = db.prepare('SELECT is_admin, status FROM users WHERE id = ?').get(req.user.id);
  if (!row || row.is_admin !== 1 || row.status !== 'active') {
    return res.status(403).json({ error: '管理员账户已被停用或撤销' });
  }
  next();
}

module.exports = { signToken, authRequired, adminRequired, JWT_SECRET };

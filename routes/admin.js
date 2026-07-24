const express = require('express');
const os = require('os');
const { db } = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// 所有管理员路由需登录 + 管理员权限
router.use(authRequired, adminRequired);

// 写管理员操作日志
function logAction(adminId, action, target, detail) {
  db.prepare(
    'INSERT INTO admin_logs (admin_id, action, target, detail) VALUES (?, ?, ?, ?)'
  ).run(adminId, action, target || null, detail ? JSON.stringify(detail) : null);
}

// 读取设置
function getSetting(key, def = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : def;
}

function setSetting(key, value) {
  db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now','localtime'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, String(value));
}

// ===== 概览统计 =====
router.get('/dashboard', (req, res) => {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const activeUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE status = 'active'").get().c;
  const disabledUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE status = 'disabled'").get().c;
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM users WHERE is_admin = 1').get().c;
  const diaryCount = db.prepare('SELECT COUNT(*) as c FROM diaries').get().c;
  const imageCount = db.prepare('SELECT COUNT(*) as c FROM images').get().c;
  const totalImageSize = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM images').get().s;
  const totalStorageLimit = db.prepare('SELECT COALESCE(SUM(storage_limit),0) as s FROM users').get().s;

  // 最近 7 天注册数
  const recentUsers = db.prepare(
    `SELECT substr(created_at,1,10) as date, COUNT(*) as count
     FROM users
     WHERE created_at >= datetime('now','localtime','-7 days')
     GROUP BY date ORDER BY date`
  ).all();

  // 最近 7 天日记数
  const recentDiaries = db.prepare(
    `SELECT substr(created_at,1,10) as date, COUNT(*) as count
     FROM diaries
     WHERE created_at >= datetime('now','localtime','-7 days')
     GROUP BY date ORDER BY date`
  ).all();

  // 最近 14 天每日活跃用户
  const recentActive = db.prepare(
    `SELECT substr(created_at,1,10) as date, COUNT(DISTINCT user_id) as count
     FROM diaries
     WHERE created_at >= datetime('now','localtime','-14 days')
     GROUP BY date ORDER BY date`
  ).all();

  // 最活跃用户（日记数 top5）
  const topUsers = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, COUNT(d.id) as diary_count
     FROM users u
     LEFT JOIN diaries d ON d.user_id = u.id
     GROUP BY u.id
     ORDER BY diary_count DESC
     LIMIT 5`
  ).all();

  res.json({
    users: { total: userCount, active: activeUsers, disabled: disabledUsers, admins: adminCount },
    content: { diaries: diaryCount, images: imageCount, totalImageSize },
    storage: { used: totalImageSize, totalLimit: totalStorageLimit },
    trends: { recentUsers, recentDiaries, recentActive },
    topUsers
  });
});

// ===== 平台设置 =====
router.get('/settings', (req, res) => {
  const keys = ['allow_register', 'site_name', 'site_notice', 'default_storage_limit'];
  const result = {};
  for (const k of keys) {
    result[k] = getSetting(k, '');
  }
  result.allow_register = result.allow_register === '1';
  result.default_storage_limit = parseInt(result.default_storage_limit, 10) || 104857600;
  res.json({ settings: result });
});

router.put('/settings', (req, res) => {
  const { allow_register, site_name, site_notice, default_storage_limit } = req.body || {};
  if (typeof allow_register !== 'undefined') {
    setSetting('allow_register', allow_register ? '1' : '0');
  }
  if (typeof site_name !== 'undefined') {
    setSetting('site_name', String(site_name).slice(0, 50));
  }
  if (typeof site_notice !== 'undefined') {
    setSetting('site_notice', String(site_notice).slice(0, 500));
  }
  if (typeof default_storage_limit !== 'undefined') {
    const n = parseInt(default_storage_limit, 10);
    if (!isNaN(n) && n > 0) setSetting('default_storage_limit', n);
  }
  logAction(req.user.id, 'update_settings', null, req.body);
  res.json({ message: '设置已更新' });
});

// ===== 用户管理 =====
router.get('/users', (req, res) => {
  const { keyword, status, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  let where = '1=1';
  const params = [];
  if (keyword) {
    where += ' AND (username LIKE ? OR nickname LIKE ?)';
    const kw = `%${keyword}%`;
    params.push(kw, kw);
  }
  if (status) {
    where += ' AND status = ?';
    params.push(status);
  }

  const total = db.prepare(`SELECT COUNT(*) as c FROM users WHERE ${where}`).get(...params).c;
  const rows = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, u.bio, u.is_admin, u.status, u.storage_limit, u.created_at,
            (SELECT COUNT(*) FROM diaries WHERE user_id = u.id) as diary_count,
            (SELECT COUNT(*) FROM images WHERE user_id = u.id) as image_count,
            (SELECT COALESCE(SUM(size),0) FROM images WHERE user_id = u.id) as used_storage
     FROM users u
     WHERE ${where}
     ORDER BY u.is_admin DESC, u.created_at DESC
     LIMIT ? OFFSET ?`
  ).all(...params, limitNum, offset);

  res.json({
    items: rows,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

// 获取单个用户详情
router.get('/users/:id', (req, res) => {
  const row = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, u.bio, u.is_admin, u.status, u.storage_limit, u.created_at,
            (SELECT COUNT(*) FROM diaries WHERE user_id = u.id) as diary_count,
            (SELECT COUNT(*) FROM images WHERE user_id = u.id) as image_count,
            (SELECT COALESCE(SUM(size),0) FROM images WHERE user_id = u.id) as used_storage
     FROM users u WHERE u.id = ?`
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  res.json({ user: row });
});

// 更新用户（状态、管理员、空间、昵称）
router.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) {
    // 不允许管理员停用自己或撤销自己权限
    if (req.body.status === 'disabled' || req.body.is_admin === false) {
      return res.status(400).json({ error: '不能停用自己或撤销自己的管理员权限' });
    }
  }
  const { nickname, is_admin, status, storage_limit } = req.body || {};
  const current = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!current) return res.status(404).json({ error: '用户不存在' });

  db.prepare(
    `UPDATE users SET
       nickname = COALESCE(?, nickname),
       is_admin = COALESCE(?, is_admin),
       status = COALESCE(?, status),
       storage_limit = COALESCE(?, storage_limit)
     WHERE id = ?`
  ).run(
    nickname != null ? nickname : null,
    is_admin != null ? (is_admin ? 1 : 0) : null,
    status != null ? status : null,
    storage_limit != null ? parseInt(storage_limit, 10) : null,
    id
  );

  logAction(req.user.id, 'update_user', String(id), req.body);
  const updated = db.prepare(
    'SELECT id, username, nickname, avatar, bio, is_admin, status, storage_limit, created_at FROM users WHERE id = ?'
  ).get(id);
  res.json({ user: updated });
});

// 重置用户密码
router.post('/users/:id/reset-password', (req, res) => {
  const bcrypt = require('bcryptjs');
  const id = parseInt(req.params.id, 10);
  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: '新密码长度至少 6 位' });
  }
  const row = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, id);
  logAction(req.user.id, 'reset_password', String(id), null);
  res.json({ message: '密码已重置' });
});

// 删除用户
router.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) {
    return res.status(400).json({ error: '不能删除自己' });
  }
  const row = db.prepare('SELECT id, is_admin FROM users WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  if (row.is_admin === 1) {
    // 防止删掉最后一个管理员
    const adminCount = db.prepare('SELECT COUNT(*) as c FROM users WHERE is_admin = 1').get().c;
    if (adminCount <= 1) {
      return res.status(400).json({ error: '不能删除最后一个管理员' });
    }
  }
  // 删除用户上传的文件
  const path = require('path');
  const fs = require('fs');
  const userDir = path.join(__dirname, '..', 'public', 'uploads', String(id));
  if (fs.existsSync(userDir)) {
    try { fs.rmSync(userDir, { recursive: true, force: true }); } catch (e) { console.error('删除用户目录失败', e.message); }
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  logAction(req.user.id, 'delete_user', String(id), null);
  res.json({ message: '用户已删除' });
});

// ===== 管理员操作日志 =====
router.get('/logs', (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));
  const offset = (pageNum - 1) * limitNum;
  const total = db.prepare('SELECT COUNT(*) as c FROM admin_logs').get().c;
  const rows = db.prepare(
    `SELECT l.*, u.username as admin_username, u.nickname as admin_nickname
     FROM admin_logs l
     LEFT JOIN users u ON u.id = l.admin_id
     ORDER BY l.id DESC
     LIMIT ? OFFSET ?`
  ).all(limitNum, offset);
  res.json({ items: rows, total, page: pageNum, limit: limitNum });
});

// ===== 系统性能 =====
router.get('/system', (req, res) => {
  const mem = process.memoryUsage();
  const cpus = os.cpus();
  const uptime = process.uptime();
  const osUptime = os.uptime();

  // 磁盘使用（仅 uploads 目录）
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  let uploadsSize = 0;
  let uploadsFiles = 0;
  const calcDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) calcDir(full);
      else {
        try {
          const stat = fs.statSync(full);
          uploadsSize += stat.size;
          uploadsFiles++;
        } catch (_) {}
      }
    }
  };
  calcDir(uploadsDir);

  res.json({
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: uptime,
      memory: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        external: mem.external,
        arrayBuffers: mem.arrayBuffers
      }
    },
    os: {
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      uptime: osUptime,
      loadavg: os.loadavg(),
      cpus: cpus.length,
      cpuModel: cpus[0] ? cpus[0].model : 'unknown',
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    },
    storage: {
      uploadsDir,
      uploadsSize,
      uploadsFiles
    },
    db: {
      path: require('../db').db.name || 'treeks.db'
    }
  });
});

// ===== 系统清理：预览可清理项 =====
const cleanupService = require('../services/cleanup');
router.get('/system/cleanup/preview', (req, res) => {
  try {
    const data = cleanupService.previewCleanup();
    res.json(data);
  } catch (e) {
    console.error('[Cleanup Preview Error]', e);
    res.status(500).json({ error: '预览失败: ' + e.message });
  }
});

// ===== 系统清理：执行清理 =====
// body: { targets: ['root-junk', 'orphan-uploads', 'empty-dirs', 'db-wal'] }
router.post('/system/cleanup', (req, res) => {
  try {
    const { targets } = req.body || {};
    if (!Array.isArray(targets) || targets.length === 0) {
      return res.status(400).json({ error: '请选择要清理的项目' });
    }
    const allowed = new Set(['root-junk', 'orphan-uploads', 'empty-dirs', 'db-wal']);
    const validTargets = targets.filter(t => allowed.has(t));
    if (validTargets.length === 0) {
      return res.status(400).json({ error: '未指定有效的清理目标' });
    }
    const result = cleanupService.executeCleanup(validTargets);
    logAction(req.user.id, 'system_cleanup', null, { targets: validTargets, result });
    res.json({ message: '清理完成', result });
  } catch (e) {
    console.error('[Cleanup Error]', e);
    res.status(500).json({ error: '清理失败: ' + e.message });
  }
});

// ===== 数据导出 / 导入 =====
const multer = require('multer');
const dataTransfer = require('../services/dataTransfer');

// 平台数据导出（一键导出所有用户、日记、图片元数据、日程、设置）
router.get('/export/all', (req, res) => {
  try {
    const { images = '0' } = req.query;
    const includeImages = images === '1' || images === 'true';
    const data = dataTransfer.exportPlatformData();

    if (includeImages) {
      // 打包 ZIP（含图片）
      const zipName = `treeks-platform-${new Date().toISOString().slice(0, 10)}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"; filename*=UTF-8''${encodeURIComponent(zipName)}`);
      const archive = dataTransfer.buildExportZip(data, true);
      archive.on('error', err => {
        console.error('[Export All Error]', err);
        if (!res.headersSent) res.status(500).json({ error: '打包失败' });
      });
      res.on('close', () => { archive.destroy(); });
      archive.pipe(res);
      archive.finalize();
    } else {
      // 仅 JSON
      const fileName = `treeks-platform-${new Date().toISOString().slice(0, 10)}.json`;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
      res.json(data);
    }
    logAction(req.user.id, 'export_platform', null, { includeImages });
  } catch (e) {
    console.error('[Export All Error]', e);
    res.status(500).json({ error: '导出失败: ' + e.message });
  }
});

// 导出预览（仅返回统计数据，不返回实际内容）
router.get('/export/preview', (req, res) => {
  try {
    const data = dataTransfer.exportPlatformData();
    res.json({
      meta: data.meta,
      sampleUsers: data.users.slice(0, 5).map(u => ({ id: u.id, username: u.username, nickname: u.nickname }))
    });
  } catch (e) {
    res.status(500).json({ error: '预览失败: ' + e.message });
  }
});

// 平台数据导入
const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

router.post('/import', importUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请上传 JSON 文件' });
    const data = dataTransfer.parseImportFile(req.file.buffer);

    if (data.meta.type !== 'platform') {
      return res.status(400).json({ error: '上传文件不是平台数据格式（请使用用户导入入口导入用户数据）' });
    }

    const overwriteSettings = req.body.overwriteSettings === '1' || req.body.overwriteSettings === 'true';
    const skipDuplicate = req.body.skipDuplicate !== '0' && req.body.skipDuplicate !== 'false';

    const result = dataTransfer.importPlatformData(data, { skipDuplicate, overwriteSettings });
    logAction(req.user.id, 'import_platform', null, { result, overwriteSettings, skipDuplicate });
    res.json({ message: '导入完成', result });
  } catch (e) {
    console.error('[Import Error]', e);
    res.status(500).json({ error: '导入失败: ' + e.message });
  }
});

module.exports = router;

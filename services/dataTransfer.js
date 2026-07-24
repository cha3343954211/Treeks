// 数据迁移服务：平台级 / 用户级 数据的导出与导入
// 格式：JSON（包含元数据 + 各表数据），可选打包图片资源为 ZIP

const path = require('path');
const fs = require('fs');
const { db } = require('../db');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const { ZipArchive } = require('archiver');

const FORMAT_VERSION = '1.0';

// 安全的字符串 parse
function parseTags(t) {
  if (!t) return [];
  if (Array.isArray(t)) return t;
  try { return JSON.parse(t); } catch { return []; }
}

// ===== 平台级导出 =====
function exportPlatformData() {
  const users = db.prepare(
    `SELECT id, username, nickname, avatar, bio, is_admin, status, storage_limit, theme, created_at FROM users ORDER BY id`
  ).all();

  const diaries = db.prepare(
    `SELECT id, user_id, title, content, mood, weather, tags, is_pinned, is_public, created_at, updated_at
     FROM diaries ORDER BY user_id, created_at`
  ).all().map(d => ({ ...d, tags: parseTags(d.tags), is_pinned: !!d.is_pinned, is_public: !!d.is_public }));

  const images = db.prepare(
    `SELECT id, user_id, filename, original_name, size, url, created_at FROM images ORDER BY user_id, created_at`
  ).all();

  const schedules = db.prepare(
    `SELECT id, user_id, title, description, schedule_date, start_time, end_time, color, is_done, created_at, updated_at
     FROM schedules ORDER BY user_id, schedule_date`
  ).all().map(s => ({ ...s, is_done: !!s.is_done }));

  const settings = db.prepare(`SELECT key, value, updated_at FROM settings ORDER BY key`).all();

  return {
    meta: {
      version: FORMAT_VERSION,
      type: 'platform',
      exportedAt: new Date().toISOString(),
      stats: {
        users: users.length,
        diaries: diaries.length,
        images: images.length,
        schedules: schedules.length,
        settings: settings.length
      }
    },
    users,
    diaries,
    images,
    schedules,
    settings
  };
}

// ===== 用户级导出 =====
function exportUserData(userId) {
  const user = db.prepare(
    'SELECT id, username, nickname, avatar, bio, is_admin, status, storage_limit, theme, created_at FROM users WHERE id = ?'
  ).get(userId);
  if (!user) throw new Error('用户不存在');

  const diaries = db.prepare(
    `SELECT id, user_id, title, content, mood, weather, tags, is_pinned, is_public, created_at, updated_at
     FROM diaries WHERE user_id = ? ORDER BY created_at`
  ).all(userId).map(d => ({ ...d, tags: parseTags(d.tags), is_pinned: !!d.is_pinned, is_public: !!d.is_public }));

  const images = db.prepare(
    `SELECT id, user_id, filename, original_name, size, url, created_at FROM images WHERE user_id = ? ORDER BY created_at`
  ).all(userId);

  const schedules = db.prepare(
    `SELECT id, user_id, title, description, schedule_date, start_time, end_time, color, is_done, created_at, updated_at
     FROM schedules WHERE user_id = ? ORDER BY schedule_date`
  ).all(userId).map(s => ({ ...s, is_done: !!s.is_done }));

  return {
    meta: {
      version: FORMAT_VERSION,
      type: 'user',
      exportedAt: new Date().toISOString(),
      user: { id: user.id, username: user.username, nickname: user.nickname },
      stats: { diaries: diaries.length, images: images.length, schedules: schedules.length }
    },
    user,
    diaries,
    images,
    schedules
  };
}

// ===== 打包图片资源到 ZIP =====
// data: 平台或用户导出数据
// includeImages: 是否打包图片文件
// 返回 archive 流（已注册 error 处理），调用方负责 pipe(res) 和 finalize
function buildExportZip(data, includeImages = false) {
  const archive = new ZipArchive({ zlib: { level: 6 } });

  // 添加 JSON 数据
  const json = JSON.stringify(data, null, 2);
  const jsonName = data.meta.type === 'platform' ? 'platform-data.json' : 'user-data.json';
  archive.append(Buffer.from(json, 'utf8'), { name: jsonName });

  // 添加 README
  const stats = data.meta.stats;
  const readme = [
    `# Treeks 数据导出`,
    ``,
    `- 类型：${data.meta.type === 'platform' ? '平台数据' : '用户数据'}`,
    `- 导出时间：${new Date(data.meta.exportedAt).toLocaleString('zh-CN')}`,
    `- 格式版本：${data.meta.version}`,
    ``,
    `## 统计`,
    ...Object.entries(stats).map(([k, v]) => `- ${k}: ${v}`),
    ``,
    data.meta.type === 'platform'
      ? '此文件包含所有用户、日记、图片元数据、日程和平台设置。'
      : '此文件包含当前用户的日记、图片元数据和日程。',
    ``,
    `由 Treeks 导出`
  ].join('\n');
  archive.append(Buffer.from(readme, 'utf8'), { name: 'README.md' });

  if (includeImages && data.images && data.images.length) {
    let added = 0;
    let missing = 0;
    for (const img of data.images) {
      // 图片存储路径：public/uploads/<user_id>/<filename>
      const localPath = path.join(UPLOADS_DIR, String(img.user_id), img.filename);
      if (fs.existsSync(localPath)) {
        archive.file(localPath, { name: `images/${img.user_id}/${img.filename}` });
        added++;
      } else {
        missing++;
      }
    }
    const imgLog = `# 图片打包日志\n\n- 已打包：${added}\n- 缺失：${missing}\n- 总计：${data.images.length}\n`;
    archive.append(Buffer.from(imgLog, 'utf8'), { name: 'images-log.txt' });
  }

  return archive;
}

// ===== 用户级导入 =====
// 将导入数据合并到当前用户名下（diaries/schedules/images 元数据）
// 策略：按 title+content 或 created_at 去重；返回新增数量
function importUserData(userId, data, options = {}) {
  const { skipDuplicate = true } = options;
  const result = { diaries: 0, schedules: 0, images: 0, skipped: 0, errors: [] };

  if (!data || !data.meta || data.meta.type !== 'user') {
    throw new Error('无效的用户数据格式');
  }

  const insertDiary = db.prepare(
    `INSERT INTO diaries (user_id, title, content, mood, weather, tags, is_pinned, is_public, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const checkDiary = db.prepare(
    `SELECT id FROM diaries WHERE user_id = ? AND title = ? AND content = ? AND created_at = ?`
  );

  const insertSchedule = db.prepare(
    `INSERT INTO schedules (user_id, title, description, schedule_date, start_time, end_time, color, is_done, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertImage = db.prepare(
    `INSERT INTO images (user_id, filename, original_name, size, url, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    if (Array.isArray(data.diaries)) {
      for (const d of data.diaries) {
        try {
          if (skipDuplicate) {
            const dup = checkDiary.get(userId, d.title || '', d.content || '', d.created_at || '');
            if (dup) { result.skipped++; continue; }
          }
          insertDiary.run(
            userId,
            d.title || '',
            d.content || '',
            d.mood || null,
            d.weather || null,
            Array.isArray(d.tags) ? JSON.stringify(d.tags) : (d.tags || null),
            d.is_pinned ? 1 : 0,
            d.is_public ? 1 : 0,
            d.created_at || new Date().toISOString(),
            d.updated_at || new Date().toISOString()
          );
          result.diaries++;
        } catch (e) { result.errors.push(`日记导入失败: ${e.message}`); }
      }
    }

    if (Array.isArray(data.schedules)) {
      for (const s of data.schedules) {
        try {
          insertSchedule.run(
            userId,
            s.title || '',
            s.description || null,
            s.schedule_date || new Date().toISOString().slice(0, 10),
            s.start_time || null,
            s.end_time || null,
            s.color || '#4c995c',
            s.is_done ? 1 : 0,
            s.created_at || new Date().toISOString(),
            s.updated_at || new Date().toISOString()
          );
          result.schedules++;
        } catch (e) { result.errors.push(`日程导入失败: ${e.message}`); }
      }
    }

    // 仅导入图片元数据（实际文件需单独上传）
    if (Array.isArray(data.images) && options.importImageMeta) {
      for (const img of data.images) {
        try {
          insertImage.run(
            userId,
            img.filename || `imported-${Date.now()}.bin`,
            img.original_name || null,
            img.size || 0,
            `/uploads/${userId}/${img.filename}` || img.url,
            img.created_at || new Date().toISOString()
          );
          result.images++;
        } catch (e) { result.errors.push(`图片元数据导入失败: ${e.message}`); }
      }
    }
  });
  tx();

  return result;
}

// ===== 平台级导入 =====
// 仅管理员使用：合并平台数据
// 策略：用户名已存在则跳过；diaries/schedules 按 (user_id+title+content+created_at) 去重
function importPlatformData(data, options = {}) {
  const { skipDuplicate = true, overwriteSettings = false } = options;
  const result = {
    users: 0, diaries: 0, schedules: 0, settings: 0,
    skippedUsers: 0, skippedDiaries: 0, errors: []
  };

  if (!data || !data.meta || data.meta.type !== 'platform') {
    throw new Error('无效的平台数据格式');
  }

  const bcrypt = require('bcryptjs');
  // 用户名 → 新 user_id 映射
  const userIdMap = new Map();
  const defaultStorage = parseInt(
    db.prepare("SELECT value FROM settings WHERE key = 'default_storage_limit'").get()?.value || '104857600',
    10
  );

  const insertUser = db.prepare(
    `INSERT INTO users (username, password, nickname, avatar, bio, is_admin, status, storage_limit, theme, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const findUserByName = db.prepare('SELECT id FROM users WHERE username = ?');
  const findUserById = db.prepare('SELECT id FROM users WHERE id = ?');

  const insertDiary = db.prepare(
    `INSERT INTO diaries (user_id, title, content, mood, weather, tags, is_pinned, is_public, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const checkDiaryDup = db.prepare(
    `SELECT id FROM diaries WHERE user_id = ? AND title = ? AND content = ? AND created_at = ?`
  );

  const insertSchedule = db.prepare(
    `INSERT INTO schedules (user_id, title, description, schedule_date, start_time, end_time, color, is_done, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const upsertSetting = db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now','localtime'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  );

  const tx = db.transaction(() => {
    // 1. 导入用户（不导入密码，使用随机密码；管理员可在后台重置）
    if (Array.isArray(data.users)) {
      for (const u of data.users) {
        try {
          if (skipDuplicate && findUserByName.get(u.username)) {
            const exist = findUserByName.get(u.username);
            userIdMap.set(u.id, exist.id);
            result.skippedUsers++;
            continue;
          }
          // 随机密码（导入后用户需重置）
          const randomPwd = bcrypt.hashSync(Math.random().toString(36).slice(2) + Date.now().toString(), 10);
          const info = insertUser.run(
            u.username,
            randomPwd,
            u.nickname || null,
            u.avatar || null,
            u.bio || null,
            // 不导入管理员权限，避免提权
            0,
            u.status || 'active',
            u.storage_limit || defaultStorage,
            u.theme || 'green',
            u.created_at || new Date().toISOString()
          );
          userIdMap.set(u.id, info.lastInsertRowid);
          result.users++;
        } catch (e) { result.errors.push(`用户 ${u.username} 导入失败: ${e.message}`); }
      }
    }

    // 2. 导入日记
    if (Array.isArray(data.diaries)) {
      for (const d of data.diaries) {
        try {
          const newUid = userIdMap.get(d.user_id);
          if (!newUid) { result.skippedDiaries++; continue; }
          if (skipDuplicate) {
            const dup = checkDiaryDup.get(newUid, d.title || '', d.content || '', d.created_at || '');
            if (dup) { result.skippedDiaries++; continue; }
          }
          insertDiary.run(
            newUid,
            d.title || '',
            d.content || '',
            d.mood || null,
            d.weather || null,
            Array.isArray(d.tags) ? JSON.stringify(d.tags) : (d.tags || null),
            d.is_pinned ? 1 : 0,
            d.is_public ? 1 : 0,
            d.created_at || new Date().toISOString(),
            d.updated_at || new Date().toISOString()
          );
          result.diaries++;
        } catch (e) { result.errors.push(`日记导入失败: ${e.message}`); }
      }
    }

    // 3. 导入日程
    if (Array.isArray(data.schedules)) {
      for (const s of data.schedules) {
        try {
          const newUid = userIdMap.get(s.user_id);
          if (!newUid) continue;
          insertSchedule.run(
            newUid,
            s.title || '',
            s.description || null,
            s.schedule_date || new Date().toISOString().slice(0, 10),
            s.start_time || null,
            s.end_time || null,
            s.color || '#4c995c',
            s.is_done ? 1 : 0,
            s.created_at || new Date().toISOString(),
            s.updated_at || new Date().toISOString()
          );
          result.schedules++;
        } catch (e) { result.errors.push(`日程导入失败: ${e.message}`); }
      }
    }

    // 4. 导入平台设置（仅当 overwriteSettings）
    if (overwriteSettings && Array.isArray(data.settings)) {
      for (const s of data.settings) {
        try {
          upsertSetting.run(s.key, s.value);
          result.settings++;
        } catch (e) { result.errors.push(`设置 ${s.key} 导入失败: ${e.message}`); }
      }
    }
  });
  tx();

  return result;
}

// 解析上传的 ZIP 文件中的 JSON 数据
function parseImportFile(buffer) {
  try {
    const text = buffer.toString('utf8');
    const data = JSON.parse(text);
    if (!data.meta || !data.meta.type) {
      throw new Error('缺少 meta.type 字段');
    }
    if (data.meta.type !== 'user' && data.meta.type !== 'platform') {
      throw new Error('不支持的导出类型: ' + data.meta.type);
    }
    return data;
  } catch (e) {
    throw new Error('解析 JSON 失败: ' + e.message);
  }
}

module.exports = {
  exportPlatformData,
  exportUserData,
  buildExportZip,
  importUserData,
  importPlatformData,
  parseImportFile,
  FORMAT_VERSION
};

/**
 * 平台数据存储位置管理服务
 *
 * 设计：
 *  - 默认存储位置：项目目录下 data/（数据库） + public/uploads/（图片）
 *  - 自定义存储位置：管理员可选择任意可写路径，数据库与上传文件会迁移过去
 *  - 配置持久化在 settings 表（storage_path 字段），重启后自动恢复
 *  - 当前运行时路径通过 db.name 与全局 UPLOAD_DIR 运行时变量获取
 *
 * 安全约束：
 *  - 切换前校验目标目录可写
 *  - 不允许选择项目根目录（避免误删源码）
 *  - 迁移采用复制（非移动），原数据保留以防回滚
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// 项目根目录
const PROJECT_ROOT = path.join(__dirname, '..');
// 默认数据库目录（项目内）
const DEFAULT_DB_DIR = path.join(PROJECT_ROOT, 'data');
// 默认上传目录（项目内）
const DEFAULT_UPLOAD_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');

/**
 * 启动时引导：在 db.js 加载前读取自定义存储位置并设置 env 变量
 * 直接打开默认位置数据库（只读）读取 storage_path 配置，避免循环依赖
 * @returns {{ customPath: string|null, dbDir: string, uploadDir: string, isCustom: boolean, applied: boolean }}
 */
function bootstrapStorageConfig() {
  // 已通过环境变量预设（如容器部署），跳过自动引导
  if (process.env.TREEKS_RUNTIME_DB_DIR && process.env.TREEKS_RUNTIME_UPLOAD_DIR) {
    return {
      customPath: null,
      dbDir: process.env.TREEKS_RUNTIME_DB_DIR,
      uploadDir: process.env.TREEKS_RUNTIME_UPLOAD_DIR,
      isCustom: true,
      applied: false
    };
  }

  let customPath = null;
  try {
    // 默认数据库文件路径
    const defaultDbFile = path.join(DEFAULT_DB_DIR, 'treeks.db');
    if (fs.existsSync(defaultDbFile)) {
      const Database = require('better-sqlite3');
      const tmpDb = new Database(defaultDbFile, { readonly: true, fileMustExist: true });
      try {
        const row = tmpDb.prepare('SELECT value FROM settings WHERE key = ?').get('storage_path');
        if (row && row.value) customPath = row.value;
      } finally {
        tmpDb.close();
      }
    }
  } catch (e) {
    console.warn('[StorageLocation] bootstrap 读取失败:', e.message);
  }

  if (!customPath) {
    // 无自定义配置，使用默认路径
    process.env.TREEKS_RUNTIME_DB_DIR = DEFAULT_DB_DIR;
    process.env.TREEKS_RUNTIME_UPLOAD_DIR = DEFAULT_UPLOAD_DIR;
    return { customPath: null, dbDir: DEFAULT_DB_DIR, uploadDir: DEFAULT_UPLOAD_DIR, isCustom: false, applied: true };
  }

  // 校验自定义路径仍然存在且可访问
  const customDbDir = path.join(customPath, 'data');
  const customUploadDir = path.join(customPath, 'uploads');
  const customDbFile = path.join(customDbDir, 'treeks.db');

  if (!fs.existsSync(customDbFile)) {
    // 自定义位置数据库不存在，回退到默认位置并警告
    console.warn(`[StorageLocation] 自定义位置数据库不存在: ${customDbFile}，回退到默认位置`);
    process.env.TREEKS_RUNTIME_DB_DIR = DEFAULT_DB_DIR;
    process.env.TREEKS_RUNTIME_UPLOAD_DIR = DEFAULT_UPLOAD_DIR;
    return { customPath, dbDir: DEFAULT_DB_DIR, uploadDir: DEFAULT_UPLOAD_DIR, isCustom: false, applied: false };
  }

  process.env.TREEKS_RUNTIME_DB_DIR = customDbDir;
  process.env.TREEKS_RUNTIME_UPLOAD_DIR = customUploadDir;
  console.log(`[StorageLocation] 应用自定义存储位置: ${customPath}`);
  return { customPath, dbDir: customDbDir, uploadDir: customUploadDir, isCustom: true, applied: true };
}

/**
 * 获取运行时数据库目录（启动后由 env 决定）
 */
function getRuntimeDbDir() {
  return process.env.TREEKS_RUNTIME_DB_DIR || DEFAULT_DB_DIR;
}

/**
 * 获取运行时上传目录（启动后由 env 决定）
 */
function getRuntimeUploadDir() {
  return process.env.TREEKS_RUNTIME_UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
}

/**
 * 读取当前存储位置配置（来自 settings 表）
 * 注意：此函数依赖 db 模块，需在 db 初始化后调用
 * @returns {{ customPath: string|null, dbDir: string, uploadDir: string, isCustom: boolean }}
 */
function getStorageConfig() {
  const { db } = require('../db');
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('storage_path');
  const customPath = row ? row.value : null;
  const isCustom = !!customPath;
  // 运行时实际使用路径：env 优先（启动时已根据配置设置）
  const uploadDir = getRuntimeUploadDir();
  const dbDir = getRuntimeDbDir();
  return { customPath, dbDir, uploadDir, isCustom };
}

/**
 * 收集目录大小与文件数
 */
function dirStats(dir) {
  let size = 0;
  let files = 0;
  if (!fs.existsSync(dir)) return { size: 0, files: 0 };
  const walk = (d) => {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else {
        try {
          const st = fs.statSync(full);
          size += st.size;
          files++;
        } catch (_) {}
      }
    }
  };
  walk(dir);
  return { size, files };
}

/**
 * 校验目标路径是否可用作存储位置
 */
function validateTargetPath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') {
    return { ok: false, error: '请提供有效路径' };
  }
  const abs = path.resolve(targetPath);

  // 不允许选择项目根目录或其父目录
  if (abs === PROJECT_ROOT || PROJECT_ROOT.startsWith(abs + path.sep)) {
    return { ok: false, error: '不能选择项目根目录或其上级目录' };
  }
  // 不允许选择项目内的子目录（除默认 data/uploads 外）
  if (abs.startsWith(PROJECT_ROOT + path.sep) && abs !== DEFAULT_DB_DIR && abs !== DEFAULT_UPLOAD_DIR) {
    return { ok: false, error: '不能选择项目内部目录，请使用项目外的独立路径' };
  }

  // 检查父目录是否存在（用于创建新目录）
  const parent = path.dirname(abs);
  if (!fs.existsSync(parent)) {
    return { ok: false, error: `父目录不存在: ${parent}` };
  }

  // 若目录已存在，检查可写
  if (fs.existsSync(abs)) {
    const st = fs.statSync(abs);
    if (!st.isDirectory()) {
      return { ok: false, error: '目标路径已存在但不是目录' };
    }
    try {
      fs.accessSync(abs, fs.constants.W_OK);
    } catch {
      return { ok: false, error: '目标目录不可写' };
    }
  }
  return { ok: true, abs };
}

/**
 * 递归复制目录
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      // 跳过 WAL/SHM 临时文件（运行时无法复制）
      if (e.name.endsWith('-wal') || e.name.endsWith('-shm')) continue;
      fs.copyFileSync(s, d);
    }
  }
}

/**
 * 切换存储位置：迁移数据并写入配置
 * 注意：运行时数据库已打开，无法立即重定向；新位置需要重启服务生效。
 * @param {string} targetPath - 用户指定的目标根目录
 * @param {object} opts - { migrate: boolean } 是否迁移现有数据
 */
function switchStorageLocation(targetPath, opts = {}) {
  const { migrate = true } = opts;
  const validation = validateTargetPath(targetPath);
  if (!validation.ok) {
    const err = new Error(validation.error);
    err.code = 'INVALID_PATH';
    throw err;
  }
  const abs = validation.abs;
  const config = getStorageConfig();

  // 目标子目录
  const newDbDir = path.join(abs, 'data');
  const newUploadDir = path.join(abs, 'uploads');

  // 创建目标目录结构
  if (!fs.existsSync(newDbDir)) fs.mkdirSync(newDbDir, { recursive: true });
  if (!fs.existsSync(newUploadDir)) fs.mkdirSync(newUploadDir, { recursive: true });

  const result = {
    targetPath: abs,
    newDbDir,
    newUploadDir,
    migrated: { db: false, uploads: false, dbSize: 0, uploadSize: 0, uploadFiles: 0 }
  };

  if (migrate) {
    // 1. 迁移数据库文件（关闭 WAL 后用 backup API 安全复制）
    try {
      const backup = db.backup(path.join(newDbDir, 'treeks.db'));
      backup.transfer(0, -1);
      backup.finish();
      result.migrated.db = true;
    } catch (e) {
      // backup 失败则降级为 copyFileSync（但需跳过 wal/shm）
      const srcDb = path.join(config.dbDir, 'treeks.db');
      if (fs.existsSync(srcDb)) {
        fs.copyFileSync(srcDb, path.join(newDbDir, 'treeks.db'));
        result.migrated.db = true;
      }
    }

    // 2. 迁移上传文件
    if (fs.existsSync(config.uploadDir)) {
      const before = dirStats(newUploadDir);
      copyDirRecursive(config.uploadDir, newUploadDir);
      const after = dirStats(newUploadDir);
      result.migrated.uploads = true;
      result.migrated.uploadSize = after.size - before.size;
      result.migrated.uploadFiles = after.files - before.files;
    }
    // 统计 db 大小
    const dbFile = path.join(newDbDir, 'treeks.db');
    if (fs.existsSync(dbFile)) {
      result.migrated.dbSize = fs.statSync(dbFile).size;
    }
  }

  // 3. 写入配置
  db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now','localtime'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run('storage_path', abs);

  return result;
}

/**
 * 清除自定义存储位置配置（恢复默认）
 * 不删除已迁移到自定义位置的数据，由管理员手动处理
 */
function resetStorageLocation() {
  const config = getStorageConfig();
  if (!config.isCustom) {
    return { reset: false, message: '当前已是默认位置' };
  }
  db.prepare('DELETE FROM settings WHERE key = ?').run('storage_path');
  return {
    reset: true,
    previousPath: config.customPath,
    message: '已恢复为默认存储位置，重启服务后生效'
  };
}

/**
 * 列出系统盘符（Windows）或根挂载点（Unix），辅助 UI 选择
 */
function listStorageDrives() {
  const drives = [];
  if (process.platform === 'win32') {
    // Windows：通过环境变量推断常见盘符
    const candidates = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:'];
    for (const letter of candidates) {
      const p = letter + '\\';
      if (fs.existsSync(p)) {
        try {
          fs.accessSync(p, fs.constants.W_OK);
          drives.push({ path: p, label: `${letter} 盘`, system: letter === 'C:' });
        } catch {}
      }
    }
  } else {
    drives.push({ path: '/', label: '根目录 /', system: true });
    // Unix: 列出 /mnt /media 下的挂载点
    for (const base of ['/mnt', '/media']) {
      if (fs.existsSync(base)) {
        try {
          const entries = fs.readdirSync(base, { withFileTypes: true });
          for (const e of entries) {
            if (e.isDirectory()) {
              drives.push({ path: path.join(base, e.name), label: `${base}/${e.name}`, system: false });
            }
          }
        } catch {}
      }
    }
  }
  // 用户主目录
  drives.push({ path: os.homedir(), label: `主目录 (${os.homedir()})`, system: false });
  return drives;
}

module.exports = {
  bootstrapStorageConfig,
  getStorageConfig,
  getRuntimeDbDir,
  getRuntimeUploadDir,
  dirStats,
  validateTargetPath,
  switchStorageLocation,
  resetStorageLocation,
  listStorageDrives,
  DEFAULT_DB_DIR,
  DEFAULT_UPLOAD_DIR,
  PROJECT_ROOT
};

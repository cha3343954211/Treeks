// 系统清理服务：清理项目运行产生的垃圾文件
// 严格保护：用户数据（数据库、有效上传文件、配置）不会被删除

const path = require('path');
const fs = require('fs');
const { db } = require('../db');

const PROJECT_ROOT = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');

// 识别为垃圾文件的根目录测试产物（仅扫描根目录，不递归）
const ROOT_JUNK_PATTERNS = [
  /^test-.*\.(zip|pdf|md|json|txt|html)$/i,  // 测试导出文件
  /^tmp-.*\.(zip|json|txt|md)$/i,             // 临时导出文件
  /^.*\.tmp$/i,                                // 临时文件
  /^.*\.bak$/i,                                // 备份文件
  /^.*\.log$/i,                                // 日志文件
  /^npm-debug\.log.*$/i,
  /^yarn-debug\.log.*$/i,
  /^\.DS_Store$/i,                             // macOS 系统文件
  /^Thumbs\.db$/i                              // Windows 系统文件
];

// 计算目录大小（递归）
function calcDirSize(dir) {
  let size = 0;
  let files = 0;
  if (!fs.existsSync(dir)) return { size, files };
  const walk = (d) => {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else {
        try {
          const stat = fs.statSync(full);
          size += stat.size;
          files++;
        } catch (_) {}
      }
    }
  };
  walk(dir);
  return { size, files };
}

// ===== 1. 扫描根目录垃圾文件 =====
function scanRootJunk() {
  const items = [];
  const entries = fs.readdirSync(PROJECT_ROOT, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    const matched = ROOT_JUNK_PATTERNS.some(p => p.test(e.name));
    if (!matched) continue;
    try {
      const full = path.join(PROJECT_ROOT, e.name);
      const stat = fs.statSync(full);
      items.push({
        path: e.name,
        absPath: full,
        size: stat.size,
        mtime: stat.mtime
      });
    } catch (_) {}
  }
  return items;
}

// ===== 2. 扫描孤儿上传文件 =====
// 孤儿文件：存在于 public/uploads/<uid>/ 但 images 表中没有对应记录
function scanOrphanUploads() {
  const items = [];
  if (!fs.existsSync(UPLOADS_DIR)) return items;

  // 获取所有数据库中记录的图片 (user_id + filename)
  const dbImages = db.prepare('SELECT user_id, filename FROM images').all();
  const dbSet = new Set(dbImages.map(i => `${i.user_id}/${i.filename}`));

  const userDirs = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const dir of userDirs) {
    const uid = dir.name;
    const userDir = path.join(UPLOADS_DIR, uid);
    let files;
    try { files = fs.readdirSync(userDir, { withFileTypes: true }); }
    catch (_) { continue; }

    for (const f of files) {
      if (!f.isFile()) continue;
      // 跳过 .gitkeep 等占位文件
      if (f.name.startsWith('.')) continue;
      const key = `${uid}/${f.name}`;
      if (!dbSet.has(key)) {
        try {
          const full = path.join(userDir, f.name);
          const stat = fs.statSync(full);
          items.push({
            path: `uploads/${uid}/${f.name}`,
            absPath: full,
            size: stat.size,
            mtime: stat.mtime,
            type: 'orphan-upload'
          });
        } catch (_) {}
      }
    }
  }
  return items;
}

// ===== 3. 扫描空的上传用户目录 =====
// 用户已被删除但目录残留（非 .gitkeep 内容）
function scanEmptyUploadDirs() {
  const items = [];
  if (!fs.existsSync(UPLOADS_DIR)) return items;

  // 获取所有有效用户 ID
  const userIds = new Set(db.prepare('SELECT id FROM users').all().map(u => u.id));

  const dirs = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const d of dirs) {
    const uid = parseInt(d.name, 10);
    const userDir = path.join(UPLOADS_DIR, d.name);
    let files;
    try { files = fs.readdirSync(userDir); }
    catch (_) { continue; }

    // 目录为空，或仅包含 .gitkeep 等隐藏文件
    const realFiles = files.filter(f => !f.startsWith('.'));
    if (realFiles.length === 0) {
      // 若用户已删除，或目录名非数字，则可清理
      if (!userIds.has(uid) || isNaN(uid)) {
        items.push({
          path: `uploads/${d.name}/`,
          absPath: userDir,
          size: 0,
          mtime: new Date(),
          type: 'empty-dir'
        });
      }
    }
  }
  return items;
}

// ===== 4. 数据库维护信息 =====
// 返回数据库碎片化信息（用于决定是否 VACUUM）
function getDbInfo() {
  const dbPath = db.name;
  let dbSize = 0;
  try { dbSize = fs.statSync(dbPath).size; } catch (_) {}

  // WAL 文件大小
  const walPath = dbPath + '-wal';
  let walSize = 0;
  try { walSize = fs.statSync(walPath).size; } catch (_) {}

  // SHM 文件大小
  const shmPath = dbPath + '-shm';
  let shmSize = 0;
  try { shmSize = fs.statSync(shmPath).size; } catch (_) {}

  // 统计各表行数
  const stats = {
    users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
    diaries: db.prepare('SELECT COUNT(*) as c FROM diaries').get().c,
    images: db.prepare('SELECT COUNT(*) as c FROM images').get().c,
    schedules: db.prepare('SELECT COUNT(*) as c FROM schedules').get().c,
    settings: db.prepare('SELECT COUNT(*) as c FROM settings').get().c,
    admin_logs: db.prepare('SELECT COUNT(*) as c FROM admin_logs').get().c
  };

  return { dbPath, dbSize, walSize, shmSize, stats };
}

// ===== 预览：返回所有可清理项 =====
function previewCleanup() {
  const rootJunk = scanRootJunk();
  const orphanUploads = scanOrphanUploads();
  const emptyDirs = scanEmptyUploadDirs();
  const dbInfo = getDbInfo();

  // 按类型聚合
  const groups = [
    {
      id: 'root-junk',
      title: '根目录垃圾文件',
      description: '测试导出、临时文件、备份、日志等',
      icon: 'trash',
      items: rootJunk,
      totalSize: rootJunk.reduce((s, i) => s + i.size, 0),
      deletable: true
    },
    {
      id: 'orphan-uploads',
      title: '孤儿上传文件',
      description: '文件存在于服务器但数据库无记录（上传失败或已删除日记遗留）',
      icon: 'image',
      items: orphanUploads,
      totalSize: orphanUploads.reduce((s, i) => s + i.size, 0),
      deletable: true
    },
    {
      id: 'empty-dirs',
      title: '空的上传目录',
      description: '用户已删除但上传目录残留（仅清理空目录）',
      icon: 'folder',
      items: emptyDirs,
      totalSize: 0,
      deletable: true
    },
    {
      id: 'db-wal',
      title: '数据库 WAL 文件',
      description: 'SQLite WAL 日志文件，可通过 checkpoint 合并到主库',
      icon: 'database',
      items: [{
        path: 'data/treeks.db-wal',
        absPath: dbInfo.walPath,
        size: dbInfo.walSize,
        mtime: new Date(),
        type: 'wal'
      }],
      totalSize: dbInfo.walSize,
      deletable: false,  // 不能直接删除，需 checkpoint
      canCheckpoint: true
    }
  ];

  const totalSize = groups.reduce((s, g) => s + g.totalSize, 0);
  const totalItems = groups.reduce((s, g) => s + g.items.length, 0);

  return {
    groups,
    summary: {
      totalSize,
      totalItems,
      dbInfo
    }
  };
}

// ===== 执行清理 =====
// targets: 数组，指定要清理的组 ID，如 ['root-junk', 'orphan-uploads']
function executeCleanup(targets) {
  const result = {
    deletedFiles: 0,
    deletedDirs: 0,
    freedSize: 0,
    checkpointed: false,
    errors: []
  };

  const targetSet = new Set(targets);

  // 1. 清理根目录垃圾文件
  if (targetSet.has('root-junk')) {
    const items = scanRootJunk();
    for (const it of items) {
      try {
        fs.unlinkSync(it.absPath);
        result.deletedFiles++;
        result.freedSize += it.size;
      } catch (e) { result.errors.push(`删除 ${it.path} 失败: ${e.message}`); }
    }
  }

  // 2. 清理孤儿上传文件
  if (targetSet.has('orphan-uploads')) {
    const items = scanOrphanUploads();
    for (const it of items) {
      try {
        fs.unlinkSync(it.absPath);
        result.deletedFiles++;
        result.freedSize += it.size;
      } catch (e) { result.errors.push(`删除 ${it.path} 失败: ${e.message}`); }
    }
  }

  // 3. 清理空目录
  if (targetSet.has('empty-dirs')) {
    const items = scanEmptyUploadDirs();
    for (const it of items) {
      try {
        fs.rmdirSync(it.absPath);
        result.deletedDirs++;
      } catch (e) { result.errors.push(`删除目录 ${it.path} 失败: ${e.message}`); }
    }
  }

  // 4. 数据库 WAL checkpoint（将 WAL 合并到主库，但不删除 WAL 文件本身）
  if (targetSet.has('db-wal')) {
    try {
      // TRUNCATE 模式：将 WAL 内容写入主库并截断 WAL 文件
      const r = db.pragma('wal_checkpoint(TRUNCATE)');
      result.checkpointed = true;
      result.freedSize += r[0] && r[0].wal_frames > 0 ? (r[0].wal_frames * 4096) : 0;  // 估算
    } catch (e) { result.errors.push(`WAL checkpoint 失败: ${e.message}`); }
  }

  return result;
}

module.exports = {
  previewCleanup,
  executeCleanup,
  getDbInfo,
  calcDirSize
};

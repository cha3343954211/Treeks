const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 数据库目录：优先使用启动时 bootstrap 设置的环境变量，否则使用默认位置
const DB_PATH = process.env.TREEKS_RUNTIME_DB_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

const db = new Database(path.join(DB_PATH, 'treeks.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');
db.pragma('synchronous = NORMAL');

function initDatabase() {
  // Existing tables need new columns before indexes are created. On a fresh
  // database PRAGMA returns no columns, so the current CREATE definitions below
  // create the complete schema directly.
  const addColumnIfMissing = (table, column, def) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (cols.length === 0) return;
    if (!cols.includes(column)) {
      try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
        console.log(`[DB] 补字段: ${table}.${column}`);
      } catch (e) {
        console.warn(`[DB] 补字段失败 ${table}.${column}: ${e.message}`);
      }
    }
  };
  addColumnIfMissing('users', 'is_admin', 'INTEGER DEFAULT 0');
  addColumnIfMissing('users', 'status', "TEXT DEFAULT 'active'");
  addColumnIfMissing('users', 'storage_limit', 'INTEGER DEFAULT 104857600');
  addColumnIfMissing('users', 'theme', "TEXT DEFAULT 'green'");
  // 用户最近一次活跃时间（用于在线/离线判定）
  addColumnIfMissing('users', 'last_active_at', "TEXT DEFAULT NULL");
  // 日记可见性：private / public / friends / specific
  addColumnIfMissing('diaries', 'visibility', "TEXT DEFAULT 'private'");
  // 日记所属文件夹（NULL 表示在默认/根目录）
  addColumnIfMissing('diaries', 'folder_id', 'INTEGER DEFAULT NULL');
  // PDF 附件：filename 是用户上传的 PDF 文件名（相对路径），pdf_pages 是总页数
  addColumnIfMissing('diaries', 'pdf_filename', "TEXT DEFAULT NULL");
  addColumnIfMissing('diaries', 'pdf_pages', "INTEGER DEFAULT 0");
  // 统一文件表：folder（所属文件夹路径），annotations（批注数据 JSON），thumbnail_url（缩略图）
  addColumnIfMissing('files', 'folder', "TEXT DEFAULT ''");
  addColumnIfMissing('files', 'annotations', "TEXT DEFAULT NULL");
  addColumnIfMissing('files', 'thumbnail_url', "TEXT DEFAULT NULL");
  // 信件文件附件：file_id 关联 files 表
  addColumnIfMissing('letters', 'file_id', 'INTEGER DEFAULT NULL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS diary_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diary_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      title TEXT DEFAULT '',
      content TEXT DEFAULT '',
      mood TEXT,
      weather TEXT,
      tags TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_diary_versions_diary_id ON diary_versions(diary_id);

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      avatar TEXT,
      bio TEXT,
      is_admin INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      storage_limit INTEGER DEFAULT 104857600,
      theme TEXT DEFAULT 'green',
      last_active_at TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT DEFAULT '',
      content TEXT DEFAULT '',
      mood TEXT,
      weather TEXT,
      tags TEXT,
      is_pinned INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 0,
      visibility TEXT DEFAULT 'private',
      folder_id INTEGER DEFAULT NULL,
      pdf_filename TEXT DEFAULT NULL,
      pdf_pages INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
    CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
    CREATE INDEX IF NOT EXISTS idx_diaries_tags ON diaries(tags);
    -- 复合索引：列表查询 WHERE user_id=? ORDER BY is_pinned DESC, created_at DESC
    CREATE INDEX IF NOT EXISTS idx_diaries_user_pin_time ON diaries(user_id, is_pinned, created_at);

    -- FTS5 全文检索：使用普通内嵌表（rowid = diaries.id），不依赖外部内容表。
    -- 注意：切勿改为 content='diaries' 的外部内容表——其 'delete' 命令要求旧值与索引完全匹配，
    -- 存量数据在迁移期间写入的索引与该语义冲突时会导致 SQLITE_CORRUPT（database disk image is malformed），
    -- 进而使所有日记写操作（新建/编辑/移动）报 500。普通 fts5 表按 rowid 删除，无此风险。
    CREATE VIRTUAL TABLE IF NOT EXISTS diary_fts USING fts5(
      title, content,
      tokenize='unicode61'
    );
    CREATE TRIGGER IF NOT EXISTS diary_fts_ai AFTER INSERT ON diaries BEGIN
      INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
    END;
    CREATE TRIGGER IF NOT EXISTS diary_fts_ad AFTER DELETE ON diaries BEGIN
      DELETE FROM diary_fts WHERE rowid = old.id;
    END;
    CREATE TRIGGER IF NOT EXISTS diary_fts_au AFTER UPDATE ON diaries BEGIN
      DELETE FROM diary_fts WHERE rowid = old.id;
      INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
    END;

    -- 日记文件夹
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#4c995c',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name,
      size INTEGER,
      url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

    -- 统一文件表：覆盖图片、PDF 等所有用户上传的文件
    -- kind: 'image' | 'pdf' | 'other'
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      kind TEXT NOT NULL DEFAULT 'other',
      filename TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT,
      size INTEGER,
      url TEXT NOT NULL,
      folder TEXT DEFAULT '',
      annotations TEXT,
      thumbnail_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
    CREATE INDEX IF NOT EXISTS idx_files_user_kind ON files(user_id, kind);
    CREATE INDEX IF NOT EXISTS idx_files_user_folder ON files(user_id, folder);

    -- 用户文件夹表
    CREATE TABLE IF NOT EXISTS file_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      parent TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, parent, name)
    );
    CREATE INDEX IF NOT EXISTS idx_folders_user ON file_folders(user_id, parent);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- AI 对话：按日记归档，-1 表示未绑定具体日记的全局会话
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      diary_id INTEGER DEFAULT -1,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      result TEXT DEFAULT '',
      action TEXT DEFAULT 'custom',
      model_id TEXT DEFAULT '',
      mode TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_diary ON ai_conversations(user_id, diary_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON ai_conversations(created_at);

    CREATE TABLE IF NOT EXISTS ai_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      base_url TEXT NOT NULL,
      model TEXT NOT NULL,
      api_key_encrypted TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_models_name ON ai_models(name);
    CREATE INDEX IF NOT EXISTS idx_ai_models_enabled ON ai_models(enabled, is_default);

    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      detail TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      schedule_date TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      color TEXT DEFAULT '#4c995c',
      is_done INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
    CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(schedule_date);

    -- 好友关系（双向，存两行）
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
    CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);

    -- 好友请求
    CREATE TABLE IF NOT EXISTS friend_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_friend_requests_to ON friend_requests(to_user_id, status);
    CREATE INDEX IF NOT EXISTS idx_friend_requests_from ON friend_requests(from_user_id, status);

    -- 日记协作者
    CREATE TABLE IF NOT EXISTS diary_collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diary_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'editor',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(diary_id, user_id),
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_diary_collaborators_diary ON diary_collaborators(diary_id);
    CREATE INDEX IF NOT EXISTS idx_diary_collaborators_user ON diary_collaborators(user_id);

    -- 日记指定可见用户
    CREATE TABLE IF NOT EXISTS diary_visible_to (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diary_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(diary_id, user_id),
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_diary_visible_to_user ON diary_visible_to(user_id);
    -- 关键索引：shared/list 查询用 diary_id 过滤（之前缺失导致全表扫）
    CREATE INDEX IF NOT EXISTS idx_diary_visible_to_diary ON diary_visible_to(diary_id);

    -- 信件
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      diary_id INTEGER,
      file_id INTEGER,
      subject TEXT DEFAULT '',
      content TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      read_at TEXT,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE SET NULL,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_letters_recipient ON letters(recipient_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_letters_sender ON letters(sender_id);

    -- 用户屏蔽关系（屏蔽某作者后，其笔记不再出现在共享列表中）
    CREATE TABLE IF NOT EXISTS user_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      blocked_user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blocked_user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, blocked_user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON user_blocks(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON user_blocks(blocked_user_id);

    -- 日记附件（一个日记可挂多个文件，复用 files 表）
    CREATE TABLE IF NOT EXISTS diary_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diary_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
      UNIQUE(diary_id, file_id)
    );
    CREATE INDEX IF NOT EXISTS idx_diary_attachments_diary ON diary_attachments(diary_id, sort_order);

    -- 即时消息（一对一聊天）
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      content TEXT DEFAULT '',
      file_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      read_at TEXT,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_messages_pair ON messages(sender_id, recipient_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, is_read);
    -- 反向索引：支持历史消息查询（recipient_id, sender_id, created_at）
    CREATE INDEX IF NOT EXISTS idx_messages_recipient_pair ON messages(recipient_id, sender_id, created_at);
  `);

  // Normalize future inserts even when an old SQLite table still has a
  // datetime('now', 'localtime') default in its persisted schema.
  const timestampTables = [
    'users', 'diaries', 'folders', 'images', 'files', 'file_folders',
    'admin_logs', 'schedules', 'friends', 'friend_requests',
    'diary_collaborators', 'diary_visible_to', 'letters', 'user_blocks',
    'diary_attachments', 'messages', 'diary_versions'
  ];
  for (const table of timestampTables) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (!cols.includes('created_at') || !cols.includes('id')) continue;
    const updatedAt = cols.includes('updated_at')
      ? ", updated_at = CASE WHEN updated_at = datetime('now', 'localtime') THEN datetime('now') ELSE updated_at END"
      : '';
    db.exec(`DROP TRIGGER IF EXISTS trg_${table}_utc_insert;
      CREATE TRIGGER trg_${table}_utc_insert
      AFTER INSERT ON ${table}
      WHEN datetime('now', 'localtime') != datetime('now')
       AND NEW.created_at = datetime('now', 'localtime')
      BEGIN
        UPDATE ${table} SET created_at = datetime('now')${updatedAt} WHERE id = NEW.id;
      END;`);
  }

  // 默认设置
  const defaultSettings = {
    allow_register: '1',
    site_name: 'Treeks',
    site_notice: '',
    default_storage_limit: '104857600'
  };
  const upsertSetting = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING'
  );
  for (const [k, v] of Object.entries(defaultSettings)) {
    upsertSetting.run(k, v);
  }

  // 首次启动时，把最早注册的用户设为管理员（如果没有管理员）
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM users WHERE is_admin = 1').get();
  if (adminCount.c === 0) {
    const firstUser = db.prepare('SELECT id FROM users ORDER BY id ASC LIMIT 1').get();
    if (firstUser) {
      db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(firstUser.id);
      console.log(`[DB] 已将用户 #${firstUser.id} 设为管理员`);
    }
  }

  // 数据迁移：统一日期格式（将 YYYY/MM/DD 修复为 YYYY-MM-DD）
  const dateTables = [
    'diaries', 'users', 'schedules', 'letters', 'friend_requests',
    'admin_logs', 'images', 'diary_collaborators', 'settings'
  ];
  const dateColumns = ['created_at', 'updated_at', 'read_at'];
  let migrated = 0;
  for (const table of dateTables) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    for (const col of dateColumns) {
      if (cols.includes(col)) {
        const result = db.prepare(`UPDATE ${table} SET ${col} = REPLACE(${col}, '/', '-') WHERE ${col} LIKE '%/%'`).run();
        if (result.changes > 0) {
          console.log(`[DB] 日期格式迁移: ${table}.${col} 修复 ${result.changes} 条记录`);
          migrated += result.changes;
        }
      }
    }
  }
  if (migrated > 0) console.log(`[DB] 共修复 ${migrated} 条日期格式记录`);

  // 数据迁移：将旧的本地时间转换为 UTC 时间
  // 旧版本使用 datetime('now', 'localtime') 存储服务器本地时间，现在统一改为 UTC
  // 检查是否已执行过此迁移（通过检查是否存在 timezone_migration 标记）
  const migrationDone = db.prepare("SELECT 1 FROM settings WHERE key = 'timezone_migration'").get();
  if (!migrationDone) {
    let tzMigrated = 0;
    for (const table of dateTables) {
      const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
      for (const col of dateColumns) {
        if (cols.includes(col)) {
          // 将本地时间转换为 UTC（减去 8 小时，假设旧数据是在 UTC+8 创建的）
          // datetime(col, '-8 hours') 将本地时间转换为 UTC
          const result = db.prepare(`UPDATE ${table} SET ${col} = datetime(${col}, '-8 hours') WHERE ${col} IS NOT NULL AND ${col} != ''`).run();
          if (result.changes > 0) {
            console.log(`[DB] UTC 转换迁移: ${table}.${col} 转换 ${result.changes} 条记录`);
            tzMigrated += result.changes;
          }
        }
      }
    }
    if (tzMigrated > 0) console.log(`[DB] 共转换 ${tzMigrated} 条记录为 UTC 时间`);
    db.prepare("INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('timezone_migration', 'done', datetime('now'))").run();
    console.log('[DB] 时区迁移标记已设置');
  }

  // 数据迁移：把旧 images 表的记录和 diaries.pdf_filename 关联的 PDF 文件同步到 files 统一表
  // 仅在 files 表为空时执行（首次启动后不再重复迁移）
  const filesCount = db.prepare('SELECT COUNT(*) AS c FROM files').get().c;
  if (filesCount === 0) {
    let fileMigrated = 0;
    // 1. 从 images 表迁移（URL 加上 images/ 子目录，匹配新文件存储结构）
    const imgRows = db.prepare('SELECT id, user_id, filename, original_name, size, url, created_at FROM images').all();
    const insFile = db.prepare(
      `INSERT INTO files (user_id, kind, filename, original_name, mime_type, size, url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const r of imgRows) {
      const ext = (r.filename.split('.').pop() || '').toLowerCase();
      const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp', svg: 'image/svg+xml' };
      const mime = mimeMap[ext] || 'image/' + ext;
      // 旧版 URL 形如 /uploads/USER_ID/filename；新结构要求 /uploads/USER_ID/images/filename
      let newUrl = r.url;
      if (newUrl && /^\/uploads\/\d+\/[^/]+$/.test(newUrl)) {
        newUrl = newUrl.replace(/^(\/uploads\/\d+\/)([^/]+)$/, '$1images/$2');
      }
      insFile.run(r.user_id, 'image', r.filename, r.original_name, mime, r.size, newUrl, r.created_at);
      fileMigrated++;
    }
    // 2. 从 diaries.pdf_filename 迁移（去重）
    const pdfRows = db.prepare(
      `SELECT user_id, pdf_filename, created_at FROM diaries
       WHERE pdf_filename IS NOT NULL AND pdf_filename != '' GROUP BY user_id, pdf_filename`
    ).all();
    for (const r of pdfRows) {
      const exists = db.prepare('SELECT 1 FROM files WHERE user_id = ? AND filename = ?').get(r.user_id, r.pdf_filename);
      if (exists) continue;
      const url = `/api/upload/pdf/${r.pdf_filename}`;
      insFile.run(r.user_id, 'pdf', r.pdf_filename, r.pdf_filename, 'application/pdf', null, url, r.created_at);
      fileMigrated++;
    }
    if (fileMigrated > 0) console.log(`[DB] files 统一表已迁移 ${fileMigrated} 条记录`);
  }

  // 修复：把已存在但 URL 未含子目录的图片记录补上 images/ 子目录
  // 仅对 URL 形如 /uploads/USER_ID/file 的 image 类记录执行
  const oldImageUrlRows = db.prepare(
    `SELECT id, user_id, filename FROM files
     WHERE kind = 'image' AND url LIKE '/uploads/%/%' AND url NOT LIKE '/uploads/%/%/%'`
  ).all();
  if (oldImageUrlRows.length > 0) {
    const upd = db.prepare(`UPDATE files SET url = ? WHERE id = ?`);
    for (const r of oldImageUrlRows) {
      const newUrl = `/uploads/${r.user_id}/images/${r.filename}`;
      upd.run(newUrl, r.id);
    }
    console.log(`[DB] 修复了 ${oldImageUrlRows.length} 条历史图片 URL，添加 images/ 子目录`);
  }

  // 迁移：把旧 diaries.pdf_filename 绑定关系迁移到 diary_attachments 表
  const attachMigrationFlag = db.prepare("SELECT value FROM settings WHERE key = 'pdf_attach_migration_v1'").get();
  if (!attachMigrationFlag) {
    const oldBinds = db.prepare(
      `SELECT d.id AS diary_id, d.user_id, d.pdf_filename, f.id AS file_id
       FROM diaries d
       LEFT JOIN files f ON f.user_id = d.user_id AND f.filename = d.pdf_filename
       WHERE d.pdf_filename IS NOT NULL AND d.pdf_filename != ''`
    ).all();
    let attMigrated = 0;
    const insAtt = db.prepare(
      'INSERT OR IGNORE INTO diary_attachments (diary_id, file_id, sort_order) VALUES (?, ?, ?)'
    );
    for (const r of oldBinds) {
      if (!r.file_id) continue;
      insAtt.run(r.diary_id, r.file_id, 0);
      attMigrated++;
    }
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('pdf_attach_migration_v1', ?)").run(String(attMigrated));
    if (attMigrated > 0) console.log(`[DB] 已迁移 ${attMigrated} 条旧 PDF 绑定到 diary_attachments 表`);
  }

  // 乱码修复一次性自动迁移：修正历史 files 表中误存为 latin1 的乱码 original_name
  try {
    const filesToFix = db.prepare("SELECT id, original_name FROM files WHERE original_name LIKE '%ä%' OR original_name LIKE '%æ%' OR original_name LIKE '%å%'").all();
    let fixedCount = 0;
    for (const f of filesToFix) {
      try {
        const fixed = Buffer.from(f.original_name, 'latin1').toString('utf8');
        if (fixed && !fixed.includes('\uFFFD') && /[\u4e00-\u9fa5]/.test(fixed)) {
          db.prepare('UPDATE files SET original_name = ? WHERE id = ?').run(fixed, f.id);
          fixedCount++;
        }
      } catch (_) {}
    }
    if (fixedCount > 0) console.log(`[DB] 已修复 ${fixedCount} 个历史乱码文件名`);
  } catch (_) {}

  // 补列 diaries.is_locked 与 diaries.pin_code (私密锁功能)
  try {
    const cols = db.prepare("PRAGMA table_info(diaries)").all();
    if (!cols.some(c => c.name === 'is_locked')) {
      db.prepare("ALTER TABLE diaries ADD COLUMN is_locked INTEGER DEFAULT 0").run();
      console.log('[DB] 补字段: diaries.is_locked');
    }
    if (!cols.some(c => c.name === 'pin_code')) {
      db.prepare("ALTER TABLE diaries ADD COLUMN pin_code TEXT").run();
      console.log('[DB] 补字段: diaries.pin_code');
    }
  } catch (e) {
    console.warn('[DB] 检查/补 diaries.is_locked/pin_code 异常:', e.message);
  }

  // 新建 message_reactions 消息表情回应表
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      emoji TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(message_id, user_id, emoji)
    );
    CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions(message_id);
  `);

  // 表情包表：用户上传的动图/静态表情（支持 GIF），发送时作为消息文件附件
  db.exec(`
    CREATE TABLE IF NOT EXISTS stickers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL,
      name TEXT DEFAULT '',
      emoji TEXT DEFAULT '',
      is_public INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_stickers_user ON stickers(user_id);
    CREATE INDEX IF NOT EXISTS idx_stickers_file ON stickers(file_id);
    CREATE INDEX IF NOT EXISTS idx_stickers_created ON stickers(created_at);
  `);

  // FTS5 索引自检与自愈：
  //  1) 检测旧版外部内容表（content='diaries'）或写入异常（SQLITE_CORRUPT）→ 重建为普通 fts5
  //  2) 行数不一致时回填存量数据（INSERT SELECT，避免外部内容表 rebuild 的语义问题）
  try {
    const ftsDef = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'diary_fts'").get();
    const isExternalContent = !!ftsDef && /content\s*=\s*'diaries'/.test(ftsDef.sql || '');
    let ftsUsable = true;
    try {
      db.prepare('DELETE FROM diary_fts WHERE rowid = -1').run();
      db.prepare("INSERT INTO diary_fts(rowid, title, content) VALUES (-1, 'probe', 'probe')").run();
      db.prepare('DELETE FROM diary_fts WHERE rowid = -1').run();
    } catch (_) {
      ftsUsable = false;
    }
    if (isExternalContent || !ftsUsable) {
      console.log('[DB] 检测到 FTS5 索引异常，正在重建为普通全文索引...');
      db.exec('DROP TRIGGER IF EXISTS diary_fts_ai; DROP TRIGGER IF EXISTS diary_fts_ad; DROP TRIGGER IF EXISTS diary_fts_au;');
      db.exec('DROP TABLE IF EXISTS diary_fts');
      db.exec("CREATE VIRTUAL TABLE diary_fts USING fts5(title, content, tokenize='unicode61')");
      db.exec('CREATE TRIGGER diary_fts_ai AFTER INSERT ON diaries BEGIN INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content); END');
      db.exec('CREATE TRIGGER diary_fts_ad AFTER DELETE ON diaries BEGIN DELETE FROM diary_fts WHERE rowid = old.id; END');
      db.exec('CREATE TRIGGER diary_fts_au AFTER UPDATE ON diaries BEGIN DELETE FROM diary_fts WHERE rowid = old.id; INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content); END');
      console.log('[DB] FTS5 索引已重建为普通全文索引');
    }
    // 每次启动都刷新为幂等触发器（INSERT OR REPLACE）：
    // 兼容旧版本已创建的普通 fts5 表 + 旧触发器，避免“INSERT 后 UTC 触发器 UPDATE
    // 触发 AU 先写入 rowid，随后 AI 再写同 rowid”导致的 PRIMARY KEY 冲突。
    db.exec('DROP TRIGGER IF EXISTS diary_fts_ai; DROP TRIGGER IF EXISTS diary_fts_ad; DROP TRIGGER IF EXISTS diary_fts_au;');
    db.exec(`
      CREATE TRIGGER diary_fts_ai AFTER INSERT ON diaries BEGIN
        INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
      END;
      CREATE TRIGGER diary_fts_ad AFTER DELETE ON diaries BEGIN
        DELETE FROM diary_fts WHERE rowid = old.id;
      END;
      CREATE TRIGGER diary_fts_au AFTER UPDATE ON diaries BEGIN
        DELETE FROM diary_fts WHERE rowid = old.id;
        INSERT OR REPLACE INTO diary_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
      END;
    `);
    const ftsCount = db.prepare('SELECT COUNT(*) as c FROM diary_fts').get().c;
    const diariesCount = db.prepare('SELECT COUNT(*) as c FROM diaries').get().c;
    if (ftsCount < diariesCount) {
      const backfilled = db.prepare(
        "INSERT OR REPLACE INTO diary_fts(rowid, title, content) SELECT id, COALESCE(title, ''), COALESCE(content, '') FROM diaries WHERE id NOT IN (SELECT rowid FROM diary_fts)"
      ).run();
      if (backfilled.changes > 0) console.log(`[DB] FTS5 索引已回填 ${backfilled.changes} 条存量日记`);
    }
  } catch (e) {
    console.warn('[DB] FTS5 自检/回填失败（不影响日记写入）:', e.message);
  }

  console.log('[DB] 数据库初始化完成');
}

module.exports = { db, initDatabase };

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

function initDatabase() {
  db.exec(`
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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
    CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
    CREATE INDEX IF NOT EXISTS idx_diaries_tags ON diaries(tags);

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
      original_name TEXT,
      size INTEGER,
      url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

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

    -- 信件
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      diary_id INTEGER,
      subject TEXT DEFAULT '',
      content TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      read_at TEXT,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE SET NULL
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
  `);

  // 兼容旧库：补字段
  const addColumnIfMissing = (table, column, def) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (!cols.includes(column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
      console.log(`[DB] 补字段: ${table}.${column}`);
    }
  };
  addColumnIfMissing('users', 'is_admin', 'INTEGER DEFAULT 0');
  addColumnIfMissing('users', 'status', "TEXT DEFAULT 'active'");
  addColumnIfMissing('users', 'storage_limit', 'INTEGER DEFAULT 104857600');
  addColumnIfMissing('users', 'theme', "TEXT DEFAULT 'green'");
  // 日记可见性：private / public / friends / specific
  addColumnIfMissing('diaries', 'visibility', "TEXT DEFAULT 'private'");
  // 日记所属文件夹（NULL 表示在默认/根目录）
  addColumnIfMissing('diaries', 'folder_id', 'INTEGER DEFAULT NULL');
  // PDF 附件：filename 是用户上传的 PDF 文件名（相对路径），pdf_pages 是总页数
  addColumnIfMissing('diaries', 'pdf_filename', "TEXT DEFAULT NULL");
  addColumnIfMissing('diaries', 'pdf_pages', "INTEGER DEFAULT 0");

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

  console.log('[DB] 数据库初始化完成');
}

module.exports = { db, initDatabase };

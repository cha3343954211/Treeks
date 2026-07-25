const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data');
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
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
    CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
    CREATE INDEX IF NOT EXISTS idx_diaries_tags ON diaries(tags);

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT,
      size INTEGER,
      url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      detail TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
    CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(schedule_date);

    -- 好友关系（双向，存两行）
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
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
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      read_at TEXT,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_letters_recipient ON letters(recipient_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_letters_sender ON letters(sender_id);
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

  console.log('[DB] 数据库初始化完成');
}

module.exports = { db, initDatabase };

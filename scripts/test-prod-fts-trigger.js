// Regression test for the production bug:
// prod DB uses created_at/updated_at DEFAULT (datetime('now','localtime')) plus a
// legacy trg_diaries_utc_insert trigger that UPDATEs the row right after INSERT.
// That UPDATE fired the FTS AFTER-UPDATE trigger (rowid inserted) and then the
// AFTER-INSERT trigger tried to insert the same rowid again ->
// SQLITE_CONSTRAINT_PRIMARYKEY, making create/move/edit diary return 500.
// Fixed by making FTS triggers idempotent (INSERT OR REPLACE) and refreshing
// them on every startup.
const assert = require('assert/strict');
const Database = require('better-sqlite3');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = 32500 + Math.floor(Math.random() * 1000);
const BASE = `http://127.0.0.1:${PORT}`;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-prodfts-'));
const dbDir = path.join(tempRoot, 'data');
const uploadDir = path.join(tempRoot, 'uploads');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

// 1) Build a DB that mirrors the production shape: localtime defaults + legacy UTC trigger.
{
  const db = new Database(path.join(dbDir, 'treeks.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT DEFAULT '',
      avatar TEXT,
      bio TEXT,
      is_admin INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      storage_limit INTEGER DEFAULT 104857600,
      theme TEXT DEFAULT 'green',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE diaries (
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
    CREATE TRIGGER trg_diaries_utc_insert
      AFTER INSERT ON diaries
      WHEN datetime('now', 'localtime') != datetime('now')
       AND NEW.created_at = datetime('now', 'localtime')
      BEGIN
        UPDATE diaries SET created_at = datetime('now'), updated_at = CASE WHEN updated_at = datetime('now', 'localtime') THEN datetime('now') ELSE updated_at END WHERE id = NEW.id;
      END;
    INSERT INTO users (username, password, nickname) VALUES ('legacy_user', '$2a$10$abcdefghijklmnopqrstuv', '旧用户');
    INSERT INTO diaries (user_id, title, content) VALUES (1, '存量日记', '存量内容');
  `);
  db.close();
}

let child;
let serverOutput = '';

async function request(url, options = {}) {
  const res = await fetch(BASE + url, options);
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json() : await res.text();
  return { res, data };
}

function auth(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(BASE + '/api/health');
      if (res.ok) return;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('test server did not start\n' + serverOutput);
}

async function main() {
  child = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      TREEKS_RUNTIME_DB_DIR: dbDir,
      TREEKS_RUNTIME_UPLOAD_DIR: uploadDir,
      CORS_ORIGINS: ''
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', d => { serverOutput += d; });
  child.stderr.on('data', d => { serverOutput += d; });

  try {
    await waitForServer();

    // register a fresh user
    const reg = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'fts_user', password: 'Test123!', nickname: 'FTS' })
    });
    assert.equal(reg.res.status, 201, JSON.stringify(reg.data));
    const token = reg.data.token;

    // create folder
    const folder = await request('/api/diaries/folders', {
      method: 'POST',
      headers: auth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name: '目标文件夹' })
    });
    assert.equal(folder.res.status, 201, JSON.stringify(folder.data));
    const folderId = folder.data.id ?? folder.data.folder?.id;

    // create diary (used to throw PRIMARY KEY conflict on prod-shaped DB)
    const created = await request('/api/diaries', {
      method: 'POST',
      headers: auth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: '新建日记', content: '中文内容 english content', folder_id: folderId })
    });
    assert.equal(created.res.status, 201, 'create diary: ' + JSON.stringify(created.data) + '\n' + serverOutput.slice(-2000));
    const diaryId = created.data.id;

    // move to root (folder_id null)
    const moved = await request(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      headers: auth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ folder_id: null })
    });
    assert.equal(moved.res.status, 200, 'move diary: ' + JSON.stringify(moved.data));

    // move back into folder
    const moved2 = await request(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      headers: auth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ folder_id: folderId })
    });
    assert.equal(moved2.res.status, 200, 'move diary 2: ' + JSON.stringify(moved2.data));

    // edit content (fires FTS au trigger)
    const edited = await request(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      headers: auth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: '改名', content: 'updated content' })
    });
    assert.equal(edited.res.status, 200, 'edit diary: ' + JSON.stringify(edited.data));

    // FTS search must find the new diary
    const search = await request(`/api/diaries?folder_id=all&q=${encodeURIComponent('updated')}`, { headers: auth(token) });
    assert.equal(search.res.status, 200, 'search: ' + JSON.stringify(search.data));
    const hits = search.data.total ?? search.data.length ?? 0;
    assert.ok(hits >= 1, 'FTS search should return the edited diary, got ' + JSON.stringify(search.data).slice(0, 300));

    // legacy diary must still be searchable after startup backfill
    const legacySearch = await request(`/api/diaries?folder_id=all&q=${encodeURIComponent('存量')}`, { headers: auth(token) });
    assert.equal(legacySearch.res.status, 200, 'legacy search: ' + JSON.stringify(legacySearch.data));

    console.log('[ProdFTS] 新建/移动/编辑/搜索 全部通过（生产库形态回归测试）✓');
  } finally {
    child.kill();
  }
}

main().then(() => process.exit(0)).catch(e => {
  console.error('ProdFTS regression FAILED:', e.message);
  process.exit(1);
});

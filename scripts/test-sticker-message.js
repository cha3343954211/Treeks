// Regression: sticker (emoji pack) upload/list/send/read + delete permission.
// Usage: node scripts/test-sticker-message.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3472;
const BASE = `http://127.0.0.1:${PORT}`;
const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-sticker-'));
const dbDir = path.join(tmpBase, 'data');
const uploadDir = path.join(tmpBase, 'uploads');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

let server;
let serverLog = '';

async function api(url, { method = 'GET', token, json, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  let body;
  if (json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(json); }
  if (form) body = form;
  const res = await fetch(BASE + url, { method, headers, body });
  let data = null;
  try { data = await res.json(); } catch { data = await res.text(); }
  return { ok: res.ok, status: res.status, data };
}

// Minimal valid 1-frame GIF (2x2 red/blue checkerboard)
function makeGif(name = 'sticker.gif') {
  const gif = Buffer.from(
    'R0lGODlhAgACAIAAAP8AAP///yH5BAEAAAAALAAAAAACAAIAAAIDhB4FADs=',
    'base64'
  );
  return { buf: gif, name, type: 'image/gif' };
}

async function waitReady(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(BASE + '/api/health');
      if (r.ok) return;
    } catch (_) {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('server not ready\n' + serverLog);
}

let passed = 0;
function check(cond, label) {
  if (!cond) throw new Error('FAIL: ' + label);
  passed++;
  console.log('  ok - ' + label);
}

async function main() {
  server = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: 'test',
      JWT_SECRET: crypto.randomBytes(48).toString('hex'),
      TREEKS_RUNTIME_DB_DIR: dbDir,
      TREEKS_RUNTIME_UPLOAD_DIR: uploadDir,
      CORS_ORIGINS: ''
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', d => { serverLog += d; });
  server.stderr.on('data', d => { serverLog += d; });

  try {
    await waitReady();

    const suffix = Math.random().toString(36).slice(2, 8);
    const a = await api('/api/auth/register', { method: 'POST', json: { username: 'stk_a_' + suffix, password: 'Test123!', nickname: 'StickerA' } });
    if (!a.ok) throw new Error('register A failed: ' + JSON.stringify(a.data));
    const b = await api('/api/auth/register', { method: 'POST', json: { username: 'stk_b_' + suffix, password: 'Test123!', nickname: 'StickerB' } });
    if (!b.ok) throw new Error('register B failed: ' + JSON.stringify(b.data));
    const c = await api('/api/auth/register', { method: 'POST', json: { username: 'stk_c_' + suffix, password: 'Test123!', nickname: 'StickerC' } });
    if (!c.ok) throw new Error('register C failed: ' + JSON.stringify(c.data));
    const aToken = a.data.token, bToken = b.data.token, cToken = c.data.token;
    const bobId = b.data.user.id, carolId = c.data.user.id;
    console.log('[setup] users a/b/c registered');

    // friends A <-> B
    const req = await api('/api/friends/requests', { method: 'POST', token: aToken, json: { toUserId: bobId } });
    if (!req.ok) throw new Error('friend request failed: ' + JSON.stringify(req.data));
    const pending = await api('/api/friends/requests', { token: bToken });
    const list = pending.data.items || pending.data || [];
    const rq = list.find(r => r.from_user_id === a.data.user.id);
    if (!rq) throw new Error('no pending request: ' + JSON.stringify(pending.data).slice(0, 300));
    const acc = await api(`/api/friends/requests/${rq.id || rq.friend_request_id}/accept`, { method: 'POST', token: bToken });
    if (!acc.ok) throw new Error('accept failed: ' + JSON.stringify(acc.data));
    console.log('[setup] A<->B friends');

    // upload sticker (GIF)
    const gif = makeGif('funny-cat.gif');
    const fd = new FormData();
    fd.append('file', new File([gif.buf], gif.name, { type: gif.type }));
    fd.append('name', '可爱猫猫');
    fd.append('emoji', '😸');
    const up = await api('/api/stickers', { method: 'POST', token: aToken, form: fd });
    if (!up.ok) throw new Error('sticker upload failed: ' + JSON.stringify(up.data));
    check(up.data.file_id && up.data.url.includes('/stickers/'), 'sticker uploaded with file_id/url');
    const stickerId = up.data.id, fileId = up.data.file_id;
    console.log('  sticker id=' + stickerId + ' file_id=' + fileId + ' url=' + up.data.url);

    // list contains it, with file fields needed to send
    const listRes = await api('/api/stickers', { token: aToken });
    if (!listRes.ok) throw new Error('sticker list failed');
    const mine = (listRes.data.items || []).find(s => s.id === stickerId);
    check(!!mine && !!mine.file && mine.file.id === fileId && mine.mine === true, 'list returns sticker with file.id');
    const publicList = await api('/api/stickers', { token: cToken });
    check((publicList.data.items || []).some(s => s.id === stickerId), 'sticker visible to other users');

    // send as message
    const msg = await api('/api/messages', { method: 'POST', token: aToken, json: { peerId: bobId, content: '', fileId } });
    if (!msg.ok) throw new Error('send sticker message failed: ' + JSON.stringify(msg.data));
    check(!!msg.data.id, 'sticker message sent');
    const msgId = msg.data.id;

    // recipient can read message with file info
    const hist = await api(`/api/messages/with/${a.data.user.id}`, { token: bToken });
    const m = (hist.data.items || []).find(x => x.id === msgId);
    check(!!m && m.file_id === fileId && m.file_kind === 'image' && !!m.file_url, 'recipient reads sticker message with file url');

    // sticker file is servable (login required)
    const fileRes = await fetch(BASE + up.data.url, { headers: { Authorization: 'Bearer ' + bToken } });
    check(fileRes.status === 200, 'sticker image served to friend');

    // C cannot delete A's sticker
    const delForbidden = await api('/api/stickers/' + stickerId, { method: 'DELETE', token: cToken });
    check(delForbidden.status === 403, 'non-owner delete rejected');

    // A can delete own sticker; file record removed when unreferenced
    const delOk = await api('/api/stickers/' + stickerId, { method: 'DELETE', token: aToken });
    check(delOk.ok, 'owner delete allowed');
    const gone = await api('/api/stickers', { token: aToken });
    check(!(gone.data.items || []).some(s => s.id === stickerId), 'deleted sticker removed from list');

    console.log(`\nALL ${passed} CHECKS PASSED`);
  } finally {
    if (server) { server.kill(); }
    try { fs.rmSync(tmpBase, { recursive: true, force: true }); } catch (_) {}
  }
}

main().catch(err => {
  console.error(err.stack || err);
  if (serverLog) console.error('\n--- server log tail ---\n' + serverLog.slice(-2000));
  process.exit(1);
});

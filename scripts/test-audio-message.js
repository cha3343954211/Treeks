// E2E: audio preview in My Files + audio message bubble + voice button in composer.
// Also captures desktop/mobile screenshots for visual QA.
// Usage: node scripts/test-audio-message.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const PORT = 3471;
const BASE = `http://127.0.0.1:${PORT}`;
const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-audio-e2e-'));
const dbDir = path.join(tmpBase, 'data');
const uploadDir = path.join(tmpBase, 'uploads');
const shotsDir = path.join(tmpBase, 'shots');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(shotsDir, { recursive: true });

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

function makeWav(seconds = 0.2) {
  const sampleRate = 8000;
  const n = Math.floor(sampleRate * seconds);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.sin(i / 20) * 3000), 44 + i * 2);
  return buf;
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

    // ---- setup via API ----
    const a = await api('/api/auth/register', { method: 'POST', json: { username: 'alice_audio', password: 'Test123!', nickname: 'Alice' } });
    if (!a.ok) throw new Error('register alice failed: ' + JSON.stringify(a.data));
    const b = await api('/api/auth/register', { method: 'POST', json: { username: 'bob_audio', password: 'Test123!', nickname: 'Bob' } });
    if (!b.ok) throw new Error('register bob failed: ' + JSON.stringify(b.data));
    const aToken = a.data.token, bToken = b.data.token;
    const bobId = b.data.user.id;

    const req = await api('/api/friends/requests', { method: 'POST', token: aToken, json: { toUserId: bobId } });
    if (!req.ok) throw new Error('friend request failed: ' + JSON.stringify(req.data));
    const pending = await api('/api/friends/requests', { token: bToken });
    const rq = (pending.data.items || []).find(r => r.from_user_id === a.data.user.id) || (pending.data || []).find(r => r.from_user_id === a.data.user.id);
    const reqId = rq ? (rq.id || rq.friend_request_id) : null;
    if (!reqId) throw new Error('no pending friend request found: ' + JSON.stringify(pending.data).slice(0, 300));
    const acc = await api(`/api/friends/requests/${reqId}/accept`, { method: 'POST', token: bToken });
    if (!acc.ok) throw new Error('accept failed: ' + JSON.stringify(acc.data));

    // upload wav (audio kind)
    const fd = new FormData();
    fd.append('file', new File([makeWav()], '问候语音.wav', { type: 'audio/wav' }));
    const up = await api('/api/upload/file', { method: 'POST', token: aToken, form: fd });
    if (!up.ok) throw new Error('audio upload failed: ' + JSON.stringify(up.data));
    const audioFileId = up.data.id;
    console.log('[api] audio uploaded id=' + audioFileId, 'kind=' + up.data.kind, 'url=' + up.data.url);

    // send audio message
    const msg = await api('/api/messages', { method: 'POST', token: aToken, json: { peerId: bobId, content: '', fileId: audioFileId } });
    if (!msg.ok) throw new Error('send audio msg failed: ' + JSON.stringify(msg.data));
    console.log('[api] audio message sent, id=' + msg.data.id);

    // ---- browser ----
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((token, user) => {
      localStorage.setItem('treeks_token', token);
      localStorage.setItem('treeks_user', JSON.stringify(user));
    }, aToken, a.data.user);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.user && state.user.id > 0, { timeout: 15000 });

    // files view
    await page.evaluate(() => { navigateTo('files'); refreshFiles(); });
    await page.waitForSelector('.file-item.file-audio-card audio[controls]', { timeout: 10000 });
    const fileCardOk = await page.evaluate(() => {
      const card = document.querySelector('.file-item.file-audio-card');
      return {
        hasPlayer: !!card.querySelector('audio[controls]'),
        playerSrc: card.querySelector('audio').getAttribute('src'),
        hasCopyBtn: !!card.querySelector('.copy-md-btn[data-md]'),
        name: card.querySelector('.file-name')?.textContent
      };
    });
    console.log('[browser] files audio card:', JSON.stringify(fileCardOk));
    await page.screenshot({ path: path.join(shotsDir, 'files-desktop.png') });

    // messages view
    await page.evaluate(() => navigateTo('messages'));
    await page.waitForSelector('.msg-conv-item', { timeout: 10000 });
    await page.evaluate(() => {
      const item = [...document.querySelectorAll('.msg-conv-item')].find(el => el.textContent.includes('Bob'));
      if (item) item.click();
    });
    await page.waitForSelector('.msg-bubble-audio-card audio[controls]', { timeout: 10000 });
    const msgOk = await page.evaluate(() => ({
      hasAudioBubble: !!document.querySelector('.msg-bubble-audio-card audio[controls]'),
      voiceBtn: !!document.getElementById('msg-voice-btn'),
      recordingBar: !!document.getElementById('msg-voice-recording')
    }));
    console.log('[browser] message audio:', JSON.stringify(msgOk));
    await page.screenshot({ path: path.join(shotsDir, 'messages-desktop.png') });

    // mobile viewport
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(shotsDir, 'messages-mobile.png') });
    await page.evaluate(() => navigateTo('files'));
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(shotsDir, 'files-mobile.png') });

    const asserts = [
      ['files audio card', fileCardOk.hasPlayer],
      ['files copy-md', fileCardOk.hasCopyBtn],
      ['msg audio bubble', msgOk.hasAudioBubble],
      ['voice button', msgOk.voiceBtn],
      ['recording bar', msgOk.recordingBar]
    ];
    const failed = asserts.filter(a => !a[1]);
    if (failed.length) throw new Error('FAILED: ' + failed.map(f => f[0]).join(', '));
    console.log('ALL AUDIO MESSAGE E2E PASSED');
    console.log('screenshots:', shotsDir);
    await browser.close();
  } catch (e) {
    console.error('E2E FAILED:', e.message);
    console.error(serverLog.slice(-3000));
    process.exitCode = 1;
  } finally {
    if (server) server.kill();
    setTimeout(() => process.exit(), 300);
  }
}

main();

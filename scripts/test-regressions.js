const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = 32000 + Math.floor(Math.random() * 1000);
const BASE = `http://127.0.0.1:${PORT}`;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-regression-'));
const dbDir = path.join(tempRoot, 'data');
const uploadDir = path.join(tempRoot, 'uploads');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

let child;
let serverOutput = '';

async function request(url, options = {}) {
  const res = await fetch(BASE + url, options);
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json() : await res.arrayBuffer();
  return { res, data };
}

function auth(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function waitForServer() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(BASE + '/api/health');
      if (res.ok) return;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`test server did not start\n${serverOutput}`);
}

async function register(username) {
  const { res, data } = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'Test123!', nickname: username })
  });
  assert.equal(res.status, 201, JSON.stringify(data));
  return data;
}

async function main() {
  const appSource = fs.readFileSync(path.join(ROOT, 'public', 'js', 'app.js'), 'utf8');
  const names = [...appSource.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  assert.deepEqual([...new Set(duplicates)], [], 'top-level function names must be unique');
  assert.ok(!appSource.includes('apiUploadFile('), 'undefined apiUploadFile reference remains');
  // 禁止残留内联 onclick（易引发存储型 XSS，一律走 data 属性 + addEventListener）
  assert.ok(!/onclick="/.test(appSource), 'inline onclick must be removed (XSS risk)');

  // 编辑器顶部/底部收起控件必须存在
  const htmlSource = fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8');
  assert.ok(htmlSource.includes('id="btn-editor-top-toggle"'), 'editor top collapse toggle missing');
  assert.ok(htmlSource.includes('id="btn-editor-footer-toggle"'), 'editor footer collapse toggle missing');
  assert.ok(htmlSource.includes('id="files-upload-progress"'), 'files upload progress bar missing');
  // 笔刷撤销/重做必须走双栈模型，且重做按钮绑定 redoAnnotation
  assert.ok(appSource.includes('redoStack'), 'brush redoStack missing');
  assert.ok(appSource.includes("pushBrushAction({ type: 'add', items: [anno] })"), 'brush draw undo record missing');
  assert.ok(appSource.includes("if (tool === 'redo') {\n        redoAnnotation();"), 'brush redo button not wired');

  child = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: 'test',
      JWT_SECRET: crypto.randomBytes(48).toString('hex'),
      TREEKS_RUNTIME_DB_DIR: dbDir,
      TREEKS_RUNTIME_UPLOAD_DIR: uploadDir
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
  child.stderr.on('data', chunk => { serverOutput += chunk.toString(); });
  await waitForServer();

  const alice = await register('alice_test');
  const bob = await register('bob_test');

  let out = await request('/api/diaries/blocked-users', { headers: auth(alice.token) });
  assert.equal(out.res.status, 200);
  assert.deepEqual(out.data.items, []);

  out = await request('/api/diaries', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: { invalid: true }, content: '' })
  });
  assert.equal(out.res.status, 400);

  out = await request('/api/schedules', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: 'bad date', schedule_date: '2026-02-31' })
  });
  assert.equal(out.res.status, 400);

  const htmlForm = new FormData();
  htmlForm.append('file', new Blob(['<script>globalThis.pwned=true</script>'], { type: 'text/html' }), 'probe.html');
  out = await request('/api/upload/file', {
    method: 'POST', headers: auth(alice.token), body: htmlForm
  });
  assert.equal(out.res.status, 201, JSON.stringify(out.data));
  const textFile = out.data;

  out = await request(textFile.url, { headers: auth(alice.token) });
  assert.equal(out.res.status, 200);
  assert.match(out.res.headers.get('content-type') || '', /^text\/plain/);
  assert.match(out.res.headers.get('content-disposition') || '', /^attachment/);
  out = await request(textFile.url);
  assert.equal(out.res.status, 401);

  const pngForm = new FormData();
  pngForm.append('file', new Blob([Buffer.from([0x89, 0x50, 0x4e, 0x47])], { type: 'image/png' }), 'probe.png');
  out = await request('/api/upload/file', {
    method: 'POST', headers: auth(alice.token), body: pngForm
  });
  assert.equal(out.res.status, 201);
  const imageUrl = out.data.url;
  out = await request(imageUrl);
  assert.equal(out.res.status, 401);

  out = await request('/api/friends/requests', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ toUserId: bob.user.id })
  });
  assert.equal(out.res.status, 201);
  out = await request('/api/friends/requests', { headers: auth(bob.token) });
  const friendRequest = out.data.items[0];
  assert.ok(friendRequest);
  out = await request(`/api/friends/requests/${friendRequest.id}/accept`, {
    method: 'POST', headers: auth(bob.token)
  });
  assert.equal(out.res.status, 200);

  out = await request('/api/messages', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ peerId: bob.user.id, fileId: textFile.id, content: 'attachment' })
  });
  assert.equal(out.res.status, 201, JSON.stringify(out.data));
  out = await request(textFile.url, { headers: auth(bob.token) });
  assert.equal(out.res.status, 200, 'message recipient must be able to download attachment');

  const pdfForm = new FormData();
  pdfForm.append('pdf', new Blob(['%PDF-1.4\n%%EOF\n'], { type: 'application/pdf' }), 'probe.pdf');
  out = await request('/api/upload/pdf', { method: 'POST', headers: auth(alice.token), body: pdfForm });
  assert.equal(out.res.status, 201);
  out = await request(out.data.url, { headers: auth(alice.token, { Range: 'bytes=999-1000' }) });
  assert.equal(out.res.status, 416);

  // ===== 改进项回归：gzip 压缩 =====
  out = await request('/css/style.css', { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(out.res.status, 200);
  assert.equal(out.res.headers.get('content-encoding'), 'gzip', 'static assets must be gzip-compressed');

  // ===== 改进项回归：CORS 默认拒绝跨域 =====
  out = await request('/api/auth/site-info', { headers: { Origin: 'https://evil.example.com' } });
  assert.equal(out.res.status, 200);
  assert.equal(out.res.headers.get('access-control-allow-origin'), null, 'arbitrary origins must NOT be allowed');

  // ===== 改进项回归：列表接口默认 LIMIT =====
  out = await request('/api/upload/files', { headers: auth(alice.token) });
  assert.ok(Array.isArray(out.data.items), 'files list must return items');
  out = await request('/api/friends', { headers: auth(alice.token) });
  assert.ok(typeof out.data.total === 'number', 'friends list must return total count');
  out = await request('/api/messages/conversations', { headers: auth(alice.token) });
  assert.ok(Array.isArray(out.data.items), 'conversations must return items');

  // ===== 改进项回归：登录限流（15 分钟 20 次 → 第 21 次 429） =====
  // 注意：同一 IP 已登录 2 次（alice/bob register），此处再打 18 次错误密码应触发 429
  let limited = false;
  for (let i = 0; i < 22; i++) {
    out = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'alice_test', password: 'wrong-pass-' + i })
    });
    if (out.res.status === 429) { limited = true; break; }
  }
  assert.ok(limited, 'login rate limit must trigger 429 after repeated attempts');

  console.log('Regression tests passed');
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
}).finally(async () => {
  if (child && !child.killed) {
    child.kill();
    await new Promise(resolve => child.once('exit', resolve));
  }
  fs.rmSync(tempRoot, { recursive: true, force: true });
});

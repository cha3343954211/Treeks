// 新功能回归测试：PWA / 安全响应头 / FTS5 检索 / 统计增强 / 登录限流
// 用法：node scripts/test-new-features.js（自起临时服务器）
const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = 33000 + Math.floor(Math.random() * 800);
const BASE = `http://127.0.0.1:${PORT}`;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-features-'));
const dbDir = path.join(tempRoot, 'data');
const uploadDir = path.join(tempRoot, 'uploads');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

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
  child.stdout.on('data', d => { serverOutput += d; });
  child.stderr.on('data', d => { serverOutput += d; });
  await waitForServer();

  // ---- PWA 静态资源 ----
  const manifest = await request('/manifest.json');
  assert.equal(manifest.res.status, 200);
  const manifestObj = typeof manifest.data === 'string' ? JSON.parse(manifest.data) : manifest.data;
  assert.ok(manifestObj.name && manifestObj.start_url === '/' && manifestObj.display === 'standalone', 'manifest 字段不完整');
  assert.ok(Array.isArray(manifestObj.icons) && manifestObj.icons.length >= 3, 'manifest 图标缺失');

  const sw = await request('/sw.js');
  assert.equal(sw.res.status, 200);
  assert.ok(sw.data.includes('CACHE_VERSION') && sw.data.includes('skipWaiting'), 'sw.js 结构异常');

  const icon = await request('/icons/icon-192.png');
  assert.equal(icon.res.status, 200);
  assert.ok(icon.res.headers.get('content-type').includes('image/png'), 'PNG 图标类型错误');

  const home = await request('/');
  assert.ok(home.data.includes('rel="manifest"'), '首页缺少 manifest 链接');
  assert.ok(home.data.includes('mermaid.min.js'), '首页缺少 Mermaid 脚本');
  assert.ok(home.data.includes('capture="environment"'), '首页缺少相机直拍属性');
  assert.ok(home.data.includes('btn-voice-memo'), '首页缺少语音备忘按钮');
  assert.equal(home.res.headers.get('x-content-type-options'), 'nosniff', '缺少 nosniff 安全头');
  assert.equal(home.res.headers.get('x-frame-options'), 'SAMEORIGIN', '缺少 frame 安全头');
  assert.equal(home.res.headers.get('referrer-policy'), 'same-origin', '缺少 referrer 安全头');

  const appSource = fs.readFileSync(path.join(ROOT, 'public', 'js', 'app.js'), 'utf8');
  assert.ok(appSource.includes("navigator.serviceWorker.register('/sw.js')"), 'app.js 缺少 SW 注册');
  assert.ok(appSource.includes('compressImageFile'), 'app.js 缺少图片压缩');
  assert.ok(appSource.includes('checkScheduleReminders'), 'app.js 缺少日程提醒');
  assert.ok(appSource.includes('toggleVoiceMemo'), 'app.js 缺少语音备忘');
  assert.ok(appSource.includes('scheduleMermaidRender'), 'app.js 缺少 Mermaid 渲染');

  // ---- 业务 API：FTS5 / 统计 ----
  const user = await register('feat_api_user');
  const headers = auth(user.token, { 'Content-Type': 'application/json' });
  const unique = 'zephyrquasar' + Math.floor(Math.random() * 1e6);
  const zhKw = '\u5199\u65e5\u8bb0'; // 写日记
  const zhContent = '\u4eca\u5929' + zhKw + '\u8bb0\u5f55\u751f\u6d3b\u70b9\u6ef4\u3002';
  const d1 = await request('/api/diaries', { method: 'POST', headers, body: JSON.stringify({ title: 'English Note', content: 'The ' + unique + ' constellation shines at night.' }) });
  const d2 = await request('/api/diaries', { method: 'POST', headers, body: JSON.stringify({ title: '\u4e2d\u6587\u65e5\u8bb0', content: zhContent }) });
  assert.equal(d1.res.status, 201);
  assert.equal(d2.res.status, 201);

  const s1 = await request('/api/diaries?keyword=' + unique + '&folder_id=all', { headers });
  assert.equal(s1.res.status, 200);
  assert.equal(s1.data.total, 1, 'FTS 英文关键词检索失败');
  assert.ok(s1.data.items.some(i => i.id === d1.data.id), 'FTS 命中条目错误');

  const s2 = await request('/api/diaries?keyword=' + encodeURIComponent(zhKw) + '&folder_id=all', { headers });
  assert.equal(s2.res.status, 200);
  assert.ok(s2.data.items.some(i => i.id === d2.data.id), '中文关键词检索失败');

  const stats = await request('/api/diaries/stats/summary', { headers });
  assert.equal(stats.res.status, 200);
  assert.ok(stats.data.totalWords > 0, '统计缺少 totalWords');
  assert.ok(Array.isArray(stats.data.monthly) && stats.data.monthly.length >= 1, '统计缺少 monthly');

  // ---- 音频上传（语音备忘链路） ----
  const audioBlob = new Blob([Buffer.from('fake audio bytes for webm')], { type: 'audio/webm' });
  const fd = new FormData();
  fd.append('file', audioBlob, 'voice-memo-test.webm');
  const upRes = await fetch(BASE + '/api/upload/file', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + user.token },
    body: fd
  });
  const upData = await upRes.json();
  assert.equal(upRes.status, 201, JSON.stringify(upData));
  assert.equal(upData.kind, 'audio', '音频应归类为 audio');
  assert.ok(upData.url.includes('/uploads/') && upData.url.includes('audios'), '音频 URL 应指向鉴权静态路径: ' + upData.url);
  const mediaRes = await fetch(BASE + upData.url, { headers: { Authorization: 'Bearer ' + user.token } });
  assert.equal(mediaRes.status, 200, '音频文件应可鉴权读取');
  const audioList = await request('/api/upload/files?kind=audio', { headers });
  assert.ok(audioList.data.items.some(i => i.id === upData.id), '音频应出现在音频筛选列表');

  // ---- 登录限流（同一 IP 超过 20 次触发 429）----
  let last = null;
  for (let i = 0; i < 22; i++) {
    const r = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'feat_api_user', password: 'wrongpass' })
    });
    last = r.res.status;
  }
  assert.equal(last, 429, '登录限流未生效（应为 429）');

  console.log('[Features] 全部新功能测试通过 ✓');
}

main()
  .catch(e => {
    console.error('[Features] 测试失败:', e.message);
    console.error(serverOutput.slice(-2000));
    process.exitCode = 1;
  })
  .finally(() => {
    if (child) child.kill();
    setTimeout(() => {
      try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (_) {}
    }, 300);
  });

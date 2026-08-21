const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
let providerRequests = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

async function waitReady(port, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise(resolve => setTimeout(resolve, 120));
    try {
      await new Promise((resolve, reject) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('connect', () => { socket.destroy(); resolve(); });
        socket.once('error', reject);
      });
      return;
    } catch (_) {}
  }
  throw new Error(`server on port ${port} did not become ready`);
}

async function api(base, pathname, options = {}) {
  const response = await fetch(base + pathname, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `${pathname} failed (${response.status})`);
  return data;
}

function parseSse(text) {
  return text.split(/\n\n+/).filter(Boolean).map(block => {
    let event = 'message';
    let data = '';
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    return { event, data: data ? JSON.parse(data) : {} };
  });
}

async function main() {
  const appPort = 30000 + Math.floor(Math.random() * 10000);
  const provider = http.createServer((req, res) => {
    providerRequests += 1;
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body);
      provider.lastPrompt = payload.messages.at(-1).content;
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      });
      ['REPLACED ', 'SELECTION'].forEach(text => {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
      });
      res.write('data: [DONE]\n\n');
      res.end();
    });
  });
  const providerPort = await listen(provider);

  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-ai-test-'));
  const app = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(appPort),
      NODE_ENV: 'test',
      JWT_SECRET: crypto.randomBytes(48).toString('hex'),
      TREEKS_RUNTIME_DB_DIR: path.join(runtimeRoot, 'data'),
      TREEKS_RUNTIME_UPLOAD_DIR: path.join(runtimeRoot, 'uploads'),
      AI_API_KEY: 'test-key',
      AI_BASE_URL: `http://127.0.0.1:${providerPort}`,
      AI_MODEL: 'test-model'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let appOutput = '';
  app.stdout.on('data', chunk => { appOutput += chunk; });
  app.stderr.on('data', chunk => { appOutput += chunk; });

  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`app was not ready on ${appPort}\n${appOutput}`)), 15000);
      waitReady(appPort).then(() => { clearTimeout(timer); resolve(); }).catch(error => { clearTimeout(timer); reject(error); });
      app.on('exit', code => { clearTimeout(timer); reject(new Error(`app exited early (${code})\n${appOutput}`)); });
    });
    const base = `http://127.0.0.1:${appPort}`;

    const register = await api(base, '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'ai_tester', password: 'secret-password' })
    });
    const auth = { Authorization: `Bearer ${register.token}`, 'Content-Type': 'application/json' };
    const diary = await api(base, '/api/diaries', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        title: 'AI context test',
        content: 'STALE_DATABASE_CONTENT should never win'
      })
    });

    assert((await fetch(`${base}/api/ai/assist/stream?x=1`, { headers: auth })).status === 404, 'legacy GET stream endpoint should be disabled');

    const streamResponse = await fetch(`${base}/api/ai/assist/stream`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        action: 'edit',
        title: 'AI context test',
        content: 'Keep this outside. OLD_DRAFT_SELECTION keep this too.',
        selection: 'OLD_DRAFT_SELECTION',
        prompt: 'make it clearer',
        diary_id: diary.id
      })
    });
    assert(streamResponse.ok, `stream request failed (${streamResponse.status})`);
    assert((streamResponse.headers.get('content-type') || '').includes('text/event-stream'), 'response should be SSE');

    const events = parseSse(await streamResponse.text());
    const meta = events.find(item => item.event === 'meta')?.data || {};
    const done = events.find(item => item.event === 'done')?.data || {};
    assert(meta.scope === 'selection', 'selection edit metadata should identify the selection scope');
    assert(done.result === 'REPLACED SELECTION', 'provider deltas should be assembled in order');
    assert(done.scope === 'selection', 'done event should preserve edit scope');
    assert(typeof done.thread_id === 'string' && done.thread_id.length > 0, 'completed exchange should be persisted');
    assert(provider.lastPrompt.includes('OLD_DRAFT_SELECTION'), 'model should receive the selected draft text');
    assert(provider.lastPrompt.includes('Keep this outside.'), 'model should receive the current unsaved draft context');
    assert(!provider.lastPrompt.includes('STALE_DATABASE_CONTENT'), 'database content must not override current draft');
    assert(providerRequests === 1, 'supported streaming providers should not be called twice');

    const conversations = await api(
      base,
      `/api/ai/conversations?diary_id=${diary.id}&limit=10`,
      { headers: { Authorization: `Bearer ${register.token}` } }
    );
    assert(conversations.items.some(item => item.role === 'assistant' && item.result === done.result), 'assistant output should appear in diary history');

    const browser = await puppeteer.launch({ headless: 'new' });
    try {
      const page = await browser.newPage();
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.setViewport({ width: 1280, height: 850 });
      await page.evaluateOnNewDocument((token, user) => {
        localStorage.setItem('treeks_token', token);
        localStorage.setItem('treeks_user', JSON.stringify(user));
      }, register.token, register.user);
      await page.goto(base, { waitUntil: 'networkidle0' });
      await page.waitForSelector('.diary-card', { timeout: 15000 });
      await page.evaluate(id => openEditor(id), diary.id);
      await page.waitForFunction(() => document.getElementById('editor-textarea')?.value?.length > 0, { timeout: 15000 });
      await page.click('#btn-toggle-ai-sidebar');
      await page.waitForSelector('#ai-prompt:not([disabled])', { timeout: 15000 });
      await page.type('#ai-prompt', 'browser streaming check');
      await page.click('.ai-send-btn');
      await page.waitForFunction(() => {
        return Array.from(document.querySelectorAll('#ai-chat .ai-result-md')).some(node => node.textContent.includes('REPLACED'));
      }, { timeout: 20000 });

      await page.evaluate(() => loadAiHistoryForCurrentDiary(true));
      await page.waitForFunction(() => {
        return Array.from(document.querySelectorAll('#ai-chat .ai-message[data-thread-id] button'))
          .some(node => node.textContent.trim() === '重新生成');
      }, { timeout: 15000 });
      assert(pageErrors.length === 0, `sidebar produced page errors: ${pageErrors.join('; ')}`);
    } finally {
      await browser.close();
    }

    console.log('AI assistant streaming/context integration passed');
  } finally {
    app.kill('SIGTERM');
    provider.close();
    setTimeout(() => {
      try { fs.rmSync(runtimeRoot, { recursive: true, force: true }); } catch (_) {}
    }, 100).unref?.();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});

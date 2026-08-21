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
      if (provider.lastPrompt.includes('CANCEL_PARTIAL_TEST')) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'CANCELLED_PARTIAL' } }] })}\n\n`);
        return;
      }
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

    const validSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10"><circle cx="10" cy="5" r="4" fill="green"/></svg>';
    const svgSaveResponse = await fetch(`${base}/api/upload/svg`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ svg: validSvg, name: 'integration circle' })
    });
    assert(svgSaveResponse.ok, `valid SVG upload failed (${svgSaveResponse.status})`);
    const savedSvg = await svgSaveResponse.json();
    assert(/^\/uploads\/.+\.svg$/.test(savedSvg.url), 'valid SVG should be stored in user files');
    const maliciousSvgUpload = await fetch(`${base}/api/upload/svg`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ svg: '<svg xmlns="http://www.w3.org/2000/svg"><circle onmouseover="alert(1)"/></svg>', name: 'unsafe' })
    });
    assert(maliciousSvgUpload.status === 400, 'malicious SVG upload should be rejected');

    const cancelController = new AbortController();
    const cancelResponse = await fetch(`${base}/api/ai/assist/stream`, {
      method: 'POST',
      headers: auth,
      signal: cancelController.signal,
      body: JSON.stringify({
        action: 'ask',
        title: 'AI context test',
        content: 'Cancel partial context',
        prompt: 'CANCEL_PARTIAL_TEST',
        diary_id: diary.id
      })
    });
    const cancelReader = cancelResponse.body.getReader();
    const cancelDecoder = new TextDecoder();
    let cancelText = '';
    while (!cancelText.includes('event: delta')) {
      const { value, done } = await cancelReader.read();
      if (done) break;
      cancelText += cancelDecoder.decode(value, { stream: true });
    }
    cancelController.abort();
    try { await cancelReader.read(); } catch (_) {}
    let cancelledSaved = false;
    for (let attempt = 0; attempt < 30 && !cancelledSaved; attempt += 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const history = await api(
        base,
        `/api/ai/conversations?diary_id=${diary.id}&limit=20`,
        { headers: { Authorization: `Bearer ${register.token}` } }
      );
      cancelledSaved = history.items.some(item => item.role === 'assistant' && item.result === 'CANCELLED_PARTIAL');
    }
    assert(cancelledSaved, 'partial assistant output should be preserved after cancellation');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-proxy-server', '--disable-dev-shm-usage']
    });
    try {
      const page = await browser.newPage();
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().startsWith(base)) {
          request.continue({ method: request.method(), headers: request.headers(), postData: request.postData() });
        } else {
          request.abort();
        }
      });
      await page.setViewport({ width: 1280, height: 850 });
      await page.evaluateOnNewDocument((token, user) => {
        localStorage.setItem('treeks_token', token);
        localStorage.setItem('treeks_user', JSON.stringify(user));
        window.marked = window.marked || { setOptions: () => {}, parse: value => '<pre>' + String(value) + '</pre>' };
        window.DOMPurify = window.DOMPurify || { sanitize: value => value };
        window.hljs = window.hljs || { highlightElement: () => {} };
        window.katex = window.katex || { renderToString: value => String(value) };
        window.mermaid = window.mermaid || { initialize: () => {}, run: async () => {} };
        window.pdfjsLib = window.pdfjsLib || { GlobalWorkerOptions: { workerSrc: '' }, getDocument: () => { throw new Error('offline test'); } };
        window.mammoth = window.mammoth || { convertToHtml: async () => ({ value: '' }) };
        window.XLSX = window.XLSX || { read: () => ({ SheetNames: [], Sheets: {} }), utils: { sheet_to_html: () => '' } };
      }, register.token, register.user);
      page.setDefaultTimeout(60000);
      await page.goto(base, { waitUntil: 'domcontentloaded' });
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
      const svgSafety = await page.evaluate(() => {
        window.__svgXss = false;
        const unsafe = '<svg xmlns="http://www.w3.org/2000/svg" onload="window.__svgXss=true"><script>window.__svgXss=true</script><a href="https://example.com"><circle r="8"/></a></svg>';
        const safe = sanitizeSvgText(unsafe);
        const host = document.createElement('div');
        host.innerHTML = safe;
        return {
          safe,
          executed: window.__svgXss,
          hasCircle: !!host.querySelector('circle'),
          hasScript: !!host.querySelector('script'),
          hasOnload: !!host.querySelector('[onload]'),
          hasExternalHref: !!host.querySelector('[href^="https://"]')
        };
      });
      assert(svgSafety.executed === false && svgSafety.hasCircle && !svgSafety.hasScript && !svgSafety.hasOnload && !svgSafety.hasExternalHref, `SVG sanitizer output invalid: ${svgSafety.safe}`);
      await page.waitForFunction(() => !aiSidebarState?.isGenerating, { timeout: 15000 });
      const contextControl = await page.evaluate(() => {
        const textarea = document.getElementById('editor-textarea');
        textarea.value = 'FULL_SECRET_CONTEXT with SELECTED_TARGET inside';
        textarea.selectionStart = textarea.value.indexOf('SELECTED_TARGET');
        textarea.selectionEnd = textarea.selectionStart + 'SELECTED_TARGET'.length;
        document.querySelector('[data-ai-context-scope="selection"]').click();
        const selectionContext = getAiWritingContext();
        document.querySelector('[data-ai-context-scope="none"]').click();
        const closedContext = getAiWritingContext();
        document.querySelector('[data-ai-context-scope="auto"]').click();
        const autoContext = getAiWritingContext();
        return {
          selectionContext,
          closedContext,
          autoContext,
          activeAuto: document.querySelector('[data-ai-context-scope="auto"]').classList.contains('active'),
          exportReady: !!document.getElementById('btn-export-ai-chat')
        };
      });
      assert(contextControl.selectionContext.selection === 'SELECTED_TARGET' && !contextControl.selectionContext.content.includes('FULL_SECRET'), 'selection context scope leaked full note');
      assert(!contextControl.closedContext.content && !contextControl.closedContext.selection && !contextControl.closedContext.title, 'closed context scope still returned note data');
      assert(contextControl.autoContext.content.includes('FULL_SECRET_CONTEXT') && contextControl.activeAuto && contextControl.exportReady, 'context scope controls failed');
      const streamingA11y = await page.evaluate(() => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const stream = createAiStreamingBlock(host);
        const head = host.querySelector('.ai-streaming-head');
        const body = host.querySelector('.ai-streaming-body');
        const initial = {
          tag: head.tagName,
          expanded: head.getAttribute('aria-expanded'),
          controls: head.getAttribute('aria-controls') === body.id
        };
        stream.appendDelta('hello');
        stream.finalize('hello');
        const completed = {
          count: head.querySelector('.ai-streaming-count')?.textContent,
          busy: host.querySelector('.ai-streaming')?.getAttribute('aria-busy')
        };
        head.click();
        const collapsed = head.getAttribute('aria-expanded') === 'false'
          && host.querySelector('.ai-streaming').classList.contains('collapsed');
        head.click();
        const restored = head.getAttribute('aria-expanded') === 'true';
        const thinking = createAiThinkingBlock(host, ['step']);
        const thinkingHeader = host.querySelector('.ai-thinking-header');
        thinkingHeader.click();
        const thinkingCollapsed = thinkingHeader.getAttribute('aria-expanded') === 'false';
        thinkingHeader.click();
        const thinkingRestored = thinkingHeader.getAttribute('aria-expanded') === 'true';
        host.remove();
        return { ...initial, ...completed, collapsed, restored, thinkingCollapsed, thinkingRestored };
      });
      assert(streamingA11y.tag === 'BUTTON' && streamingA11y.expanded === 'true' && streamingA11y.controls, `stream collapse semantics invalid: ${JSON.stringify(streamingA11y)}`);
      assert(streamingA11y.count === '5 字' && streamingA11y.busy === 'false' && streamingA11y.collapsed && streamingA11y.restored, `stream collapse behavior invalid: ${JSON.stringify(streamingA11y)}`);
      assert(streamingA11y.thinkingCollapsed && streamingA11y.thinkingRestored, 'thinking collapse semantics invalid');
      await page.evaluate(() => {
        setAiMode('ask');
        const prompt = document.getElementById('ai-prompt');
        prompt.value = 'FRESH_TOPIC_PROMPT';
        prompt.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-ai-fresh-topic]');
      assert(await page.evaluate(() => document.querySelector('[data-ai-fresh-topic]')?.getAttribute('aria-pressed')) === 'true', 'fresh topic did not activate');
      await page.waitForFunction(() => !document.getElementById('ai-send-btn')?.disabled, { timeout: 5000 });
      const resultCountBefore = await page.evaluate(() => document.querySelectorAll('#ai-chat .ai-result-md').length);
      await page.click('.ai-send-btn');
      await page.waitForFunction(count => document.querySelectorAll('#ai-chat .ai-result-md').length > count, { timeout: 20000 }, resultCountBefore);
      await page.waitForFunction(() => !aiSidebarState?.isGenerating, { timeout: 20000 });
      assert(provider.lastPrompt.includes('FRESH_TOPIC_PROMPT'), `fresh topic prompt missing from provider payload: ${String(provider.lastPrompt).slice(0, 500)}`);
      assert(provider.lastPrompt.includes('SELECTED_TARGET'), 'fresh topic should still receive current note context');
      assert(!provider.lastPrompt.includes('browser streaming check'), 'fresh topic leaked prior prompt');
      assert(!provider.lastPrompt.includes('REPLACED'), 'fresh topic leaked prior assistant answer');
      await page.waitForFunction(() => document.querySelectorAll('.ai-topic-divider').length === 1 && !document.querySelector('.ai-topic-divider[data-pending]'), { timeout: 15000 });
      assert(await page.evaluate(() => document.querySelector('[data-ai-fresh-topic]')?.getAttribute('aria-pressed')) === 'false', 'fresh topic did not reset after generation');
      const exported = await page.evaluate(() => buildAiConversationMarkdown([
        { role: 'user', action: 'ask', content: 'What changed?', created_at: new Date().toISOString() },
        { role: 'assistant', action: 'ask', result: 'A **markdown** answer.', created_at: new Date().toISOString() }
      ]));
      assert(exported.includes('# Treeks AI 对话导出') && exported.includes('What changed?') && exported.includes('A **markdown** answer.'), 'AI conversation export markdown invalid');
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

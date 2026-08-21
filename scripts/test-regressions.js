const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
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
process.env.TREEKS_RUNTIME_DB_DIR = dbDir;

let child;
let serverOutput = '';
let mockProvider;

async function request(url, options = {}) {
  const res = await fetch(BASE + url, options);
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json() : await res.arrayBuffer();
  return { res, data };
}

function auth(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function startMockAiProvider() {
  const requests = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      requests.push(JSON.parse(body || '{}'));
      const answer = `mock answer ${requests.length}`;
      if(String(req.headers.accept || '').includes('text/event-stream')) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        });
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: answer } }] })}\n\n`);
        res.end('data: [DONE]\n\n');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ choices: [{ message: { content: answer } }] }));
      }
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    requests,
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => server.close(resolve))
  };
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
  const appSource = fs.readFileSync(path.join(ROOT, 'public', 'js', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
  const names = [...appSource.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  assert.deepEqual([...new Set(duplicates)], [], 'top-level function names must be unique');
  assert.ok(!appSource.includes('apiUploadFile('), 'undefined apiUploadFile reference remains');
  // 禁止残留内联 onclick（易引发存储型 XSS，一律走 data 属性 + addEventListener）
  assert.ok(!/onclick="/.test(appSource), 'inline onclick must be removed (XSS risk)');

  const diffFunctionMatch = appSource.match(/function computeAiLineDiff[\s\S]*?\n}/);
  assert.ok(diffFunctionMatch, 'AI line diff function missing');
  const computeAiLineDiff = new Function(`${diffFunctionMatch[0]}; return computeAiLineDiff;`)();
  assert.deepEqual(
    computeAiLineDiff('a\nb\nc', 'a\nX\nc').map(op => `${op.type}:${op.text}`),
    ['equal:a', 'delete:b', 'insert:X', 'equal:c']
  );
  assert.deepEqual(
    computeAiLineDiff('', '').map(op => `${op.type}:${op.text}`),
    ['equal:']
  );
  const repeatedOld = Array.from({ length: 20000 }, () => 'same');
  const repeatedNew = Array.from({ length: 21000 }, () => 'different');
  let startedAt = process.hrtime.bigint();
  let largeDiff = computeAiLineDiff(repeatedOld.join('\n'), repeatedNew.join('\n'));
  assert.equal(largeDiff.filter(op => op.type !== 'equal').length, 2);
  assert.ok(Number(process.hrtime.bigint() - startedAt) / 1e6 < 1000, 'pathological AI diff became too slow');
  const oldLines = Array.from({ length: 20000 }, (_, index) => `old-${index}`);
  const newLines = [...oldLines.slice(0, 100), ...Array.from({ length: 20100 }, (_, index) => `new-${index}`)];
  startedAt = process.hrtime.bigint();
  largeDiff = computeAiLineDiff(oldLines.join('\n'), newLines.join('\n'));
  assert.ok(largeDiff.some(op => op.type === 'delete'));
  assert.ok(largeDiff.some(op => op.type === 'insert'));
  assert.ok(Number(process.hrtime.bigint() - startedAt) / 1e6 < 1000, 'large AI diff became too slow');
  const renderFunctionMatch = appSource.match(/function renderAiDiffHtml[\s\S]*?\n}/);
  assert.ok(renderFunctionMatch, 'AI diff renderer missing');
  const renderAiDiffHtml = new Function('computeAiLineDiff', `${renderFunctionMatch[0]}; return renderAiDiffHtml;`)(computeAiLineDiff);
  const renderedLargeDiff = renderAiDiffHtml(repeatedOld.join('\n'), repeatedNew.join('\n'));
  assert.equal(renderedLargeDiff.del, repeatedOld.length);
  assert.equal(renderedLargeDiff.ins, repeatedNew.length);
  assert.equal((renderedLargeDiff.html.match(/class="ai-diff-(?:del|ins)"/g) || []).length, 2);

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

  // AI conversations must expose the latest window first, then page backwards.
  const db = require('../db').db;
  const aiDiaryResponse = await request('/api/diaries', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: 'AI history', content: 'Conversation archive' })
  });
  assert.equal(aiDiaryResponse.res.status, 201, JSON.stringify(aiDiaryResponse.data));
  const aiDiaryId = aiDiaryResponse.data.id;
  const insertConversation = db.prepare(`
    INSERT INTO ai_conversations
      (user_id, diary_id, role, content, result, action, model_id, mode, created_at)
    VALUES (?, ?, ?, ?, '', 'ask', '', 'ask', ?)
  `);
  const baseTime = new Date('2026-01-01T00:00:00.000Z').getTime();
  const insertMany = db.transaction(() => {
    for (let i = 1; i <= 125; i += 1) {
      const createdAt = new Date(baseTime + i * 1000).toISOString().slice(0, 19).replace('T', ' ');
      const content = i === 42 ? 'needle-100%_special' : `message-${i}`;
      insertConversation.run(alice.user.id, aiDiaryId, 'user', content, createdAt);
    }
  });
  insertMany();

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

  const latestAiHistory = await request(`/api/ai/conversations?diary_id=${aiDiaryId}&limit=100`, { headers: auth(alice.token) });
  assert.equal(latestAiHistory.res.status, 200);
  assert.equal(latestAiHistory.data.items.length, 100);
  assert.equal(latestAiHistory.data.total, 125);
  assert.equal(latestAiHistory.data.has_more, true);
  assert.equal(latestAiHistory.data.items[0].content, 'message-26');
  assert.equal(latestAiHistory.data.items.at(-1).content, 'message-125');
  assert.equal(latestAiHistory.data.oldest_id, latestAiHistory.data.items[0].id);
  const oldestId = latestAiHistory.data.oldest_id;

  const olderAiHistory = await request(`/api/ai/conversations?diary_id=${aiDiaryId}&limit=100&before_id=${oldestId}`, { headers: auth(alice.token) });
  assert.equal(olderAiHistory.res.status, 200);
  assert.equal(olderAiHistory.data.items.length, 25);
  assert.equal(olderAiHistory.data.has_more, false);
  assert.equal(olderAiHistory.data.items[0].content, 'message-1');
  assert.equal(olderAiHistory.data.items.at(-1).content, 'message-25');

  const threadDiary = await request('/api/diaries', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: 'AI thread', content: 'Conversation context' })
  });
  assert.equal(threadDiary.res.status, 201);
  const threadId = 'search-thread-1';
  const insertThread = db.prepare(`
    INSERT INTO ai_conversations
      (user_id, diary_id, role, content, result, action, model_id, mode, thread_id)
    VALUES (?, ?, ?, ?, ?, 'ask', '', 'ask', ?)
  `);
  insertThread.run(alice.user.id, threadDiary.data.id, 'user', 'question about mythical horses', '', threadId);
  insertThread.run(alice.user.id, threadDiary.data.id, 'assistant', 'stored prompt', 'The answer mentions unicorns.', threadId);

  const contextualAiSearch = await request(`/api/ai/conversations?diary_id=${threadDiary.data.id}&search=${encodeURIComponent('unicorns')}`, { headers: auth(alice.token) });
  assert.equal(contextualAiSearch.res.status, 200);
  assert.equal(contextualAiSearch.data.match_count, 1);
  assert.deepEqual(contextualAiSearch.data.items.map(item => item.role), ['user', 'assistant']);
  assert.equal(contextualAiSearch.data.items[0].search_hit, 0);
  assert.equal(contextualAiSearch.data.items[1].search_hit, 1);

  const contextualPage1 = await request(`/api/ai/conversations?diary_id=${threadDiary.data.id}&limit=1&search=${encodeURIComponent('unicorns')}`, { headers: auth(alice.token) });
  assert.equal(contextualPage1.res.status, 200);
  assert.deepEqual(contextualPage1.data.items.map(item => item.role), ['assistant']);
  const contextualCursor = contextualPage1.data.oldest_id;
  const contextualPage2 = await request(`/api/ai/conversations?diary_id=${threadDiary.data.id}&limit=1&before_id=${contextualCursor}&search=${encodeURIComponent('unicorns')}`, { headers: auth(alice.token) });
  assert.equal(contextualPage2.res.status, 200);
  assert.deepEqual(contextualPage2.data.items.map(item => item.role), ['user']);
  assert.equal(contextualPage2.data.has_more, false);

  const contextAssistantId = contextualAiSearch.data.items.find(item => item.role === 'assistant').id;
  const foreignConversationDelete = await request(`/api/ai/conversations/${contextAssistantId}`, { method: 'DELETE', headers: auth(bob.token) });
  assert.equal(foreignConversationDelete.res.status, 404);
  const conversationDelete = await request(`/api/ai/conversations/${contextAssistantId}`, { method: 'DELETE', headers: auth(alice.token) });
  assert.equal(conversationDelete.res.status, 200);
  assert.equal(conversationDelete.data.deleted_count, 2);
  const threadAfterDelete = await request(`/api/ai/conversations?diary_id=${threadDiary.data.id}`, { headers: auth(alice.token) });
  assert.equal(threadAfterDelete.res.status, 200);
  assert.equal(threadAfterDelete.data.total, 0);

  // AI retry must replace its own exchange instead of appending a duplicate.
  const { encryptSecret } = require('../services/aiModels');
  mockProvider = await startMockAiProvider();
  const mockModelInfo = db.prepare(`
    INSERT INTO ai_models
      (name, base_url, model, api_key_encrypted, enabled, is_default)
    VALUES (?, ?, ?, ?, 1, 1)
  `).run('Retry mock', mockProvider.baseUrl, 'mock-model', encryptSecret('mock-key'));
  const mockModelId = String(mockModelInfo.lastInsertRowid);
  const retryDiary = await request('/api/diaries', {
    method: 'POST',
    headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: 'AI retry', content: 'Current note body' })
  });
  assert.equal(retryDiary.res.status, 201);
  const retryPayload = {
    action: 'ask', title: 'AI retry', content: 'Current note body',
    prompt: 'What does the note preserve?', diary_id: retryDiary.data.id,
    model_id: mockModelId
  };
  const initialAiAnswer = await request('/api/ai/assist', {
    method: 'POST', headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(retryPayload)
  });
  assert.equal(initialAiAnswer.res.status, 200, JSON.stringify(initialAiAnswer.data));
  assert.equal(initialAiAnswer.data.result, 'mock answer 1');
  assert.ok(initialAiAnswer.data.thread_id);
  const initialRetryHistory = await request(`/api/ai/conversations?diary_id=${retryDiary.data.id}`, { headers: auth(alice.token) });
  assert.equal(initialRetryHistory.data.total, 2);
  const foreignRetry = await request('/api/ai/assist', {
    method: 'POST', headers: auth(bob.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ ...retryPayload, retry_thread_id: initialAiAnswer.data.thread_id })
  });
  assert.equal(foreignRetry.res.status, 404);
  const retriedAiAnswer = await request('/api/ai/assist', {
    method: 'POST', headers: auth(alice.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ ...retryPayload, retry_thread_id: initialAiAnswer.data.thread_id })
  });
  assert.equal(retriedAiAnswer.res.status, 200, JSON.stringify(retriedAiAnswer.data));
  assert.equal(retriedAiAnswer.data.result, 'mock answer 2');
  assert.ok(retriedAiAnswer.data.thread_id);
  assert.notEqual(retriedAiAnswer.data.thread_id, initialAiAnswer.data.thread_id);
  assert.equal(mockProvider.requests[1].messages.some(message => message.content.includes('mock answer 1')), false);
  const historyAfterRetry = await request(`/api/ai/conversations?diary_id=${retryDiary.data.id}`, { headers: auth(alice.token) });
  assert.equal(historyAfterRetry.data.total, 2);
  assert.deepEqual(historyAfterRetry.data.items.map(item => item.role), ['user', 'assistant']);
  assert.equal(historyAfterRetry.data.items.at(-1).result, 'mock answer 2');

  const streamPayload = {
    action: 'ask', title: 'AI retry', content: 'Current note body',
    prompt: 'Keep literal A%20B exactly', diary_id: String(retryDiary.data.id),
    model_id: mockModelId
  };
  const streamResponse = await fetch(`${BASE}/api/ai/assist/stream`, {
    method: 'POST',
    headers: auth(alice.token, { Accept: 'text/event-stream', 'Content-Type': 'application/json' }),
    body: JSON.stringify(streamPayload)
  });
  assert.equal(streamResponse.status, 200);
  const streamBody = await streamResponse.text();
  assert.ok(streamBody.includes('event: done'), 'AI stream must finish');
  assert.ok(streamBody.includes('mock answer 3'), 'AI stream must return provider output');
  const streamProviderRequest = mockProvider.requests.at(-1);
  assert.equal(streamProviderRequest.messages.at(-1).content.includes('Keep literal A%20B exactly'), true);

  const escapedAiSearch = await request(`/api/ai/conversations?diary_id=${aiDiaryId}&search=${encodeURIComponent('needle-100%_')}`, { headers: auth(alice.token) });
  assert.equal(escapedAiSearch.res.status, 200);
  assert.equal(escapedAiSearch.data.total, 1);
  assert.equal(escapedAiSearch.data.items.length, 1);
  assert.equal(escapedAiSearch.data.items[0].content, 'needle-100%_special');

  const caseInsensitiveAiSearch = await request(`/api/ai/conversations?diary_id=${aiDiaryId}&search=NEEDLE-100%25_`, { headers: auth(alice.token) });
  assert.equal(caseInsensitiveAiSearch.res.status, 200);
  assert.equal(caseInsensitiveAiSearch.data.total, 1);

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
  if (mockProvider) {
    await mockProvider.close();
  }
  if (child && !child.killed) {
    child.kill();
    await new Promise(resolve => child.once('exit', resolve));
  }
  try {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  } catch (_) {
    // Windows can briefly retain SQLite WAL handles; the directory is isolated.
  }
});

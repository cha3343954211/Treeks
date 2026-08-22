const express = require('express');
const crypto = require('crypto');
const { authRequired } = require('../middleware/auth');
const { db } = require('../db');
const { canReadDiary } = require('../services/permissions');
const { getEnabledModels, getSelectedModel } = require('../services/aiModels');

const router = express.Router();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;
const requestBuckets = new Map();
const ALLOWED_ACTIONS = new Set(['continue', 'polish', 'outline', 'summarize', 'title', 'tasks', 'custom', 'ask', 'edit', 'draw']);

function isRateLimited(userId) {
  const now = Date.now();
  const requests = (requestBuckets.get(userId) || []).filter(time => now - time < WINDOW_MS);
  if (requests.length >= MAX_REQUESTS) {
    requestBuckets.set(userId, requests);
    return true;
  }
  requests.push(now);
  requestBuckets.set(userId, requests);
  return false;
}


function resolveDiaryContext(userId, rawDiaryId, fallbackTitle, fallbackContent){
  let diaryId = rawDiaryId != null ? Number(rawDiaryId) : -1;
  if(!Number.isFinite(diaryId) || Number.isNaN(diaryId)) diaryId = -1;
  // -1 means global / not bound
  if(diaryId === -1) return { diaryId: -1, title: String(fallbackTitle||''), content: String(fallbackContent||''), source: String(fallbackContent||'') };
  const row = db.prepare('SELECT id, user_id, title, content FROM diaries WHERE id = ?').get(diaryId);
  if(!row) return { diaryId: -1, title: String(fallbackTitle||''), content: String(fallbackContent||''), source: String(fallbackContent||'') };
  if(!canReadDiary(row, userId)) return { diaryId: -1, title: String(fallbackTitle||''), content: String(fallbackContent||''), source: String(fallbackContent||'') };
  return { diaryId: row.id, title: row.title||'', content: row.content||'', source: row.content||'' };
}
function normalizeDiaryIdForStorage(v){
  const n = Number(v);
  if(!Number.isFinite(n) || Number.isNaN(n)) return -1;
  if(n <= 0) return -1;
  return Math.floor(n);
}
function loadRecentConversations(userId, diaryId, limit=12, excludeThreadId=''){
  try{
    // A topic boundary starts a durable context window: only exchanges at or
    // after the newest boundary belong to follow-up prompts.
    const boundaryThread = db.prepare("SELECT thread_id FROM ai_conversations WHERE user_id=? AND diary_id=? AND topic_boundary=1 ORDER BY id DESC LIMIT 1").get(userId, diaryId);
    const boundary = boundaryThread?.thread_id
      ? db.prepare("SELECT MIN(id) AS id FROM ai_conversations WHERE user_id=? AND diary_id=? AND thread_id=?").get(userId, diaryId, boundaryThread.thread_id)?.id || 0
      : 0;
    const excludeSql = excludeThreadId ? " AND IFNULL(thread_id, '') != ?" : '';
    const boundarySql = boundary ? ' AND id >= ?' : '';
    const params = [userId, diaryId];
    if(excludeThreadId) params.push(excludeThreadId);
    if(boundary) params.push(boundary);
    params.push(limit);
    const rows = db.prepare(`SELECT role, content, result, action, mode, model_id, created_at FROM ai_conversations WHERE user_id=? AND diary_id=?${excludeSql}${boundarySql} ORDER BY created_at DESC, id DESC LIMIT ?`).all(...params);
    return rows.reverse();
  }catch(e){ return []; }
}
function saveConversations(userId, diaryId, messages, options={}){
  try{
    const stmt = db.prepare('INSERT INTO ai_conversations (user_id, diary_id, role, content, result, action, model_id, mode, thread_id, topic_boundary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const threadId = crypto.randomUUID();
    let topicBoundary = options.topicBoundary ? 1 : 0;
    const tx = db.transaction(()=>{
      if(options.replaceThreadId){
        const previous = db.prepare('SELECT topic_boundary FROM ai_conversations WHERE user_id=? AND IFNULL(thread_id, \'\')=? ORDER BY id ASC').get(userId, options.replaceThreadId);
        if(previous && !options.topicBoundary) topicBoundary = previous.topic_boundary ? 1 : 0;
        db.prepare('DELETE FROM ai_conversations WHERE user_id=? AND IFNULL(thread_id, \'\')=?').run(userId, options.replaceThreadId);
      }
      for(const m of messages){
        stmt.run(userId, diaryId, String(m.role||'user'), String(m.content||''), String(m.result||''), String(m.action||''), String(m.model_id||''), String(m.mode||''), threadId, topicBoundary);
      }
    });
    tx();
    return threadId;
  }catch(e){ console.warn('[AI] saveConversations failed', e.message); }
}

function loadRetryContext(userId, threadId){
  if(!threadId || typeof threadId !== 'string' || threadId.length > 100) return null;
  const rows = db.prepare('SELECT user_id, diary_id, role, content, action FROM ai_conversations WHERE user_id=? AND IFNULL(thread_id, \'\')=? ORDER BY id ASC').all(userId, threadId);
  const userRow = rows.find(row => row.role === 'user');
  if(!userRow) return null;
  if(userRow.diary_id !== -1){
    const diary = db.prepare('SELECT id, user_id FROM diaries WHERE id=?').get(userRow.diary_id);
    if(!diary || !canReadDiary(diary, userId)) return null;
  }
  const action = ALLOWED_ACTIONS.has(userRow.action) ? userRow.action : 'custom';
  return { diaryId: userRow.diary_id, action, prompt: String(userRow.content || '') };
}
function buildHistoryMessages(rows){
  const out=[];
  for(const r of rows){
    if(r.role === 'user'){
      const text = r.content ? r.content : '';
      if(text) out.push({ role: 'user', content: r.action && r.action!=='custom' ? '['+r.action+'] '+text : text });
    } else if(r.role === 'assistant'){
      const text = r.result || r.content || '';
      if(text) out.push({ role: 'assistant', content: String(text).slice(0, 6000) });
    }
  }
  return out;
}


function labelsForSave(action, prompt){ const m={continue:'续写',polish:'润色',outline:'提纲',summarize:'摘要',title:'标题',tasks:'行动项',custom:'自定义',ask:'问答',edit:'编辑',draw:'绘图'}; const label=m[action]||action; return prompt ? prompt : label; }
function buildUserPrompt(action, title, source, content, prompt, scope = 'note') {
  if (action === 'ask') {
    return [
      `操作：${getActionInstruction(action)}`,
      title ? `日记标题：${title}` : '',
      source ? `待处理文本:\n${source}` : '待处理文本：（空）',
      prompt ? `用户问题：${prompt}` : ''
    ].filter(Boolean).join('\n\n');
  }
  if (action === 'edit') {
    return [
      `操作：${getActionInstruction(action)}`,
      title ? `日记标题：${title}` : '',
      scope === 'selection'
        ? `选中的原文（Markdown）:\n${source || content || ''}`
        : `原始全文（Markdown）:\n${source || content || ''}`,
      scope === 'selection' && content && content !== source ? `当前完整草稿（仅用于理解上下文）:\n${content}` : '',
      scope === 'selection' ? '只输出用于替换这段选区的完整 Markdown，不要输出整篇日记。' : '',
      prompt ? `编辑指令：${prompt}` : '编辑指令：请在保留原意的基础上优化表达，使结构更清晰。'
    ].filter(Boolean).join('\n\n');
  }
  return [
    `操作：${getActionInstruction(action)}`,
    title ? `日记标题：${title}` : '',
    prompt ? `用户请求：${prompt}` : '',
    source ? `待处理文本:\n${source}` : ''
  ].filter(Boolean).join('\n\n');
}
function sseWrite(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
function buildThinkingSteps(action, title, source, prompt) {
  const lines=[];
  if(action==='ask'){
    lines.push('理解你的问题');
    if(title) lines.push(`结合标题「${String(title).slice(0,24)}」`);
    lines.push((source||'').trim() ? '在笔记上下文中检索关键信息' : '笔记为空，按通用知识作答');
    lines.push('组织为纯 Markdown 回答');
  } else if(action==='draw'){
    lines.push('理解你的画面描述');
    if(title) lines.push(`结合标题「${String(title).slice(0,24)}」`);
    lines.push(`构思构图与配色`);
    lines.push('生成 SVG 矢量图');
  } else if(action==='edit'){
    lines.push('读取原始 Markdown 全文');
    if((source||'').trim()) lines.push(`定位需改写的段落（约 ${Math.min(999, String(source||'').split('\n').length)} 行）`);
    lines.push(`按指令「${String(prompt||'优化表达').slice(0,28)}」规划改写`);
    lines.push('生成完整改写后的 Markdown');
  } else {
    const map={continue:'续写',polish:'润色',outline:'提纲',summarize:'摘要',title:'标题',tasks:'行动项',custom:'自定义',draw:'绘制'};
    lines.push(`准备执行：${map[action]||action}`);
    if((source||'').trim()) lines.push('读取选区/全文上下文');
    if(prompt) lines.push('解析你的补充说明');
    lines.push('生成纯 Markdown 输出');
  }
  return lines;
}

function getActionInstruction(action) {
  const instructions = {
    continue: '顺着原文的语气续写一小段，避免替用户编造具体事实。只输出纯 Markdown，不要用 HTML。',
    polish: '润色原文，使表达自然、清晰，有节奏；保留原意和 Markdown 结构。只输出润色后的纯 Markdown 全文，不要用 HTML。',
    outline: '将内容整理为可继续写作的纯 Markdown 提纲。只输出 Markdown。',
    summarize: '用简洁的中文摘要概括内容。只输出纯 Markdown。',
    title: '给出 3 个简洁、贴近日记内容的中文标题，每个标题用 Markdown 无序列表项输出。只输出 Markdown。',
    tasks: '提取文本中明确或合理推断出的待办，使用 Markdown 任务列表输出。只输出 Markdown。',
    ask: '你是笔记问答助手。请严格基于【待处理文本】回答用户问题，不要编造日记中没有的信息；若无法回答请坦诚说明。只输出纯 Markdown，不要用 HTML。',
    edit: '你是 Markdown 编辑助手。请根据用户指令直接改写整篇笔记，输出完整的、修改后的 Markdown 全文。不要添加解释、前后包裹的代码块或额外前后缀；保留 Markdown 格式，语言为中文。',
    custom: '根据用户的具体请求协助修改或扩写文本。只输出纯 Markdown，不要用 HTML。',
    draw: '你是 SVG 矢量插画助手。请根据用户的描述生成一张扁平风格、单文件、可直接嵌入 Markdown 的 SVG。要求：1) 只输出一个 <svg>...</svg> 块，不要输出解释、标题或 Markdown 代码块包裹；2) 使用 viewBox="0 0 320 200"，宽度自适应；3) 仅使用内联 fill/stroke，不引用外部资源；4) 保持简洁、现代、留白充足，适合插入日记；5) 若用户未明确描述，则创作一个与上下文相关的抽象几何/自然小插画。'
  };
  return instructions[action] || instructions.custom;
}

// Conversations: list by diary
router.get('/conversations', authRequired, (req, res)=>{
  const rawId = req.query.diary_id;
  let diaryId = normalizeDiaryIdForStorage(rawId);
  if(rawId != null && String(rawId).trim()!=='' && !Number.isFinite(Number(rawId))){
    // allow -1 explicitly
    diaryId = -1;
  }
  if(diaryId !== -1){
    const row = db.prepare('SELECT id, user_id FROM diaries WHERE id=?').get(diaryId);
    if(row && !canReadDiary(row, req.user.id)) return res.status(403).json({ error: '无权限访问该日记的对话' });
  }
  const search = String(req.query.search || '').trim().slice(0, 200);
  const searchPattern = search ? `%${search.replace(/[\\%_]/g, '\$&')}%` : '';
  const searchSql = search ? ` AND (content LIKE ? ESCAPE '\\' OR result LIKE ? ESCAPE '\\')` : '';
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit,10)||100));
  const beforeId = Number.parseInt(req.query.before_id, 10);
  const hasCursor = Number.isInteger(beforeId) && beforeId > 0;
  const cursorSql = hasCursor ? ' AND id < ?' : '';
  const searchCursorSql = hasCursor ? ' WHERE c.id < ?' : '';
  let rows;
  let total;
  let hasMore;
  let matchCount;
  if(search) {
    // Include the other half of the exchange so an answer hit keeps its
    // question visible, and vice versa.
    const searchCte = `
      WITH matched AS (
        SELECT id, role, thread_id FROM ai_conversations
        WHERE user_id=? AND diary_id=?
          AND (content LIKE ? ESCAPE '\\' OR result LIKE ? ESCAPE '\\')
      ),
      context AS (
        SELECT id FROM matched
        UNION
        SELECT neighbor.id FROM matched item
        JOIN ai_conversations neighbor ON
          IFNULL(item.thread_id, '') != '' AND neighbor.thread_id=item.thread_id
          AND neighbor.role != item.role
      )
    `;
    const searchBase = [req.user.id, diaryId, searchPattern, searchPattern];
    const searchListParams = [...searchBase];
    if(hasCursor) searchListParams.push(beforeId);
    searchListParams.push(limit);
    rows = db.prepare(`${searchCte} SELECT c.*, CASE WHEN m.id IS NULL THEN 0 ELSE 1 END AS search_hit FROM context ctx JOIN ai_conversations c ON c.id=ctx.id LEFT JOIN matched m ON m.id=c.id ${searchCursorSql} ORDER BY c.created_at DESC, c.id DESC LIMIT ?`).all(...searchListParams);
    total = db.prepare(`${searchCte} SELECT COUNT(*) AS count FROM context ctx JOIN ai_conversations c ON c.id=ctx.id`).get(...searchBase).count;
    matchCount = db.prepare(`${searchCte} SELECT COUNT(*) AS count FROM matched`).get(...searchBase).count;
    rows.reverse();
    const oldest = rows[0] || null;
    hasMore = Boolean(oldest && db.prepare(`${searchCte} SELECT 1 FROM context ctx JOIN ai_conversations c ON c.id=ctx.id WHERE c.id < ? LIMIT 1`).all(...searchBase, oldest.id).length);
  } else {
    const listParams = [req.user.id, diaryId];
    if(hasCursor) listParams.push(beforeId);
    listParams.push(limit);
    rows = db.prepare(`SELECT id, user_id, diary_id, role, content, result, action, mode, model_id, thread_id, topic_boundary, created_at FROM ai_conversations WHERE user_id=? AND diary_id=?${cursorSql} ORDER BY created_at DESC, id DESC LIMIT ?`).all(...listParams).reverse();
    const oldest = rows[0] || null;
    hasMore = Boolean(oldest && db.prepare('SELECT 1 FROM ai_conversations WHERE user_id=? AND diary_id=? AND id < ? LIMIT 1').get(req.user.id, diaryId, oldest.id));
    total = db.prepare('SELECT COUNT(*) AS count FROM ai_conversations WHERE user_id=? AND diary_id=?').get(req.user.id, diaryId).count;
  }
  res.json({ items: rows.map(row => ({ ...row, topic_boundary: !!row.topic_boundary })), diary_id: diaryId, query: search, total, match_count: search ? matchCount : undefined, has_more: hasMore, oldest_id: rows[0]?.id || null });
});
router.delete('/conversations', authRequired, (req, res)=>{
  const rawId = req.query.diary_id ?? req.body?.diary_id;
  let diaryId = normalizeDiaryIdForStorage(rawId);
  if(rawId != null && String(rawId).trim()!=='' && rawId!=='-1' && !Number.isFinite(Number(rawId))) diaryId=-1;
  if(diaryId !== -1){
    const row = db.prepare('SELECT id, user_id FROM diaries WHERE id=?').get(diaryId);
    if(row && !canReadDiary(row, req.user.id)) return res.status(403).json({ error: '无权限' });
  }
  db.prepare('DELETE FROM ai_conversations WHERE user_id=? AND diary_id=?').run(req.user.id, diaryId);
  res.json({ message: '已清空' });
});
router.delete('/conversations/:id', authRequired, (req, res)=>{
  const messageId = Number.parseInt(req.params.id, 10);
  if(!Number.isInteger(messageId) || messageId <= 0) return res.status(400).json({ error: '对话 ID 无效' });
  const target = db.prepare('SELECT id, user_id, diary_id, thread_id FROM ai_conversations WHERE id=?').get(messageId);
  if(!target || target.user_id !== req.user.id) return res.status(404).json({ error: '对话不存在' });

  let deletedCount;
  if(target.thread_id) {
    deletedCount = db.prepare('DELETE FROM ai_conversations WHERE user_id=? AND thread_id=?').run(req.user.id, target.thread_id).changes;
  } else {
    deletedCount = db.prepare('DELETE FROM ai_conversations WHERE user_id=? AND id=?').run(req.user.id, target.id).changes;
  }
  res.json({ message: '已删除', deleted_count: deletedCount });
});
router.get('/status', authRequired, (req, res) => {
  const models = getEnabledModels().map(({ id, name, model, is_default, source }) => ({
    id, name, model, is_default, source
  }));
  res.json({ available: models.length > 0, models });
});

router.post('/assist/stream', authRequired, async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const invalidPayload = ['action', 'title', 'content', 'selection', 'prompt'].some(key => body[key] != null && typeof body[key] !== 'string');
  if (invalidPayload) return res.status(400).json({ error: 'AI 请求内容格式无效' });
  if (body.model_id != null && !(typeof body.model_id === 'number' || typeof body.model_id === 'string')) {
    return res.status(400).json({ error: 'AI 模型格式无效' });
  }
  if (body.retry_thread_id != null && typeof body.retry_thread_id !== 'string') {
    return res.status(400).json({ error: '重试对话格式无效' });
  }
  if (body.fresh_context != null && typeof body.fresh_context !== 'boolean') {
    return res.status(400).json({ error: '新话题标记格式无效' });
  }
  if (body.fresh_context && body.retry_thread_id) {
    return res.status(400).json({ error: '重新生成不能同时开启新话题' });
  }
  if (body.diary_id != null && !(typeof body.diary_id === 'number' || typeof body.diary_id === 'string')) {
    return res.status(400).json({ error: 'diary_id 格式无效' });
  }

  const rawAction = String(body.action || 'custom');
  const rawTitle = String(body.title || '');
  const rawContent = String(body.content || '');
  const rawSelection = String(body.selection || '');
  const rawPrompt = String(body.prompt || '');
  const rawModelId = body.model_id != null ? String(body.model_id) : undefined;
  const rawRetryId = body.retry_thread_id != null ? String(body.retry_thread_id) : '';
  let a = rawAction; let p = rawPrompt;
  const retryContext = rawRetryId ? loadRetryContext(req.user.id, rawRetryId) : null;
  if(rawRetryId && !retryContext){ res.status(404).json({ error: '要重新生成的对话不存在' }); return res.end(); }
  if(retryContext){ a = retryContext.action; p = retryContext.prompt; }
  const t = rawTitle; const c = rawContent; const sel = rawSelection; const mid = rawModelId;
  const rawDiaryId = retryContext ? String(retryContext.diaryId) : (body.diary_id != null ? String(body.diary_id) : undefined);
  const diaryCtx = resolveDiaryContext(req.user.id, rawDiaryId != null ? rawDiaryId : undefined, t, c);
  const submittedSource = [sel, c].find(value => value != null && String(value).trim());
  const effectiveTitle = diaryCtx.title || t;
  const effectiveSource = submittedSource != null ? submittedSource : diaryCtx.source;
  const editScope = a === 'edit' && String(sel || '').trim() ? 'selection' : 'note';
  const freshContext = body.fresh_context === true && !retryContext;
  const historyRows = freshContext ? [] : loadRecentConversations(req.user.id, diaryCtx.diaryId, 12, retryContext ? rawRetryId : '');
  const historyMessages = buildHistoryMessages(historyRows);
  if (!ALLOWED_ACTIONS.has(a)) return res.status(400).end('unsupported action');
  const source = String(effectiveSource || '').trim();
  if (source.length > 12000 || p.length > 500 || effectiveTitle.length > 200) {
    return res.status(413).json({ error: 'AI 请求内容过长' });
  }
  if (!source && a !== 'custom' && a !== 'ask' && a !== 'draw') return res.status(400).end('empty source');
  if (!source && a === 'ask' && !(p||'').trim()) return res.status(400).end('empty source');
  const aiModel = getSelectedModel(mid);
  if (!aiModel) { res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }); sseWrite(res,'unavailable',{available:false}); sseWrite(res,'done',{}); return res.end(); }
  if (isRateLimited(req.user.id)) { res.writeHead(429, {'Content-Type':'text/event-stream'}); sseWrite(res,'error',{error:'AI 请求过于频繁，请稍后再试'}); return res.end(); }
  const baseUrl = aiModel.base_url.replace(/\/+$/, ''); const isEdit = a==='edit' || a==='draw'; const userPrompt = buildUserPrompt(a,effectiveTitle,effectiveSource,c,p,editScope); const thinkingSteps = buildThinkingSteps(a,effectiveTitle,effectiveSource,p);
  res.writeHead(200, {'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive','X-Accel-Buffering':'no'});
  sseWrite(res,'meta',{model:{id:aiModel.id,name:aiModel.name,model:aiModel.model},mode: a==='draw' ? 'draw' : (isEdit?'edit':(a==='ask'?'ask':'assist')),scope:editScope,note:'已由 '+aiModel.name+' 生成',thinkingSteps, diary_id: diaryCtx.diaryId, fresh_context:freshContext});
  for(let i=0;i<thinkingSteps.length;i++){ sseWrite(res,'thinking',{index:i,total:thinkingSteps.length,text:thinkingSteps[i],state:'done'}); await new Promise(r=>setTimeout(r,180+Math.random()*220)); }
  sseWrite(res,'thinking_done',{});
  const controller=new AbortController();
  let timedOut=false;
  let clientClosed=false;
  let completed=false;
  let partialSaved=false;
  let providerFull='';
  let savedThreadId=null;
  let persistPartial=()=>{};
  let idleTimer=null;
  const resetIdleTimer=()=>{
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{ timedOut=true; controller.abort(); },30000);
  };
  const overallTimer=setTimeout(()=>{ timedOut=true; controller.abort(); },180000);
  resetIdleTimer();
  req.on('close',()=>{
    clientClosed=true;
    if(!completed) persistPartial();
    try{controller.abort();}catch(_){}
  });
  const persistConversation = (text) => saveConversations(req.user.id, diaryCtx.diaryId, [
    {role:'user', content: (p||labelsForSave(a,p)), result:'', action:a, model_id:String(aiModel.id), mode: a==='draw'?'draw':(isEdit?'edit':(a==='ask'?'ask':'assist'))},
    {role:'assistant', content:text, result:text, action:a, model_id:String(aiModel.id), mode: a==='draw'?'draw':(isEdit?'edit':(a==='ask'?'ask':'assist'))}
    ], retryContext ? {replaceThreadId:rawRetryId} : {topicBoundary:freshContext});
  persistPartial=()=>{
    if(completed || partialSaved || !providerFull.trim()) return;
    partialSaved=true;
    try{
      const partial=providerFull.trim();
      const fence=partial.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/);
      savedThreadId=persistConversation(fence ? fence[1].trim() : partial)||null;
    }catch(e){ console.warn('[AI stream] save partial failed:',e.message); }
  };
  try {
    const chatMessages=[{role:'system',content:'你是 Treeks 日记应用中的中文写作助手。尊重用户语气，不提供诊断、判断或虚构事实。所有输出必须是纯 Markdown，不要使用 HTML，不要用代码块包裹整篇输出。'}, ...historyMessages, {role:'user',content:userPrompt}];
    const resp=await fetch(baseUrl+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Accept:'text/event-stream',Authorization:'Bearer '+aiModel.api_key},body:JSON.stringify({model:aiModel.model,stream:true,temperature:isEdit?0.35:0.55,max_tokens:isEdit?2200:900,messages:chatMessages}),signal:controller.signal});
    if(!resp.ok){
      let errText='';
      try{ const j=await resp.json(); errText=j?.error?.message||j?.error||''; }catch(_){ try{ errText=await resp.text(); }catch(_){}}
      const streamingUnsupported = [404,405,501].includes(resp.status) || /stream/i.test(String(errText));
      if(!streamingUnsupported){
        sseWrite(res,'error',{error:'AI 服务暂时不可用，请稍后重试'});
        clearTimeout(idleTimer); clearTimeout(overallTimer);
        return res.end();
      }
      console.error('[AI stream] falling back to non-streaming provider:',resp.status,String(errText).slice(0,400));
      const fbMessages=[{role:'system',content:'你是 Treeks 日记应用中的中文写作助手。所有输出必须是纯 Markdown，不要使用 HTML。'}, ...historyMessages, {role:'user',content:userPrompt}];
      const fallback=await fetch(baseUrl+'/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+aiModel.api_key},
        body:JSON.stringify({model:aiModel.model,temperature:isEdit?0.35:0.55,max_tokens:isEdit?2200:900,messages:fbMessages}),
        signal:controller.signal
      });
      const fj=await fallback.json().catch(()=>({}));
      const fallbackText=fj?.choices?.[0]?.message?.content;
      if(fallback.ok && fallbackText){
        let fr=String(fallbackText).trim();
        const fm=fr.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/);
        if(fm) fr=fm[1].trim();
        providerFull=fr;
        completed=true;
        savedThreadId=persistConversation(fr)||null;
        sseWrite(res,'delta',{text:fr.slice(0,8000)});
        sseWrite(res,'done',{result:fr,scope:editScope,thread_id:savedThreadId});
        clearTimeout(idleTimer); clearTimeout(overallTimer); return res.end();
      }
      sseWrite(res,'error',{error:'AI 服务暂时不可用，请稍后重试'}); clearTimeout(idleTimer); clearTimeout(overallTimer); return res.end();
    }
    const providerContentType=(resp.headers.get('content-type')||'').toLowerCase();
    if(!resp.body?.getReader || providerContentType.includes('application/json')){
      const payloadText=await resp.text();
      let text=payloadText;
      try{
        const payloadJson=JSON.parse(payloadText);
        text=payloadJson?.choices?.[0]?.message?.content || payloadText;
      }catch(_){}
      providerFull=text;
      completed=true;
      savedThreadId=persistConversation(text)||null;
      sseWrite(res,'delta',{text});
      sseWrite(res,'done',{result:text,scope:editScope,thread_id:savedThreadId});
      clearTimeout(idleTimer); clearTimeout(overallTimer); return res.end();
    }
    const reader=resp.body.getReader();
    const decoder=new TextDecoder('utf-8'); let buffer=''; let full='';
    while(true){ const {done,value}=await reader.read(); if(done) break; resetIdleTimer(); buffer+=decoder.decode(value,{stream:true}); const lines=buffer.split('\n'); buffer=lines.pop()||''; for(const line of lines){ const trimmed=line.trim(); if(!trimmed||trimmed.startsWith(':')) continue; if(!trimmed.startsWith('data:')) continue; const payload=trimmed.slice(5).trim(); if(payload==='[DONE]'){buffer=''; break;} try{ const j=JSON.parse(payload); const choice=j?.choices?.[0]||{}; const delta=choice?.delta?.content||''; const finalOnly=choice?.message?.content||''; const text=delta || (!full && finalOnly); if(text){ full+=text; providerFull=full; sseWrite(res,'delta',{text}); } }catch(_){} } }
    if(buffer.trim().startsWith('data:')){ const payload=buffer.trim().slice(5).trim(); if(payload && payload!=='[DONE]'){ try{ const j=JSON.parse(payload); const d=j?.choices?.[0]?.delta?.content||''; if(d){ full+=d; sseWrite(res,'delta',{text:d}); } }catch(_){} } }
    let finalText=full.trim();
    const fence=finalText.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/);
    if(fence) finalText=fence[1].trim();
    completed=true;
    savedThreadId=persistConversation(finalText||full)||null;
    sseWrite(res,'done',{result:finalText||full, scope:editScope, diary_id: diaryCtx.diaryId, thread_id:savedThreadId});
    clearTimeout(idleTimer); clearTimeout(overallTimer); res.end();
  } catch(e){
    clearTimeout(idleTimer); clearTimeout(overallTimer);
    persistPartial();
    if(clientClosed){ return res.end(); }
    if(e.name==='AbortError') sseWrite(res,'error',{error:timedOut?'AI 响应超时，请稍后重试':'AI 连接已中断，请稍后重试'});
    else { console.error('[AI stream] failed',e.message); sseWrite(res,'error',{error:'AI 服务连接失败，请稍后重试'}); }
    res.end();
  }
});

router.post('/assist', authRequired, async (req, res) => {
  let { action, title, content, selection, prompt, model_id: modelId, retry_thread_id: retryThreadId, fresh_context: freshContextPost } = req.body || {};
  if (modelId != null && !(typeof modelId === 'number' || typeof modelId === 'string')) {
    return res.status(400).json({ error: 'AI 模型格式无效' });
  }
  const aiModel = getSelectedModel(modelId);
  if (!aiModel) {
    return res.json({ available: false });
  }
  if (isRateLimited(req.user.id)) {
    return res.status(429).json({ error: 'AI 请求过于频繁，请稍后再试' });
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ error: '不支持的 AI 操作' });
  }
  if ([title, content, selection, prompt].some(value => value != null && typeof value !== 'string')) {
    return res.status(400).json({ error: 'AI 请求内容格式无效' });
  }
  if (req.body && req.body.diary_id != null && typeof req.body.diary_id !== 'number' && typeof req.body.diary_id !== 'string') {
    return res.status(400).json({ error: 'diary_id 格式无效' });
  }
  if (retryThreadId != null && typeof retryThreadId !== 'string') {
    return res.status(400).json({ error: '重试对话格式无效' });
  }
  if (freshContextPost != null && typeof freshContextPost !== 'boolean') {
    return res.status(400).json({ error: '新话题标记格式无效' });
  }
  if (freshContextPost && retryThreadId) {
    return res.status(400).json({ error: '重新生成不能同时开启新话题' });
  }
  const retryContextPost = retryThreadId ? loadRetryContext(req.user.id, retryThreadId) : null;
  if(retryThreadId && !retryContextPost) return res.status(404).json({ error: '要重新生成的对话不存在' });
  if(retryContextPost){
    action = retryContextPost.action;
    prompt = retryContextPost.prompt;
  }

  const diaryCtxPost = resolveDiaryContext(req.user.id, retryContextPost ? retryContextPost.diaryId : req.body?.diary_id, title, content);
  const effectiveTitlePost = diaryCtxPost.title || title;
  const submittedSourcePost = [selection, content].find(value => value != null && String(value).trim());
  const effectiveSourcePost = submittedSourcePost != null ? submittedSourcePost : diaryCtxPost.source;
  const editScopePost = action === 'edit' && String(selection || '').trim() ? 'selection' : 'note';
  const source = String(effectiveSourcePost).trim();
  if (!source && action !== 'custom' && action !== 'ask' && action !== 'draw') {
    return res.status(400).json({ error: '请先输入或选中需要处理的文本' });
  }
  if (!source && action === 'ask' && !(prompt || '').trim()) {
    return res.status(400).json({ error: '请先输入笔记内容或提问' });
  }
  if (source.length > 12000 || (prompt || '').length > 500 || (effectiveTitlePost || '').length > 200) {
    return res.status(413).json({ error: 'AI 请求内容过长' });
  }

  const baseUrl = aiModel.base_url.replace(/\/+$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const userPrompt = buildUserPrompt(action, effectiveTitlePost, effectiveSourcePost, content, prompt, editScopePost);
  const historyRowsPost = freshContextPost && !retryContextPost ? [] : loadRecentConversations(req.user.id, diaryCtxPost.diaryId, 12, retryContextPost ? retryThreadId : '');
  const historyMessagesPost = buildHistoryMessages(historyRowsPost);

  const isEdit = action === 'edit' || action === 'draw';
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiModel.api_key}`
      },
      body: JSON.stringify({
        model: aiModel.model,
        temperature: isEdit ? 0.35 : 0.55,
        max_tokens: isEdit ? 2200 : 900,
        messages: [{ role: 'system', content: '你是 Treeks 日记应用中的中文写作助手。尊重用户语气，不提供诊断、判断或虚构事实。所有输出必须是纯 Markdown，不要使用 HTML，不要用代码块包裹整篇输出。' }, ...historyMessagesPost, { role: 'user', content: userPrompt }]
      }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[AI] provider error:', response.status, data.error?.message || data.error || 'unknown');
      return res.status(502).json({ error: 'AI 服务暂时不可用，请稍后重试' });
    }
    let result = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!result) {
      return res.status(502).json({ error: 'AI 服务没有返回有效内容' });
    }
    // 兜底：剥离可能包裹的 ```markdown 代码块
    const fence = result.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/);
    if (fence) result = fence[1].trim();
    const savedThreadIdPost = saveConversations(req.user.id, diaryCtxPost.diaryId, [
      {role:'user', content: (prompt||labelsForSave(action,prompt)), result:'', action, model_id:String(aiModel.id), mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist'))},
      {role:'assistant', content: result, result, action, model_id:String(aiModel.id), mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist'))}
    ], retryContextPost ? {replaceThreadId:retryThreadId} : {topicBoundary:freshContextPost});
    res.json({
      available: true,
      result,
      note: `已由 ${aiModel.name} 生成`,
      mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist')),
      scope: editScopePost,
      model: { id: aiModel.id, name: aiModel.name, model: aiModel.model },
      diary_id: diaryCtxPost.diaryId,
      fresh_context: Boolean(freshContextPost && !retryContextPost),
      thread_id: savedThreadIdPost || null
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'AI 请求超时，请稍后重试' });
    }
    console.error('[AI] request failed:', error.message);
    res.status(502).json({ error: 'AI 服务连接失败，请稍后重试' });
  } finally {
    clearTimeout(timeout);
  }
});

module.exports = router;

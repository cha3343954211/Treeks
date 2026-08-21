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
function loadRecentConversations(userId, diaryId, limit=12){
  try{
    const rows = db.prepare('SELECT role, content, result, action, mode, model_id, created_at FROM ai_conversations WHERE user_id=? AND diary_id=? ORDER BY created_at DESC, id DESC LIMIT ?').all(userId, diaryId, limit);
    return rows.reverse();
  }catch(e){ return []; }
}
function saveConversations(userId, diaryId, messages){
  try{
    const stmt = db.prepare('INSERT INTO ai_conversations (user_id, diary_id, role, content, result, action, model_id, mode, thread_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const threadId = crypto.randomUUID();
    const tx = db.transaction(()=>{
      for(const m of messages){
        stmt.run(userId, diaryId, String(m.role||'user'), String(m.content||''), String(m.result||''), String(m.action||''), String(m.model_id||''), String(m.mode||''), threadId);
      }
    });
    tx();
  }catch(e){ console.warn('[AI] saveConversations failed', e.message); }
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
function buildUserPrompt(action, title, source, content, prompt) {
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
      `原始全文（Markdown）:\n${source || content || ''}`,
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
    rows = db.prepare(`SELECT id, user_id, diary_id, role, content, result, action, mode, model_id, thread_id, created_at FROM ai_conversations WHERE user_id=? AND diary_id=?${cursorSql} ORDER BY created_at DESC, id DESC LIMIT ?`).all(...listParams).reverse();
    const oldest = rows[0] || null;
    hasMore = Boolean(oldest && db.prepare('SELECT 1 FROM ai_conversations WHERE user_id=? AND diary_id=? AND id < ? LIMIT 1').get(req.user.id, diaryId, oldest.id));
    total = db.prepare('SELECT COUNT(*) AS count FROM ai_conversations WHERE user_id=? AND diary_id=?').get(req.user.id, diaryId).count;
  }
  res.json({ items: rows, diary_id: diaryId, query: search, total, match_count: search ? matchCount : undefined, has_more: hasMore, oldest_id: rows[0]?.id || null });
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

router.get('/assist/stream', authRequired, async (req, res) => {
  const rawAction = String(req.query.action || 'custom');
  const rawTitle = String(req.query.title || '');
  const rawContent = String(req.query.content || '');
  const rawSelection = String(req.query.selection || '');
  const rawPrompt = String(req.query.prompt || '');
  const rawModelId = req.query.model_id != null ? String(req.query.model_id) : undefined;
  const dec = s=>{ try{ return decodeURIComponent(s);}catch(_){ return s; }};
  const a = dec(rawAction); const t = dec(rawTitle); const c = dec(rawContent); const sel = dec(rawSelection); const p = dec(rawPrompt); const mid = rawModelId ? dec(rawModelId) : undefined;
  const rawDiaryId = req.query.diary_id != null ? String(req.query.diary_id) : undefined;
  const diaryCtx = resolveDiaryContext(req.user.id, rawDiaryId != null ? dec(rawDiaryId) : undefined, t, c);
  const effectiveTitle = diaryCtx.title || t;
  const effectiveSource = diaryCtx.source || (sel || c || '');
  const historyRows = loadRecentConversations(req.user.id, diaryCtx.diaryId, 12);
  const historyMessages = buildHistoryMessages(historyRows);
  if (!ALLOWED_ACTIONS.has(a)) return res.status(400).end('unsupported action');
  const source = (sel || c || '').trim();
  if (!source && a !== 'custom' && a !== 'ask' && a !== 'draw') return res.status(400).end('empty source');
  if (!source && a === 'ask' && !(p||'').trim()) return res.status(400).end('empty source');
  const aiModel = getSelectedModel(mid);
  if (!aiModel) { res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }); sseWrite(res,'unavailable',{available:false}); sseWrite(res,'done',{}); return res.end(); }
  if (isRateLimited(req.user.id)) { res.writeHead(429, {'Content-Type':'text/event-stream'}); sseWrite(res,'error',{error:'AI 请求过于频繁，请稍后再试'}); return res.end(); }
  const baseUrl = aiModel.base_url.replace(/\/+$/, ''); const isEdit = a==='edit' || a==='draw'; const userPrompt = buildUserPrompt(a,effectiveTitle,effectiveSource,c,p); const thinkingSteps = buildThinkingSteps(a,effectiveTitle,effectiveSource,p);
  res.writeHead(200, {'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive','X-Accel-Buffering':'no'});
  sseWrite(res,'meta',{model:{id:aiModel.id,name:aiModel.name,model:aiModel.model},mode: a==='draw' ? 'draw' : (isEdit?'edit':(a==='ask'?'ask':'assist')),note:'已由 '+aiModel.name+' 生成',thinkingSteps, diary_id: diaryCtx.diaryId});
  for(let i=0;i<thinkingSteps.length;i++){ sseWrite(res,'thinking',{index:i,total:thinkingSteps.length,text:thinkingSteps[i],state:'done'}); await new Promise(r=>setTimeout(r,180+Math.random()*220)); }
  sseWrite(res,'thinking_done',{});
  const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),45000); req.on('close',()=>{ try{controller.abort();}catch(_){} });
  try {
    const chatMessages=[{role:'system',content:'你是 Treeks 日记应用中的中文写作助手。尊重用户语气，不提供诊断、判断或虚构事实。所有输出必须是纯 Markdown，不要使用 HTML，不要用代码块包裹整篇输出。'}, ...historyMessages, {role:'user',content:userPrompt}];
    const resp=await fetch(baseUrl+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+aiModel.api_key},body:JSON.stringify({model:aiModel.model,stream:true,temperature:isEdit?0.35:0.55,max_tokens:isEdit?2200:900,messages:chatMessages}),signal:controller.signal});
    if(!resp.ok){ let errText=''; try{const j=await resp.json(); errText=j?.error?.message||j?.error||'';}catch(_){ try{errText=await resp.text();}catch(_){}} console.error('[AI stream] provider error:',resp.status, String(errText).slice(0,400)); const fbMessages=[{role:'system',content:'你是 Treeks 日记应用中的中文写作助手。所有输出必须是纯 Markdown，不要使用 HTML。'}, ...historyMessages, {role:'user',content:userPrompt}]; const fallback=await fetch(baseUrl+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+aiModel.api_key},body:JSON.stringify({model:aiModel.model,temperature:isEdit?0.35:0.55,max_tokens:isEdit?2200:900,messages:fbMessages}),signal:controller.signal}); const fj=await fallback.json().catch(()=>({})); if(fallback.ok && fj?.choices?.[0]?.message?.content){ let fr=String(fj.choices[0].message.content).trim(); const fm=fr.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/); if(fm) fr=fm[1].trim(); sseWrite(res,'delta',{text:fr.slice(0,8000)}); sseWrite(res,'done',{result:fr}); clearTimeout(timeout); return res.end(); } sseWrite(res,'error',{error:'AI 服务暂时不可用，请稍后重试'}); clearTimeout(timeout); return res.end(); }
    const reader=resp.body && resp.body.getReader ? resp.body.getReader() : null; if(!reader){ const text=await resp.text(); sseWrite(res,'delta',{text}); sseWrite(res,'done',{result:text}); clearTimeout(timeout); return res.end(); }
    const decoder=new TextDecoder('utf-8'); let buffer=''; let full='';
    while(true){ const {done,value}=await reader.read(); if(done) break; buffer+=decoder.decode(value,{stream:true}); const lines=buffer.split('\n'); buffer=lines.pop()||''; for(const line of lines){ const trimmed=line.trim(); if(!trimmed||trimmed.startsWith(':')) continue; if(!trimmed.startsWith('data:')) continue; const payload=trimmed.slice(5).trim(); if(payload==='[DONE]'){buffer=''; break;} try{ const j=JSON.parse(payload); const delta=j?.choices?.[0]?.delta?.content||''; if(delta){ full+=delta; sseWrite(res,'delta',{text:delta}); } }catch(_){} } }
    if(buffer.trim().startsWith('data:')){ const payload=buffer.trim().slice(5).trim(); if(payload && payload!=='[DONE]'){ try{ const j=JSON.parse(payload); const d=j?.choices?.[0]?.delta?.content||''; if(d){ full+=d; sseWrite(res,'delta',{text:d}); } }catch(_){} } }
    let finalText=full.trim(); const fence=finalText.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/); if(fence) finalText=fence[1].trim(); sseWrite(res,'done',{result:finalText||full, diary_id: diaryCtx.diaryId});
    try{ saveConversations(req.user.id, diaryCtx.diaryId, [{role:'user', content: (p||labelsForSave(a,p)), result:'', action:a, model_id:String(aiModel.id), mode: a==='draw'?'draw':(isEdit?'edit':(a==='ask'?'ask':'assist'))}, {role:'assistant', content: finalText||full, result: finalText||full, action:a, model_id:String(aiModel.id), mode: a==='draw'?'draw':(isEdit?'edit':(a==='ask'?'ask':'assist'))}]); }catch(_){}
    clearTimeout(timeout); res.end();
  } catch(e){ clearTimeout(timeout); if(e.name==='AbortError') sseWrite(res,'error',{error:'AI 请求超时，请稍后重试'}); else { console.error('[AI stream] failed',e.message); sseWrite(res,'error',{error:'AI 服务连接失败，请稍后重试'}); } res.end(); }
});

router.post('/assist', authRequired, async (req, res) => {
  const { action, title, content, selection, prompt, model_id: modelId } = req.body || {};
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

  const diaryCtxPost = resolveDiaryContext(req.user.id, req.body?.diary_id, title, content);
  const effectiveTitlePost = diaryCtxPost.title || title;
  const effectiveSourcePost = diaryCtxPost.source || (selection || content || '');
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

  const userPrompt = buildUserPrompt(action, effectiveTitlePost, source, content, prompt);
  const historyRowsPost = loadRecentConversations(req.user.id, diaryCtxPost.diaryId, 12);
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
    try{ saveConversations(req.user.id, diaryCtxPost.diaryId, [{role:'user', content: (prompt||labelsForSave(action,prompt)), result:'', action, model_id:String(aiModel.id), mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist'))}, {role:'assistant', content: result, result, action, model_id:String(aiModel.id), mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist'))}]); }catch(_){}
    res.json({
      available: true,
      result,
      note: `已由 ${aiModel.name} 生成`,
      mode: action === 'draw' ? 'draw' : (isEdit ? 'edit' : (action === 'ask' ? 'ask' : 'assist')),
      model: { id: aiModel.id, name: aiModel.name, model: aiModel.model },
      diary_id: diaryCtxPost.diaryId
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

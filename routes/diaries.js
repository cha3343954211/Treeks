const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要登录
router.use(authRequired);

// 解析 tags 字符串 <-> 数组
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  try { return JSON.parse(tagsStr); } catch { return []; }
}
function stringifyTags(tagsArr) {
  return JSON.stringify(tagsArr || []);
}

// 本地日期字符串（YYYY-MM-DD），避免 toISOString 返回 UTC 日期与日记 created_at（localtime）错位
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 判断用户是否可读某篇日记
function canReadDiary(diary, userId) {
  if (!diary) return false;
  if (diary.user_id === userId) return true;
  // 协作者可读
  if (db.prepare('SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').get(diary.id, userId)) return true;
  const vis = diary.visibility || 'private';
  if (vis === 'public') return true;
  if (vis === 'friends') {
    return !!db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(diary.user_id, userId);
  }
  if (vis === 'specific') {
    return !!db.prepare('SELECT 1 FROM diary_visible_to WHERE diary_id = ? AND user_id = ?').get(diary.id, userId);
  }
  return false;
}

// 判断用户是否可编辑某篇日记
function canEditDiary(diaryId, userId) {
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return false;
  if (diary.user_id === userId) return true;
  const c = db.prepare("SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ? AND role = 'editor'").get(diaryId, userId);
  return !!c;
}

// 同步日记可见性指定用户列表
function syncVisibleTo(diaryId, userIds) {
  db.prepare('DELETE FROM diary_visible_to WHERE diary_id = ?').run(diaryId);
  if (Array.isArray(userIds) && userIds.length) {
    const stmt = db.prepare('INSERT OR IGNORE INTO diary_visible_to (diary_id, user_id) VALUES (?, ?)');
    const tx = db.transaction(() => userIds.forEach(uid => stmt.run(diaryId, uid)));
    tx();
  }
}

// ===== 文件夹 CRUD =====
// 注意：这些路由必须放在 GET /:id 之前，否则 /folders 会被 /:id 匹配

// 获取当前用户的文件夹列表（含每个文件夹的日记数量）
router.get('/folders', (req, res) => {
  const rows = db.prepare(
    `SELECT f.*,
       (SELECT COUNT(*) FROM diaries d WHERE d.folder_id = f.id AND d.user_id = f.user_id) AS diary_count
     FROM folders f
     WHERE f.user_id = ?
     ORDER BY f.sort_order ASC, f.name ASC`
  ).all(req.user.id);
  res.json({ items: rows });
});

// 创建文件夹
router.post('/folders', (req, res) => {
  const { name, color, sort_order } = req.body || {};
  const trimmed = (name || '').trim();
  if (!trimmed) return res.status(400).json({ error: '文件夹名称不能为空' });
  if (trimmed.length > 50) return res.status(400).json({ error: '文件夹名称过长' });

  const result = db.prepare(
    `INSERT INTO folders (user_id, name, color, sort_order)
     VALUES (?, ?, ?, ?)`
  ).run(
    req.user.id,
    trimmed,
    (color || '#4c995c').slice(0, 20),
    Number.isInteger(sort_order) ? sort_order : 0
  );
  const row = db.prepare('SELECT * FROM folders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// 重命名 / 修改颜色 / 调整排序
router.put('/folders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT * FROM folders WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!existing) return res.status(404).json({ error: '文件夹不存在或无权修改' });

  const { name, color, sort_order } = req.body || {};
  const newName = name !== undefined ? String(name).trim() : null;
  if (newName === '') return res.status(400).json({ error: '文件夹名称不能为空' });
  if (newName && newName.length > 50) return res.status(400).json({ error: '文件夹名称过长' });

  db.prepare(
    `UPDATE folders SET
       name = COALESCE(?, name),
       color = COALESCE(?, color),
       sort_order = COALESCE(?, sort_order)
     WHERE id = ? AND user_id = ?`
  ).run(
    newName,
    color !== undefined ? String(color).slice(0, 20) : null,
    Number.isInteger(sort_order) ? sort_order : null,
    id,
    req.user.id
  );

  const row = db.prepare('SELECT * FROM folders WHERE id = ?').get(id);
  res.json(row);
});

// 删除文件夹：其中的日记移到默认文件夹（folder_id 设为 NULL），不删除日记
router.delete('/folders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT * FROM folders WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!existing) return res.status(404).json({ error: '文件夹不存在或无权删除' });

  const tx = db.transaction(() => {
    db.prepare('UPDATE diaries SET folder_id = NULL WHERE folder_id = ? AND user_id = ?')
      .run(id, req.user.id);
    db.prepare('DELETE FROM folders WHERE id = ? AND user_id = ?').run(id, req.user.id);
  });
  tx();
  res.json({ message: '文件夹已删除，其中的日记已移至默认文件夹' });
});

// 获取日记列表（支持分页、搜索、标签过滤、日期过滤、文件夹过滤）
router.get('/', (req, res) => {
  const {
    keyword,
    tag,
    date,
    folder_id,
    page = 1,
    limit = 20,
    order = 'desc'
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE user_id = ?';
  const params = [req.user.id];

  // folder_id 过滤：
  //   - 未传 / folder_id=null / folder_id=NULL → 默认文件夹（folder_id IS NULL）
  //   - folder_id=all → 全部日记（不加过滤）
  //   - folder_id=<数字> → 指定文件夹
  if (folder_id !== undefined && String(folder_id).toLowerCase() !== 'all') {
    const v = String(folder_id).toLowerCase();
    if (v === 'null' || v === '') {
      where += ' AND folder_id IS NULL';
    } else {
      const fid = parseInt(folder_id, 10);
      if (Number.isInteger(fid) && fid > 0) {
        where += ' AND folder_id = ?';
        params.push(fid);
      } else {
        // 非法值，按默认文件夹处理
        where += ' AND folder_id IS NULL';
      }
    }
  } else if (folder_id === undefined) {
    // 默认行为：只显示默认文件夹
    where += ' AND folder_id IS NULL';
  }
  // folder_id === 'all' → 不加过滤

  if (keyword) {
    where += ' AND (title LIKE ? OR content LIKE ?)';
    const kw = `%${keyword}%`;
    params.push(kw, kw);
  }
  if (tag) {
    where += ' AND tags LIKE ?';
    params.push(`%"${tag}"%`);
  }
  if (date) {
    where += " AND substr(created_at, 1, 10) = ?";
    params.push(date);
  }

  const orderClause = order === 'asc' ? 'ORDER BY is_pinned DESC, created_at ASC' : 'ORDER BY is_pinned DESC, created_at DESC';

  const total = db.prepare(`SELECT COUNT(*) as count FROM diaries ${where}`).get(...params).count;
  const rows = db.prepare(
    `SELECT id, title, content, mood, weather, tags, is_pinned, is_public, visibility, folder_id, pdf_filename, pdf_pages, created_at, updated_at
     FROM diaries ${where} ${orderClause} LIMIT ? OFFSET ?`
  ).all(...params, limitNum, offset);

  const items = rows.map(r => ({
    ...r,
    tags: parseTags(r.tags),
    is_pinned: !!r.is_pinned,
    is_public: !!r.is_public
  }));

  res.json({
    items,
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum)
  });
});

// 获取单篇日记（支持协作者/被授权用户读取他人日记）
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM diaries WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  if (!canReadDiary(row, req.user.id)) return res.status(403).json({ error: '无权查看此日记' });

  const isOwner = row.user_id === req.user.id;
  const canEdit = canEditDiary(id, req.user.id);
  const collaborators = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, dc.role
     FROM diary_collaborators dc
     JOIN users u ON u.id = dc.user_id
     WHERE dc.diary_id = ?`
  ).all(id);

  // 指定可见用户列表（仅 owner 可见完整列表；其他人只看是否能见）
  let visibleTo = [];
  let visibleToUsers = [];
  if (isOwner) {
    visibleTo = db.prepare('SELECT user_id FROM diary_visible_to WHERE diary_id = ?').all(id).map(r => r.user_id);
    if (visibleTo.length) {
      visibleToUsers = db.prepare(
        `SELECT id, username, nickname, avatar FROM users WHERE id IN (${visibleTo.map(() => '?').join(',')})`
      ).all(...visibleTo);
    }
  }

  res.json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public,
    is_owner: isOwner,
    can_edit: canEdit,
    collaborators,
    visibleTo,
    visibleToUsers
  });
});

// 创建日记
router.post('/', (req, res) => {
  const { title, content, mood, weather, tags, is_pinned, is_public, visibility, visibleTo, collaborators, folder_id, pdf_filename, pdf_pages } = req.body || {};
  const vis = ['private', 'public', 'friends', 'specific'].includes(visibility) ? visibility : 'private';

  // 校验 folder_id：必须属于当前用户，否则置为 NULL（默认文件夹）
  let folderId = null;
  if (folder_id !== undefined && folder_id !== null) {
    const fid = parseInt(folder_id, 10);
    if (Number.isInteger(fid) && fid > 0) {
      const owned = db.prepare('SELECT 1 FROM folders WHERE id = ? AND user_id = ?').get(fid, req.user.id);
      if (owned) folderId = fid;
    }
  }

  const result = db.prepare(
    `INSERT INTO diaries (user_id, title, content, mood, weather, tags, is_pinned, is_public, visibility, folder_id, pdf_filename, pdf_pages)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.user.id,
    (title || '').trim(),
    content || '',
    mood || null,
    weather || null,
    stringifyTags(tags),
    is_pinned ? 1 : 0,
    is_public ? 1 : 0,
    vis,
    folderId,
    pdf_filename !== undefined ? pdf_filename : null,
    pdf_pages !== undefined ? parseInt(pdf_pages, 10) || 0 : 0
  );
  const newId = result.lastInsertRowid;

  if (vis === 'specific' && Array.isArray(visibleTo)) {
    syncVisibleTo(newId, visibleTo);
  }
  // 创建时直接添加协作者
  if (Array.isArray(collaborators)) {
    const stmt = db.prepare('INSERT OR IGNORE INTO diary_collaborators (diary_id, user_id, role) VALUES (?, ?, ?)');
    collaborators.forEach(c => {
      if (c.userId && c.userId !== req.user.id) {
        stmt.run(newId, c.userId, c.role === 'viewer' ? 'viewer' : 'editor');
      }
    });
  }

  const row = db.prepare('SELECT * FROM diaries WHERE id = ?').get(newId);
  res.status(201).json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public
  });
});

// 更新日记（协作者也可编辑）
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT * FROM diaries WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: '日记不存在' });

  const isOwner = existing.user_id === req.user.id;
  const canEdit = isOwner || canEditDiary(id, req.user.id);
  if (!canEdit) return res.status(403).json({ error: '无权编辑此日记' });

  const { title, content, mood, weather, tags, is_pinned, is_public, visibility, visibleTo, folder_id, pdf_filename, pdf_pages } = req.body || {};

  // 仅 owner 可改可见性/置顶/公开/移动文件夹
  const canChangeMeta = isOwner;
  const vis = canChangeMeta && ['private', 'public', 'friends', 'specific'].includes(visibility) ? visibility : existing.visibility;

  // 处理 folder_id 移动（仅 owner 可移动；folder_id 可为 null 表示移到默认文件夹）
  let folderIdUpdate = null;
  let shouldUpdateFolder = false;
  if (canChangeMeta && folder_id !== undefined) {
    shouldUpdateFolder = true;
    if (folder_id === null) {
      folderIdUpdate = null;
    } else {
      const fid = parseInt(folder_id, 10);
      if (Number.isInteger(fid) && fid > 0) {
        const owned = db.prepare('SELECT 1 FROM folders WHERE id = ? AND user_id = ?').get(fid, req.user.id);
        if (owned) {
          folderIdUpdate = fid;
        } else {
          return res.status(400).json({ error: '文件夹不存在或无权访问' });
        }
      } else {
        return res.status(400).json({ error: 'folder_id 参数无效' });
      }
    }
  }

  // PDF 字段：仅 owner 可修改；pdf_filename 可被设置为 null 来移除附件
  const shouldUpdatePdf = canChangeMeta && pdf_filename !== undefined;
  const shouldUpdatePdfPages = canChangeMeta && pdf_pages !== undefined;

  db.prepare(
    `UPDATE diaries SET
       title = COALESCE(?, title),
       content = COALESCE(?, content),
       mood = COALESCE(?, mood),
       weather = COALESCE(?, weather),
       tags = COALESCE(?, tags),
       is_pinned = COALESCE(?, is_pinned),
       is_public = COALESCE(?, is_public),
       visibility = ?,
       updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title !== undefined ? title : null,
    content !== undefined ? content : null,
    mood !== undefined ? mood : null,
    weather !== undefined ? weather : null,
    tags !== undefined ? stringifyTags(tags) : null,
    canChangeMeta && is_pinned !== undefined ? (is_pinned ? 1 : 0) : null,
    canChangeMeta && is_public !== undefined ? (is_public ? 1 : 0) : null,
    vis,
    id
  );

  // 单独处理 folder_id（因为它可能是 NULL，COALESCE 无法区分"未传"和"传 null"）
  if (shouldUpdateFolder) {
    db.prepare('UPDATE diaries SET folder_id = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(folderIdUpdate, id);
  }

  // PDF 字段单独处理（保持一致的处理方式）
  if (shouldUpdatePdf || shouldUpdatePdfPages) {
    const sets = [];
    const args = [];
    if (shouldUpdatePdf) {
      sets.push('pdf_filename = ?');
      args.push(pdf_filename); // 支持 null（移除 PDF）
    }
    if (shouldUpdatePdfPages) {
      sets.push('pdf_pages = ?');
      args.push(parseInt(pdf_pages, 10) || 0);
    }
    sets.push("updated_at = datetime('now')");
    args.push(id);
    db.prepare(`UPDATE diaries SET ${sets.join(', ')} WHERE id = ?`).run(...args);
  }

  // 仅 owner 可同步可见性用户列表
  if (canChangeMeta && vis === 'specific' && Array.isArray(visibleTo)) {
    syncVisibleTo(id, visibleTo);
  }

  const row = db.prepare('SELECT * FROM diaries WHERE id = ?').get(id);
  res.json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public
  });
});

// 删除日记（仅 owner）
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM diaries WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: '日记不存在或无权删除' });
  res.json({ message: '已删除' });
});

// 置顶/取消置顶
router.patch('/:id/pin', (req, res) => {
  const result = db.prepare(
    'UPDATE diaries SET is_pinned = CASE WHEN is_pinned = 1 THEN 0 ELSE 1 END WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: '日记不存在' });
  const row = db.prepare('SELECT is_pinned FROM diaries WHERE id = ?').get(req.params.id);
  res.json({ is_pinned: !!row.is_pinned });
});

// 绑定 PDF 到日记（从 files 表选择）
// body: { fileId }  -> 设置 diaries.pdf_filename
// body: { fileId: null } 或 {} -> 移除
router.post('/:id/bind-pdf', (req, res) => {
  const diaryId = parseInt(req.params.id, 10);
  if (!diaryId) return res.status(400).json({ error: '参数错误' });
  const diary = db.prepare('SELECT * FROM diaries WHERE id = ? AND user_id = ?').get(diaryId, req.user.id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });

  const { fileId } = req.body || {};
  if (fileId === null || fileId === '' || fileId === undefined) {
    // 移除 PDF
    db.prepare("UPDATE diaries SET pdf_filename = NULL, pdf_pages = 0, updated_at = datetime('now') WHERE id = ?").run(diaryId);
    return res.json({ message: '已移除 PDF', pdf_filename: null });
  }
  const fid = parseInt(fileId, 10);
  if (!fid) return res.status(400).json({ error: '请提供 fileId' });
  const file = db.prepare("SELECT * FROM files WHERE id = ? AND user_id = ? AND kind = 'pdf'").get(fid, req.user.id);
  if (!file) return res.status(404).json({ error: 'PDF 文件不存在或不属于你' });
  // pdf_filename 在 diaries 表中存储相对路径（filename 即可）
  db.prepare("UPDATE diaries SET pdf_filename = ?, pdf_pages = 0, updated_at = datetime('now') WHERE id = ?")
    .run(file.filename, diaryId);
  res.json({ message: '已绑定 PDF', pdf_filename: file.filename, url: file.url, original_name: file.original_name });
});

// ===== 日记附件（多文件，替代旧 PDF 绑定）=====

// 列出某日记的全部附件
router.get('/:id/attachments', (req, res) => {
  const diaryId = parseInt(req.params.id, 10);
  if (!diaryId) return res.status(400).json({ error: '参数错误' });
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  // 协作者也可查看
  const isOwner = diary.user_id === req.user.id;
  if (!isOwner) {
    const collab = db.prepare('SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').get(diaryId, req.user.id);
    if (!collab) return res.status(403).json({ error: '无权访问该日记' });
  }
  const rows = db.prepare(
    `SELECT da.id AS attachment_id, da.sort_order, da.created_at,
            f.id AS file_id, f.kind, f.filename, f.original_name, f.mime_type, f.size, f.url
     FROM diary_attachments da
     JOIN files f ON f.id = da.file_id
     WHERE da.diary_id = ?
     ORDER BY da.sort_order ASC, da.created_at ASC`
  ).all(diaryId);
  res.json({ items: rows });
});

// 添加附件（body: { fileId }）
router.post('/:id/attachments', (req, res) => {
  const diaryId = parseInt(req.params.id, 10);
  if (!diaryId) return res.status(400).json({ error: '参数错误' });
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  const isOwner = diary.user_id === req.user.id;
  if (!isOwner) {
    const collab = db.prepare("SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ? AND role = 'editor'").get(diaryId, req.user.id);
    if (!collab) return res.status(403).json({ error: '只有作者或可编辑协作者才能添加附件' });
  }
  const fid = parseInt(req.body && req.body.fileId, 10);
  if (!fid) return res.status(400).json({ error: '请提供 fileId' });
  const file = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(fid, req.user.id);
  if (!file) return res.status(404).json({ error: '文件不存在或不属于你' });
  try {
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM diary_attachments WHERE diary_id = ?').get(diaryId);
    db.prepare('INSERT OR IGNORE INTO diary_attachments (diary_id, file_id, sort_order) VALUES (?, ?, ?)')
      .run(diaryId, fid, maxOrder.m + 1);
  } catch (e) {
    return res.status(409).json({ error: '该文件已是附件' });
  }
  db.prepare("UPDATE diaries SET updated_at = datetime('now') WHERE id = ?").run(diaryId);
  res.json({ message: '已添加附件', file_id: fid });
});

// 移除附件
router.delete('/:id/attachments/:fileId', (req, res) => {
  const diaryId = parseInt(req.params.id, 10);
  const fid = parseInt(req.params.fileId, 10);
  if (!diaryId || !fid) return res.status(400).json({ error: '参数错误' });
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  const isOwner = diary.user_id === req.user.id;
  if (!isOwner) {
    const collab = db.prepare("SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ? AND role = 'editor'").get(diaryId, req.user.id);
    if (!collab) return res.status(403).json({ error: '只有作者或可编辑协作者才能移除附件' });
  }
  const info = db.prepare('DELETE FROM diary_attachments WHERE diary_id = ? AND file_id = ?').run(diaryId, fid);
  if (info.changes === 0) return res.status(404).json({ error: '附件不存在' });
  db.prepare("UPDATE diaries SET updated_at = datetime('now') WHERE id = ?").run(diaryId);
  res.json({ message: '已移除附件' });
});

// 调整附件顺序（body: { orderedFileIds: [3, 5, 7] }）
router.put('/:id/attachments/order', (req, res) => {
  const diaryId = parseInt(req.params.id, 10);
  if (!diaryId) return res.status(400).json({ error: '参数错误' });
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  if (diary.user_id !== req.user.id) return res.status(403).json({ error: '只有作者才能调整附件顺序' });
  const ids = Array.isArray(req.body && req.body.orderedFileIds) ? req.body.orderedFileIds : null;
  if (!ids) return res.status(400).json({ error: '请提供 orderedFileIds' });
  const upd = db.prepare('UPDATE diary_attachments SET sort_order = ? WHERE diary_id = ? AND file_id = ?');
  const tx = db.transaction(() => {
    ids.forEach((fid, i) => upd.run(i, diaryId, parseInt(fid, 10)));
  });
  tx();
  res.json({ message: '顺序已更新' });
});

// ===== 共享/协作相关 =====

// 我能看到的他人日记（好友公开 / 指定可见 / 我协作的）
// 已屏蔽作者的笔记不会出现在列表中
router.get('/shared/list', (req, res) => {
  const rows = db.prepare(
    `SELECT d.id, d.title, d.content, d.mood, d.weather, d.tags, d.visibility, d.created_at, d.updated_at,
            u.id AS author_id, u.username AS author_username, u.nickname AS author_nickname, u.avatar AS author_avatar
     FROM diaries d
     JOIN users u ON u.id = d.user_id
     WHERE d.user_id != ?
       AND NOT EXISTS (SELECT 1 FROM user_blocks ub WHERE ub.user_id = ? AND ub.blocked_user_id = d.user_id)
       AND (
         d.visibility = 'public'
         OR (d.visibility = 'friends' AND EXISTS (
           SELECT 1 FROM friends f WHERE f.user_id = d.user_id AND f.friend_id = ?
         ))
         OR EXISTS (SELECT 1 FROM diary_visible_to dv WHERE dv.diary_id = d.id AND dv.user_id = ?)
         OR EXISTS (SELECT 1 FROM diary_collaborators dc WHERE dc.diary_id = d.id AND dc.user_id = ?)
       )
     ORDER BY d.created_at DESC
     LIMIT 100`
  ).all(req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
  const items = rows.map(r => ({ ...r, tags: parseTags(r.tags) }));
  res.json({ items, total: items.length });
});

// ===== 屏蔽用户管理 =====

// 获取已屏蔽用户列表
router.get('/blocked-users', (req, res) => {
  const rows = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, ub.created_at AS blocked_at
     FROM user_blocks ub
     JOIN users u ON u.id = ub.blocked_user_id
     WHERE ub.user_id = ?
     ORDER BY ub.created_at DESC`
  ).all(req.user.id);
  res.json({ items: rows, total: rows.length });
});

// 屏蔽用户
router.post('/blocked-users', (req, res) => {
  const { blockedUserId } = req.body || {};
  const uid = parseInt(blockedUserId, 10);
  if (!uid) return res.status(400).json({ error: '请指定要屏蔽的用户' });
  if (uid === req.user.id) return res.status(400).json({ error: '不能屏蔽自己' });

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(uid);
  if (!user) return res.status(404).json({ error: '用户不存在' });

  db.prepare('INSERT OR IGNORE INTO user_blocks (user_id, blocked_user_id) VALUES (?, ?)')
    .run(req.user.id, uid);
  res.status(201).json({ message: '已屏蔽该用户' });
});

// 取消屏蔽
router.delete('/blocked-users/:userId', (req, res) => {
  const uid = parseInt(req.params.userId, 10);
  if (!uid) return res.status(400).json({ error: '参数无效' });
  db.prepare('DELETE FROM user_blocks WHERE user_id = ? AND blocked_user_id = ?')
    .run(req.user.id, uid);
  res.json({ message: '已取消屏蔽' });
});

// 我正在协作的日记
router.get('/collaborating/list', (req, res) => {
  const rows = db.prepare(
    `SELECT d.id, d.title, d.content, d.mood, d.weather, d.tags, d.visibility, d.created_at, d.updated_at,
            u.id AS author_id, u.username AS author_username, u.nickname AS author_nickname, u.avatar AS author_avatar,
            dc.role AS my_role
     FROM diary_collaborators dc
     JOIN diaries d ON d.id = dc.diary_id
     JOIN users u ON u.id = d.user_id
     WHERE dc.user_id = ?
     ORDER BY d.updated_at DESC`
  ).all(req.user.id);
  const items = rows.map(r => ({ ...r, tags: parseTags(r.tags) }));
  res.json({ items, total: items.length });
});

// 列出某日记的协作者
router.get('/:id/collaborators', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  if (!canReadDiary({ id, user_id: diary.user_id, visibility: 'private' }, req.user.id) && diary.user_id !== req.user.id) {
    return res.status(403).json({ error: '无权查看' });
  }
  const rows = db.prepare(
    `SELECT u.id, u.username, u.nickname, u.avatar, dc.role, dc.created_at AS joined_at
     FROM diary_collaborators dc
     JOIN users u ON u.id = dc.user_id
     WHERE dc.diary_id = ?`
  ).all(id);
  res.json({ items: rows, total: rows.length });
});

// 添加协作者（仅 owner）
router.post('/:id/collaborators', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  if (diary.user_id !== req.user.id) return res.status(403).json({ error: '只有日记作者可添加协作者' });

  const { userId, role } = req.body || {};
  const uid = parseInt(userId, 10);
  if (!uid) return res.status(400).json({ error: '请指定用户' });
  if (uid === req.user.id) return res.status(400).json({ error: '不能添加自己为协作者' });

  const user = db.prepare("SELECT id, status FROM users WHERE id = ?").get(uid);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  if (user.status !== 'active') return res.status(400).json({ error: '用户已被停用' });

  db.prepare('INSERT OR IGNORE INTO diary_collaborators (diary_id, user_id, role) VALUES (?, ?, ?)')
    .run(id, uid, role === 'viewer' ? 'viewer' : 'editor');
  res.status(201).json({ message: '已添加协作者' });
});

// 移除协作者（仅 owner，或自己退出）
router.delete('/:id/collaborators/:userId', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const uid = parseInt(req.params.userId, 10);
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });
  if (diary.user_id !== req.user.id && uid !== req.user.id) {
    return res.status(403).json({ error: '无权移除协作者' });
  }
  db.prepare('DELETE FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').run(id, uid);
  res.json({ message: '已移除协作者' });
});

// 写作热力图 - 返回指定年份每天的日记数（GitHub 风格）
router.get('/stats/heatmap', (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  // 查询该用户这一年所有日记，按日期分组
  const rows = db.prepare(
    `SELECT substr(created_at, 1, 10) as date, COUNT(*) as count
     FROM diaries
     WHERE user_id = ?
       AND substr(created_at, 1, 4) = ?
     GROUP BY date`
  ).all(req.user.id, String(year));

  const map = {};
  // 统一日期分隔符（数据库返回 2026/01/05，转为 2026-01-05 与前端 ISO 对齐）
  rows.forEach(r => { map[r.date.replace(/\//g, '-')] = r.count; });

  // 查询该年所有日记的标题（用于日历显示），按日期升序、置顶优先
  const titleRows = db.prepare(
    `SELECT id, title, substr(created_at, 1, 10) as date, is_pinned
     FROM diaries
     WHERE user_id = ?
       AND substr(created_at, 1, 4) = ?
     ORDER BY is_pinned DESC, created_at ASC`
  ).all(req.user.id, String(year));
  const titlesMap = {};
  titleRows.forEach(r => {
    const d = r.date.replace(/\//g, '-');
    if (!titlesMap[d]) titlesMap[d] = [];
    // 每天最多保留 5 篇标题（足够日历和详情面板使用）
    if (titlesMap[d].length < 5) {
      titlesMap[d].push({
        id: r.id,
        title: (r.title || '无标题').slice(0, 60),
        is_pinned: !!r.is_pinned
      });
    }
  });

  // 生成 365 天（按周对齐，从周日到周六）
  const start = new Date(`${year}-01-01T00:00:00`);
  const end = new Date(`${year}-12-31T00:00:00`);
  const startDayOfWeek = start.getDay(); // 0=Sunday
  // 找到第一个周日（含或之前）
  const firstSunday = new Date(start);
  firstSunday.setDate(start.getDate() - startDayOfWeek);

  const weeks = [];
  const cursor = new Date(firstSunday);
  while (cursor <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = localDateStr(cursor);
      const inYear = cursor.getFullYear() === year;
      week.push({
        date: dateStr,
        count: inYear ? (map[dateStr] || 0) : 0,
        titles: inYear ? (titlesMap[dateStr] || []) : [],
        inYear
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  // 统计该年总篇数与最长连续
  const total = rows.reduce((s, r) => s + r.count, 0);
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0);

  // 计算最长连续写作天数
  let longestStreak = 0, currentStreak = 0, lastStreak = 0;
  const allDates = Object.keys(map).sort();
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(allDates[i - 1]);
      const cur = new Date(allDates[i]);
      const diff = (cur - prev) / 86400000;
      currentStreak = diff === 1 ? currentStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }
  // 当前连续（从今天往回数）
  const today = localDateStr(new Date());
  const yesterday = localDateStr(new Date(Date.now() - 86400000));
  const startFrom = map[today] ? today : (map[yesterday] ? yesterday : null);
  if (startFrom) {
    const cur = new Date(startFrom + 'T00:00:00');
    while (map[localDateStr(cur)]) {
      lastStreak++;
      cur.setDate(cur.getDate() - 1);
    }
  }

  res.json({ year, total, max, longestStreak, currentStreak: lastStreak, weeks });
});

// 获取统计信息
router.get('/stats/summary', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM diaries WHERE user_id = ?')
    .get(req.user.id).count;
  const pinned = db.prepare('SELECT COUNT(*) as count FROM diaries WHERE user_id = ? AND is_pinned = 1')
    .get(req.user.id).count;

  const moodStats = db.prepare(
    `SELECT mood, COUNT(*) as count FROM diaries
     WHERE user_id = ? AND mood IS NOT NULL AND mood != ''
     GROUP BY mood ORDER BY count DESC`
  ).all(req.user.id);

  const tagStats = db.prepare(
    `SELECT tags FROM diaries WHERE user_id = ? AND tags IS NOT NULL AND tags != '[]'`
  ).all(req.user.id);

  const tagCount = {};
  tagStats.forEach(r => {
    parseTags(r.tags).forEach(t => {
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // 最近7天写作数量
  const recentDays = db.prepare(
    `SELECT substr(created_at, 1, 10) as date, COUNT(*) as count
     FROM diaries WHERE user_id = ?
     AND created_at >= datetime('now', '-7 days')
     GROUP BY date ORDER BY date DESC`
  ).all(req.user.id);

  res.json({ total, pinned, moodStats, topTags, recentDays });
});

module.exports = router;

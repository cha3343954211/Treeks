const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { getRuntimeUploadDir, DEFAULT_UPLOAD_DIR } = require('../services/storageLocation');

const router = express.Router();

// 通用文件存储配置：所有用户文件统一存到 USER_ID/ 目录下
// 通过文件扩展名分子目录（images / pdf / texts / docs / other）
// 文件类型与 kind/subdir 映射
const TEXT_EXTS = /\.(txt|md|markdown|json|ya?ml|csv|tsv|log|ini|conf|xml|html?|css|scss|sass|less|js|jsx|ts|tsx|vue|svelte|py|java|kt|swift|rb|go|rs|php|sh|bat|sql|env|toml)$/i;
const DOC_EXTS = /\.(docx?|xlsx?|xlsb?|pptx?|odt|ods|odp|rtf)$/i;
const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;
const PDF_EXTS = /\.pdf$/i;

function classifyFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (IMAGE_EXTS.test(ext)) return { kind: 'image', subdir: 'images' };
  if (PDF_EXTS.test(ext)) return { kind: 'pdf', subdir: 'pdf' };
  if (TEXT_EXTS.test(ext)) return { kind: 'text', subdir: 'texts' };
  if (DOC_EXTS.test(ext)) return { kind: 'document', subdir: 'docs' };
  return { kind: 'other', subdir: 'other' };
}

const userFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { subdir } = classifyFile(file.originalname);
    const userDir = path.join(getRuntimeUploadDir(), String(req.user.id), subdir);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    // 把 subdir/kind 挂到 req 上，让后续路由识别
    req._fileSubdir = subdir;
    req._fileKind = classifyFile(file.originalname).kind;
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname + (req.user.id || '')).digest('hex').slice(0, 12);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    cb(null, `${dateStr}_${hash}${ext}`);
  }
});

// 图片上传配置（兼容旧 API：/api/upload/image，存到 USER_ID/ 根目录，保持向后兼容）
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(getRuntimeUploadDir(), String(req.user.id));
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname).digest('hex').slice(0, 12);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    cb(null, `${dateStr}_${hash}${ext}`);
  }
});

// PDF 上传配置（用 pdf/ 子目录，扩展名固定为 .pdf）
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(getRuntimeUploadDir(), String(req.user.id), 'pdf');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.createHash('md5').update(Date.now() + file.originalname + (req.user.id || '')).digest('hex').slice(0, 12);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    cb(null, `${dateStr}_${hash}.pdf`);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 10) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp|svg\+xml/;
    const ok = allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) cb(null, true);
    else cb(new Error('仅支持 jpeg/jpg/png/gif/webp/bmp/svg 格式'));
  }
});

// PDF 限制：单文件最大 50MB
const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: (parseInt(process.env.MAX_PDF_SIZE, 10) || 50) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('仅支持 PDF 格式'));
    }
  }
});

// 通用文件上传（用于"我的文件"页面）：支持图片 / PDF / 文本 / Office 文档
const generalFileUpload = multer({
  storage: userFileStorage,
  limits: {
    fileSize: (parseInt(process.env.MAX_PDF_SIZE, 10) || 50) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const { kind } = classifyFile(file.originalname);
    if (kind === 'other') {
      cb(new Error('暂不支持该文件类型（支持：图片、PDF、文本/代码、Word/Excel/PPT）'));
      return;
    }
    cb(null, true);
  }
});

router.use(authRequired);

// 检查用户存储配额（统一从 files 表计算）
function checkStorage(user, addSize) {
  const row = db.prepare('SELECT storage_limit, status FROM users WHERE id = ?').get(user.id);
  if (!row) throw new Error('用户不存在');
  if (row.status === 'disabled') throw new Error('账户已被停用');
  const used = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM files WHERE user_id = ?').get(user.id).s;
  if (used + addSize > row.storage_limit) {
    throw new Error(`存储空间不足，剩余 ${formatBytes(Math.max(0, row.storage_limit - used))}，本次需要 ${formatBytes(addSize)}`);
  }
  return row.storage_limit;
}

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// ===== 通用文件 API（"我的文件"页面） =====

// 上传单个文件（图片 / PDF / 文本 / 文档）
router.post('/file', generalFileUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到文件' });
  try {
    checkStorage(req.user, req.file.size);
  } catch (e) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  const { kind } = classifyFile(req.file.originalname);
  // 取子目录：图片 → images，PDF → pdf，文本 → texts，文档 → docs，其他 → other
  const subdir = req._fileSubdir || (kind === 'image' ? 'images' : kind === 'pdf' ? 'pdf' : kind === 'text' ? 'texts' : kind === 'document' ? 'docs' : 'other');
  // folder 可选：通过请求头/字段指定
  const folder = (req.body.folder || req.query.folder || '').toString().trim().slice(0, 200);
  // URL 策略：
  //  - PDF：使用鉴权接口 /api/upload/pdf/<filename>
  //  - 文本/文档：使用鉴权接口 /api/upload/file/<id>/raw（按 ID 鉴权，避免泄露文件结构）
  //  - 图片：使用 /uploads 静态服务（带子目录路径）
  //  - 兼容：旧版图片可能存在 USER_ID/ 下，URL 不带子目录；新版带子目录
  let url;
  if (kind === 'pdf') {
    url = `/api/upload/pdf/${req.file.filename}`;
  } else if (kind === 'image') {
    url = `/uploads/${req.user.id}/${subdir}/${req.file.filename}`;
  } else {
    // 文本/文档：占位 URL（创建后用 ID 重写）
    url = `/uploads/_pending/${req.file.filename}`;
  }
  const ins = db.prepare(
    `INSERT INTO files (user_id, kind, filename, original_name, mime_type, size, url, folder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, kind, req.file.filename, req.file.originalname, req.file.mimetype || '', req.file.size, url, folder);
  const fileId = ins.lastInsertRowid;
  // 文本/文档用 ID 生成稳定 URL
  if (kind === 'text' || kind === 'document') {
    const finalUrl = `/api/upload/file/${fileId}/raw`;
    db.prepare('UPDATE files SET url = ? WHERE id = ?').run(finalUrl, fileId);
    url = finalUrl;
  }
  res.status(201).json({
    id: fileId,
    kind,
    url,
    folder,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype || ''
  });
});

// 获取文件列表（支持按 kind / folder 过滤）
router.get('/files', (req, res) => {
  const kind = (req.query.kind || '').toString();
  const folder = (req.query.folder || '').toString();
  const VALID_KINDS = ['image', 'pdf', 'text', 'document', 'other'];
  const where = ['user_id = ?'];
  const args = [req.user.id];
  if (kind && VALID_KINDS.includes(kind)) { where.push('kind = ?'); args.push(kind); }
  if (folder) { where.push('folder = ?'); args.push(folder); }
  const rows = db.prepare(
    `SELECT id, kind, filename, original_name, mime_type, size, url, folder, created_at
     FROM files WHERE ${where.join(' AND ')} ORDER BY created_at DESC`
  ).all(...args);
  res.json({ items: rows });
});

// 重命名文件
router.patch('/files/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const { original_name, folder } = req.body || {};
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  const updates = [];
  const args = [];
  if (typeof original_name === 'string' && original_name.trim()) {
    updates.push('original_name = ?');
    args.push(original_name.trim().slice(0, 200));
  }
  if (typeof folder === 'string') {
    updates.push('folder = ?');
    args.push(folder.trim().slice(0, 200));
  }
  if (updates.length === 0) return res.status(400).json({ error: '无可更新字段' });
  args.push(id);
  db.prepare(`UPDATE files SET ${updates.join(', ')} WHERE id = ?`).run(...args);
  res.json({ message: '已更新' });
});

// 保存文件批注（笔刷标注）
router.put('/files/:id/annotations', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const { annotations } = req.body || {};
  if (annotations === undefined) return res.status(400).json({ error: 'annotations 必填' });
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  // 限制大小：annotations 序列化为 JSON 后不超过 4MB
  const str = JSON.stringify(annotations);
  if (str.length > 4 * 1024 * 1024) {
    return res.status(413).json({ error: '批注数据过大（>4MB）' });
  }
  db.prepare('UPDATE files SET annotations = ? WHERE id = ?').run(str, id);
  res.json({ message: '已保存', size: str.length });
});

// 获取文件批注
router.get('/files/:id/annotations', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT annotations FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  let data = null;
  if (row.annotations) {
    try { data = JSON.parse(row.annotations); } catch (_) { data = null; }
  }
  res.json({ annotations: data });
});

// ===== 文件夹 API =====
// 列出指定目录下的文件夹
router.get('/folders', (req, res) => {
  const parent = (req.query.parent || '').toString();
  const rows = db.prepare(
    `SELECT id, name, parent, created_at FROM file_folders
     WHERE user_id = ? AND parent = ? ORDER BY created_at ASC`
  ).all(req.user.id, parent);
  res.json({ items: rows });
});

// 创建文件夹
router.post('/folders', (req, res) => {
  const { name, parent } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: '文件夹名称必填' });
  }
  const folderName = name.trim().slice(0, 50);
  const parentPath = (parent || '').toString().trim().slice(0, 200);
  try {
    const result = db.prepare(
      `INSERT INTO file_folders (user_id, name, parent) VALUES (?, ?, ?)`
    ).run(req.user.id, folderName, parentPath);
    res.status(201).json({ id: result.lastInsertRowid, name: folderName, parent: parentPath });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) {
      return res.status(409).json({ error: '该目录下已存在同名文件夹' });
    }
    res.status(500).json({ error: '创建失败：' + e.message });
  }
});

// 重命名文件夹
router.patch('/folders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const { name } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: '文件夹名称必填' });
  }
  const folderName = name.trim().slice(0, 50);
  const row = db.prepare('SELECT * FROM file_folders WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件夹不存在' });
  try {
    db.prepare('UPDATE file_folders SET name = ? WHERE id = ?').run(folderName, id);
    res.json({ message: '已重命名' });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) {
      return res.status(409).json({ error: '该目录下已存在同名文件夹' });
    }
    res.status(500).json({ error: '重命名失败：' + e.message });
  }
});

// 删除文件夹（同时删除其下所有文件与子文件夹）
router.delete('/folders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT * FROM file_folders WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件夹不存在' });
  // 递归收集所有子文件夹的 path 前缀
  const collectDescendants = (parentPath) => {
    const children = db.prepare(
      `SELECT id, name FROM file_folders WHERE user_id = ? AND parent = ?`
    ).all(req.user.id, parentPath);
    const result = [parentPath];
    for (const c of children) {
      const childPath = parentPath ? parentPath + '/' + c.name : c.name;
      result.push(...collectDescendants(childPath));
    }
    return result;
  };
  const allPaths = collectDescendants(row.parent ? row.parent + '/' + row.name : row.name);
  // 删除这些路径下的所有文件
  for (const p of allPaths) {
    const files = db.prepare(
      `SELECT * FROM files WHERE user_id = ? AND folder = ?`
    ).all(req.user.id, p);
    for (const f of files) {
      const { subdir } = classifyFile(f.original_name || f.filename);
      const runtimeDir = getRuntimeUploadDir();
      const defaultDir = DEFAULT_UPLOAD_DIR;
      const baseDirs = runtimeDir === defaultDir ? [runtimeDir] : [runtimeDir, defaultDir];
      for (const base of baseDirs) {
        const fp = path.join(base, String(req.user.id), subdir, f.filename);
        if (fs.existsSync(fp)) {
          try { fs.unlinkSync(fp); } catch (_) {}
        }
      }
    }
    db.prepare(`DELETE FROM files WHERE user_id = ? AND folder = ?`).run(req.user.id, p);
    db.prepare(`DELETE FROM file_folders WHERE user_id = ? AND parent = ?`).run(req.user.id, p);
  }
  // 最后删除本文件夹
  db.prepare(`DELETE FROM file_folders WHERE id = ?`).run(id);
  res.json({ message: '已删除' });
});

// 删除用户文件
router.delete('/files/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  // 物理删除：根据 kind 选择子目录
  const { subdir } = classifyFile(row.original_name || row.filename);
  // 删除候选路径：优先当前运行时目录，兼容默认目录（应对存储位置切换后旧数据残留）
  const runtimeDir = getRuntimeUploadDir();
  const defaultDir = DEFAULT_UPLOAD_DIR;
  const baseDirs = runtimeDir === defaultDir ? [runtimeDir] : [runtimeDir, defaultDir];
  const candidates = [];
  for (const base of baseDirs) {
    candidates.push(path.join(base, String(req.user.id), subdir, row.filename));
    candidates.push(path.join(base, String(req.user.id), row.filename)); // 旧版直存 USER_ID/
  }
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try { fs.unlinkSync(p); console.log('[Upload] 删除物理文件:', p); } catch (e) { console.error('删除文件失败', e.message); }
    }
  }
  // 同时清理 images 表中同 filename 的旧记录（避免存储位置切换后冲突）
  if (row.kind === 'image') {
    try { db.prepare('DELETE FROM images WHERE user_id = ? AND filename = ?').run(req.user.id, row.filename); } catch (_) {}
  }
  // 同时清理引用此文件名的 diary 的 pdf_filename（如果它是被引用的 PDF）
  if (row.kind === 'pdf') {
    try {
      db.prepare("UPDATE diaries SET pdf_filename = NULL WHERE user_id = ? AND pdf_filename = ?")
        .run(req.user.id, row.filename);
    } catch (_) {}
  }
  db.prepare('DELETE FROM files WHERE id = ?').run(id);
  res.json({ message: '已删除' });
});

// 获取用户存储空间使用情况（统一从 files 表计算）
router.get('/storage', (req, res) => {
  const row = db.prepare('SELECT storage_limit, status FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  const used = db.prepare('SELECT COALESCE(SUM(size),0) as s FROM files WHERE user_id = ?').get(req.user.id).s;
  const countRow = db.prepare('SELECT COUNT(*) as c FROM files WHERE user_id = ?').get(req.user.id);
  const pdfCount = db.prepare("SELECT COUNT(*) as c FROM files WHERE user_id = ? AND kind = 'pdf'").get(req.user.id).c;
  const imageCount = db.prepare("SELECT COUNT(*) as c FROM files WHERE user_id = ? AND kind = 'image'").get(req.user.id).c;
  res.json({
    used,
    limit: row.storage_limit,
    count: countRow.c,
    imageCount,
    pdfCount,
    available: Math.max(0, row.storage_limit - used),
    percent: row.storage_limit > 0 ? Math.min(100, (used / row.storage_limit) * 100) : 100
  });
});

// ===== 旧版图片 API（向后兼容） =====

// 上传单张图片
router.post('/image', imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到图片文件' });
  try {
    checkStorage(req.user, req.file.size);
  } catch (e) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  const url = `/uploads/${req.user.id}/${req.file.filename}`;
  // 同时写入 images 表（向后兼容）与 files 表（统一管理）
  const result = db.prepare(
    'INSERT INTO images (user_id, filename, original_name, size, url) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, req.file.filename, req.file.originalname, req.file.size, url);
  db.prepare(
    `INSERT OR IGNORE INTO files (user_id, kind, filename, original_name, mime_type, size, url)
     VALUES (?, 'image', ?, ?, ?, ?, ?)`
  ).run(req.user.id, req.file.filename, req.file.originalname, req.file.mimetype || 'image/jpeg', req.file.size, url);
  res.status(201).json({
    id: result.lastInsertRowid,
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    markdown: `![${req.file.originalname}](${url})`
  });
});

// 上传多张图片
router.post('/images', imageUpload.array('images', 9), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '未接收到图片文件' });
  }
  const totalSize = req.files.reduce((s, f) => s + f.size, 0);
  try {
    checkStorage(req.user, totalSize);
  } catch (e) {
    for (const f of req.files) { try { fs.unlinkSync(f.path); } catch (_) {} }
    return res.status(400).json({ error: e.message });
  }
  const insertImg = db.prepare(
    'INSERT INTO images (user_id, filename, original_name, size, url) VALUES (?, ?, ?, ?, ?)'
  );
  const insertFile = db.prepare(
    `INSERT OR IGNORE INTO files (user_id, kind, filename, original_name, mime_type, size, url)
     VALUES (?, 'image', ?, ?, ?, ?, ?)`
  );
  const items = req.files.map(f => {
    const url = `/uploads/${req.user.id}/${f.filename}`;
    const info = insertImg.run(req.user.id, f.filename, f.originalname, f.size, url);
    insertFile.run(req.user.id, f.filename, f.originalname, f.mimetype || 'image/jpeg', f.size, url);
    return {
      id: info.lastInsertRowid,
      url,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      markdown: `![${f.originalname}](${url})`
    };
  });
  res.status(201).json({ items });
});

// 获取用户的图片列表（从 files 表读取，仅 kind=image）
router.get('/images', (req, res) => {
  const rows = db.prepare(
    `SELECT id, kind, filename, original_name, mime_type, size, url, created_at
     FROM files WHERE user_id = ? AND kind = 'image' ORDER BY created_at DESC`
  ).all(req.user.id);
  res.json({ items: rows });
});

// 删除图片（同时清理 images 表与 files 表 + 物理文件）
router.delete('/images/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  // 从 images 找（兼容旧 ID）
  let row = db.prepare('SELECT * FROM images WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) {
    row = db.prepare("SELECT * FROM files WHERE id = ? AND user_id = ? AND kind = 'image'").get(id, req.user.id);
  }
  if (!row) return res.status(404).json({ error: '图片不存在' });

  // 物理删除：尝试两个位置（USER_ID/images/ 与 USER_ID/）
  const candidates = [
    path.join(getRuntimeUploadDir(), String(req.user.id), 'images', row.filename),
    path.join(getRuntimeUploadDir(), String(req.user.id), row.filename)
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (e) { console.error('删除文件失败', e.message); }
    }
  }
  db.prepare('DELETE FROM images WHERE id = ?').run(id);
  db.prepare("DELETE FROM files WHERE id = ? AND kind = 'image'").run(id);
  res.json({ message: '已删除' });
});

// ============ PDF 上传与服务 ============

// 鉴权下载文件原始内容（用于文本/文档/其他需要鉴权访问的 kind）
// 路径：GET /api/upload/file/:id/raw
// 注意：必须放在通用 /uploads 静态服务之前，因为通用服务不做鉴权
router.get('/file/:id/raw', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  // 物理文件位置
  const { subdir } = classifyFile(row.original_name || row.filename);
  const runtimeDir = getRuntimeUploadDir();
  const defaultDir = DEFAULT_UPLOAD_DIR;
  const baseDirs = runtimeDir === defaultDir ? [runtimeDir] : [runtimeDir, defaultDir];
  let filePath = null;
  for (const base of baseDirs) {
    const p = path.join(base, String(req.user.id), subdir, row.filename);
    if (fs.existsSync(p)) { filePath = p; break; }
    // 兼容旧版直存
    const legacy = path.join(base, String(req.user.id), row.filename);
    if (fs.existsSync(legacy)) { filePath = legacy; break; }
  }
  if (!filePath) return res.status(404).json({ error: '物理文件不存在' });
  const stat = fs.statSync(filePath);
  // 设置合适的 Content-Type
  let contentType = row.mime_type || 'application/octet-stream';
  if (row.kind === 'text' && !row.mime_type) {
    const ext = path.extname(row.original_name || row.filename).toLowerCase();
    const textTypes = {
      '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
      '.json': 'application/json', '.xml': 'application/xml', '.md': 'text/markdown',
      '.csv': 'text/csv', '.txt': 'text/plain'
    };
    if (textTypes[ext]) contentType = textTypes[ext] + '; charset=utf-8';
    else contentType = 'text/plain; charset=utf-8';
  }
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'private, max-age=300');
  fs.createReadStream(filePath).pipe(res);
});

// 读取文本文件内容（仅 text 类型；自动检测编码）
// GET /api/upload/file/:id/text
router.get('/file/:id/text', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  if (row.kind !== 'text') return res.status(400).json({ error: '此接口仅用于文本文件' });
  const { subdir } = classifyFile(row.original_name || row.filename);
  const runtimeDir = getRuntimeUploadDir();
  const defaultDir = DEFAULT_UPLOAD_DIR;
  const baseDirs = runtimeDir === defaultDir ? [runtimeDir] : [runtimeDir, defaultDir];
  let filePath = null;
  for (const base of baseDirs) {
    const p = path.join(base, String(req.user.id), subdir, row.filename);
    if (fs.existsSync(p)) { filePath = p; break; }
    const legacy = path.join(base, String(req.user.id), row.filename);
    if (fs.existsSync(legacy)) { filePath = legacy; break; }
  }
  if (!filePath) return res.status(404).json({ error: '物理文件不存在' });
  // 文件大小限制（2MB），避免大文件超时
  const stat = fs.statSync(filePath);
  if (stat.size > 2 * 1024 * 1024) {
    return res.status(413).json({ error: '文本文件过大（>2MB），请直接下载' });
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ content, size: stat.size, filename: row.original_name || row.filename });
});

// 保存文本文件内容（仅 text 类型）
// PATCH /api/upload/file/:id/text
router.patch('/file/:id/text', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: '参数错误' });
  const { content } = req.body || {};
  if (typeof content !== 'string') return res.status(400).json({ error: 'content 必须是字符串' });
  const row = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '文件不存在' });
  if (row.kind !== 'text') return res.status(400).json({ error: '此接口仅用于文本文件' });
  const { subdir } = classifyFile(row.original_name || row.filename);
  const userDir = path.join(getRuntimeUploadDir(), String(req.user.id), subdir);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
  const filePath = path.join(userDir, row.filename);
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    // 更新 size
    const newSize = Buffer.byteLength(content, 'utf-8');
    db.prepare('UPDATE files SET size = ? WHERE id = ?').run(newSize, id);
    res.json({ message: '已保存', size: newSize });
  } catch (e) {
    res.status(500).json({ error: '保存失败：' + e.message });
  }
});

// 上传 PDF（同时写入 files 表，返回 url 与原始文件名）
router.post('/pdf', pdfUpload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未接收到 PDF 文件' });
  try {
    checkStorage(req.user, req.file.size);
  } catch (e) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: e.message });
  }
  // 写入 files 表
  const url = `/api/upload/pdf/${req.file.filename}`;
  db.prepare(
    `INSERT OR IGNORE INTO files (user_id, kind, filename, original_name, mime_type, size, url)
     VALUES (?, 'pdf', ?, ?, 'application/pdf', ?, ?)`
  ).run(req.user.id, req.file.filename, req.file.originalname, req.file.size, url);
  res.status(201).json({
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// PDF 文件服务（带鉴权 + 范围请求支持）
// 注意：必须放在通用 /uploads 静态服务之前，因为通用服务不做鉴权
// 同时回退到默认目录：应对存储位置切换后旧文件残留
router.get('/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  // 防路径穿越
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: '无效的文件名' });
  }
  const runtimeDir = getRuntimeUploadDir();
  const defaultDir = DEFAULT_UPLOAD_DIR;
  const baseDirs = runtimeDir === defaultDir ? [runtimeDir] : [runtimeDir, defaultDir];
  let filePath = null;
  for (const base of baseDirs) {
    const p = path.join(base, String(req.user.id), 'pdf', filename);
    if (fs.existsSync(p)) { filePath = p; break; }
  }
  if (!filePath) return res.status(404).json({ error: '文件不存在' });
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'private, max-age=300');
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10) || 0;
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunksize);
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Length', fileSize);
    fs.createReadStream(filePath).pipe(res);
  }
});

module.exports = router;

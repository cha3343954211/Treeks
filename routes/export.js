const express = require('express');
const path = require('path');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const exportService = require('../services/exportService');
const { ZipArchive } = require('archiver');

const router = express.Router();

// 创建 zip 归档（兼容 archiver v8 API）
function createZip() {
  return new ZipArchive({ zlib: { level: 6 } });
}

// 注意：不使用 router.use(authRequired)，避免对其他 diaries 路由造成双重鉴权
// 每个路由单独挂载 authRequired

// 解析 tags 字符串 <-> 数组
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  try { return JSON.parse(tagsStr); } catch { return []; }
}

// 安全文件名
function safeFilename(name) {
  return String(name || '').replace(/[\\/:*?"<>|\r\n\t]/g, '_').slice(0, 80).trim() || 'diary';
}

// 获取用户自己的日记（单篇）
function getUserDiary(id, userId) {
  const row = db.prepare('SELECT * FROM diaries WHERE id = ? AND user_id = ?').get(id, userId);
  if (!row) return null;
  return { ...row, tags: parseTags(row.tags), is_pinned: !!row.is_pinned, is_public: !!row.is_public };
}

// 获取用户自己的多篇日记
function getUserDiaries(ids, userId) {
  if (!ids || !ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT * FROM diaries WHERE id IN (${placeholders}) AND user_id = ? ORDER BY created_at DESC`
  ).all(...ids, userId);
  return rows.map(r => ({ ...r, tags: parseTags(r.tags), is_pinned: !!r.is_pinned, is_public: !!r.is_public }));
}

// 获取用户信息
function getUser(userId) {
  return db.prepare('SELECT id, username, nickname FROM users WHERE id = ?').get(userId);
}

// ============ 模板列表 ============
router.get('/templates', authRequired, (req, res) => {
  const templates = exportService.listTemplates();
  res.json({ templates });
});

// ============ 用户数据导出 / 导入 ============
const dataTransfer = require('../services/dataTransfer');
const multer = require('multer');
const userImportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// 导出当前用户的所有数据（日记、图片元数据、日程）为 JSON 或 ZIP
router.get('/user-data/export', authRequired, (req, res) => {
  try {
    const { images = '0' } = req.query;
    const includeImages = images === '1' || images === 'true';
    const data = dataTransfer.exportUserData(req.user.id);
    const user = getUser(req.user.id);
    const safeName = (user.nickname || user.username || 'user').replace(/[\\/:*?"<>|]/g, '_');

    if (includeImages) {
      const zipName = `treeks-${safeName}-${new Date().toISOString().slice(0, 10)}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"; filename*=UTF-8''${encodeURIComponent(zipName)}`);
      const archive = dataTransfer.buildExportZip(data, true);
      archive.on('error', err => {
        console.error('[User Export Error]', err);
        if (!res.headersSent) res.status(500).json({ error: '打包失败' });
      });
      res.on('close', () => { archive.destroy(); });
      archive.pipe(res);
      archive.finalize();
    } else {
      const fileName = `treeks-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
      res.json(data);
    }
  } catch (e) {
    console.error('[User Export Error]', e);
    // 不向客户端泄露内部错误细节（防信息泄露，与全局错误中间件策略一致）
    res.status(500).json({ error: '导出失败，请稍后重试' });
  }
});

// 导入用户数据（合并到当前用户名下）
router.post('/user-data/import', authRequired, userImportUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请上传 JSON 文件' });
    const data = dataTransfer.parseImportFile(req.file.buffer);

    if (data.meta.type !== 'user') {
      return res.status(400).json({ error: '上传文件不是用户数据格式（平台数据请由管理员导入）' });
    }

    const skipDuplicate = req.body.skipDuplicate !== '0' && req.body.skipDuplicate !== 'false';
    const importImageMeta = req.body.importImageMeta === '1' || req.body.importImageMeta === 'true';

    const result = dataTransfer.importUserData(req.user.id, data, { skipDuplicate, importImageMeta });
    res.json({ message: '导入完成', result });
  } catch (e) {
    console.error('[User Import Error]', e);
    res.status(500).json({ error: '导入失败，请检查文件格式' });
  }
});

// 导入预览（仅返回统计，不实际写入）
router.post('/user-data/preview', authRequired, userImportUpload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请上传 JSON 文件' });
    const data = dataTransfer.parseImportFile(req.file.buffer);
    res.json({
      meta: data.meta,
      sampleDiaries: (data.diaries || []).slice(0, 3).map(d => ({ title: d.title, created_at: d.created_at }))
    });
  } catch (e) {
    console.error('[Import Preview Error]', e);
    res.status(500).json({ error: '预览失败，请检查文件格式' });
  }
});

// ============ 单篇导出 MD ============
router.get('/:id/export.md', authRequired, (req, res) => {
  const diary = getUserDiary(req.params.id, req.user.id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });

  const user = getUser(req.user.id);
  const author = user ? (user.nickname || user.username) : '';
  const tags = (diary.tags || []).join(', ');

  const md = `# ${diary.title || '无标题'}

> 作者：${author}
> 日期：${(diary.created_at || '').replace('T', ' ').slice(0, 16)}${diary.mood ? `  \n> 心情：${diary.mood}` : ''}${diary.weather ? `  \n> 天气：${diary.weather}` : ''}${tags ? `  \n> 标签：${tags}` : ''}

---

${diary.content || ''}

<!-- 导出于 ${new Date().toLocaleString('zh-CN')} · Treeks -->
`;

  const filename = safeFilename(diary.title || 'diary') + '.md';
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.send(md);
});

// ============ 单篇导出 PDF ============
router.get('/:id/export.pdf', authRequired, async (req, res) => {
  try {
    const diary = getUserDiary(req.params.id, req.user.id);
    if (!diary) return res.status(404).json({ error: '日记不存在' });

    const user = getUser(req.user.id);
    const templateId = req.query.template || 'default';
    const html = exportService.buildDiaryHtml(diary, user, templateId);
    const pdf = await exportService.htmlToPdf(html);

    const filename = safeFilename(diary.title || 'diary') + '.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.send(pdf);
  } catch (e) {
    console.error('[Export PDF Error]', e);
    res.status(500).json({ error: 'PDF 导出失败，请稍后重试' });
  }
});

// ============ 单篇预览 HTML（用于前端预览 PDF 模板效果） ============
router.get('/:id/export.html', authRequired, (req, res) => {
  const diary = getUserDiary(req.params.id, req.user.id);
  if (!diary) return res.status(404).json({ error: '日记不存在' });

  const user = getUser(req.user.id);
  const templateId = req.query.template || 'default';
  try {
    const html = exportService.buildDiaryHtml(diary, user, templateId);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    console.error('[Export HTML Error]', e);
    res.status(500).json({ error: '生成 HTML 失败，请稍后重试' });
  }
});

// ============ 批量导出 ============
// POST /api/diaries/export
// body: { ids: [1,2,3], format: 'md' | 'pdf' | 'pdf-merged', template: 'default' }
router.post('/export', authRequired, async (req, res) => {
  try {
    const { ids, format = 'md', template = 'default' } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: '请提供要导出的日记 ID 列表' });
    }
    if (ids.length > 100) {
      return res.status(400).json({ error: '一次最多导出 100 篇日记' });
    }

    const diaries = getUserDiaries(ids, req.user.id);
    if (diaries.length === 0) {
      return res.status(404).json({ error: '未找到可导出的日记' });
    }

    const user = getUser(req.user.id);

    if (format === 'md') {
      // 批量 MD：打包为 zip
      const archive = createZip();
      archive.on('error', err => {
        console.error('[Zip Error]', err);
        if (!res.headersSent) res.status(500).json({ error: '打包失败' });
      });

      const zipName = `diaries-${diaries.length}篇-${Date.now()}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"; filename*=UTF-8''${encodeURIComponent(zipName)}`);

      archive.pipe(res);
      // 客户端中途断开时销毁 archive，防止继续向已关闭的响应写入
      res.on('close', () => { try { archive.destroy(); } catch (_) {} });

      // 去重文件名
      const usedNames = new Set();
      const uniqueName = (base) => {
        let n = base, i = 1;
        while (usedNames.has(n + '.md')) {
          n = `${base}-${i++}`;
        }
        usedNames.add(n + '.md');
        return n + '.md';
      };

      diaries.forEach((d, idx) => {
        const author = user ? (user.nickname || user.username) : '';
        const tags = (d.tags || []).join(', ');
        const md = `# ${d.title || '无标题'}

> 作者：${author}  
> 日期：${(d.created_at || '').replace('T', ' ').slice(0, 16)}${d.mood ? `  \n> 心情：${d.mood}` : ''}${d.weather ? `  \n> 天气：${d.weather}` : ''}${tags ? `  \n> 标签：${tags}` : ''}

---

${d.content || ''}
`;
        const fname = uniqueName(safeFilename(d.title || `diary-${idx + 1}`));
        archive.append(md, { name: fname });
      });

      // 添加 README
      const readme = `# 导出说明

- 导出时间：${new Date().toLocaleString('zh-CN')}
- 日记数量：${diaries.length} 篇
- 导出用户：${user ? (user.nickname || user.username) : ''}
- 格式：Markdown (.md)

由 Treeks 导出
`;
      archive.append(readme, { name: 'README.md' });

      await archive.finalize();
      return;
    }

    if (format === 'pdf') {
      // 批量 PDF：每篇一个 PDF，打包为 zip
      const archive = createZip();
      archive.on('error', err => {
        console.error('[Zip Error]', err);
        if (!res.headersSent) res.status(500).json({ error: '打包失败' });
      });

      const zipName = `diaries-pdf-${diaries.length}篇-${Date.now()}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"; filename*=UTF-8''${encodeURIComponent(zipName)}`);

      archive.pipe(res);
      // 客户端中途断开时销毁 archive，防止继续向已关闭的响应写入
      res.on('close', () => { try { archive.destroy(); } catch (_) {} });

      const usedNames = new Set();
      const uniqueName = (base) => {
        let n = base, i = 1;
        while (usedNames.has(n + '.pdf')) {
          n = `${base}-${i++}`;
        }
        usedNames.add(n + '.pdf');
        return n + '.pdf';
      };

      for (let i = 0; i < diaries.length; i++) {
        const d = diaries[i];
        try {
          const html = exportService.buildDiaryHtml(d, user, template);
          const pdf = await exportService.htmlToPdf(html);
          // puppeteer 返回 Uint8Array，archiver 严格要求 Buffer
          const buf = Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
          const fname = uniqueName(safeFilename(d.title || `diary-${i + 1}`));
          archive.append(buf, { name: fname });
        } catch (e) {
          console.error('[Export PDF Error]', e);
        }
      }

      await archive.finalize();
      return;
    }

    if (format === 'pdf-merged') {
      // 批量 PDF 合并为单个 PDF
      const html = exportService.buildMultiDiaryHtml(diaries, user, template);
      const pdf = await exportService.htmlToPdf(html);

      const filename = `diaries-merged-${diaries.length}篇-${Date.now()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.send(pdf);
      return;
    }

    res.status(400).json({ error: '不支持的导出格式: ' + format });
  } catch (e) {
    console.error('[Batch Export Error]', e);
    if (!res.headersSent) res.status(500).json({ error: '批量导出失败，请稍后重试' });
  }
});

module.exports = router;

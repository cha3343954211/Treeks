const path = require('path');
const fs = require('fs');
const { db } = require('../db');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// 简易模板渲染（不引入 handlebars，自行实现 {{var}} / {{#if}} / {{#each}}）
function renderTemplate(tpl, data) {
  let html = tpl;

  // {{#each array}} ... {{/each}}
  html = html.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, name, body) => {
    const arr = data[name];
    if (!Array.isArray(arr)) return '';
    return arr.map(item => renderTemplate(body, { ...data, this: item })).join('');
  });

  // {{#if cond}} ... {{/if}}
  html = html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, name, body) => {
    return data[name] ? renderTemplate(body, data) : '';
  });

  // {{{unescaped}}}
  html = html.replace(/\{\{\{(\w+)\}\}\}/g, (_, name) => {
    const v = data[name];
    return v == null ? '' : String(v);
  });

  // {{escaped}}
  html = html.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    const v = data[name];
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(', ');
    return escapeHtml(String(v));
  });

  // {{this}} (在 each 循环中)
  html = html.replace(/\{\{this\}\}/g, () => {
    const v = data.this;
    return v == null ? '' : escapeHtml(String(v));
  });

  return html;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// 列出可用模板
function listTemplates() {
  const manifestPath = path.join(TEMPLATES_DIR, 'templates.json');
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return manifest;
  } catch (e) {
    return [];
  }
}

// 读取模板内容
function getTemplateContent(templateId) {
  const templates = listTemplates();
  const tpl = templates.find(t => t.id === templateId) || templates[0];
  if (!tpl) return null;
  const tplPath = path.join(TEMPLATES_DIR, tpl.file);
  if (!fs.existsSync(tplPath)) return null;
  return { content: fs.readFileSync(tplPath, 'utf8'), meta: tpl };
}

// 把相对/绝对 URL 转换为本地文件路径，便于 puppeteer 加载本地图片
function resolveImageUrl(src, baseUrl) {
  if (!src) return null;
  // /uploads/xxx.png
  if (src.startsWith('/uploads/')) {
    const filename = path.basename(src);
    const localPath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(localPath)) return localPath;
  }
  // http(s)://...
  if (/^https?:\/\//.test(src)) {
    // 跳过远程图片（puppeteer 会自行加载，但离线时可能失败）
    return null;
  }
  return null;
}

// 把日记内容中的本地图片 URL 转换为 file:// URL 或 base64 内嵌
function inlineLocalImages(html) {
  return html.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*)>/g, (match, pre, src, post) => {
    const localPath = resolveImageUrl(src, '');
    if (localPath) {
      try {
        const ext = path.extname(localPath).toLowerCase().replace('.', '');
        const mime = ext === 'jpg' ? 'jpeg' : (ext === 'svg' ? 'svg+xml' : ext);
        const b64 = fs.readFileSync(localPath).toString('base64');
        return `<img ${pre}src="data:image/${mime};base64,${b64}"${post}>`;
      } catch (e) {
        return match;
      }
    }
    return match;
  });
}

// 准备日记数据
function prepareDiaryData(diary, user) {
  let tags = diary.tags;
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { tags = []; }
  }
  tags = Array.isArray(tags) ? tags : [];

  // 简易日期格式化
  const created = diary.created_at || '';
  const dateStr = created.replace('T', ' ').slice(0, 16);

  return {
    title: diary.title || '无标题',
    author: user ? (user.nickname || user.username) : '',
    mood: diary.mood || '',
    weather: diary.weather || '',
    date: dateStr,
    tags,
    content: diary.content || '',
    exportDate: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  };
}

// Markdown 渲染 - 使用 marked
let markedInstance = null;
function getMarked() {
  if (!markedInstance) {
    const marked = require('marked');
    marked.setOptions({ breaks: true, gfm: true });
    markedInstance = marked;
  }
  return markedInstance;
}

function renderMarkdownToHtml(mdText) {
  try {
    return getMarked().parse(mdText || '');
  } catch (e) {
    return '<p>' + escapeHtml(mdText || '') + '</p>';
  }
}

// 生成单个日记的完整 HTML
function buildDiaryHtml(diary, user, templateId) {
  const tplInfo = getTemplateContent(templateId);
  if (!tplInfo) throw new Error('模板不存在');
  const data = prepareDiaryData(diary, user);
  data.content = inlineLocalImages(renderMarkdownToHtml(data.content));
  return renderTemplate(tplInfo.content, data);
}

// 生成多个日记合并的 HTML
function buildMultiDiaryHtml(diaries, user, templateId) {
  const tplInfo = getTemplateContent(templateId);
  if (!tplInfo) throw new Error('模板不存在');

  // 每个 diary 渲染为一节，节之间加分页符
  const sections = diaries.map((d, i) => {
    const data = prepareDiaryData(d, user);
    data.content = inlineLocalImages(renderMarkdownToHtml(data.content));
    const sectionHtml = renderTemplate(tplInfo.content, data);
    // 除最后一节外，添加分页符
    const pageBreak = i < diaries.length - 1 ? '<div style="page-break-after: always;"></div>' : '';
    return sectionHtml + pageBreak;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>日记合集</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body { margin: 0; padding: 0; font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; }
    .multi-section { page-break-after: always; }
    .multi-section:last-child { page-break-after: auto; }
  </style>
</head>
<body>
  ${sections}
</body>
</html>`;
}

// puppeteer 单例（避免每次启动浏览器）
let browserPromise = null;
async function getBrowser() {
  const puppeteer = require('puppeteer');
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none'
      ]
    });
  }
  return browserPromise;
}

// 关闭浏览器（用于进程退出清理）
async function closeBrowser() {
  if (browserPromise) {
    try {
      const browser = await browserPromise;
      await browser.close();
    } catch (e) {}
    browserPromise = null;
  }
}

process.on('exit', () => { closeBrowser(); });

// HTML -> PDF
async function htmlToPdf(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    // 给字体/图片一点额外时间
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true
    });
    // puppeteer 较新版本返回 Uint8Array，统一转换为 Buffer 便于 archiver/res.send 使用
    return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

module.exports = {
  listTemplates,
  getTemplateContent,
  buildDiaryHtml,
  buildMultiDiaryHtml,
  htmlToPdf,
  renderMarkdownToHtml,
  prepareDiaryData,
  closeBrowser
};

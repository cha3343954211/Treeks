const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { getRuntimeUploadDir } = require('./storageLocation');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
// 使用运行时配置的上传目录
function getUploadsDir() {
  return getRuntimeUploadDir();
}

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
  // /uploads/<uid>/<filename>
  if (src.startsWith('/uploads/')) {
    const relPath = src.slice('/uploads/'.length);
    const localPath = path.join(getUploadsDir(), relPath);
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

// KaTeX 单例（按需加载，避免未安装时崩溃）
let katexInstance = null;
function getKatex() {
  if (katexInstance === null) {
    try {
      katexInstance = require('katex');
    } catch (e) {
      console.warn('[Export] KaTeX 未安装，公式将以原始 LaTeX 文本输出:', e.message);
      katexInstance = false;
    }
  }
  return katexInstance || null;
}

// 在 Markdown 渲染前预处理 LaTeX 公式，与前端逻辑保持一致
function preprocessLatex(text) {
  const placeholders = [];
  const stash = (html) => {
    const key = '\u0000KATEX' + placeholders.length + '\u0000';
    placeholders.push(html);
    return key;
  };
  const renderKatex = (expr, displayMode) => {
    const katex = getKatex();
    if (!katex) {
      // 回退：保留原始 LaTeX 文本
      return escapeHtml('$' + (displayMode ? '$' : '') + expr + '$' + (displayMode ? '$' : ''));
    }
    try {
      return katex.renderToString(expr, {
        displayMode,
        throwOnError: true,
        output: 'html',
        strict: 'ignore'
      });
    } catch (e) {
      return '<span style="color:#c75450;">[公式错误: ' + escapeHtml(e.message) + ']</span>';
    }
  };

  // 块级公式 $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => stash(renderKatex(expr, true)));
  // 行内公式 $...$（避开 \$）
  text = text.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_, pre, expr) => pre + stash(renderKatex(expr, false)));

  return { text, placeholders };
}

function restoreLatexPlaceholders(html, placeholders) {
  placeholders.forEach((ph, i) => {
    html = html.replace('\u0000KATEX' + i + '\u0000', ph);
  });
  return html;
}

function renderMarkdownToHtml(mdText) {
  try {
    const { text, placeholders } = preprocessLatex(mdText || '');
    let html = getMarked().parse(text);
    html = restoreLatexPlaceholders(html, placeholders);
    return html;
  } catch (e) {
    return '<p>' + escapeHtml(mdText || '') + '</p>';
  }
}

// 注入 KaTeX CSS 到导出 HTML（用于 PDF 渲染时显示公式样式）
const KATEX_CSS_TAG = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">';
function injectKatexCss(html) {
  if (html.includes('katex.min.css')) return html; // 已注入
  // 在 </head> 之前注入；若无 head，则在 <body> 之前注入
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, KATEX_CSS_TAG + '</head>');
  }
  if (/<body/i.test(html)) {
    return html.replace(/<body/i, KATEX_CSS_TAG + '<body');
  }
  return KATEX_CSS_TAG + html;
}

// 生成单个日记的完整 HTML
function buildDiaryHtml(diary, user, templateId) {
  const tplInfo = getTemplateContent(templateId);
  if (!tplInfo) throw new Error('模板不存在');
  const data = prepareDiaryData(diary, user);
  data.content = inlineLocalImages(renderMarkdownToHtml(data.content));
  const html = renderTemplate(tplInfo.content, data);
  return injectKatexCss(html);
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
  <!-- Web 字体：跨平台保证中英文显示一致 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body {
      margin: 0;
      padding: 0;
      font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft YaHei UI", "Source Han Sans CN", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", "Heiti SC", sans-serif;
    }
    .multi-section { page-break-after: always; }
    .multi-section:last-child { page-break-after: auto; }
    .katex-display { margin: 1em 0; overflow-x: hidden; }
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
    // 使用 domcontentloaded 更快进入，再主动等待字体；
    // 模板里通常会引用 Google Fonts 之类的 web 字体，需要更长超时。
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 90000 });

    // 主动等待所有 @font-face 字体加载完成（最多 60s，避免网络抖动时永远卡住）
    try {
      await Promise.race([
        page.evaluate(() => document.fonts.ready),
        new Promise((_, reject) => setTimeout(() => reject(new Error('font-ready-timeout')), 60000))
      ]);
    } catch (e) {
      // 字体加载超时也不致命，让浏览器使用系统字体回退
      console.warn('[ExportPDF] 等待字体加载超时，将使用系统字体回退:', e.message);
    }

    // 额外等待 200ms 让字体子集被浏览器派发
    await new Promise(r => setTimeout(r, 200));

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

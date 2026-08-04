/* ===== Treeks 日记应用前端逻辑 ===== */

// ===== SVG 插画（空状态）=====
const ILLUSTRATIONS = {
  emptyList: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emptyGrad1" x1="50" y1="40" x2="150" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8fc391" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#4c995c" stop-opacity="0.15"/>
      </linearGradient>
      <linearGradient id="emptyGrad2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#6dbb7d"/>
        <stop offset="1" stop-color="#3b8a48"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#emptyGrad1)"/>
    <ellipse cx="100" cy="170" rx="60" ry="6" fill="#000" opacity="0.04"/>
    <path d="M70 60h60a8 8 0 0 1 8 8v72a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8z" fill="white" stroke="#d4e0d5" stroke-width="2"/>
    <line x1="76" y1="84" x2="124" y2="84" stroke="#8fc391" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="76" y1="100" x2="116" y2="100" stroke="#c5dec8" stroke-width="2" stroke-linecap="round"/>
    <line x1="76" y1="114" x2="110" y2="114" stroke="#c5dec8" stroke-width="2" stroke-linecap="round"/>
    <line x1="76" y1="128" x2="120" y2="128" stroke="#c5dec8" stroke-width="2" stroke-linecap="round"/>
    <g transform="translate(140 36)">
      <path d="M0 0c4-12 16-14 22-6s4 22-6 24-18-4-16-18z" fill="url(#emptyGrad2)"/>
      <path d="M11 4v22" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    </g>
    <g transform="translate(34 130) rotate(-25)">
      <path d="M0 0c3-9 12-10 17-4s3 17-5 18-14-3-12-14z" fill="#6dbb7d" opacity="0.7"/>
      <path d="M7 3v15" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    </g>
  </svg>`,
  emptyImage: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="imgGrad1" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8fc391" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#4c995c" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#imgGrad1)"/>
    <ellipse cx="100" cy="170" rx="60" ry="6" fill="#000" opacity="0.04"/>
    <rect x="50" y="60" width="100" height="80" rx="12" fill="white" stroke="#d4e0d5" stroke-width="2"/>
    <circle cx="80" cy="86" r="8" fill="#c5dec8"/>
    <path d="M58 134l28-28 18 18 14-14 24 24" stroke="#8fc391" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <g transform="translate(150 40) rotate(15)">
      <path d="M0 0c3-9 12-10 17-4s3 17-5 18-14-3-12-14z" fill="#6dbb7d" opacity="0.7"/>
    </g>
  </svg>`,
  emptyFilter: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="filterGrad1" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8fc391" stop-opacity="0.3"/>
        <stop offset="1" stop-color="#4c995c" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#filterGrad1)"/>
    <ellipse cx="100" cy="170" rx="60" ry="6" fill="#000" opacity="0.04"/>
    <circle cx="86" cy="92" r="28" fill="none" stroke="#8fc391" stroke-width="3"/>
    <line x1="108" y1="114" x2="138" y2="144" stroke="#8fc391" stroke-width="3" stroke-linecap="round"/>
    <path d="M76 92h20" stroke="#c5dec8" stroke-width="2" stroke-linecap="round"/>
    <path d="M81 86v12" stroke="#c5dec8" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  authDecoration: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="authGrad" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8fc391" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#4c995c" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#authGrad)"/>
    <ellipse cx="100" cy="170" rx="50" ry="5" fill="#000" opacity="0.05"/>
    <path d="M100 40L75 70h12l-8 18h18v32h6V88h18l-8-18h12L100 40z" fill="url(#authGrad)"/>
    <g transform="translate(40 130) rotate(-25)">
      <path d="M0 0c3-9 12-10 17-4s3 17-5 18-14-3-12-14z" fill="#6dbb7d" opacity="0.6"/>
      <path d="M7 3v15" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    </g>
    <g transform="translate(150 60) rotate(25)">
      <path d="M0 0c3-9 12-10 17-4s3 17-5 18-14-3-12-14z" fill="#8fc391" opacity="0.5"/>
    </g>
  </svg>`
};

// ===== Markdown 渲染 =====
if (window.marked) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });
}

function renderMarkdown(text) {
  if (!text) return '<p style="color:#999;font-style:italic;">预览区域为空，开始书写吧...</p>';
  // 依赖缺失时给出明确提示（CDN 被 SRI 拦截 / 网络失败 / 离线场景），
  // 而不是抛错落入通用"解析错误"
  if (!window.marked) {
    return '<p style="color:#c75450;">Markdown 渲染库（marked）未加载，请检查网络或刷新页面。</p>';
  }
  if (!window.DOMPurify) {
    return '<p style="color:#c75450;">安全过滤库（DOMPurify）未加载，已禁用预览以保障安全。</p>';
  }
  try {
    // 先抽取 LaTeX 公式占位，避免被 marked 当成普通文本处理（反斜杠转义、下划线等会破坏公式）
    const placeholders = [];
    const stash = (html) => {
      const key = '\u0000KATEX' + placeholders.length + '\u0000';
      placeholders.push(html);
      return key;
    };

    // 块级公式 $$...$$ （优先匹配，避免被行内规则吞掉）
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
      try {
        return stash(renderKatex(expr, true));
      } catch (e) {
        return stash('<span style="color:#c75450;">[公式错误: ' + escapeHtml(e.message) + ']</span>');
      }
    });

    // 行内公式 $...$（不匹配跨行、不匹配空内容；避开 \$ 转义）
    text = text.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_, pre, expr) => {
      try {
        return pre + stash(renderKatex(expr, false));
      } catch (e) {
        return pre + stash('<span style="color:#c75450;">[公式错误: ' + escapeHtml(e.message) + ']</span>');
      }
    });

    // 抽取 Mermaid 流程图占位（原始文本必须绕过 HTML 过滤，交由 mermaid 安全渲染）
    const mermaidBlocks = [];
    text = text.replace(/```mermaid\s*\n?([\s\S]*?)```/g, (_, code) => {
      const key = '\u0000MERMAID' + mermaidBlocks.length + '\u0000';
      mermaidBlocks.push(code.replace(/\n+$/, ''));
      return key;
    });

    let raw = marked.parse(text);

    // 还原公式占位
    placeholders.forEach((html, i) => {
      raw = raw.replace('\u0000KATEX' + i + '\u0000', html);
    });
    if (mermaidBlocks.length) {
      raw = raw.replace(/\u0000MERMAID(\d+)\u0000/g, (_, i) => `<pre class="mermaid">${escapeHtml(mermaidBlocks[+i])}</pre>`);
      scheduleMermaidRender();
    }

    return DOMPurify.sanitize(raw, {
      ADD_ATTR: ['target', 'controls', 'autoplay', 'loop'],
      ADD_TAGS: ['span', 'math', 'semantics', 'annotation', 'audio', 'source']
    });
  } catch (e) {
    return '<p style="color:#c75450;">Markdown 解析错误</p>';
  }
}

// 调用 KaTeX 渲染公式
function renderKatex(expr, displayMode) {
  if (!window.katex) return '<code>' + escapeHtml('$' + (displayMode ? '$' : '') + expr + '$' + (displayMode ? '$' : '') + '</code>');
  return window.katex.renderToString(expr, {
    displayMode,
    throwOnError: true,
    output: 'html',
    strict: 'warn',
    trust: false
  });
}

// Mermaid 渲染（防抖，避免连续输入频繁重建图表）
let mermaidRenderTimer = null;
function scheduleMermaidRender() {
  if (!window.mermaid) {
    // mermaid 以 defer 方式加载，可能晚于首帧渲染；等 load 后重试一次
    if (!window.__mermaidRetry) {
      window.__mermaidRetry = true;
      const tryLater = () => { window.__mermaidRetry = false; scheduleMermaidRender(); };
      if (document.readyState === 'complete') setTimeout(tryLater, 300);
      else window.addEventListener('load', tryLater, { once: true });
    }
    return;
  }
  clearTimeout(mermaidRenderTimer);
  mermaidRenderTimer = setTimeout(() => {
    const nodes = document.querySelectorAll('.mermaid');
    if (!nodes.length) return;
    try {
      const isDark = !!(document.documentElement.classList.contains('dark') || document.body.classList.contains('dark'));
      window.mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', securityLevel: 'strict' });
      window.mermaid.run({ nodes, suppressErrors: true });
    } catch (_) {}
  }, 150);
}

// 对已渲染的 HTML 进行代码高亮
function highlightCodeIn(container) {
  if (!window.hljs) return;
  container.querySelectorAll('pre code').forEach(block => {
    if (block.dataset.highlighted) return;
    try {
      hljs.highlightElement(block);
      block.dataset.highlighted = 'yes';
    } catch (e) {}
  });
}

// ===== 编辑/预览滚动跟随 =====
// split 模式下根据 textarea 滚动位置计算对应的预览滚动位置
let scrollSyncLock = false; // 防止双向触发死循环
function setupScrollSync() {
  const textarea = document.getElementById('editor-textarea');
  const previewPane = document.querySelector('.preview-pane');
  if (!textarea || !previewPane) return;

  const sync = (source, target) => {
    if (scrollSyncLock) return;
    const body = document.querySelector('.editor-body');
    if (!body || !body.classList.contains('mode-split')) return; // 仅 split 模式生效
    const srcMax = source.scrollHeight - source.clientHeight;
    const tgtMax = target.scrollHeight - target.clientHeight;
    if (srcMax <= 0 || tgtMax <= 0) return;
    const ratio = source.scrollTop / srcMax;
    scrollSyncLock = true;
    target.scrollTop = ratio * tgtMax;
    requestAnimationFrame(() => { scrollSyncLock = false; });
  };

  // 节流版 sync：用 rAF 合并同一帧内的多次 scroll 事件，避免与浏览器滚动渲染抢帧
  // passive: true 表示不调用 preventDefault，让浏览器在主线程之外即时滚动（提升流畅度）
  const scheduleSync = (source, target) => {
    if (source._syncRaf) return; // 已调度则跳过
    source._syncRaf = requestAnimationFrame(() => {
      source._syncRaf = 0;
      sync(source, target);
    });
  };
  textarea.addEventListener('scroll', () => scheduleSync(textarea, previewPane), { passive: true });
  previewPane.addEventListener('scroll', () => scheduleSync(previewPane, textarea), { passive: true });
}

// ===== 预览模式双击进入编辑 =====
function setupPreviewDblClick() {
  const preview = document.getElementById('editor-preview');
  if (!preview) return;
  preview.addEventListener('dblclick', (e) => {
    const body = document.querySelector('.editor-body');
    if (!body || !body.classList.contains('mode-preview')) return; // 仅 preview 模式
    // 标注模式下不允许双击进入编辑
    if (brushState.tool !== 'none') return;
    // 找到点击位置对应的 markdown 行：通过预览内元素的位置比例反推
    const textarea = document.getElementById('editor-textarea');
    const previewPane = document.querySelector('.preview-pane');
    if (!textarea || !previewPane) return;

    // 计算点击位置在预览中的比例
    const rect = previewPane.getBoundingClientRect();
    const y = e.clientY - rect.top + previewPane.scrollTop;
    const ratio = y / Math.max(1, previewPane.scrollHeight);
    const lines = textarea.value.split('\n');
    const targetLine = Math.floor(ratio * lines.length);
    // 计算目标行起始字符索引
    let pos = 0;
    for (let i = 0; i < targetLine && i < lines.length; i++) {
      pos += lines[i].length + 1;
    }

    // 切换到编辑模式
    document.querySelectorAll('#editor-mode-toggle .mode-btn').forEach(b => b.classList.remove('active'));
    const editBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="edit"]');
    if (editBtn) editBtn.classList.add('active');
    body.classList.remove('mode-preview');
    body.classList.add('mode-edit');
    // 退出预览模式全屏
    const viewEditor = document.getElementById('view-editor');
    if (viewEditor) viewEditor.classList.remove('preview-fullscreen');

    // 聚焦并定位光标
    requestAnimationFrame(() => {
      textarea.focus();
      try {
        textarea.setSelectionRange(pos, pos);
        // 滚动到光标位置
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 22;
        textarea.scrollTop = targetLine * lineHeight;
      } catch (err) {}
    });
  });
}

// ===== FAB 管理器：统一拖拽、位置持久化、默认避让 =====
const FabManager = (() => {
  const POS_PREFIX = 'treeks:fab-pos:';
  const registry = []; // 已注册的 FAB 列表 [{ fab, id, onClick }]

  // 读取持久化的位置
  function loadPos(id) {
    try {
      const raw = localStorage.getItem(POS_PREFIX + id);
      if (!raw) return null;
      const parts = raw.split(',');
      if (parts.length !== 2) return null;
      const left = parseFloat(parts[0]);
      const top = parseFloat(parts[1]);
      if (isNaN(left) || isNaN(top)) return null;
      return { left, top };
    } catch (e) { return null; }
  }

  // 持久化位置
  function savePos(id, left, top) {
    try { localStorage.setItem(POS_PREFIX + id, left + ',' + top); } catch (e) {}
  }

  // 清除持久化位置（重置到默认）
  function clearPos(id) {
    try { localStorage.removeItem(POS_PREFIX + id); } catch (e) {}
  }

  // 注册一个 FAB
  function register(fab, id, onClick) {
    if (!fab) return;
    registry.push({ fab, id, onClick });

    // 恢复持久化位置
    const saved = loadPos(id);
    if (saved) {
      // 限制在视口内（防止窗口缩小后位置不可见）
      const fabSize = fab.offsetWidth || 44;
      const left = Math.max(4, Math.min(window.innerWidth - fabSize - 4, saved.left));
      const top = Math.max(4, Math.min(window.innerHeight - fabSize - 4, saved.top));
      fab.style.left = left + 'px';
      fab.style.top = top + 'px';
    }

    // 绑定拖拽逻辑
    setupDrag(fab, () => {
      savePos(id, parseFloat(fab.style.left) || 0, parseFloat(fab.style.top) || 0);
      onClick && onClick();
    });
  }

  // 内部拖拽实现（短按触发 onClick，长按拖动改变位置）
  function setupDrag(fab, onPointerUp) {
    let dragState = {
      active: false,
      moved: false,
      startX: 0,
      startY: 0,
      originLeft: 0,
      originTop: 0
    };

    fab.addEventListener('pointerdown', (e) => {
      dragState.active = true;
      dragState.moved = false;
      dragState.startX = e.clientX;
      dragState.startY = e.clientY;
      // 读取当前位置：优先用 left，若为 auto（说明用 right 定位）则从 right 反算
      const cs = getComputedStyle(fab);
      let originLeft = parseFloat(cs.left);
      if (isNaN(originLeft)) {
        const rightVal = parseFloat(cs.right) || 0;
        const fabSize = fab.offsetWidth || 44;
        originLeft = window.innerWidth - rightVal - fabSize;
      }
      dragState.originLeft = originLeft;
      dragState.originTop = parseFloat(cs.top) || 0;
      fab.setPointerCapture && fab.setPointerCapture(e.pointerId);
    });

    fab.addEventListener('pointermove', (e) => {
      if (!dragState.active) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      // 移动超过 4px 视为拖拽
      if (!dragState.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        dragState.moved = true;
        fab.classList.add('dragging');
        // 拖拽开始时切到 fixed 定位 + 显式 left/top
        fab.style.left = dragState.originLeft + 'px';
        fab.style.top = dragState.originTop + 'px';
        // 清除 right 定位，避免与 left 冲突
        fab.style.right = 'auto';
      }
      if (dragState.moved) {
        let newLeft = dragState.originLeft + dx;
        let newTop = dragState.originTop + dy;
        // 限制在视口内
        const fabSize = fab.offsetWidth || 44;
        newLeft = Math.max(4, Math.min(window.innerWidth - fabSize - 4, newLeft));
        newTop = Math.max(4, Math.min(window.innerHeight - fabSize - 4, newTop));
        fab.style.left = newLeft + 'px';
        fab.style.top = newTop + 'px';
      }
    });

    const endDrag = (e) => {
      if (!dragState.active) return;
      dragState.active = false;
      fab.classList.remove('dragging');
      if (fab.releasePointerCapture && e && e.pointerId) {
        try { fab.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      // 未拖动则视为点击
      if (!dragState.moved) {
        onPointerUp && onPointerUp();
      } else {
        // 拖拽结束也触发回调（用于保存位置）
        onPointerUp && onPointerUp();
      }
    };

    fab.addEventListener('pointerup', endDrag);
    fab.addEventListener('pointercancel', endDrag);
  }

  // 窗口尺寸变化时，重新限制所有 FAB 位置在视口内
  window.addEventListener('resize', () => {
    registry.forEach(({ fab, id }) => {
      const cs = getComputedStyle(fab);
      let left = parseFloat(cs.left);
      if (isNaN(left)) return; // 未拖拽过，使用 CSS 默认位置，无需调整
      const top = parseFloat(cs.top) || 0;
      const fabSize = fab.offsetWidth || 44;
      const newLeft = Math.max(4, Math.min(window.innerWidth - fabSize - 4, left));
      const newTop = Math.max(4, Math.min(window.innerHeight - fabSize - 4, top));
      fab.style.left = newLeft + 'px';
      fab.style.top = newTop + 'px';
      savePos(id, newLeft, newTop);
    });
  });

  return { register, loadPos, savePos, clearPos };
})();

// ===== 预览模式笔刷标注功能 =====
// 笔刷状态
const brushState = {
  tool: 'none',           // 'none' | 'highlight' | 'pen' | 'annotate' | 'text' | 'rect' | 'ellipse' | 'eraser' | 'lasso'
  color: '#ffeb3b',       // 当前颜色
  size: 6,                // 笔刷粗细
  opacity: 1,             // 不透明度 0-1（荧光笔自动切换为 0.45）
  drawing: false,         // 是否正在绘制
  currentPath: null,      // 当前绘制的 SVG 元素
  points: [],             // 当前路径的点
  startPoint: null,       // 讲解笔 / 矩形 / 椭圆起点
  annotateTempEl: null,   // 临时元素（预览线段/形状）
  paths: [],              // 已绘制的所有路径 [{ id, type, color, size, points, opacity, text }]
  undoStack: [],          // 撤销栈（用于 redo）
  redoStack: [],          // 重做栈
  textInput: null,        // 当前文本输入框（HTML element）
  draggingAnno: null,     // 正在拖动的标注 id（文本拖动用）
  dragOffset: null,       // 拖动偏移量
  diaryId: null,          // 当前日记 ID（用于保存到 localStorage）
  // 橡皮相关
  eraserMode: 'stroke',   // 'stroke' 笔画橡皮擦（整笔擦除）| 'pixel' 精细橡皮擦（仅擦除经过区域）
  eraserRadius: 20,       // 精细橡皮擦半径
  eraserPath: [],         // 精细橡皮擦当前拖动轨迹
  // 套索相关
  lassoPath: [],          // 套索当前拖动轨迹
  selectedIds: [],        // 套索选中的标注 id
  lassoDragging: false    // 是否正在套索拖动
};

const ANNOTATION_STORAGE_PREFIX = 'treeks_annotations_';

// 获取标注数据的 localStorage key
function annotationStorageKey(diaryId) {
  if (!diaryId) return null;
  return ANNOTATION_STORAGE_PREFIX + diaryId;
}

// 从 localStorage 加载标注
// 返回原始结构：数组（Markdown 单层标注）或对象（PDF 按页标注），无数据时返回 null
function loadAnnotations(diaryId) {
  if (!diaryId) return null;
  const key = annotationStorageKey(diaryId);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return (Array.isArray(data) || (data && typeof data === 'object')) ? data : null;
  } catch (e) {
    console.warn('[Annotation] 加载失败:', e.message);
    return null;
  }
}

// 保存标注到 localStorage
function saveAnnotationsToStorage(diaryId, paths) {
  if (!diaryId) return false;
  const key = annotationStorageKey(diaryId);
  if (!key) return false;
  try {
    localStorage.setItem(key, JSON.stringify(paths));
    return true;
  } catch (e) {
    console.error('[Annotation] 保存失败:', e.message);
    return false;
  }
}

// 将十六进制颜色转为 rgba
function hexToRgba(hex, alpha) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ⚡ 归一化相对坐标计算（解决双栏分栏模式、屏幕缩放、窗口改变下的标注偏移难题）
function getSvgPoint(evt) {
  const wrapper = document.getElementById('preview-content-wrapper');
  const w = (wrapper && wrapper.clientWidth) || 800;
  const h = (wrapper && wrapper.clientHeight) || 600;

  let x = 0, y = 0;
  if (brushState.cachedBounds) {
    x = evt.clientX - brushState.cachedBounds.left;
    y = evt.clientY - brushState.cachedBounds.top;
  } else {
    const svg = document.getElementById('annotation-layer');
    if (svg) {
      const rect = svg.getBoundingClientRect();
      x = evt.clientX - rect.left;
      y = evt.clientY - rect.top;
    }
  }

  return {
    x: x,
    y: y,
    relX: w > 0 ? x / w : 0,
    relY: h > 0 ? y / h : 0
  };
}

// 根据相对比例坐标与当前容器实时宽高，精准还原绝对像素坐标
function getAbsPoint(pt, wrapperW, wrapperH) {
  if (!pt) return { x: 0, y: 0 };
  if (pt.relX !== undefined && pt.relY !== undefined && wrapperW > 0 && wrapperH > 0) {
    return {
      x: pt.relX * wrapperW,
      y: pt.relY * wrapperH
    };
  }
  return { x: pt.x || 0, y: pt.y || 0 };
}

// 创建 SVG 元素辅助函数
function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) {
    for (const k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
  }
  return el;
}

// GoodNotes 级别二次贝塞尔 Spline 平滑算法（把折线 polyline 提升为曲线 path d="M... Q..."，支持双栏归一化像素映射）
function generateSmoothSvgPath(pts, wrapperW, wrapperH) {
  if (!pts || pts.length === 0) return '';
  const p0 = getAbsPoint(pts[0], wrapperW, wrapperH);
  if (pts.length === 1) {
    return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`;
  }
  const p1 = getAbsPoint(pts[1], wrapperW, wrapperH);
  if (pts.length === 2) {
    return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  let str = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const curr = getAbsPoint(pts[i], wrapperW, wrapperH);
    const next = getAbsPoint(pts[i + 1], wrapperW, wrapperH);
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    str += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = getAbsPoint(pts[pts.length - 1], wrapperW, wrapperH);
  str += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return str;
}

// 根据笔刷类型创建路径元素
function createBrushElement(type, color, size, points, opacity, text) {
  if (!points || points.length === 0) return null;
  const op = (opacity === undefined || opacity === null || isNaN(opacity)) ? 1 : Math.max(0, Math.min(1, opacity));
  const wrapper = document.getElementById('preview-content-wrapper');
  const w = (wrapper && wrapper.clientWidth) || 800;
  const h = (wrapper && wrapper.clientHeight) || 600;

  if (type === 'annotate') {
    if (points.length < 2) return null;
    const start = getAbsPoint(points[0], w, h);
    const end = getAbsPoint(points[points.length - 1], w, h);
    const g = svgEl('g', {
      'data-brush': 'annotate',
      'data-color': color,
      'data-size': size,
      'opacity': op
    });
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowLen = Math.max(10, size * 3);
    const lineEndX = end.x - arrowLen * 0.55 * Math.cos(angle);
    const lineEndY = end.y - arrowLen * 0.55 * Math.sin(angle);
    const line = svgEl('line', {
      x1: start.x, y1: start.y,
      x2: lineEndX, y2: lineEndY,
      stroke: color,
      'stroke-width': size,
      'stroke-linecap': 'round',
      fill: 'none'
    });
    g.appendChild(line);
    const arrowHalfWidth = Math.max(6, size * 1.8);
    const arrowAngle = Math.PI / 7;
    const baseX = end.x - arrowLen * Math.cos(angle);
    const baseY = end.y - arrowLen * Math.sin(angle);
    const x1 = baseX - arrowHalfWidth * Math.cos(angle - arrowAngle);
    const y1 = baseY - arrowHalfWidth * Math.sin(angle - arrowAngle);
    const x2 = baseX - arrowHalfWidth * Math.cos(angle + arrowAngle);
    const y2 = baseY - arrowHalfWidth * Math.sin(angle + arrowAngle);
    const arrow = svgEl('polygon', {
      points: `${end.x},${end.y} ${x1},${y1} ${x2},${y2}`,
      fill: color,
      stroke: color,
      'stroke-width': Math.max(1, size * 0.3),
      'stroke-linejoin': 'round'
    });
    g.appendChild(arrow);
    return g;
  }

  if (type === 'text') {
    const p = getAbsPoint(points[0], w, h);
    const fontSize = Math.max(12, size * 2.5);
    const textEl = svgEl('text', {
      x: p.x,
      y: p.y,
      'font-size': fontSize,
      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
      'font-weight': '600',
      fill: color,
      'fill-opacity': op,
      'data-brush': 'text',
      'data-color': color,
      'data-size': size
    });
    textEl.textContent = text || '';
    return textEl;
  }

  if (type === 'rect') {
    if (points.length < 2) return null;
    const a = getAbsPoint(points[0], w, h);
    const b = getAbsPoint(points[points.length - 1], w, h);
    const rx = Math.min(a.x, b.x);
    const ry = Math.min(a.y, b.y);
    const rw = Math.max(1, Math.abs(b.x - a.x));
    const rh = Math.max(1, Math.abs(b.y - a.y));
    return svgEl('rect', {
      x: rx, y: ry, width: rw, height: rh,
      rx: Math.max(2, size * 0.3),
      ry: Math.max(2, size * 0.3),
      fill: hexToRgba(color, op * 0.18),
      stroke: color,
      'stroke-width': Math.max(2, size * 0.6),
      'stroke-opacity': op,
      'stroke-linejoin': 'round',
      'data-brush': 'rect',
      'data-color': color,
      'data-size': size
    });
  }

  if (type === 'ellipse') {
    if (points.length < 2) return null;
    const a = getAbsPoint(points[0], w, h);
    const b = getAbsPoint(points[points.length - 1], w, h);
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const erx = Math.max(1, Math.abs(b.x - a.x) / 2);
    const ery = Math.max(1, Math.abs(b.y - a.y) / 2);
    return svgEl('ellipse', {
      cx: cx, cy: cy, rx: erx, ry: ery,
      fill: hexToRgba(color, op * 0.18),
      stroke: color,
      'stroke-width': Math.max(2, size * 0.6),
      'stroke-opacity': op,
      'data-brush': 'ellipse',
      'data-color': color,
      'data-size': size
    });
  }

  // 荧光笔 / 钢笔：使用 GoodNotes 二次贝塞尔 Spline 平滑曲线绘制（传入 w, h 支持双栏归一化映射）
  const isHighlight = type === 'highlight';
  const strokeColor = color;
  const strokeWidth = isHighlight ? Math.max(size, 10) * 1.8 : size;
  const pathD = generateSmoothSvgPath(points, w, h);
  
  const attrs = {
    d: pathD,
    fill: 'none',
    stroke: strokeColor,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-opacity': isHighlight ? (0.45 * op) : op,
    'data-brush': type,
    'data-color': color,
    'data-size': size
  };

  const pathEl = svgEl('path', attrs);
  if (isHighlight) {
    const isDark = document.documentElement.getAttribute('data-mode') === 'dark';
    if (!isDark) pathEl.style.mixBlendMode = 'multiply';
  }
  return pathEl;
}

// 渲染所有路径到 SVG 层
function renderAllAnnotations() {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;
  // 清空现有内容（保留属性）
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  for (const p of brushState.paths) {
    const el = createBrushElement(p.type, p.color, p.size, p.points, p.opacity, p.text);
    if (el) {
      el.setAttribute('data-anno-id', p.id);
      svg.appendChild(el);
    }
  }
  // 重新绘制选区高亮
  renderSelectionOverlay();
}

// 重新计算 SVG 尺寸（不使用 viewBox，坐标 1:1 映射到像素，避免偏移）
function resizeAnnotationLayer() {
  const svg = document.getElementById('annotation-layer');
  const wrapper = document.getElementById('preview-content-wrapper');
  if (!svg || !wrapper) return;
  // PDF 模式：让 SVG 与 PDF canvas 大小完全一致，并覆盖在 canvas 上
  // 这样笔刷坐标才能与 PDF 页面像素精准对应
  if (pdfState.active && pdfState.pdfDoc) {
    const canvas = document.getElementById('pdf-canvas');
    if (canvas) {
      const cRect = canvas.getBoundingClientRect();
      const wRect = wrapper.getBoundingClientRect();
      const offsetLeft = cRect.left - wRect.left;
      const offsetTop = cRect.top - wRect.top;
      svg.style.left = offsetLeft + 'px';
      svg.style.top = offsetTop + 'px';
      svg.setAttribute('width', cRect.width);
      svg.setAttribute('height', cRect.height);
      svg.removeAttribute('viewBox');
      svg.removeAttribute('preserveAspectRatio');
      return;
    }
  }
  // 默认（Markdown 模式）：SVG 覆盖整个 wrapper
  svg.style.left = '';
  svg.style.top = '';
  const rect = wrapper.getBoundingClientRect();
  // 显式设置 width/height，确保 SVG 坐标系与像素 1:1 对应
  svg.setAttribute('width', rect.width);
  svg.setAttribute('height', rect.height);
  // 移除 viewBox，避免缩放导致的坐标偏移
  svg.removeAttribute('viewBox');
  svg.removeAttribute('preserveAspectRatio');
}

// 设置当前笔刷工具
function setBrushTool(tool) {
  brushState.tool = tool;
  const svg = document.getElementById('annotation-layer');
  const previewPane = document.querySelector('.preview-pane');
  if (!svg || !previewPane) return;

  // 更新按钮激活状态
  document.querySelectorAll('.brush-btn[data-brush]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.brush === tool);
  });

  // 荧光笔自动切换为半透明；其他绘制工具恢复不透明（用户手动调整后保持不变）
  if (tool === 'highlight' && brushState.opacity === 1) {
    setBrushOpacity(0.45);
  } else if (tool !== 'highlight' && tool !== 'none' && brushState.opacity === 0.45) {
    setBrushOpacity(1);
  }

  // 重置光标类
  svg.classList.remove('eraser-mode', 'eraser-stroke-mode', 'eraser-pixel-mode',
                       'text-mode', 'shape-mode', 'lasso-mode', 'lasso-selected');
  if (tool === 'none') {
    svg.style.pointerEvents = 'none';
    svg.classList.remove('active');
    previewPane.classList.remove('annotate-active');
  } else {
    svg.style.pointerEvents = 'auto';
    svg.classList.add('active');
    previewPane.classList.add('annotate-active');
    if (tool === 'eraser') {
      if (brushState.eraserMode === 'pixel') {
        svg.classList.add('eraser-mode', 'eraser-pixel-mode');
      } else {
        svg.classList.add('eraser-mode', 'eraser-stroke-mode');
      }
    } else if (tool === 'lasso') {
      svg.classList.add('lasso-mode');
    } else if (tool === 'text') {
      svg.classList.add('text-mode');
    } else if (tool === 'rect' || tool === 'ellipse') {
      svg.classList.add('shape-mode');
    }
  }

  // 切换工具时提交未完成的文本输入
  if (tool !== 'text' && brushState.textInput) {
    commitTextInput();
  }

  // 工具栏橡皮半径滑块仅在精细橡皮擦时显示
  const radiusWrap = document.getElementById('brush-eraser-radius');
  if (radiusWrap) {
    radiusWrap.style.display = (tool === 'eraser' && brushState.eraserMode === 'pixel') ? 'inline-flex' : 'none';
  }
  // 橡皮工具组高亮：选中橡皮时整个工具组轻微底色
  const eraserGroup = document.getElementById('brush-eraser-group');
  if (eraserGroup) {
    eraserGroup.classList.toggle('eraser-active', tool === 'eraser');
  }
}

// 设置笔刷颜色
function setBrushColor(color) {
  brushState.color = color;
  const swatch = document.getElementById('brush-color-swatch');
  const input = document.getElementById('brush-color-input');
  if (swatch) swatch.style.background = color;
  if (input) input.value = color;
}

// 设置笔刷粗细
function setBrushSize(size) {
  brushState.size = parseInt(size, 10) || 6;
  const valueEl = document.getElementById('brush-size-value');
  if (valueEl) valueEl.textContent = brushState.size;
}

// 设置笔刷不透明度（0-1）
function setBrushOpacity(op) {
  brushState.opacity = Math.max(0, Math.min(1, parseFloat(op) || 0));
  const slider = document.getElementById('brush-opacity-input');
  const valueEl = document.getElementById('brush-opacity-value');
  const pct = Math.round(brushState.opacity * 100);
  if (slider) slider.value = pct;
  if (valueEl) valueEl.textContent = pct + '%';
}

// 记录一次可撤销/可重做的笔刷操作
function pushBrushAction(action) {
  brushState.undoStack.push(action);
  brushState.redoStack = [];
}

// 撤销上一步（新增/删除/精细擦除）
function undoAnnotation() {
  if (brushState.undoStack.length === 0) {
    toast('没有可撤销的标记', 'error');
    return;
  }
  const action = brushState.undoStack.pop();
  if (action.type === 'add') {
    // 撤销新增：移除该次新增的标注
    brushState.paths = brushState.paths.filter(p => !action.items.some(it => it.id === p.id));
  } else if (action.type === 'remove') {
    // 撤销删除：恢复被删标注
    brushState.paths = brushState.paths.concat(action.items);
  } else if (action.type === 'replace') {
    // 撤销精细擦除：恢复擦除前的完整 paths
    brushState.paths = action.before;
  }
  brushState.redoStack.push(action);
  renderAllAnnotations();
  toast('已撤销，可点重做恢复', 'info');
}

// 重做（撤销的逆操作）
function redoAnnotation() {
  if (brushState.redoStack.length === 0) {
    toast('没有可重做的标记', 'error');
    return;
  }
  const action = brushState.redoStack.pop();
  if (action.type === 'add') {
    // 重做新增：重新加回标注
    brushState.paths = brushState.paths.concat(action.items);
  } else if (action.type === 'remove') {
    // 重做删除：再次移除
    brushState.paths = brushState.paths.filter(p => !action.items.some(it => it.id === p.id));
  } else if (action.type === 'replace') {
    // 重做精细擦除：基于擦除前快照重新应用
    brushState.paths = pixelErasePaths(action.before, action.eraserPath, action.eraserRadius);
  }
  brushState.undoStack.push(action);
  renderAllAnnotations();
  toast('已重做', 'info');
}

// 清除所有标记
function clearAllAnnotations() {
  if (brushState.paths.length === 0) {
    toast('当前没有标记', 'error');
    return;
  }
  if (!confirm('确认清除全部标记？此操作不可恢复。')) return;
  brushState.paths = [];
  brushState.undoStack = [];
  brushState.redoStack = [];
  renderAllAnnotations();
  toast('已清除全部标记', 'success');
}

// 保存标注到 localStorage
function saveAnnotationsForCurrentDiary() {
  if (!brushState.diaryId) {
    toast('请先保存日记再保存标记', 'error');
    return;
  }
  let ok;
  if (pdfState.active) {
    ok = savePdfAnnotations();
  } else {
    ok = saveAnnotationsToStorage(brushState.diaryId, brushState.paths);
  }
  if (ok) {
    const total = pdfState.active
      ? Object.values(pdfState.allPagesAnnos).reduce((s, arr) => s + arr.length, 0)
      : brushState.paths.length;
    toast(`已保存 ${total} 条标记`, 'success');
  } else {
    toast('保存失败', 'error');
  }
}

// 导出标注数据为 JSON 文件（服务端持久化的可选方案：用户可手动导出/导入）
function exportAnnotations() {
  if (brushState.paths.length === 0) {
    toast('没有标记可导出', 'error');
    return;
  }
  const data = {
    version: 1,
    diaryId: brushState.diaryId,
    exportedAt: new Date().toISOString(),
    paths: brushState.paths
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `treeks_annotations_${brushState.diaryId || 'export'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`已导出 ${brushState.paths.length} 条标记`, 'success');
}

// 导入标注数据（替换当前标注；清空 undoStack）
function importAnnotations(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const paths = Array.isArray(data) ? data : (data && data.paths);
      if (!Array.isArray(paths)) throw new Error('文件格式不正确');
      // 规范化每条标注
      brushState.paths = paths.map(p => ({
        id: p.id || ('anno_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)),
        type: p.type,
        color: p.color || '#ffeb3b',
        size: Number(p.size) || 6,
        points: Array.isArray(p.points) ? p.points : [],
        opacity: p.opacity !== undefined ? Number(p.opacity) : 1,
        text: p.text || '',
        createdAt: p.createdAt || Date.now()
      }));
      brushState.undoStack = [];
      brushState.redoStack = [];
      renderAllAnnotations();
      toast(`已导入 ${brushState.paths.length} 条标记`, 'success');
    } catch (err) {
      toast('导入失败：' + (err.message || '未知错误'), 'error');
    }
  };
  reader.onerror = () => toast('读取文件失败', 'error');
  reader.readAsText(file);
}

// 找到点击位置命中的标注（用于橡皮）
function findHitAnnotation(x, y) {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return null;
  // 倒序遍历（顶层优先）
  for (let i = brushState.paths.length - 1; i >= 0; i--) {
    const p = brushState.paths[i];
    const el = svg.querySelector(`[data-anno-id="${p.id}"]`);
    if (!el) continue;
    // 使用 SVG 的 isPointInFill / 检测 bbox
    const hit = checkPathHit(p, x, y);
    if (hit) return p;
  }
  return null;
}

// 简单命中检测：判断点是否在路径附近（支持 polyline/annotate/text/rect/ellipse）
function checkPathHit(path, x, y) {
  const threshold = Math.max(path.size + 4, 8);
  if (path.type === 'annotate' && path.points.length >= 2) {
    // 箭头线段命中检测（含箭头末端的容差）
    const start = path.points[0];
    const end = path.points[path.points.length - 1];
    return distancePointToSegment(x, y, start.x, start.y, end.x, end.y) <= threshold + 6;
  }
  if (path.type === 'text' && path.points.length >= 1) {
    // 文本包围盒检测
    const p = path.points[0];
    const fontSize = Math.max(12, path.size * 2.5);
    const charW = fontSize * 0.6;
    const textW = Math.max(charW * 2, (path.text || '').length * charW);
    const textH = fontSize * 1.3;
    return x >= p.x - 4 && x <= p.x + textW + 4 &&
           y >= p.y - textH + 2 && y <= p.y + 6;
  }
  if (path.type === 'rect' && path.points.length >= 2) {
    // 矩形包围盒检测（含边线容差）
    const a = path.points[0];
    const b = path.points[path.points.length - 1];
    const x1 = Math.min(a.x, b.x), x2 = Math.max(a.x, b.x);
    const y1 = Math.min(a.y, b.y), y2 = Math.max(a.y, b.y);
    return x >= x1 - threshold && x <= x2 + threshold &&
           y >= y1 - threshold && y <= y2 + threshold;
  }
  if (path.type === 'ellipse' && path.points.length >= 2) {
    // 椭圆内部命中检测
    const a = path.points[0];
    const b = path.points[path.points.length - 1];
    const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    const rx = Math.abs(b.x - a.x) / 2, ry = Math.abs(b.y - a.y) / 2;
    if (rx <= 0 || ry <= 0) return false;
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    return dx * dx + dy * dy <= 1.15;
  }
  // polyline 命中：检查每个线段
  for (let i = 0; i < path.points.length - 1; i++) {
    const a = path.points[i];
    const b = path.points[i + 1];
    if (distancePointToSegment(x, y, a.x, a.y, b.x, b.y) <= threshold) return true;
  }
  return false;
}

// 点到线段距离
function distancePointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// 生成标注 id
function genAnnoId() {
  return 'anno_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// 两点距离
function dist2D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ===== 精细橡皮擦：按轨迹擦除，返回新的 paths 列表 =====
/**
 * 思路：把橡皮轨迹离散为一系列采样点（步进 ~ radius/2）
 * - pen / highlight (polyline)：逐点判断是否在橡皮半径内，相邻被擦点之间断开，保留剩余段
 * - annotate (箭头) / rect / ellipse / text：任一关键点被擦到则整条擦除
 */
function pixelErasePaths(paths, eraserPath, radius) {
  if (!eraserPath || eraserPath.length === 0) return paths;
  const r = radius;
  // 轨迹点太少时补足（单点也能擦除，但容差更宽容）
  const r2 = r * r;

  // 对每个路径点，判断是否在橡皮"圆盘链"范围内：任一轨迹点的距离 < r
  // O(N*M) 即可，性能足够（百级标注、百级轨迹点）
  const inEraser = (x, y) => {
    for (let i = 0; i < eraserPath.length; i++) {
      const p = eraserPath[i];
      const dx = x - p.x, dy = y - p.y;
      if (dx * dx + dy * dy <= r2) return true;
    }
    return false;
  };

  const next = [];
  for (const path of paths) {
    if (path.type === 'pen' || path.type === 'highlight') {
      // 逐点检查
      const segments = [];
      let cur = [];
      for (const pt of path.points) {
        if (!inEraser(pt.x, pt.y)) {
          if (cur.length === 0) cur.push({ x: pt.x, y: pt.y });
          else cur.push({ x: pt.x, y: pt.y });
        } else {
          if (cur.length >= 2) {
            segments.push({ ...path, id: genAnnoId(), points: cur });
          }
          cur = [];
        }
      }
      if (cur.length >= 2) {
        segments.push({ ...path, id: genAnnoId(), points: cur });
      }
      for (const seg of segments) next.push(seg);
    } else {
      // 其它类型：任一关键点被擦到则整条擦除
      let hit = false;
      for (const pt of path.points) {
        if (inEraser(pt.x, pt.y)) { hit = true; break; }
      }
      if (!hit) next.push(path);
    }
  }
  return next;
}

// ===== 套索：判断点是否在多边形内（射线法） =====
function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// 获取标注的代表性点（用于套索包含判断）
function annoAnchorPoint(anno) {
  if (!anno.points || anno.points.length === 0) return null;
  if (anno.type === 'text') return anno.points[0];
  // 用首末两点的中点
  const a = anno.points[0];
  const b = anno.points[anno.points.length - 1];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// 判断标注是否被套索多边形"包围"（用锚点 + 端点判断）
function isAnnoInLasso(anno, polygon) {
  if (polygon.length < 3) return false;
  // 锚点
  const anchor = annoAnchorPoint(anno);
  if (anchor && pointInPolygon(anchor.x, anchor.y, polygon)) return true;
  // 首末端点也判断（提高鲁棒性）
  for (const p of anno.points) {
    if (pointInPolygon(p.x, p.y, polygon)) return true;
  }
  return false;
}

// 笔刷栏拖拽逻辑（仿 GoodNotes，fixed 定位贴视口，可拖到任意位置不回弹）
function setupBrushDrag() {
  const handle = document.getElementById('brush-drag-handle');
  const toolbar = document.getElementById('brush-toolbar');
  if (!handle || !toolbar) return;

  let dragState = {
    active: false,
    startX: 0,
    startY: 0,
    originLeft: 0,
    originTop: 0,
    moved: false
  };

  handle.addEventListener('pointerdown', (e) => {
    // 折叠状态不允许拖拽
    if (toolbar.classList.contains('collapsed')) return;
    dragState.active = true;
    dragState.moved = false;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;

    // 使用视口坐标（fixed 定位）
    const rect = toolbar.getBoundingClientRect();
    dragState.originLeft = rect.left;
    dragState.originTop = rect.top;

    // 切换到浮动状态：取消居中 transform，改用 left/top 定位
    toolbar.classList.add('floating', 'dragging');
    toolbar.style.left = dragState.originLeft + 'px';
    toolbar.style.top = dragState.originTop + 'px';

    handle.setPointerCapture && handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragState.active) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragState.moved = true;

    let newLeft = dragState.originLeft + dx;
    let newTop = dragState.originTop + dy;

    // 限制在视口范围内（允许贴边，但不要完全拖出屏幕）
    const tw = toolbar.offsetWidth;
    const th = toolbar.offsetHeight;
    // 允许部分露出屏幕外，但至少保留一部分可见
    newLeft = Math.max(-tw + 60, Math.min(window.innerWidth - 60, newLeft));
    newTop = Math.max(4, Math.min(window.innerHeight - 40, newTop));
    toolbar.style.left = newLeft + 'px';
    toolbar.style.top = newTop + 'px';
  });

  const endDrag = (e) => {
    if (!dragState.active) return;
    dragState.active = false;
    toolbar.classList.remove('dragging');
    // 拖动后保持在当前位置（fixed 定位），不回弹
    // 仅点击未拖动时恢复居中默认位置
    if (!dragState.moved) {
      toolbar.classList.remove('floating');
      toolbar.style.left = '';
      toolbar.style.top = '';
    }
    if (handle.releasePointerCapture && e && e.pointerId) {
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };

  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

// 初始化笔刷功能（事件绑定）
function setupBrushAnnotations() {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;

  // 笔刷工具切换
  document.querySelectorAll('.brush-btn[data-brush]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.brush;
      if (tool === 'undo') {
        undoAnnotation();
        return;
      }
      if (tool === 'redo') {
        redoAnnotation();
        return;
      }
      if (tool === 'clear') {
        clearAllAnnotations();
        return;
      }
      setBrushTool(tool === brushState.tool ? 'none' : tool);
    });
  });

  // 折叠/展开笔刷栏（FAB 支持拖拽 + 位置持久化 + 淡入淡出动画）
  const collapseBtn = document.getElementById('btn-collapse-brush');
  const fabBtn = document.getElementById('brush-fab');
  const toolbar = document.getElementById('brush-toolbar');
  if (collapseBtn && fabBtn && toolbar) {
    collapseBtn.addEventListener('click', () => {
      // 先淡出笔刷栏，再隐藏并显示 FAB
      toolbar.classList.add('fading-out');
      setTimeout(() => {
        toolbar.classList.add('collapsed');
        toolbar.style.display = 'none';
        toolbar.classList.remove('fading-out');
        fabBtn.style.display = 'flex';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => fabBtn.classList.add('visible'));
        });
      }, 200);
    });
    // 通过 FabManager 注册（支持拖拽 + 位置持久化）
    FabManager.register(fabBtn, 'brush', () => {
      // 点击回调：展开笔刷栏
      fabBtn.classList.remove('visible');
      toolbar.classList.remove('collapsed');
      // 先保持 fading-out 状态并显示，再下一帧移除 fading-out 触发淡入动画
      toolbar.classList.add('fading-out');
      toolbar.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toolbar.classList.remove('fading-out'));
      });
      setTimeout(() => {
        if (!fabBtn.classList.contains('visible')) fabBtn.style.display = 'none';
      }, 380);
    });
  }

  // 拖拽笔刷栏
  setupBrushDrag();

  // 色盘按钮：显示/隐藏色盘
  const colorBtn = document.getElementById('brush-color-btn');
  const palette = document.getElementById('brush-color-palette');
  if (colorBtn && palette) {
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      palette.style.display = palette.style.display === 'none' ? 'grid' : 'none';
    });
    // 点击其他地方关闭色盘
    document.addEventListener('click', (e) => {
      if (!palette.contains(e.target) && e.target !== colorBtn) {
        palette.style.display = 'none';
      }
    });
    // 预设色块
    palette.querySelectorAll('.palette-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        setBrushColor(sw.dataset.color);
        palette.style.display = 'none';
      });
    });
    // 自定义取色器
    const customInput = document.getElementById('brush-color-custom');
    if (customInput) {
      customInput.addEventListener('input', (e) => {
        setBrushColor(e.target.value);
      });
      customInput.addEventListener('change', () => {
        palette.style.display = 'none';
      });
    }
  }

  // 隐藏的原生 color input（兼容旧逻辑，可被色盘按钮触发）
  const colorInput = document.getElementById('brush-color-input');
  if (colorInput) {
    colorInput.addEventListener('input', (e) => setBrushColor(e.target.value));
  }

  // 粗细滑块
  const sizeInput = document.getElementById('brush-size-input');
  if (sizeInput) {
    sizeInput.addEventListener('input', (e) => setBrushSize(e.target.value));
  }

  // 不透明度滑块
  const opacityInput = document.getElementById('brush-opacity-input');
  if (opacityInput) {
    opacityInput.addEventListener('input', (e) => setBrushOpacity(e.target.value / 100));
  }

  // 橡皮模式切换（笔画/精细）
  document.querySelectorAll('.brush-eraser-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.dataset.eraserMode;
      if (!mode) return;
      brushState.eraserMode = mode;
      document.querySelectorAll('.brush-eraser-mode').forEach(b => {
        b.classList.toggle('active', b.dataset.eraserMode === mode);
      });
      // 如果当前是橡皮工具，刷新滑块显示
      if (brushState.tool === 'eraser') {
        const radiusWrap = document.getElementById('brush-eraser-radius');
        if (radiusWrap) {
          radiusWrap.style.display = (mode === 'pixel') ? 'inline-flex' : 'none';
        }
      }
    });
  });

  // 橡皮半径滑块
  const eraserRadiusInput = document.getElementById('brush-eraser-radius-input');
  if (eraserRadiusInput) {
    eraserRadiusInput.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) || 20;
      brushState.eraserRadius = v;
      const vEl = document.getElementById('brush-eraser-radius-value');
      if (vEl) vEl.textContent = v;
    });
  }

  // 导入文件输入
  const importInput = document.getElementById('brush-import-input');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importAnnotations(file);
      e.target.value = ''; // 允许重复导入同一文件
    });
  }

  // 保存按钮
  const saveBtn = document.getElementById('btn-save-annotations');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveAnnotationsForCurrentDiary);
  }

  // SVG 绘制事件
  svg.addEventListener('pointerdown', onBrushPointerDown);
  svg.addEventListener('pointermove', onBrushPointerMove);
  svg.addEventListener('pointerup', onBrushPointerUp);
  svg.addEventListener('pointerleave', onBrushPointerUp);
  // 防止触摸滚动
  svg.addEventListener('touchstart', (e) => {
    if (brushState.tool !== 'none') e.preventDefault();
  }, { passive: false });
  svg.addEventListener('touchmove', (e) => {
    if (brushState.tool !== 'none') e.preventDefault();
  }, { passive: false });

  // 窗口尺寸变化时重新计算 SVG 尺寸
  window.addEventListener('resize', () => {
    const editorView = document.getElementById('view-editor');
    if (editorView && editorView.classList.contains('active')) {
      resizeAnnotationLayer();
    }
  });

  // 监听预览内容尺寸变化（双栏切换、窗口拉伸、图片加载等），保持 SVG 与内容同步并零偏移重绘
  const wrapper = document.getElementById('preview-content-wrapper');
  if (wrapper && window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      resizeAnnotationLayer();
      renderAllAnnotations();
    });
    ro.observe(wrapper);
  }

  // 键盘快捷键：Ctrl/Cmd+Z 撤销，Ctrl/Cmd+Shift+Z 或 Ctrl/Cmd+Y 重做
  // Delete/Backspace 删除套索选中的标注
  document.addEventListener('keydown', (e) => {
    const toolbar = document.getElementById('brush-toolbar');
    // 仅在笔刷工具栏可见（预览模式）下响应
    if (!toolbar || toolbar.style.display === 'none') return;
    // Delete / Backspace：删除套索选中的标注
    if ((e.key === 'Delete' || e.key === 'Backspace') &&
        brushState.selectedIds && brushState.selectedIds.length > 0) {
      // 不要在文本输入框中触发
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      deleteSelectedAnnotations();
      return;
    }
    // Escape：取消套索选区
    if (e.key === 'Escape') {
      if (brushState.selectedIds && brushState.selectedIds.length > 0) {
        brushState.selectedIds = [];
        renderAllAnnotations();
        toast('已取消选区', 'info');
        return;
      }
    }
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoAnnotation();
    } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
      e.preventDefault();
      redoAnnotation();
    }
  });
}

// ===== PDF 事件绑定（在编辑器初始化时调用一次） =====
function setupPdfViewer() {
  // 翻页
  const prevBtn = document.getElementById('btn-pdf-prev');
  const nextBtn = document.getElementById('btn-pdf-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (!pdfState.pdfDoc) return;
    stashCurrentPageAnnos();
    renderPdfPage(pdfState.pageNum - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!pdfState.pdfDoc) return;
    stashCurrentPageAnnos();
    renderPdfPage(pdfState.pageNum + 1);
  });
  // 页码输入
  const pageInput = document.getElementById('pdf-page-input');
  if (pageInput) {
    pageInput.addEventListener('change', (e) => {
      if (!pdfState.pdfDoc) return;
      const n = parseInt(e.target.value, 10);
      if (!isNaN(n) && n >= 1 && n <= pdfState.totalPages) {
        stashCurrentPageAnnos();
        renderPdfPage(n);
      } else {
        e.target.value = pdfState.pageNum;
      }
    });
  }
  // 缩放
  const zoomIn = document.getElementById('btn-pdf-zoom-in');
  const zoomOut = document.getElementById('btn-pdf-zoom-out');
  const zoomFit = document.getElementById('btn-pdf-fit');
  function setScale(s) {
    pdfState.scale = Math.max(0.5, Math.min(3, s));
    const valEl = document.getElementById('pdf-zoom-value');
    if (valEl) valEl.textContent = Math.round(pdfState.scale * 100) + '%';
    if (pdfState.pdfDoc) {
      stashCurrentPageAnnos();
      renderPdfPage(pdfState.pageNum);
    }
  }
  if (zoomIn) zoomIn.addEventListener('click', () => setScale(pdfState.scale + 0.1));
  if (zoomOut) zoomOut.addEventListener('click', () => setScale(pdfState.scale - 0.1));
  if (zoomFit) zoomFit.addEventListener('click', async () => {
    if (!pdfState.pdfDoc) return;
    // 简单适应宽度：取预览容器宽度，计算缩放
    const wrapper = document.getElementById('preview-content-wrapper');
    const page = await pdfState.pdfDoc.getPage(pdfState.pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const containerW = (wrapper && wrapper.clientWidth) || 800;
    const targetScale = Math.max(0.5, Math.min(2, (containerW - 80) / viewport.width));
    setScale(targetScale);
  });
  // 旧的"上传 PDF" 按钮（input-upload-pdf）已弃用：PDF 应在「我的文件」页面上传
  // 这里兼容旧按钮：点击后跳转到「我的文件」页面
  const oldUploadInput = document.getElementById('input-upload-pdf');
  if (oldUploadInput) {
    const oldBtn = oldUploadInput.closest('label') || oldUploadInput;
    if (oldBtn) {
      oldBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toast('PDF 请到「我的文件」页面上传后，再回来绑定', 'info');
        navigateTo('files');
      });
    }
  }
  // 附件按钮：打开附件管理模态框
  const attBtn = document.getElementById('btn-attachments');
  if (attBtn) {
    attBtn.addEventListener('click', () => openAttachmentsModal());
  }
  // 初始化 PDF.js worker
  setupPdfJsWorker();
}

// 当打开一篇已有附件的日记时，自动加载并进入预览
async function autoLoadDiaryPdf(diary) {
  // 兼容旧逻辑：如果 diaries.pdf_filename 还在则继续加载
  if (!diary || !diary.pdf_filename) {
    exitPdfMode();
    return;
  }
  let url;
  if (diary.pdf_filename.startsWith('/uploads/') || diary.pdf_filename.startsWith('/api/')) {
    url = diary.pdf_filename;
  } else {
    url = `/api/upload/pdf/${diary.pdf_filename}`;
  }
  const ok = await loadPdf(url, diary.pdf_filename);
  if (ok) {
    enterPdfMode();
    setTimeout(() => {
      const previewBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="preview"]');
      if (previewBtn) previewBtn.click();
    }, 100);
  }
}

// 显示文本输入框（用于文本标注工具）
function showTextInput(x, y) {
  // 先提交已有输入
  if (brushState.textInput) commitTextInput();

  const wrapper = document.getElementById('preview-content-wrapper');
  if (!wrapper) return;

  const fontSize = Math.max(12, brushState.size * 2.5);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'brush-text-input';
  input.style.left = x + 'px';
  input.style.top = (y - fontSize) + 'px';
  input.style.fontSize = fontSize + 'px';
  input.style.color = brushState.color;
  input.style.opacity = brushState.opacity;
  input.dataset.x = x;
  input.dataset.y = y;
  input.placeholder = '输入文字后按 Enter…';
  input.maxLength = 200;

  wrapper.appendChild(input);
  brushState.textInput = input;

  requestAnimationFrame(() => input.focus());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitTextInput();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      input.value = '';
      commitTextInput();
    }
    e.stopPropagation();
  });
  input.addEventListener('blur', () => {
    // 延迟提交，避免与 Enter 重复触发
    setTimeout(() => {
      if (brushState.textInput === input) commitTextInput();
    }, 120);
  });
}

// 提交文本输入：把输入内容存为 text 标注
function commitTextInput() {
  const input = brushState.textInput;
  if (!input) return;
  const text = (input.value || '').trim();
  const x = parseFloat(input.dataset.x);
  const y = parseFloat(input.dataset.y);
  if (text && !isNaN(x) && !isNaN(y)) {
    const anno = {
      id: 'anno_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      type: 'text',
      color: brushState.color,
      size: brushState.size,
      points: [{ x, y }],
      opacity: brushState.opacity,
      text: text,
      createdAt: Date.now()
    };
    brushState.paths.push(anno);
    pushBrushAction({ type: 'add', items: [anno] });
    renderAllAnnotations();
  }
  if (input.parentNode) input.parentNode.removeChild(input);
  brushState.textInput = null;
}

// ⚡ GoodNotes 级 0 延迟同步增量出墨 + 笔尖预测绘制引擎 (Direct Synchronous Ink Engine)
function drawDirectIncrementalSegment(p0, p1, predP) {
  const canvas = document.getElementById('brush-active-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const type = brushState.tool;
  const isHighlight = type === 'highlight';
  const color = brushState.color || '#ffeb3b';
  const size = brushState.size || 6;
  const op = brushState.opacity !== undefined ? brushState.opacity : 1;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = isHighlight ? Math.max(size, 10) * 1.8 : size;
  ctx.globalAlpha = isHighlight ? (0.45 * op) : op;

  if (isHighlight) {
    const isDark = document.documentElement.getAttribute('data-mode') === 'dark';
    if (!isDark) ctx.globalCompositeOperation = 'multiply';
  }

  ctx.beginPath();
  const midX = (p0.x + p1.x) / 2;
  const midY = (p0.y + p1.y) / 2;
  ctx.moveTo(p0.x, p0.y);
  ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);

  if (predP) {
    // 🔮 笔尖外推预测：向前方微延伸 0.5 个步进，形成物理级完全跟手
    ctx.quadraticCurveTo(midX, midY, predP.x, predP.y);
  } else {
    ctx.lineTo(p1.x, p1.y);
  }

  ctx.stroke();
  ctx.restore();
}

// 鼠标按下：开始绘制
function onBrushPointerDown(e) {
  if (brushState.tool === 'none') return;
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;

  // ⚡ 0-Reflow：下笔瞬间缓存布局 Bounds，消去 pointermove 期间的强行 Layout 死锁
  brushState.cachedBounds = svg.getBoundingClientRect();

  const pt = getSvgPoint(e);

  if (brushState.tool === 'eraser') {
    if (brushState.eraserMode === 'pixel') {
      // 精细橡皮擦：开始记录轨迹
      brushState.drawing = true;
      brushState.eraserPath = [pt];
      svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
      return;
    }
    // 笔画橡皮擦（整笔擦除）：单点擦除
    const hit = findHitAnnotation(pt.x, pt.y);
    if (hit) {
      pushBrushAction({ type: 'remove', items: [hit] });
      brushState.paths = brushState.paths.filter(p => p.id !== hit.id);
      renderAllAnnotations();
      toast('已删除一条标记', 'success');
    }
    return;
  }

  // 文本工具：点击空白处创建输入框，点击已有文本则进入拖动
  if (brushState.tool === 'text') {
    const hit = findHitAnnotation(pt.x, pt.y);
    if (hit && hit.type === 'text') {
      brushState.draggingAnno = hit.id;
      brushState.dragOffset = { x: pt.x - hit.points[0].x, y: pt.y - hit.points[0].y };
      svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
    } else {
      showTextInput(pt.x, pt.y);
    }
    return;
  }

  // 套索工具：开始绘制套索多边形
  if (brushState.tool === 'lasso') {
    brushState.drawing = true;
    brushState.lassoDragging = true;
    brushState.lassoPath = [pt];
    brushState.selectedIds = [];
    svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
    return;
  }

  brushState.drawing = true;
  brushState.points = [pt];
  brushState.startPoint = pt;
  svg.setPointerCapture && svg.setPointerCapture(e.pointerId);

  // 初始化动态 Canvas 像素尺寸
  if (brushState.tool === 'highlight' || brushState.tool === 'pen') {
    const canvas = document.getElementById('brush-active-canvas');
    const wrapper = document.getElementById('preview-content-wrapper');
    if (canvas && wrapper) {
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
    }
  } else if (brushState.tool === 'annotate') {
    // 讲解笔：先画临时线段，松开时确定
    const g = svgEl('g', { 'data-temp': 'true' });
    const line = svgEl('line', {
      x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y,
      stroke: brushState.color,
      'stroke-width': brushState.size,
      'stroke-linecap': 'round',
      'stroke-dasharray': '6 4',
      opacity: 0.7
    });
    g.appendChild(line);
    svg.appendChild(g);
    brushState.currentPath = g;
  } else if (brushState.tool === 'rect' || brushState.tool === 'ellipse') {
    // 矩形 / 椭圆：起点 + 拖动
    const el = createBrushElement(brushState.tool, brushState.color, brushState.size, [pt, pt], brushState.opacity);
    if (el) {
      el.setAttribute('data-temp', 'true');
      svg.appendChild(el);
      brushState.currentPath = el;
    }
  }
}

// 鼠标移动：0 延迟同步实时出墨
function onBrushPointerMove(e) {
  const pt = getSvgPoint(e);

  // 文本拖动
  if (brushState.tool === 'text' && brushState.draggingAnno) {
    const anno = brushState.paths.find(p => p.id === brushState.draggingAnno);
    if (anno && anno.points[0]) {
      anno.points[0] = {
        x: pt.x - brushState.dragOffset.x,
        y: pt.y - brushState.dragOffset.y
      };
      renderAllAnnotations();
    }
    return;
  }

  if (!brushState.drawing) return;

  if (brushState.tool === 'highlight' || brushState.tool === 'pen') {
    const pts = brushState.points;
    const lastPt = pts[pts.length - 1];
    
    // 过滤同点微小震荡
    if (lastPt && Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y) < 1.2) {
      return;
    }

    // 计算笔尖预测点 (Prediction Point)
    let predPt = null;
    if (pts.length >= 2) {
      const prev = pts[pts.length - 2];
      const vx = pt.x - prev.x;
      const vy = pt.y - prev.y;
      predPt = { x: pt.x + vx * 0.4, y: pt.y + vy * 0.4 };
    }

    pts.push(pt);
    // ⚡ 0 延迟同步增量出墨：指针到达的同毫秒内，墨水立刻渲染呈现！
    drawDirectIncrementalSegment(lastPt || pt, pt, predPt);
    return;
  }

  const svg = document.getElementById('annotation-layer');
  if (!svg) return;

  // 精细橡皮擦
  if (brushState.tool === 'eraser' && brushState.eraserMode === 'pixel') {
    const last = brushState.eraserPath[brushState.eraserPath.length - 1];
    const minStep = Math.max(2, brushState.eraserRadius / 2);
    if (!last || dist2D(last, pt) >= minStep) {
      brushState.eraserPath.push(pt);
      renderEraserPreview();
    }
    return;
  }

  // 套索
  if (brushState.tool === 'lasso' && brushState.lassoDragging) {
    const last = brushState.lassoPath[brushState.lassoPath.length - 1];
    if (!last || dist2D(last, pt) >= 3) {
      brushState.lassoPath.push(pt);
      renderLassoPreview();
    }
    return;
  } else if (brushState.tool === 'annotate') {
    // 更新临时线段
    if (brushState.currentPath) {
      const line = brushState.currentPath.querySelector('line');
      if (line) {
        line.setAttribute('x2', pt.x);
        line.setAttribute('y2', pt.y);
      }
    }
    brushState.points = [brushState.startPoint, pt];
  } else if (brushState.tool === 'rect' && brushState.currentPath) {
    // 矩形：直接更新属性
    const sp = brushState.startPoint;
    const x = Math.min(sp.x, pt.x);
    const y = Math.min(sp.y, pt.y);
    const w = Math.max(1, Math.abs(pt.x - sp.x));
    const h = Math.max(1, Math.abs(pt.y - sp.y));
    brushState.currentPath.setAttribute('x', x);
    brushState.currentPath.setAttribute('y', y);
    brushState.currentPath.setAttribute('width', w);
    brushState.currentPath.setAttribute('height', h);
    brushState.points = [sp, pt];
  } else if (brushState.tool === 'ellipse' && brushState.currentPath) {
    // 椭圆：直接更新属性
    const sp = brushState.startPoint;
    const cx = (sp.x + pt.x) / 2;
    const cy = (sp.y + pt.y) / 2;
    const rx = Math.max(1, Math.abs(pt.x - sp.x) / 2);
    const ry = Math.max(1, Math.abs(pt.y - sp.y) / 2);
    brushState.currentPath.setAttribute('cx', cx);
    brushState.currentPath.setAttribute('cy', cy);
    brushState.currentPath.setAttribute('rx', rx);
    brushState.currentPath.setAttribute('ry', ry);
    brushState.points = [sp, pt];
  }
}

// 渲染精细橡皮擦的预览（当前指针位置的圆环 + 轨迹）
function renderEraserPreview() {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;
  // 移除旧预览
  const old = svg.querySelector('.eraser-preview');
  if (old) old.remove();
  if (!brushState.eraserPath || brushState.eraserPath.length === 0) return;
  const g = svgEl('g', { 'class': 'eraser-preview', 'pointer-events': 'none' });
  // 轨迹线
  if (brushState.eraserPath.length >= 2) {
    const d = brushState.eraserPath.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    g.appendChild(svgEl('polyline', {
      points: d, fill: 'none', stroke: 'rgba(76,153,92,0.55)',
      'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      'stroke-dasharray': '4 3'
    }));
  }
  // 当前指针位置的圆环
  const last = brushState.eraserPath[brushState.eraserPath.length - 1];
  g.appendChild(svgEl('circle', {
    cx: last.x, cy: last.y, r: brushState.eraserRadius,
    fill: 'rgba(76,153,92,0.12)',
    stroke: 'rgba(76,153,92,0.9)',
    'stroke-width': '1.5',
    'stroke-dasharray': '5 3'
  }));
  svg.appendChild(g);
}

// 渲染套索预览（折线 + 已选标注的描边）
function renderLassoPreview() {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;
  // 移除旧预览
  const old = svg.querySelector('.lasso-preview');
  if (old) old.remove();
  if (!brushState.lassoPath || brushState.lassoPath.length < 2) return;
  const g = svgEl('g', { 'class': 'lasso-preview', 'pointer-events': 'none' });
  const d = brushState.lassoPath.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  g.appendChild(svgEl('polyline', {
    points: d, fill: 'rgba(76,153,92,0.10)',
    stroke: 'rgba(76,153,92,0.85)',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-dasharray': '5 3'
  }));
  svg.appendChild(g);
}

// 鼠标松开：完成绘制
function onBrushPointerUp(e) {
  brushState.cachedBounds = null;
  // 文本拖动结束
  if (brushState.tool === 'text' && brushState.draggingAnno) {
    brushState.draggingAnno = null;
    brushState.dragOffset = null;
    return;
  }

  // 精细橡皮擦：执行擦除
  if (brushState.tool === 'eraser' && brushState.eraserMode === 'pixel' && brushState.drawing) {
    brushState.drawing = false;
    const svg = document.getElementById('annotation-layer');
    // 移除预览
    if (svg) {
      const old = svg.querySelector('.eraser-preview');
      if (old) old.remove();
    }
    if (brushState.eraserPath.length > 0) {
      const before = brushState.paths.length;
      const newPaths = pixelErasePaths(brushState.paths, brushState.eraserPath, brushState.eraserRadius);
      const actuallyRemoved = before - newPaths.length;
      // 部分被擦除（拆分后变多）也支持重做：保存旧 paths 到 undoStack
      if (actuallyRemoved > 0 || newPaths.length !== before) {
        pushBrushAction({
          type: 'replace',
          before: brushState.paths,
          eraserPath: brushState.eraserPath.slice(),
          eraserRadius: brushState.eraserRadius
        });
        brushState.paths = newPaths;
        renderAllAnnotations();
        toast(`精细擦除完成（影响 ${actuallyRemoved} 条）`, 'success');
      }
    }
    brushState.eraserPath = [];
    return;
  }

  // 套索：选中范围内标注
  if (brushState.tool === 'lasso' && brushState.lassoDragging) {
    brushState.drawing = false;
    brushState.lassoDragging = false;
    const svg = document.getElementById('annotation-layer');
    if (svg) {
      const old = svg.querySelector('.lasso-preview');
      if (old) old.remove();
    }
    // 闭合套索（自动连回起点）
    if (brushState.lassoPath.length >= 3) {
      brushState.selectedIds = brushState.paths
        .filter(p => isAnnoInLasso(p, brushState.lassoPath))
        .map(p => p.id);
      renderAllAnnotations();
      renderSelectionOverlay();
      toast(`已选中 ${brushState.selectedIds.length} 条标注（按 Delete 删除）`, 'info');
    }
    return;
  }

  if (!brushState.drawing) return;
  brushState.drawing = false;
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;

  // ⚡ 抬笔时清空动态 0 延迟出墨 Canvas 画板
  const activeCanvas = document.getElementById('brush-active-canvas');
  if (activeCanvas) {
    const ctx = activeCanvas.getContext('2d');
    ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  }

  // 移除临时元素
  if (brushState.currentPath && brushState.currentPath.parentNode) {
    brushState.currentPath.parentNode.removeChild(brushState.currentPath);
  }
  brushState.currentPath = null;

  // 钢笔/荧光笔支持单击点状标注；其余工具至少需要 2 个点
  const isDotTool = brushState.tool === 'pen' || brushState.tool === 'highlight';
  if (brushState.points.length < (isDotTool ? 1 : 2)) {
    brushState.points = [];
    brushState.startPoint = null;
    return;
  }

  // 创建正式标注
  const anno = {
    id: genAnnoId(),
    type: brushState.tool,
    color: brushState.color,
    size: brushState.size,
    opacity: brushState.opacity,
    points: brushState.points.slice(),
    createdAt: Date.now()
  };
  brushState.paths.push(anno);
  pushBrushAction({ type: 'add', items: [anno] });
  brushState.points = [];
  brushState.startPoint = null;
  renderAllAnnotations();
}

// 渲染选区高亮（套索选中的标注加描边）
function renderSelectionOverlay() {
  const svg = document.getElementById('annotation-layer');
  if (!svg) return;
  const old = svg.querySelector('.selection-overlay');
  if (old) old.remove();
  if (!brushState.selectedIds || brushState.selectedIds.length === 0) return;
  const g = svgEl('g', { 'class': 'selection-overlay', 'pointer-events': 'none' });
  for (const p of brushState.paths) {
    if (!brushState.selectedIds.includes(p.id)) continue;
    if (p.type === 'text') {
      // 文字：用估算的包围盒
      const pt = p.points[0];
      if (!pt) continue;
      const fontSize = Math.max(12, p.size * 2.5);
      const charW = fontSize * 0.6;
      const w = Math.max(charW * 2, (p.text || '').length * charW);
      const h = fontSize * 1.3;
      const box = svgEl('rect', {
        x: pt.x - 3, y: pt.y - h + 2, width: w + 6, height: h + 4,
        fill: 'none', stroke: 'rgba(76,153,92,0.95)',
        'stroke-width': '1.5', 'stroke-dasharray': '4 3', rx: 3
      });
      g.appendChild(box);
    } else if (p.type === 'rect') {
      const a = p.points[0], b = p.points[p.points.length - 1];
      g.appendChild(svgEl('rect', {
        x: Math.min(a.x, b.x) - 4, y: Math.min(a.y, b.y) - 4,
        width: Math.abs(b.x - a.x) + 8, height: Math.abs(b.y - a.y) + 8,
        fill: 'none', stroke: 'rgba(76,153,92,0.95)', 'stroke-width': '1.5',
        'stroke-dasharray': '4 3', rx: 3
      }));
    } else if (p.type === 'ellipse') {
      const a = p.points[0], b = p.points[p.points.length - 1];
      const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      const rx = Math.abs(b.x - a.x) / 2 + 4, ry = Math.abs(b.y - a.y) / 2 + 4;
      g.appendChild(svgEl('ellipse', {
        cx, cy, rx, ry, fill: 'none', stroke: 'rgba(76,153,92,0.95)',
        'stroke-width': '1.5', 'stroke-dasharray': '4 3'
      }));
    } else {
      // pen / highlight / annotate：画包围盒
      const xs = p.points.map(pt => pt.x);
      const ys = p.points.map(pt => pt.y);
      const minX = Math.min(...xs) - 4;
      const maxX = Math.max(...xs) + 4;
      const minY = Math.min(...ys) - 4;
      const maxY = Math.max(...ys) + 4;
      g.appendChild(svgEl('rect', {
        x: minX, y: minY, width: maxX - minX, height: maxY - minY,
        fill: 'none', stroke: 'rgba(76,153,92,0.95)', 'stroke-width': '1.5',
        'stroke-dasharray': '4 3', rx: 3
      }));
    }
  }
  svg.appendChild(g);
}

// 删除选中的标注（供 Delete/Backspace 快捷键调用）
function deleteSelectedAnnotations() {
  if (!brushState.selectedIds || brushState.selectedIds.length === 0) return false;
  const removed = brushState.paths.filter(p => brushState.selectedIds.includes(p.id));
  pushBrushAction({ type: 'remove', items: removed });
  brushState.paths = brushState.paths.filter(p => !brushState.selectedIds.includes(p.id));
  brushState.selectedIds = [];
  renderAllAnnotations();
  renderSelectionOverlay();
  toast(`已删除 ${removed.length} 条标注`, 'success');
  return true;
}

// 在切换到预览模式时显示笔刷工具栏
function updateBrushToolbarVisibility() {
  const body = document.querySelector('.editor-body');
  const brushToolbar = document.getElementById('brush-toolbar');
  const fabBtn = document.getElementById('brush-fab');
  if (!body || !brushToolbar) return;
  // 仅在预览模式（mode-preview）下显示笔刷工具栏
  if (body.classList.contains('mode-preview')) {
    // 如果之前折叠了，保持折叠状态（显示 fab），否则显示工具栏
    if (!brushToolbar.classList.contains('collapsed')) {
      brushToolbar.style.display = 'flex';
      brushToolbar.classList.remove('fading-out');
    }
    resizeAnnotationLayer();
  } else {
    brushToolbar.style.display = 'none';
    brushToolbar.classList.remove('fading-out');
    if (fabBtn) {
      fabBtn.classList.remove('visible');
      fabBtn.style.display = 'none';
    }
    // 退出标注模式
    setBrushTool('none');
  }
}

// 初始化当前日记的标注数据（在打开日记时调用）
function initAnnotationsForDiary(diaryId) {
  // 切换日记前自动保存当前日记的标注，避免未点"保存标注"就切换导致丢失
  if (brushState.diaryId && brushState.diaryId !== diaryId) {
    saveAnnotationsToStorage(brushState.diaryId, brushState.paths);
  }
  brushState.diaryId = diaryId;
  brushState.undoStack = []; // 重置 redo 栈
  brushState.redoStack = [];
  brushState.selectedIds = [];
  setBrushTool('none');
  // PDF 模式：标注按页存储，从 allPagesAnnos 加载当前页
  // Markdown 模式：从单一 key 加载整个 paths
  if (pdfState.active && pdfState.pdfDoc) {
    const pagePaths = pdfState.allPagesAnnos[String(pdfState.pageNum)] || [];
    brushState.paths = pagePaths.map(p => ({ opacity: 1, text: '', ...p }));
    renderAllAnnotations();
    // 等待 canvas 渲染完成后调整标注层尺寸
    setTimeout(() => {
      resizeAnnotationLayer();
    }, 80);
  } else {
    const loadedAnnos = diaryId ? loadAnnotations(diaryId) : null;
    brushState.paths = Array.isArray(loadedAnnos) ? loadedAnnos : [];
    // 兼容旧数据：补齐 opacity 字段
    brushState.paths = brushState.paths.map(p => ({
      opacity: 1,
      text: '',
      ...p
    }));
    renderAllAnnotations();
    // 等待预览渲染完成后重新计算 SVG 尺寸
    setTimeout(resizeAnnotationLayer, 100);
  }
}

// ===== PDF 阅读 + 笔刷标注 =====

// PDF 状态
const pdfState = {
  pdfDoc: null,            // PDF.js 文档对象
  url: '',                 // 当前 PDF URL
  filename: '',            // 文件名（uploads/.../xxx.pdf）
  pageNum: 1,              // 当前页码（1-based）
  totalPages: 0,
  scale: 1.2,              // 渲染缩放
  renderTask: null,        // 当前渲染任务（用于取消）
  active: false,           // 是否处于 PDF 模式
  allPagesAnnos: {}        // 按页存储的标注 { pageNum: [anno, ...] }
};

// PDF.js worker 路径（在 CDN 加载后必须设置）
function setupPdfJsWorker() {
  if (typeof pdfjsLib === 'undefined') return false;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js';
  return true;
}

// 加载 PDF（支持完整 URL 或相对路径）
async function loadPdf(pdfUrl, filename) {
  if (typeof pdfjsLib === 'undefined') {
    toast('PDF.js 未加载，请检查网络', 'error');
    return false;
  }
  setupPdfJsWorker();
  // 卸载旧文档
  if (pdfState.pdfDoc) {
    try { pdfState.pdfDoc.destroy(); } catch (_) {}
    pdfState.pdfDoc = null;
  }
  // 显示加载状态
  const canvas = document.getElementById('pdf-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  try {
    // 使用 fetch + ArrayBuffer 加载 PDF（携带 JWT 鉴权头），再喂给 PDF.js
    // 这样可以避免 PDF.js 内部 fetch 不携带 Authorization 头导致 401 的问题
    const token = state.token;
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    const resp = await fetch(pdfUrl, { headers, credentials: 'include' });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    }
    const buf = await resp.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: buf });
    const pdf = await loadingTask.promise;
    pdfState.pdfDoc = pdf;
    pdfState.url = pdfUrl;
    pdfState.filename = filename || '';
    pdfState.totalPages = pdf.numPages;
    pdfState.pageNum = 1;
    pdfState.allPagesAnnos = {};
    // 更新 UI
    const totalEl = document.getElementById('pdf-page-total');
    if (totalEl) totalEl.textContent = pdf.numPages;
    const inputEl = document.getElementById('pdf-page-input');
    if (inputEl) { inputEl.max = pdf.numPages; inputEl.value = 1; }
    const fnEl = document.getElementById('pdf-filename');
    if (fnEl) { fnEl.textContent = filename || ''; fnEl.title = filename || ''; }
    // 渲染首页
    await renderPdfPage(1);
    // 加载首页标注
    if (brushState.diaryId) {
      const all = loadAnnotations(brushState.diaryId);
      // PDF 模式：标注为按页对象，仅接受对象结构（数组为 Markdown 旧数据，忽略）
      pdfState.allPagesAnnos = (all && typeof all === 'object' && !Array.isArray(all)) ? all : {};
      initAnnotationsForDiary(brushState.diaryId);
    }
    return true;
  } catch (err) {
    console.error('PDF 加载失败:', err);
    toast('PDF 加载失败：' + (err.message || '未知错误'), 'error');
    return false;
  }
}

// 渲染指定页
async function renderPdfPage(num) {
  if (!pdfState.pdfDoc) return;
  num = Math.max(1, Math.min(pdfState.totalPages, num));
  pdfState.pageNum = num;
  const pageInput = document.getElementById('pdf-page-input');
  if (pageInput) pageInput.value = num;
  // 取消上一次渲染
  if (pdfState.renderTask) {
    try { pdfState.renderTask.cancel(); } catch (_) {}
    pdfState.renderTask = null;
  }
  const page = await pdfState.pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: pdfState.scale });
  const canvas = document.getElementById('pdf-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  // 高分屏优化
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = viewport.width + 'px';
  canvas.style.height = viewport.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  pdfState.renderTask = page.render({
    canvasContext: ctx,
    viewport: page.getViewport({ scale: pdfState.scale * dpr })
  });
  try {
    await pdfState.renderTask.promise;
  } catch (e) {
    if (e.name !== 'RenderingCancelledException') console.warn('PDF 渲染错误', e);
  } finally {
    pdfState.renderTask = null;
  }
  // 重新计算标注层尺寸（让 SVG 与 canvas 像素对齐）
  setTimeout(resizeAnnotationLayer, 50);
  // 渲染当前页标注
  initAnnotationsForDiary(brushState.diaryId);
}

// 进入 PDF 模式（隐藏 markdown 预览、显示 PDF 查看器）
function enterPdfMode() {
  pdfState.active = true;
  const preview = document.getElementById('editor-preview');
  const pdfViewer = document.getElementById('pdf-viewer');
  if (preview) preview.style.display = 'none';
  if (pdfViewer) pdfViewer.style.display = 'flex';
  // 在 body 上加标记，CSS 可用 :has() 或属性选择器定位 PDF 模式
  const body = document.querySelector('.editor-body');
  if (body) body.setAttribute('data-pdf-mode', 'active');
}

// 退出 PDF 模式
function exitPdfMode() {
  pdfState.active = false;
  const preview = document.getElementById('editor-preview');
  const pdfViewer = document.getElementById('pdf-viewer');
  if (preview) preview.style.display = '';
  if (pdfViewer) pdfViewer.style.display = 'none';
  if (pdfState.pdfDoc) {
    try { pdfState.pdfDoc.destroy(); } catch (_) {}
    pdfState.pdfDoc = null;
  }
  pdfState.allPagesAnnos = {};
  const body = document.querySelector('.editor-body');
  if (body) body.removeAttribute('data-pdf-mode');
  // 标注层重新计算
  setTimeout(resizeAnnotationLayer, 50);
}

// 在保存 PDF 标注时，按页保存到 localStorage
function savePdfAnnotations() {
  if (!brushState.diaryId) {
    toast('请先保存日记', 'error');
    return false;
  }
  // 把当前页标注存回 allPagesAnnos
  pdfState.allPagesAnnos[String(pdfState.pageNum)] = brushState.paths.slice();
  // 保存整个 allPagesAnnos 到 localStorage
  return saveAnnotationsToStorage(brushState.diaryId, pdfState.allPagesAnnos);
}

// 在切换页面前，把当前页标注缓存到 allPagesAnnos
function stashCurrentPageAnnos() {
  if (pdfState.active) {
    pdfState.allPagesAnnos[String(pdfState.pageNum)] = brushState.paths.slice();
  }
}

// 上传 PDF
async function handlePdfUpload(file) {
  if (!file) return;
  if (!brushState.diaryId) {
    toast('请先保存日记后再上传 PDF', 'error');
    return;
  }
  const formData = new FormData();
  formData.append('pdf', file);
  try {
    const res = await fetch('/api/upload/pdf', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      body: formData
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '上传失败');
    }
    const data = await res.json();
    // 把 pdf_filename 写入日记
    const saveRes = await fetch(`/api/diaries/${brushState.diaryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ pdf_filename: data.filename, pdf_pages: 0 })
    });
    if (!saveRes.ok) {
      const errData = await saveRes.json().catch(() => ({}));
      throw new Error(errData.error || '写入日记失败');
    }
    toast('PDF 上传成功', 'success');
    // 加载 PDF（使用 API 返回的 url，已经是 /api/upload/pdf/... 格式）
    await loadPdf(data.url, data.originalName);
    // 把总页数写回（如果有元数据）
    enterPdfMode();
    // 切到预览模式
    const previewBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="preview"]');
    if (previewBtn) previewBtn.click();
    // 显示移除按钮
    const removeBtn = document.getElementById('btn-remove-pdf');
    if (removeBtn) removeBtn.style.display = '';
    // 更新上传按钮文字
    const uploadText = document.getElementById('btn-upload-pdf-text');
    if (uploadText) uploadText.textContent = '替换 PDF';
  } catch (e) {
    toast('PDF 上传失败：' + e.message, 'error');
  }
}

// 移除 PDF
async function handleRemovePdf() {
  if (!confirm('确认移除该 PDF 附件？此操作不会删除原始文件。')) return;
  if (!brushState.diaryId) return;
  try {
    const res = await fetch(`/api/diaries/${brushState.diaryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ pdf_filename: null, pdf_pages: 0 })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '操作失败');
    }
    exitPdfMode();
    // 同时清空 localStorage 标注
    if (brushState.diaryId) {
      try { localStorage.removeItem(ANNOTATION_STORAGE_PREFIX + brushState.diaryId); } catch (_) {}
    }
    brushState.paths = [];
    renderAllAnnotations();
    // 隐藏移除按钮
    const removeBtn = document.getElementById('btn-remove-pdf');
    if (removeBtn) removeBtn.style.display = 'none';
    const uploadText = document.getElementById('btn-upload-pdf-text');
    if (uploadText) uploadText.textContent = '上传 PDF';
    // 切回分屏
    const splitBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="split"]');
    if (splitBtn) splitBtn.click();
    toast('已移除 PDF 附件', 'success');
  } catch (e) {
    toast('移除失败：' + e.message, 'error');
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function excerpt(text, len = 120) {
  if (!text) return '';
  const stripped = text.replace(/[#*`~>\-!\[\]()_]/g, '').replace(/\n+/g, ' ').trim();
  return stripped.length > len ? stripped.slice(0, len) + '…' : stripped;
}

function formatDate(s) {
  if (!s) return '';
  let normalized = String(s).replace(/\//g, '-');
  if (!/[+-]\d{2}:\d{2}$/.test(normalized) && !normalized.endsWith('Z')) {
    normalized = normalized.replace(' ', 'T');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(normalized)) {
      normalized += 'Z';
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      normalized += 'T00:00:00Z';
    }
  }
  const d = new Date(normalized);
  if (isNaN(d)) return s;
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return Math.floor(diff/60) + ' 分钟前';
  if (diff < 86400) return Math.floor(diff/3600) + ' 小时前';
  if (diff < 86400*7) return Math.floor(diff/86400) + ' 天前';
  return d.toLocaleDateString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' });
}

function fixChineseFilenameFront(name) {
  if (!name) return '文件';
  try {
    if (/[\u0080-\u00FF]/.test(name) && !/[\u4e00-\u9fa5]/.test(name)) {
      const bytes = new Uint8Array(Array.from(name).map(c => c.charCodeAt(0)));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      if (decoded && !decoded.includes('\uFFFD')) return decoded;
    }
  } catch (_) {}
  return name;
}

// ===== 状态管理 =====
// 注意：不再将 token 明文写入 document.cookie。
// 服务端登录时已设置 HttpOnly cookie（见 routes/auth.js setAuthCookie），
// <img src="/uploads/..."> 等请求会自动携带；JS 写入的明文 cookie 会扩大 token 暴露面。
const initialToken = localStorage.getItem('treeks_token');

const state = {
  token: initialToken,
  user: JSON.parse(localStorage.getItem('treeks_user') || 'null'),
  currentView: 'list',
  currentNav: 'list',
  editingId: null,
  diaries: [],
  page: 1,
  pages: 1,
  total: 0,
  filter: { keyword: '', tag: '', date: '' },
  tags: [],
  saveTimer: null,
  selectMode: false,
  exportTemplates: [],
  exportContext: { ids: [], source: 'list' },
  // 编辑器：当前指定可见用户列表（避免每次保存时重新选择）
  visibleTo: [],
  visibleToUsers: [], // 缓存用户信息（id/username/nickname/avatar）用于展示
  // 文件夹相关
  folders: [],          // 后端返回的文件夹列表（含 diary_count）
  currentFolder: 'all', // 当前选中：'all' | null(默认文件夹) | <数字ID>
  // 编辑器光标位置记录（模板插入等场景使用；弹窗打开抢焦点后仍能定位原光标）
  editorCursor: null,   // { start, end } 或 null（未在编辑器中停留过光标）
};

// 触发文件下载：使用 fetch + Blob，避免 ORB / 导航中止问题
// url: 请求地址；fallbackFilename: 服务端未返回文件名时使用
async function downloadAuthenticatedUrl(url, fallbackFilename) {
  try {
    const res = await fetch(url, {
      headers: state.token ? { 'Authorization': 'Bearer ' + state.token } : {}
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `导出失败 (${res.status})`);
    }
    const blob = await res.blob();
    // 从 Content-Disposition 解析文件名
    let filename = fallbackFilename;
    const cd = res.headers.get('Content-Disposition') || '';
    const m1 = cd.match(/filename\*=UTF-8''([^;]+)/i);
    const m2 = cd.match(/filename="([^"]+)"/i);
    if (m1) filename = decodeURIComponent(m1[1]);
    else if (m2) filename = decodeURIComponent(m2[1]);
    if (!filename) filename = 'download.bin';

    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(objUrl);
    }, 1500);
    return true;
  } catch (e) {
    toast(e.message || '下载失败', 'error');
    return false;
  }
}

// ===== API 工具 =====
async function api(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = isFormData ? { ...(options.headers || {}) } : { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  try {
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        logout();
        throw new Error(data.error || '登录已过期，请重新登录');
      }
      if (res.status === 403) {
        throw new Error(data.error || '没有权限执行此操作');
      }
      if (res.status === 404) {
        throw new Error(data.error || '请求的资源不存在');
      }
      if (res.status === 413) {
        throw new Error(data.error || '文件过大，超过服务器限制');
      }
      if (res.status === 429) {
        throw new Error('操作过于频繁，请稍后再试');
      }
      if (res.status >= 500) {
        throw new Error(data.error || '服务器暂时不可用，请稍后重试');
      }
      throw new Error(data.error || `请求失败 (${res.status})`);
    }
    return data;
  } catch (e) {
    if (e.message === 'Failed to fetch' || e.message === 'NetworkError when attempting to fetch resource.') {
      throw new Error('网络连接失败，请检查服务是否运行');
    }
    // 超时
    if (e.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试');
    }
    throw e;
  }
}

// 图片上传前压缩：超过 1.5MB 或边长超 2560px 的图片，降采样并转 JPEG（约 85% 质量）
// 显著降低存储占用与加载体积；失败时静默回退原文件，不影响既有流程
async function compressImageFile(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif' || file.size <= 1.5 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDim = 2560;
    let width = bitmap.width;
    let height = bitmap.height;
    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    if (bitmap.close) bitmap.close();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.(png|webp|bmp)$/i, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() });
  } catch (_) {
    return file;
  }
}

async function apiUpload(file) {
  // 统一走 /api/upload/file 端点（后端会自动判断 kind：image / pdf / other）
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload/file', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + state.token },
    body: fd
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '上传失败');
  return data;
}

// ===== Toast =====
// type: 'success' | 'error' | 'info' | 'warning' | ''
// 错误提示展示时间更长（4.5s），让用户充分阅读；其他类型 2.8s
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  // 安全转义，防止 HTML 注入（虽然 textContent 已处理，但保险起见）
  el.textContent = msg;
  // 先移除 hide（如果有），再触发 show（用 rAF 让浏览器把"移除 hide"和"添加 show"分到两帧，触发过渡）
  el.classList.remove('hide');
  el.className = 'toast show ' + type;
  clearTimeout(toast._t);
  const duration = type === 'error' ? 4500 : (type === 'warning' ? 3800 : 2800);
  // 关闭时先添加 hide 类触发退场过渡，再等动画结束后清除
  toast._t = setTimeout(() => {
    el.classList.add('hide');
    el.classList.remove('show');
    toast._t = setTimeout(() => { el.className = 'toast'; }, 320);
  }, duration);
}

// ===== Modal =====
let closeModal = () => {};

function showModal(title, body, onConfirm, opts = {}) {
  const modal = document.getElementById('modal');
  // 关键：先关闭上一个弹窗（此时旧 close 被调用，display 设为 none），再设置新内容
  closeModal();
  // 取消任何残留的关闭动画类，避免与新打开动画叠加
  modal.classList.remove('closing');
  if (modal._closeTimer) { clearTimeout(modal._closeTimer); modal._closeTimer = null; }
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-cancel').style.display = opts.hideCancel ? 'none' : '';
  document.getElementById('modal-confirm').textContent = opts.confirmText || '确定';
  document.getElementById('modal-confirm').className = 'btn ' + (opts.danger ? 'btn-danger' : 'btn-primary');
  const confirmBtn = document.getElementById('modal-confirm');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  const backdrop = modal.querySelector('.modal-backdrop');
  const close = () => {
    if (modal.style.display === 'none') return;
    // 触发关闭动画：CSS .modal.closing 0.18s 后再隐藏 display
    modal.classList.add('closing');
    if (modal._closeTimer) clearTimeout(modal._closeTimer);
    modal._closeTimer = setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('closing');
      modal._closeTimer = null;
      confirmBtn.onclick = null;
      confirmBtn.disabled = false;
    }, 180);
  };
  closeModal = close;
  const onConfirmHandler = async () => {
    if (onConfirm) {
      // 防止异步期间重复点击
      confirmBtn.disabled = true;
      try {
        const result = await onConfirm();
        // 如果 onConfirm 返回 false，不关闭模态
        if (result === false) { confirmBtn.disabled = false; return; }
      } catch (e) {
        // 出错时不关闭模态，让用户看到 toast 错误提示后手动关闭或重试
        confirmBtn.disabled = false;
        return;
      }
    }
    close();
  };
  confirmBtn.onclick = onConfirmHandler;
  closeBtn.onclick = close;
  cancelBtn.onclick = close;
  backdrop.onclick = close;
  // 最后再显示，确保所有状态就绪
  modal.style.display = 'flex';
}

// ===== 认证 =====
function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('treeks_token', token);
  localStorage.setItem('treeks_user', JSON.stringify(user));
}

async function logout() {
  // 通知后端清除 cookie（treeks_token）
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (_) { /* 忽略网络错误，仍继续本地清理 */ }
  state.token = null;
  state.user = null;
  localStorage.removeItem('treeks_token');
  localStorage.removeItem('treeks_user');
  stopHeartbeat();
  // 清理协同 WebSocket、轮询定时器等资源，防止登出后继续请求/保持连接
  if (typeof collabWs !== 'undefined' && collabWs) {
    try { collabWs.close(); } catch (_) {}
    collabWs = null;
  }
  if (typeof collabCurrentDiaryId !== 'undefined') collabCurrentDiaryId = null;
  if (typeof msgState !== 'undefined' && msgState.pollTimer) {
    clearInterval(msgState.pollTimer);
    msgState.pollTimer = null;
  }
  if (typeof clearFriendsRefreshTimer === 'function') clearFriendsRefreshTimer();
  showAuthView();
}

function showAuthView() {
  document.getElementById('auth-view').style.display = 'flex';
  document.getElementById('main-view').style.display = 'none';
  // 登录/注册页不显示移动端底部导航
  const nav = document.querySelector('.mobile-bottom-nav');
  if (nav) nav.classList.remove('show');
}

function showMainView() {
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('main-view').style.display = 'grid';
  renderUserCard();
  updateAdminNavVisibility();
  navigateTo('list');
  loadTags();
  updateNavBadges();
  // 启动心跳：保持当前用户活跃状态（用于好友在线/离线判定）
  startHeartbeat();
  // 已登录：恢复移动端底部导航显示
  const nav = document.querySelector('.mobile-bottom-nav');
  if (nav) nav.classList.add('show');
}

// ===== 心跳：每 30s 一次，用于在线/离线判定（结合 WebSocket 协同） =====
let heartbeatTimer = null;
function startHeartbeat() {
  if (heartbeatTimer) return;
  const send = async () => {
    if (!state.token) return;
    try { await api('/api/auth/heartbeat', { method: 'POST' }); }
    catch (_) { /* 静默 */ }
  };
  // 立即触发一次，随后每 30 秒一次
  send();
  heartbeatTimer = setInterval(send, 30 * 1000);
}
function stopHeartbeat() {
  if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
}

function renderUserCard() {
  if (!state.user) return;
  const name = state.user.nickname || state.user.username;
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-handle').textContent = '@' + state.user.username;
  const avatarEl = document.getElementById('user-avatar');
  if (state.user.avatar) {
    avatarEl.textContent = '';
    avatarEl.classList.add('avatar-with-img');
    let img = avatarEl.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = name;
      avatarEl.appendChild(img);
    }
    if (img.src !== state.user.avatar && !img.src.endsWith(state.user.avatar)) {
      img.src = state.user.avatar;
    }
  } else {
    avatarEl.classList.remove('avatar-with-img');
    avatarEl.textContent = name.charAt(0).toUpperCase();
  }
  if (state.user.bio) {
    document.getElementById('user-handle').textContent = state.user.bio;
  }
}

// 根据当前用户是否为管理员，显示/隐藏管理员导航
function updateAdminNavVisibility() {
  const section = document.getElementById('admin-nav-section');
  if (!section) return;
  section.style.display = (state.user && state.user.is_admin) ? '' : 'none';
}

// ===== 视图切换 =====
function showView(name) {
  state.currentView = name;
  document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');

  // 同步高亮移动端底部导航
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    if (item.dataset.mobileView === name) item.classList.add('active');
    else item.classList.remove('active');
  });

  // 离开好友页面时停止定时刷新
  const inFriendsPanel = name === 'messages' && typeof msgState !== 'undefined' && msgState.tab === 'friends';
  if (name !== 'friends' && !inFriendsPanel && typeof clearFriendsRefreshTimer === 'function') {
    clearFriendsRefreshTimer();
  }
  // 离开消息页时停止录音
  if (name !== 'messages' && typeof stopMsgVoiceIfRecording === 'function') {
    stopMsgVoiceIfRecording();
  }
}

function navigateTo(nav) {
  if (nav === 'templates') {
    showView('templates');
    if (typeof renderTemplatePageGrid === 'function') {
      renderTemplatePageGrid();
    }
    state.currentNav = nav;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.sidebar-nav .nav-item[data-nav="${nav}"]`);
    if (btn) btn.classList.add('active');
    return;
  }
  state.currentNav = nav;
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-item[data-nav="${nav}"]`);
  if (btn) btn.classList.add('active');

  // 离开列表时关闭批量选择模式
  if (state.selectMode && nav !== 'list' && nav !== 'pinned') {
    toggleSelectMode(false);
  }
  // 离开消息视图时清理轮询定时器
  if (nav !== 'messages' && typeof msgState !== 'undefined' && msgState.pollTimer) {
    clearInterval(msgState.pollTimer);
    msgState.pollTimer = null;
  }

  // 重置筛选
  if (nav === 'list') {
    state.filter = { keyword: '', tag: '', date: '' };
    document.getElementById('search-input').value = '';
    document.getElementById('filter-tag').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('clear-search').style.display = 'none';
    document.getElementById('list-title').textContent = '全部日记';
    state.currentFolder = 'all';
    showView('list');
    loadFolders();
    loadDiaries();
  } else if (nav === 'pinned') {
    document.getElementById('list-title').textContent = '置顶日记';
    showView('list');
    loadFolders();
    loadDiaries({ pinned: true });
  } else if (nav === 'stats') {
    showView('stats');
    loadStats();
  } else if (nav === 'images' || nav === 'files') {
    showView('files');
    loadFiles();
  } else if (nav === 'calendar') {
    showView('calendar');
    loadCalendar();
  } else if (nav === 'friends') {
    // 好友功能已合并进消息页
    msgState.tab = 'friends';
    showView('messages');
    loadMessagesView();
    switchMsgMainTab('friends');
  } else if (nav === 'letters') {
    // 信件功能已合并进消息页
    msgState.tab = 'letters';
    showView('messages');
    loadMessagesView();
    switchMsgMainTab('letters');
  } else if (nav === 'messages') {
    msgState.tab = 'chat';
    showView('messages');
    loadMessagesView();
  } else if (nav === 'shared') {
    showView('shared');
    loadSharedView();
  } else if (nav === 'theme' || nav === 'my-data') {
    // 主题设置与我的数据已并入个人设置页
    navigateTo('profile');
    return;
  } else if (nav === 'admin-dashboard') {
    showView('admin-dashboard');
    loadAdminDashboard();
  } else if (nav === 'admin-users') {
    showView('admin-users');
    loadAdminUsers();
  } else if (nav === 'admin-settings') {
    showView('admin-settings');
    loadAdminSettings();
  } else if (nav === 'admin-system') {
    showView('admin-system');
    loadAdminSystem();
  } else if (nav === 'admin-logs') {
    showView('admin-logs');
    loadAdminLogs();
  } else if (nav === 'admin-data') {
    showView('admin-data');
    loadAdminData();
  }
}

// ===== 文件夹管理 =====
const FOLDER_COLORS = [
  '#4c995c', '#5b8def', '#f0a732', '#e9618c',
  '#9b6cd9', '#3bb4c4', '#e6783a', '#6f7785'
];

// 加载文件夹列表（含日记数量）
async function loadFolders() {
  try {
    const folders = await api('/api/diaries/folders');
    state.folders = Array.isArray(folders) ? folders : (folders.items || []);
    renderFolders();
  } catch (e) {
    // 静默失败，不打扰用户
    console.warn('加载文件夹失败:', e.message);
  }
}

// 渲染文件夹侧边栏（"全部" + "默认文件夹" + 用户文件夹）
function renderFolders() {
  const list = document.getElementById('folder-list');
  if (!list) return;

  // "全部"计数：优先用后端在 folders[0].total_diaries 中返回的总数；
  // 否则若当前正在查看"全部"，使用 state.total；都没有则留空
  let totalAll = '';
  const foldersArr = state.folders || [];
  if (foldersArr.length && typeof foldersArr[0].total_diaries === 'number') {
    totalAll = foldersArr[0].total_diaries;
  } else if (state.currentFolder === 'all' && typeof state.total === 'number') {
    totalAll = state.total;
  }

  // "默认文件夹"计数：依赖后端在 folders[0].default_diary_count 中返回，否则留空
  let defaultCount = '';
  if (foldersArr.length && typeof foldersArr[0].default_diary_count === 'number') {
    defaultCount = foldersArr[0].default_diary_count;
  }

  const allActive = state.currentFolder === 'all';
  const defaultActive = state.currentFolder === null;

  const userFoldersHtml = foldersArr.map(f => {
    const fid = f.id;
    const active = state.currentFolder === fid;
    const color = f.color || '#4c995c';
    return `
      <div class="folder-item ${active ? 'active' : ''}" data-folder-id="${fid}" title="${escapeHtml(f.name)}">
        <span class="folder-color-bar" style="background:${escapeHtml(color)};"></span>
        <span class="folder-item-name">${escapeHtml(f.name)}</span>
        <span class="folder-item-count">${f.diary_count != null ? f.diary_count : ''}</span>
        <span class="folder-item-actions">
          <button class="folder-item-action" data-action="rename" data-folder-id="${fid}" data-folder-name="${escapeHtml(f.name)}" data-folder-color="${escapeHtml(color || '')}" title="重命名">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
          <button class="folder-item-action danger" data-action="delete" data-folder-id="${fid}" data-folder-name="${escapeHtml(f.name)}" title="删除">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </span>
      </div>
    `;
  }).join('');

  list.innerHTML = `
    <div class="folder-item ${allActive ? 'active' : ''}" data-folder-id="all" title="所有文件夹的日记">
      <span class="folder-color-bar all"></span>
      <span class="folder-item-name">全部</span>
      <span class="folder-item-count">${totalAll}</span>
    </div>
    <div class="folder-item ${defaultActive ? 'active' : ''}" data-folder-id="default" title="未分配文件夹的日记">
      <span class="folder-color-bar default"></span>
      <span class="folder-item-name">默认文件夹</span>
      <span class="folder-item-count">${defaultCount}</span>
    </div>
    ${userFoldersHtml}
  `;

  // 绑定点击切换
  list.querySelectorAll('.folder-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // 点击操作按钮不触发切换
      if (e.target.closest('.folder-item-action')) return;
      const fid = item.dataset.folderId;
      selectFolder(fid);
    });
  });
  // 绑定重命名/删除按钮
  list.querySelectorAll('.folder-item-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const fid = parseInt(btn.dataset.folderId, 10);
      const name = btn.dataset.folderName || '';
      const color = btn.dataset.folderColor || '';
      if (action === 'rename') {
        openFolderForm({ id: fid, name, color });
      } else if (action === 'delete') {
        confirmDeleteFolder(fid, name);
      }
    });
  });
}

// 切换当前文件夹
function selectFolder(folderIdStr) {
  let fid;
  if (folderIdStr === 'all') {
    fid = 'all';
  } else if (folderIdStr === 'default') {
    fid = null;
  } else {
    fid = parseInt(folderIdStr, 10);
    if (isNaN(fid)) return;
  }
  state.currentFolder = fid;
  state.page = 1;
  // 更新列表标题（textContent 自动转义，无需 escapeHtml）
  let title = '全部日记';
  if (fid === null) title = '默认文件夹';
  else if (fid !== 'all') {
    const f = (state.folders || []).find(x => x.id === fid);
    if (f) title = f.name;
  }
  const titleEl = document.getElementById('list-title');
  if (titleEl) titleEl.textContent = title;
  // 重新渲染激活态（避免等待 loadDiaries）
  renderFolders();
  loadDiaries();
}

// 打开文件夹新建/编辑弹窗
// mode: {id?, name, color} - 有 id 为编辑，无 id 为新建
function openFolderForm(opts = {}) {
  const isEdit = !!opts.id;
  const name = opts.name || '';
  const color = opts.color || FOLDER_COLORS[0];
  const title = isEdit ? '重命名文件夹' : '新建文件夹';
  const confirmText = isEdit ? '保存' : '创建';

  const body = `
    <div class="folder-form">
      <div class="form-group">
        <label>文件夹名称</label>
        <input type="text" id="folder-form-name" class="form-input" value="${escapeHtml(name)}" placeholder="输入文件夹名称" maxlength="30" autofocus>
      </div>
      <div class="form-group">
        <label>颜色</label>
        <div class="folder-color-picker" id="folder-color-picker">
          ${FOLDER_COLORS.map(c => `
            <button type="button" class="folder-color-swatch ${c === color ? 'selected' : ''}" data-color="${c}" style="background:${c};" title="${c}"></button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  let selectedColor = color;
  showModal(title, body, async () => {
    const input = document.getElementById('folder-form-name');
    const newName = (input?.value || '').trim();
    if (!newName) {
      toast('请输入文件夹名称', 'error');
      return false;
    }
    try {
      if (isEdit) {
        await api(`/api/diaries/folders/${opts.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: newName, color: selectedColor })
        });
        toast('已更新', 'success');
      } else {
        const created = await api('/api/diaries/folders', {
          method: 'POST',
          body: JSON.stringify({ name: newName, color: selectedColor })
        });
        toast('已创建', 'success');
        // 若调用方提供了 onCreated 回调（如"移动到新文件夹"流程），调用之
        if (typeof opts.onCreated === 'function' && created && created.id) {
          await loadFolders();
          await opts.onCreated(created.id);
          return;
        }
      }
      await loadFolders();
      // 若当前正在查看的文件夹被重命名，更新标题
      if (state.currentFolder === opts.id) {
        const titleEl = document.getElementById('list-title');
        if (titleEl) titleEl.textContent = newName;
      }
    } catch (e) {
      toast(e.message, 'error');
      return false;
    }
  }, { confirmText });

  // 颜色选择
  setTimeout(() => {
    const picker = document.getElementById('folder-color-picker');
    if (picker) {
      picker.querySelectorAll('.folder-color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          picker.querySelectorAll('.folder-color-swatch').forEach(s => s.classList.remove('selected'));
          sw.classList.add('selected');
          selectedColor = sw.dataset.color;
        });
      });
    }
    const input = document.getElementById('folder-form-name');
    if (input) {
      input.focus();
      input.select();
      // 回车提交
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          document.getElementById('modal-confirm').click();
        }
      });
    }
  }, 50);
}

// 确认删除文件夹
function confirmDeleteFolder(id, name) {
  showModal(
    '删除文件夹',
    `<p>确定要删除文件夹 <strong>${escapeHtml(name)}</strong> 吗？</p>
     <p style="color:var(--fg-muted);font-size:13px;margin-top:8px;">文件夹内的日记将自动移动到"默认文件夹"，不会被删除。</p>`,
    async () => {
      try {
        await api(`/api/diaries/folders/${id}`, { method: 'DELETE' });
        toast('已删除文件夹', 'success');
        // 若当前正在查看被删除的文件夹，回到"全部"
        if (state.currentFolder === id) {
          state.currentFolder = 'all';
          const titleEl = document.getElementById('list-title');
          if (titleEl) titleEl.textContent = '全部日记';
        }
        await loadFolders();
        await loadDiaries();
      } catch (e) {
        toast(e.message, 'error');
      }
    },
    { danger: true, confirmText: '删除' }
  );
}

// 移动日记到指定文件夹
// folderId: null(默认) | <数字> | 'new'(新建)
async function moveDiaryToFolder(diaryId, folderId) {
  if (folderId === 'new') {
    // 先新建文件夹，再移动
    openFolderForm({
      onCreated: async (newFolderId) => {
        try {
          await api(`/api/diaries/${diaryId}`, {
            method: 'PUT',
            body: JSON.stringify({ folder_id: newFolderId })
          });
          toast('已移动到新文件夹', 'success');
          await loadFolders();
          await loadDiaries();
        } catch (e) {
          toast(e.message, 'error');
        }
      }
    });
    return;
  }
  const target = folderId === null ? null : parseInt(folderId, 10);
  if (isNaN(target) && folderId !== null) return;
  try {
    await api(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      body: JSON.stringify({ folder_id: target })
    });
    toast('已移动', 'success');
    await loadFolders();
    await loadDiaries();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// 渲染编辑器中的文件夹下拉选择
function renderEditorFolderSelect(selectedFolderId) {
  const sel = document.getElementById('editor-folder');
  if (!sel) return;
  const current = (selectedFolderId === undefined) ? state.currentFolder : selectedFolderId;
  // current 可能是 'all' / null / <数字>。编辑器中 'all' 视为默认文件夹
  let selectedVal = '';
  if (current !== 'all' && current != null) {
    selectedVal = String(current);
  }
  let html = `<option value="">默认文件夹</option>`;
  (state.folders || []).forEach(f => {
    html += `<option value="${f.id}" ${String(f.id) === selectedVal ? 'selected' : ''}>${escapeHtml(f.name)}</option>`;
  });
  sel.innerHTML = html;
  if (selectedVal) sel.value = selectedVal;
  else sel.value = '';
}

// 关闭所有"移动到"下拉菜单（用于全局点击关闭）
function closeAllMoveFolderMenus() {
  document.querySelectorAll('.move-folder-menu').forEach(m => m.remove());
}

// ===== 加载日记列表 =====
async function loadDiaries(opts = {}) {
  const params = new URLSearchParams();
  if (state.filter.keyword) params.set('keyword', state.filter.keyword);
  if (state.filter.tag) params.set('tag', state.filter.tag);
  if (state.filter.date) params.set('date', state.filter.date);
  params.set('page', state.page);
  params.set('limit', 15);

  // 文件夹过滤：'all' = 全部；null = 默认文件夹；<数字> = 指定文件夹
  // pinned 视图不传 folder_id（保留原行为）
  if (!opts.pinned) {
    if (state.currentFolder === 'all') {
      params.set('folder_id', 'all');
    } else if (state.currentFolder === null) {
      params.set('folder_id', 'null');
    } else if (state.currentFolder) {
      params.set('folder_id', state.currentFolder);
    }
  }

  // 骨架屏：网络请求期间显示占位卡片，避免界面"卡住"无响应感
  // 仅在非快速过滤（首次加载/翻页）时显示，避免每次输入都闪一下
  if (!opts.silent) showSkeletonList(5);

  try {
    const data = await api('/api/diaries?' + params.toString());
    state.diaries = data.items;
    state.pages = data.pages;
    state.total = data.total;
    renderDiaryList(data, opts);
    // 更新文件夹侧边栏的"全部"计数（仅当当前查看"全部"时）
    if (state.currentFolder === 'all') {
      const allItem = document.querySelector('.folder-item[data-folder-id="all"] .folder-item-count');
      if (allItem) allItem.textContent = state.total != null ? state.total : '';
    }
  } catch (e) {
    toast(e.message, 'error');
  }
}

// 骨架屏占位：网络请求期间显示 shimmer 卡片，渲染真实数据时自动替换
function showSkeletonList(count = 5) {
  const list = document.getElementById('diary-list');
  if (!list) return;
  const items = Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `).join('');
  list.innerHTML = items;
}

function renderDiaryList(data, opts = {}) {
  const list = document.getElementById('diary-list');
  const countEl = document.getElementById('list-count');
  countEl.textContent = `共 ${data.total} 篇`;

  if (data.items.length === 0) {
    let msg = '还没有日记，点击"写新日记"开始记录吧';
    let hint = '记录生活中的每一片绿叶';
    let illust = ILLUSTRATIONS.emptyList;
    if (state.filter.keyword || state.filter.tag || state.filter.date) {
      msg = '没有符合筛选条件的日记';
      hint = '尝试调整搜索关键词或筛选条件';
      illust = ILLUSTRATIONS.emptyFilter;
    }
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-illustration">${illust}</div>
        <h3>暂无内容</h3>
        <p>${msg}</p>
        <div class="empty-decoration">${hint}</div>
      </div>`;
    document.getElementById('list-pagination').innerHTML = '';
    return;
  }

  list.innerHTML = data.items.map(d => `
    <article class="diary-card ${d.is_pinned ? 'pinned' : ''} ${d.is_locked ? 'locked' : ''}" data-id="${d.id}" data-locked="${d.is_locked ? '1' : '0'}">
      <div class="diary-card-select" style="display:none;">
        <input type="checkbox" class="batch-checkbox" data-id="${d.id}">
      </div>
      <div class="diary-card-header">
        <div class="diary-card-title">
          ${d.is_locked ? '<span style="color:var(--accent);margin-right:4px;" title="已设置私密锁">🔒</span>' : ''}
          <span class="diary-card-title-text">${escapeHtml(d.title || '无标题')}</span>
        </div>
        <div class="diary-card-meta">
          ${d.mood ? `<span class="diary-card-meta-item" title="心情">${escapeHtml(d.mood)}</span>` : ''}
          ${d.weather ? `<span class="diary-card-meta-item" title="天气">${escapeHtml(d.weather)}</span>` : ''}
          <span class="diary-card-meta-item date">${formatDate(d.created_at)}</span>
        </div>
      </div>
      ${d.is_locked ? `
        <div class="diary-card-excerpt" style="color:var(--accent);font-weight:500;">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          私密保护日记 · 点击输入 4 位 PIN 码解锁
        </div>
      ` : `
        <div class="diary-card-excerpt">${escapeHtml(excerpt(d.content))}</div>
      `}
      ${d.tags && d.tags.length ? `
        <div class="diary-card-tags">
          ${d.tags.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
      <div class="diary-card-actions">
        <button class="action-btn pin-btn" data-id="${d.id}" title="${d.is_pinned ? '取消置顶' : '置顶'}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="${d.is_pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L8 6v6L4 16h6v6l2-2 2 2v-6h6l-4-4V6l-4-4z"/></svg>
        </button>
        <div class="move-folder-wrap">
          <button class="action-btn move-folder-btn" data-id="${d.id}" data-folder-id="${d.folder_id == null ? '' : d.folder_id}" title="移动到文件夹">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <button class="action-btn edit-btn" data-id="${d.id}" title="编辑">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="action-btn export-card-btn" data-id="${d.id}" title="导出">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="action-btn danger del-btn" data-id="${d.id}" title="删除">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </article>
  `).join('');

  // 绑定事件：使用事件委托（仅绑定一次到 #diary-list 容器），
  // 替代之前为每个卡片单独绑定 6 类事件（cards × N → 6 次绑定），
  // 显著减少内存与监听器数量，且在重新渲染列表时无需解绑。
  if (!list._diaryDelegated) {
    list._diaryDelegated = true;
    list.addEventListener('click', e => {
      const actionBtn = e.target.closest('.action-btn');
      if (actionBtn) {
        e.stopPropagation();
        const id = parseInt(actionBtn.dataset.id, 10);
        if (isNaN(id)) return;
        if (actionBtn.classList.contains('pin-btn')) togglePin(id);
        else if (actionBtn.classList.contains('edit-btn')) {
          const card = actionBtn.closest('.diary-card');
          if (card && card.dataset.locked === '1') promptPinUnlock(id);
          else openEditor(id);
        }
        else if (actionBtn.classList.contains('del-btn')) confirmDelete(id);
        else if (actionBtn.classList.contains('export-card-btn')) openExportModal([id]);
        else if (actionBtn.classList.contains('move-folder-btn')) openMoveFolderMenu(actionBtn);
        return;
      }
      if (e.target.closest('.batch-checkbox')) return;
      if (e.target.closest('.diary-card-select')) return;
      const card = e.target.closest('.diary-card');
      if (!card) return;
      if (state.selectMode) {
        const cb = card.querySelector('.batch-checkbox');
        if (cb) {
          cb.checked = !cb.checked;
          updateBatchCount();
        }
        return;
      }
      const cardId = parseInt(card.dataset.id, 10);
      if (card.dataset.locked === '1') {
        promptPinUnlock(cardId);
      } else {
        openEditor(cardId);
      }
    });
    // change 事件不冒泡到 click，单独委托
    list.addEventListener('change', e => {
      if (e.target.classList && e.target.classList.contains('batch-checkbox')) {
        updateBatchCount();
      }
    });
    // 移动端长按日记卡片弹出快捷操作菜单
    // 支持触摸长按（600ms 无移动触发）与桌面右键（contextmenu）
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      let longPressTimer = null;
      let longPressStart = null;
      list.addEventListener('touchstart', e => {
        const card = e.target.closest('.diary-card');
        if (!card || state.selectMode) return;
        if (e.target.closest('.action-btn') || e.target.closest('.batch-checkbox')) return;
        longPressStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        longPressTimer = setTimeout(() => {
          longPressTimer = null;
          const id = parseInt(card.dataset.id, 10);
          if (!isNaN(id)) showDiaryQuickActions(card, id);
          if (navigator.vibrate) navigator.vibrate(15);
        }, 600);
      }, { passive: true });
      list.addEventListener('touchmove', e => {
        if (!longPressStart) return;
        const t = e.touches[0];
        if (Math.hypot(t.clientX - longPressStart.x, t.clientY - longPressStart.y) > 10) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
          longPressStart = null;
        }
      }, { passive: true });
      list.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressStart = null;
      }, { passive: true });
      list.addEventListener('touchcancel', () => {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressStart = null;
      }, { passive: true });
    }
  }

  renderPagination(data);
}

// 移动端长按日记卡片：弹出快捷操作菜单
function showDiaryQuickActions(card, id) {
  const title = card.querySelector('.diary-card-title-text');
  const name = title ? title.textContent.trim() : ('日记 #' + id);
  const isPinned = card.classList.contains('pinned');
  const isLocked = card.dataset.locked === '1';
  showModal(`📄 ${escapeHtml(name).slice(0, 24)}`, `
    <div class="quick-action-menu">
      <button class="qa-item" data-act="edit">✏️ 编辑</button>
      <button class="qa-item" data-act="pin">${isPinned ? '📌 取消置顶' : '📌 置顶'}</button>
      <button class="qa-item" data-act="export">📤 导出</button>
      <button class="qa-item" data-act="move">📁 移动文件夹</button>
      <button class="qa-item danger" data-act="delete">🗑 删除</button>
    </div>`, null, { hideFooter: true, hideCancel: true });
  // 点击操作项直接执行并关闭弹窗
  document.querySelectorAll('.quick-action-menu .qa-item').forEach(item => {
    item.onclick = () => {
      const action = item.dataset.act;
      closeModal();
      if (action === 'edit') {
        if (isLocked) promptPinUnlock(id); else openEditor(id);
      } else if (action === 'pin') {
        togglePin(id);
      } else if (action === 'export') {
        openExportModal([id]);
      } else if (action === 'move') {
        const moveBtn = card.querySelector('.move-folder-btn');
        if (moveBtn) openMoveFolderMenu(moveBtn);
      } else if (action === 'delete') {
        confirmDelete(id);
      }
    };
  });
}

// 打开"移动到文件夹"下拉菜单
function openMoveFolderMenu(btn) {
  const wrap = btn.parentElement; // .move-folder-wrap
  // 若当前按钮下已有菜单，则切换关闭
  const existing = wrap ? wrap.querySelector('.move-folder-menu') : null;
  closeAllMoveFolderMenus();
  if (existing) return; // 切换关闭
  const diaryId = parseInt(btn.dataset.id, 10);
  const currentFolderId = btn.dataset.folderId; // '' 表示默认文件夹
  if (!wrap || isNaN(diaryId)) return;

  const menu = document.createElement('div');
  menu.className = 'move-folder-menu';

  // 默认文件夹项
  const isDefault = currentFolderId === '';
  menu.innerHTML = `
    <div class="move-folder-menu-item ${isDefault ? 'current' : ''}" data-target-folder="">
      <span class="move-folder-menu-color" style="background:linear-gradient(180deg, var(--fg-tertiary), var(--fg-muted));"></span>
      <span>默认文件夹${isDefault ? ' ·' : ''}</span>
    </div>
    ${(state.folders || []).map(f => {
      const isCurrent = String(f.id) === String(currentFolderId);
      const color = f.color || '#4c995c';
      return `
        <div class="move-folder-menu-item ${isCurrent ? 'current' : ''}" data-target-folder="${f.id}">
          <span class="move-folder-menu-color" style="background:${escapeHtml(color)};"></span>
          <span>${escapeHtml(f.name)}${isCurrent ? ' ·' : ''}</span>
        </div>
      `;
    }).join('')}
    <div class="move-folder-menu-item create-new" data-target-folder="new">
      <span class="move-folder-menu-color" style="background:var(--accent);"></span>
      <span>+ 新建文件夹…</span>
    </div>
  `;

  wrap.appendChild(menu);

  // 绑定菜单项点击
  menu.querySelectorAll('.move-folder-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = item.dataset.targetFolder;
      let targetId;
      if (target === 'new') {
        targetId = 'new';
      } else if (target === '') {
        targetId = null;
      } else {
        targetId = parseInt(target, 10);
        if (isNaN(targetId)) return;
      }
      // 若选择的是当前所在文件夹，无需移动
      if (targetId !== 'new') {
        const same = (targetId === null && currentFolderId === '') ||
                     (String(targetId) === String(currentFolderId));
        if (same) {
          closeAllMoveFolderMenus();
          return;
        }
      }
      closeAllMoveFolderMenus();
      moveDiaryToFolder(diaryId, targetId);
    });
  });

  // 点击外部关闭
  setTimeout(() => {
    const onDocClick = (ev) => {
      if (!menu.contains(ev.target) && ev.target !== btn) {
        menu.remove();
        document.removeEventListener('click', onDocClick);
      }
    };
    document.addEventListener('click', onDocClick);
  }, 0);
}

function renderPagination(data) {
  const el = document.getElementById('list-pagination');
  if (data.pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  html += `<button class="page-btn" ${data.page <= 1 ? 'disabled' : ''} data-page="${data.page - 1}">‹</button>`;
  const range = 2;
  for (let i = 1; i <= data.pages; i++) {
    if (i === 1 || i === data.pages || (i >= data.page - range && i <= data.page + range)) {
      html += `<button class="page-btn ${i === data.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === data.page - range - 1 || i === data.page + range + 1) {
      html += `<span class="page-btn" style="border:none;background:transparent;">…</span>`;
    }
  }
  html += `<button class="page-btn" ${data.page >= data.pages ? 'disabled' : ''} data-page="${data.page + 1}">›</button>`;
  el.innerHTML = html;
  el.querySelectorAll('.page-btn[data-page]').forEach(b => {
    b.addEventListener('click', () => {
      state.page = parseInt(b.dataset.page, 10);
      loadDiaries();
      document.getElementById('view-list').scrollTop = 0;
    });
  });
}

async function togglePin(id) {
  try {
    const data = await api(`/api/diaries/${id}/pin`, { method: 'PATCH' });
    toast(data.is_pinned ? '已置顶' : '已取消置顶', 'success');
    loadDiaries();
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDelete(id) {
  showModal('删除日记', '确定要删除这篇日记吗？此操作无法撤销。', async () => {
    try {
      await api(`/api/diaries/${id}`, { method: 'DELETE' });
      toast('已删除', 'success');
      loadDiaries();
      loadTags();
    } catch (e) { toast(e.message, 'error'); }
  }, { danger: true, confirmText: '删除' });
}

// ===== 编辑器 =====
async function openEditor(id) {
  // 离开当前协同房间，避免新建日记时编辑内容被误同步到旧日记导致数据覆盖
  if (collabCurrentDiaryId && collabCurrentDiaryId !== id) {
    collabLeave(collabCurrentDiaryId);
  }
  state.editingId = id || null;
  state.editorCursor = null; // 重置光标位置记录（进入新日记后旧光标失效）
  showView('editor');

  // 重置编辑器模式为 split（默认），清除预览模式全屏状态
  const editorBody = document.querySelector('.editor-body');
  if (editorBody) {
    editorBody.classList.remove('mode-preview', 'mode-edit');
    editorBody.classList.add('mode-split');
  }
  const viewEditorEl = document.getElementById('view-editor');
  if (viewEditorEl) viewEditorEl.classList.remove('preview-fullscreen');
  document.querySelectorAll('#editor-mode-toggle .mode-btn').forEach(b => b.classList.remove('active'));
  const splitBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="split"]');
  if (splitBtn) splitBtn.classList.add('active');

  // 手机（<=768px）split 在窄屏已退化（预览栏被 CSS 隐藏），
  // 自动切入编辑模式，避免 split 按钮高亮但无预览的状态不一致
  if (window.matchMedia('(max-width: 768px)').matches) {
    const editBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="edit"]');
    if (editBtn) editBtn.click();
  }

  const titleInput = document.getElementById('editor-title');
  const textarea = document.getElementById('editor-textarea');
  const moodInput = document.getElementById('editor-mood');
  const weatherInput = document.getElementById('editor-weather');
  const tagsInput = document.getElementById('editor-tags');
  const pinnedInput = document.getElementById('editor-pinned');
  const visibilitySelect = document.getElementById('editor-visibility');
  const deleteBtn = document.getElementById('btn-delete-diary');
  const saveStatus = document.getElementById('save-status');
  const collabBtn = document.getElementById('btn-collaborators');
  const sendLetterBtn = document.getElementById('btn-send-letter');

  if (id) {
    try {
      const d = await api(`/api/diaries/${id}`);
      titleInput.value = d.title || '';
      textarea.value = d.content || '';
      moodInput.value = d.mood || '';
      weatherInput.value = d.weather || '';
      tagsInput.value = (d.tags || []).join(', ');
      pinnedInput.checked = d.is_pinned;
      visibilitySelect.value = d.visibility || 'private';
      deleteBtn.style.display = d.is_owner === false ? 'none' : '';
      // 非作者不能修改可见性/置顶
      const isOwner = d.is_owner !== false;
      pinnedInput.disabled = !isOwner;
      visibilitySelect.disabled = !isOwner;
      collabBtn.style.display = isOwner ? '' : 'none';
      sendLetterBtn.style.display = '';
      // 加载已保存的指定可见用户列表
      state.visibleTo = Array.isArray(d.visibleTo) ? d.visibleTo : [];
      state.visibleToUsers = Array.isArray(d.visibleToUsers) ? d.visibleToUsers : [];
      renderVisibleToBadge();
      // 文件夹选择：若日记已有所属文件夹则预选
      renderEditorFolderSelect(d.folder_id != null ? d.folder_id : null);
      setSaveStatus('已加载', 'saved');
      state.currentDiary = d;
      // 连接 WebSocket 协同
      collabJoin(id);
    } catch (e) {
      toast(e.message, 'error');
      showView('list');
    }
  } else {
    titleInput.value = '';
    textarea.value = '';
    moodInput.value = '';
    weatherInput.value = '';
    tagsInput.value = '';
    pinnedInput.checked = false;
    visibilitySelect.value = 'private';
    pinnedInput.disabled = false;
    visibilitySelect.disabled = false;
    deleteBtn.style.display = 'none';
    collabBtn.style.display = 'none';
    sendLetterBtn.style.display = 'none';
    // 清空指定可见用户
    state.visibleTo = [];
    state.visibleToUsers = [];
    renderVisibleToBadge();
    // 新建日记：默认文件夹选择为当前查看的文件夹（若为某个具体文件夹）
    renderEditorFolderSelect(state.currentFolder);
    setSaveStatus('草稿', 'draft');
    state.currentDiary = null;
  }
  // 同步收起状态与紧凑标题（顶部收起时仍能看到当前标题）
  if (typeof applyEditorCollapseState === 'function') applyEditorCollapseState();
  updatePreview();
  updateWordCount();
  // 初始化当前日记的笔刷标注数据
  initAnnotationsForDiary(id || null);
  // 刷新附件徽标
  refreshAttachmentBadge(id);
  // 如果该日记带 PDF 附件，自动加载并进入预览模式
  const diaryObj = state.currentDiary;
  if (diaryObj && diaryObj.pdf_filename) {
    autoLoadDiaryPdf(diaryObj);
  } else {
    // 任何不带 PDF 的情况：彻底清空 PDF 模式状态
    exitPdfMode();
  }
}

// 渲染"指定可见用户"徽标（在可见性下拉框旁展示当前已选用户）
function renderVisibleToBadge() {
  let badge = document.getElementById('visible-to-badge');
  if (!badge) {
    // 动态创建容器，紧邻可见性 select
    const select = document.getElementById('editor-visibility');
    if (!select) return;
    badge = document.createElement('div');
    badge.id = 'visible-to-badge';
    badge.className = 'visible-to-badge';
    select.parentNode.insertBefore(badge, select.nextSibling);
  }
  const users = state.visibleToUsers || [];
  if (!users.length) {
    badge.innerHTML = '';
    badge.style.display = 'none';
    return;
  }
  badge.style.display = '';
  badge.innerHTML = `
    <div class="visible-to-users">
      ${users.slice(0, 5).map(u => `
        <span class="visible-to-chip" title="${escapeHtml(u.nickname || u.username)}">
          ${userAvatarHtml(u, 18)}
          <span class="visible-to-name">${escapeHtml(u.nickname || u.username)}</span>
        </span>
      `).join('')}
      ${users.length > 5 ? `<span class="visible-to-more">+${users.length - 5}</span>` : ''}
      <button type="button" class="visible-to-edit" id="btn-edit-visible-to" title="修改可见用户">管理</button>
    </div>
  `;
  const editBtn = document.getElementById('btn-edit-visible-to');
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openVisibleToPicker();
    });
  }
}

// 弹出选择可见用户对话框
async function openVisibleToPicker() {
  try {
    const friends = await api('/api/friends');
    if (!friends.items.length) {
      toast('请先添加好友才能使用指定可见功能', 'error');
      return;
    }
    // 预选当前 state.visibleTo
    const selected = await pickUsers(friends.items, '选择可见用户', state.visibleTo);
    if (selected === null) return; // 取消
    state.visibleTo = selected;
    // 缓存用户信息用于展示
    const map = new Map(friends.items.map(u => [u.id, u]));
    state.visibleToUsers = selected.map(id => map.get(id)).filter(Boolean);
    renderVisibleToBadge();
    toast(selected.length ? `已选择 ${selected.length} 位用户` : '已清空可见用户', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function setSaveStatus(text, type) {
  const dot = document.getElementById('save-dot');
  const status = document.getElementById('save-status');
  if (dot) {
    dot.className = 'status-dot ' + (type || 'draft');
  }
  if (status) status.textContent = text;
}

// 防抖版 updatePreview：高频输入（IME/快速键入）时合并多次渲染为一次，
// 避免每次按键都重排 DOM、运行代码高亮和 resize 标注层。
let _updatePreviewTimer = null;
let _updatePreviewRaf = null;
function updatePreview(opts = {}) {
  const immediate = opts.immediate === true;
  if (immediate) {
    if (_updatePreviewTimer) { clearTimeout(_updatePreviewTimer); _updatePreviewTimer = null; }
    if (_updatePreviewRaf) { cancelAnimationFrame(_updatePreviewRaf); _updatePreviewRaf = null; }
    _runUpdatePreview();
    return;
  }
  if (_updatePreviewTimer) clearTimeout(_updatePreviewTimer);
  _updatePreviewTimer = setTimeout(() => {
    _updatePreviewTimer = null;
    // 用 rAF 合并到下一帧绘制，避免 setTimeout 与浏览器渲染节拍不同步造成的抖动
    if (_updatePreviewRaf) cancelAnimationFrame(_updatePreviewRaf);
    _updatePreviewRaf = requestAnimationFrame(_runUpdatePreview);
  }, 200);
}
function _runUpdatePreview() {
  _updatePreviewRaf = null;
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;
  const text = textarea.value;
  const preview = document.getElementById('editor-preview');
  if (!preview) return;

  preview.innerHTML = renderMarkdown(text);
  highlightCodeIn(preview);
  enhancePreviewCodeBlocks(preview);
  enhancePreviewTaskLists(preview, textarea);

  // 预览内容变化后，标注层尺寸也需重新计算
  setTimeout(resizeAnnotationLayer, 50);
}

function enhancePreviewCodeBlocks(container) {
  const pres = container.querySelectorAll('pre');
  pres.forEach(pre => {
    if (pre.querySelector('.code-block-header')) return;
    const code = pre.querySelector('code');
    if (!code) return;

    let lang = 'code';
    const classes = Array.from(code.classList);
    const langClass = classes.find(c => c.startsWith('language-') || c.startsWith('lang-'));
    if (langClass) {
      lang = langClass.replace(/^(language-|lang-)/, '');
    }

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const langTag = document.createElement('span');
    langTag.className = 'code-lang-tag';
    langTag.textContent = lang;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.type = 'button';
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> 复制`;

    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const codeText = code.innerText || code.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 已复制`;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> 复制`;
        }, 1800);
      }).catch(err => {
        toast('复制失败: ' + err.message, 'error');
      });
    });

    header.appendChild(langTag);
    header.appendChild(copyBtn);
    pre.insertBefore(header, pre.firstChild);
  });
}

function enhancePreviewTaskLists(container, textarea) {
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((cb, idx) => {
    cb.removeAttribute('disabled');
    cb.classList.add('interactive-task-item');
    cb.dataset.taskIndex = idx;
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      const isChecked = cb.checked;
      const val = textarea.value;
      let count = 0;
      const updated = val.replace(/(-|\*|\d+\.)\s+\[([ xX])\]/g, (match, prefix) => {
        if (count === idx) {
          count++;
          return `${prefix} [${isChecked ? 'x' : ' '}]`;
        }
        count++;
        return match;
      });

      if (updated !== val) {
        textarea.value = updated;
        updatePreview();
        updateWordCount();
        setSaveStatus('修改未保存', 'draft');
        if (typeof collabBroadcastContent === 'function') {
          collabBroadcastContent(updated);
        }
      }
    });
  });
}

function updateWordCount() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;
  const text = textarea.value || '';

  const cjkCount = (text.match(/[\u4e00-\u9fa5\u3040-\u30ff\u1100-\u11ff]/g) || []).length;
  const englishWords = (text.replace(/[\u4e00-\u9fa5\u3040-\u30ff\u1100-\u11ff]/g, ' ').match(/[a-zA-Z0-9_\-]+/g) || []).length;
  const words = cjkCount + englishWords;

  const chars = text.replace(/[\r\n]/g, '').length;
  const lines = text ? text.split('\n').length : 1;
  const readMinutes = Math.max(1, Math.ceil(words / 300));

  const wordEl = document.getElementById('word-count');
  if (wordEl) wordEl.textContent = words + ' 字';

  const charEl = document.getElementById('char-count');
  if (charEl) charEl.textContent = chars + ' 字符';

  const lineEl = document.getElementById('line-count');
  if (lineEl) lineEl.textContent = lines + ' 行';

  const timeEl = document.getElementById('read-time');
  if (timeEl) timeEl.textContent = `预估阅读 ${readMinutes} 分钟`;
}

async function saveDiary() {
  clearTimeout(setSaveStatus._draftTimer);
  setSaveStatus._draftTimer = null;
  if (_autoSaveTimer) {
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = null;
  }
  const title = document.getElementById('editor-title').value.trim();
  const content = document.getElementById('editor-textarea').value;
  const mood = document.getElementById('editor-mood').value.trim();
  const weather = document.getElementById('editor-weather').value.trim();
  const tagsStr = document.getElementById('editor-tags').value.trim();
  const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
  const is_pinned = document.getElementById('editor-pinned').checked;
  const visibility = document.getElementById('editor-visibility').value;
  const is_public = visibility === 'public' ? 1 : 0;

  // 文件夹选择：'' = 默认文件夹(null)；<数字> = 指定文件夹
  const folderSelect = document.getElementById('editor-folder');
  let folderId = null;
  if (folderSelect && folderSelect.value) {
    const v = parseInt(folderSelect.value, 10);
    if (!isNaN(v)) folderId = v;
  }

  if (!content.trim() && !title) {
    toast('请输入日记标题或内容', 'error');
    return;
  }

  // 如果是指定可见，使用 state.visibleTo（已通过下拉框 change 事件预选）
  // 未选用户则提示用户先选择，不阻塞保存流程
  let visibleTo = null;
  if (visibility === 'specific') {
    if (!state.visibleTo || !state.visibleTo.length) {
      toast('请先选择可见用户（点击下拉框旁"管理"按钮）', 'error');
      return;
    }
    visibleTo = state.visibleTo;
  }

  const body = { title, content, mood, weather, tags, is_pinned, is_public, visibility, folder_id: folderId };
  if (visibleTo) body.visibleTo = visibleTo;
  const saveBtn = document.getElementById('btn-save-diary');
  saveBtn.disabled = true;
  const origBtn = saveBtn.innerHTML;
  saveBtn.innerHTML = '保存中…';
  setSaveStatus('保存中', 'saving');

  try {
    if (state.editingId) {
      await api(`/api/diaries/${state.editingId}`, {
        method: 'PUT', body: JSON.stringify(body)
      });
      toast('已保存', 'success');
    } else {
      const result = await api('/api/diaries', {
        method: 'POST', body: JSON.stringify(body)
      });
      state.editingId = result.id;
      document.getElementById('btn-delete-diary').style.display = '';
      // 新建日记保存后，显示协作者和发送信件按钮（与 openEditor 编辑已有日记时一致）
      document.getElementById('btn-collaborators').style.display = '';
      document.getElementById('btn-send-letter').style.display = '';
      toast('已创建', 'success');
    }
    setSaveStatus('已保存 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), 'saved');
    state._lastSavedContent = content;
    // 文件夹数量可能变化（新建/移动日记），后台刷新
    if (state.folders.length) loadFolders();
  } catch (e) {
    toast(e.message, 'error');
    setSaveStatus('保存失败', 'draft');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = origBtn;
  }
}

// ===== Markdown 工具栏 =====
function applyMarkdown(type) {
  const ta = document.getElementById('editor-textarea');
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const sel = ta.value.substring(start, end);
  const before = ta.value.substring(0, start);
  const after = ta.value.substring(end);
  let insert = sel, newStart = start, newEnd = start + sel.length;

  const wrap = (pre, post = pre, placeholder = '') => {
    const text = sel || placeholder;
    insert = pre + text + post;
    newStart = start + pre.length;
    newEnd = newStart + text.length;
  };

  switch (type) {
    case 'bold': wrap('**', '**', '加粗文字'); break;
    case 'italic': wrap('*', '*', '斜体文字'); break;
    case 'strike': wrap('~~', '~~', '删除线'); break;
    case 'h1': insert = `# ${sel || '标题'}\n`; newStart = newEnd = start + insert.length; break;
    case 'h2': insert = `## ${sel || '标题'}\n`; newStart = newEnd = start + insert.length; break;
    case 'h3': insert = `### ${sel || '标题'}\n`; newStart = newEnd = start + insert.length; break;
    case 'quote': insert = `> ${sel || '引用内容'}\n`; newStart = newEnd = start + insert.length; break;
    case 'code': wrap('`', '`', 'code'); break;
    case 'codeblock': insert = '\n```\n' + (sel || '代码') + '\n```\n'; newStart = newEnd = start + insert.length; break;
    case 'ul': insert = (sel ? sel.split('\n').map(l => '- ' + l).join('\n') : '- 列表项') + '\n'; newStart = newEnd = start + insert.length; break;
    case 'ol': insert = (sel ? sel.split('\n').map((l, i) => `${i+1}. ` + l).join('\n') : '1. 列表项') + '\n'; newStart = newEnd = start + insert.length; break;
    case 'task': insert = '- [ ] ' + (sel || '待办事项') + '\n'; newStart = newEnd = start + insert.length; break;
    case 'link': {
      const url = sel.startsWith('http') ? sel : 'https://';
      const text = sel.startsWith('http') ? '链接文字' : (sel || '链接文字');
      insert = `[${text}](${url})`;
      newStart = start + 1;
      newEnd = newStart + text.length;
      break;
    }
    case 'image': {
      const url = sel || 'https://';
      const alt = sel ? '' : '图片描述';
      insert = `![${alt}](${url})`;
      newStart = newEnd = start + insert.length;
      break;
    }
    case 'hr': insert = '\n---\n'; newStart = newEnd = start + insert.length; break;
    case 'table': insert = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n'; newStart = newEnd = start + insert.length; break;
  }

  ta.value = before + insert + after;
  ta.focus();
  // 用 requestAnimationFrame + 防止 mousedown 抢焦点导致光标跳到末尾
  requestAnimationFrame(() => {
    ta.focus();
    ta.setSelectionRange(newStart, newEnd);
    updatePreview();
    updateWordCount();
  });
}

// ===== 图片上传 =====
async function handleImageUpload(files) {
  if (!files || !files.length) return;
  const ta = document.getElementById('editor-textarea');
  const insertAtCursor = (markdown) => {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + markdown + '\n' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + markdown.length + 1;
  };

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      toast(`跳过非图片文件: ${file.name}`, 'error');
      continue;
    }
    try {
      const data = await apiUpload(await compressImageFile(file));
      // 新接口返回 url 字段，自行拼 Markdown
      const md = `![${file.name}](${data.url})`;
      insertAtCursor(md);
      toast(`已上传: ${file.name}`, 'success');
    } catch (e) {
      toast(`上传失败: ${e.message}`, 'error');
    }
  }
  updatePreview();
  updateWordCount();
}

// ===== 标签加载 =====
async function loadTags() {
  try {
    const data = await api('/api/diaries/stats/summary');
    state.tags = data.topTags.map(t => t.name);
    const select = document.getElementById('filter-tag');
    const current = select.value;
    select.innerHTML = '<option value="">所有标签</option>' +
      state.tags.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
    select.value = current;
  } catch (e) { /* 静默失败 */ }
}

// ===== 统计 =====
function fmtWordCount(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  return String(n || 0);
}
async function loadStats() {
  const container = document.getElementById('stats-content');
  container.innerHTML = '<p style="color:var(--fg-muted);">加载中...</p>';
  try {
    const year = new Date().getFullYear();
    const [summary, heatmap] = await Promise.all([
      api('/api/diaries/stats/summary'),
      api(`/api/diaries/stats/heatmap?year=${year}`)
    ]);
    const maxMood = Math.max(1, ...summary.moodStats.map(m => m.count));
    const maxTag = Math.max(1, ...summary.topTags.map(t => t.count));
    const maxDay = Math.max(1, ...summary.recentDays.map(d => d.count));
    const maxMonthly = Math.max(1, ...(summary.monthly || []).map(m => m.count));

    container.innerHTML = `
      <div class="stat-card" style="grid-column: 1 / -1;">
        ${renderHeatmapHTML(heatmap)}
      </div>
      <div class="stat-card">
        <h3>日记总数</h3>
        <div class="stat-value">${summary.total}</div>
      </div>
      <div class="stat-card">
        <h3>累计写作</h3>
        <div class="stat-value">${fmtWordCount(summary.totalWords)} <span class="stat-suffix">字</span></div>
      </div>
      <div class="stat-card">
        <h3>置顶日记</h3>
        <div class="stat-value">${summary.pinned}</div>
      </div>
      <div class="stat-card">
        <h3>最长连续</h3>
        <div class="stat-value">${heatmap.longestStreak} <span class="stat-suffix">天</span></div>
        <div class="stat-sub">当前连续 ${heatmap.currentStreak} 天</div>
      </div>
      <div class="stat-card">
        <h3>${year} 年写作</h3>
        <div class="stat-value">${heatmap.total} <span class="stat-suffix">篇</span></div>
        <div class="stat-sub">单日最多 ${heatmap.max} 篇</div>
      </div>
      <div class="stat-card">
        <h3>心情分布</h3>
        <div class="stat-list">
          ${summary.moodStats.length ? summary.moodStats.map(m => `
            <div class="stat-row">
              <span>${escapeHtml(m.mood)}</span>
              <span>${m.count} <span class="stat-bar" style="width:${m.count/maxMood*40}px;"></span></span>
            </div>`).join('') : '<div class="stat-empty">暂无数据</div>'}
        </div>
      </div>
      <div class="stat-card">
        <h3>常用标签</h3>
        <div class="stat-list">
          ${summary.topTags.length ? summary.topTags.map(t => `
            <div class="stat-row">
              <span>#${escapeHtml(t.name)}</span>
              <span>${t.count} <span class="stat-bar" style="width:${t.count/maxTag*40}px;"></span></span>
            </div>`).join('') : '<div class="stat-empty">暂无标签</div>'}
        </div>
      </div>
      <div class="stat-card" style="grid-column: 1 / -1;">
        <h3>最近 7 天写作</h3>
        <div class="stat-list">
          ${summary.recentDays.length ? summary.recentDays.map(d => `
            <div class="stat-row">
              <span>${d.date}</span>
              <span>${d.count} 篇 <span class="stat-bar" style="width:${d.count/maxDay*60}px;"></span></span>
            </div>`).join('') : '<div class="stat-empty">最近 7 天没有写日记</div>'}
        </div>
      </div>
      <div class="stat-card" style="grid-column: 1 / -1;">
        <h3>最近 12 个月写作分布</h3>
        <div class="stat-monthly">
          ${summary.monthly && summary.monthly.length ? summary.monthly.map(m => `
            <div class="stat-month-item">
              <span class="stat-month-label">${escapeHtml(m.month)}</span>
              <div class="stat-month-track"><div class="stat-month-fill" style="width:${Math.round(m.count / maxMonthly * 100)}%;"></div></div>
              <span class="stat-month-count">${m.count}</span>
            </div>`).join('') : '<div class="stat-empty">暂无数据</div>'}
        </div>
      </div>
    `;
    if (typeof renderMoodHeatmap === 'function') {
      renderMoodHeatmap(summary.yearHeatmap || []);
    }
    bindHeatmapInteractions();
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);">${escapeHtml(e.message)}</p>`;
  }
}

// ===== GitHub 风格热力图 =====
function renderHeatmapHTML(heatmap) {
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  // 计算每个月标签的位置（找该月第一周的下标）
  const monthLabels = [];
  let lastMonth = -1;
  heatmap.weeks.forEach((week, wIdx) => {
    // 取该周第一天
    const firstDay = week[0].date;
    if (firstDay) {
      const m = parseInt(firstDay.slice(5, 7), 10) - 1;
      if (m !== lastMonth && wIdx > 0) {
        monthLabels.push({ idx: wIdx, label: months[m] });
        lastMonth = m;
      } else if (lastMonth === -1) {
        monthLabels.push({ idx: wIdx, label: months[m] });
        lastMonth = m;
      }
    }
  });

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return `
    <div class="heatmap">
      <div class="heatmap-header">
        <h3>📅 写作日历</h3>
        <div class="heatmap-summary">
          <span><strong>${heatmap.total}</strong> 篇在 <strong>${heatmap.year}</strong> 年</span>
        </div>
      </div>
      <div class="heatmap-scroll">
        <div class="heatmap-grid">
          <div class="heatmap-months">
            <div class="heatmap-corner"></div>
            <div class="heatmap-month-labels">
              ${heatmap.weeks.map((_, i) => {
                const ml = monthLabels.find(m => m.idx === i);
                return `<span class="heatmap-month-label" style="grid-column:${i+1};">${ml ? ml.label : ''}</span>`;
              }).join('')}
            </div>
          </div>
          <div class="heatmap-body">
            <div class="heatmap-weekdays">
              ${weekdays.map((d, i) => i % 2 === 1 ? `<span>${d}</span>` : '<span></span>').join('')}
            </div>
            <div class="heatmap-weeks">
              ${heatmap.weeks.map(week => `
                <div class="heatmap-week">
                  ${week.map(day => {
                    let level = 0;
                    if (day.inYear && day.count > 0) {
                      if (heatmap.max <= 1) level = 1;
                      else if (day.count >= heatmap.max) level = 4;
                      else if (day.count >= heatmap.max * 0.66) level = 3;
                      else if (day.count >= heatmap.max * 0.33) level = 2;
                      else level = 1;
                    }
                    return `<div class="heatmap-cell level-${level} ${day.inYear ? '' : 'out-year'}"
                                 data-date="${day.date}" data-count="${day.count}"
                                 data-in-year="${day.inYear}"
                                 title="${day.date} · ${day.count} 篇"></div>`;
                  }).join('')}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="heatmap-footer">
          <a class="heatmap-link" href="javascript:void(0)">学习如何统计贡献</a>
          <div class="heatmap-legend">
            <span>少</span>
            <div class="heatmap-cell level-0"></div>
            <div class="heatmap-cell level-1"></div>
            <div class="heatmap-cell level-2"></div>
            <div class="heatmap-cell level-3"></div>
            <div class="heatmap-cell level-4"></div>
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindHeatmapInteractions() {
  const cells = document.querySelectorAll('.heatmap-cell[data-date]');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', e => {
      const date = cell.dataset.date;
      const count = cell.dataset.count;
      const inYear = cell.dataset.inYear === 'true';
      if (!inYear) return;
      showHeatmapTooltip(cell, date, count);
    });
    cell.addEventListener('mouseleave', hideHeatmapTooltip);
    cell.addEventListener('click', () => {
      if (cell.dataset.inYear === 'true' && parseInt(cell.dataset.count, 10) > 0) {
        const date = cell.dataset.date;
        state.filter.date = date;
        document.getElementById('filter-date').value = date;
        state.currentView = 'list';
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
        document.querySelector('.sidebar-nav .nav-item[data-nav="list"]').classList.add('active');
        document.getElementById('list-title').textContent = `${date} 的日记`;
        showView('list');
        state.page = 1;
        loadDiaries();
      }
    });
  });
}

let heatmapTooltipEl = null;
function showHeatmapTooltip(target, date, count) {
  if (!heatmapTooltipEl) {
    heatmapTooltipEl = document.createElement('div');
    heatmapTooltipEl.className = 'heatmap-tooltip';
    document.body.appendChild(heatmapTooltipEl);
  }
  const countNum = parseInt(count, 10);
  const text = countNum === 0
    ? `${date} · 没有日记`
    : `${date} · ${countNum} 篇日记${countNum > 1 ? '（点击查看）' : '（点击查看）'}`;
  heatmapTooltipEl.textContent = text;
  heatmapTooltipEl.classList.add('show');
  const rect = target.getBoundingClientRect();
  const tipRect = heatmapTooltipEl.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  let top = rect.top - tipRect.height - 8;
  if (top < 8) top = rect.bottom + 8;
  if (left < 8) left = 8;
  if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
  heatmapTooltipEl.style.left = left + 'px';
  heatmapTooltipEl.style.top = top + 'px';
}
function hideHeatmapTooltip() {
  if (heatmapTooltipEl) heatmapTooltipEl.classList.remove('show');
}

// ===== 独立 PDF 阅读器（不与任何日记绑定） =====
const pdfViewerState = {
  pdfDoc: null,
  url: '',
  filename: '',
  pageNum: 1,
  totalPages: 0,
  scale: 1.2,
  renderTask: null,
  bound: false,        // 是否已绑定事件（避免重复）
  fitWidth: false,     // 是否启用适应宽度
  brush: null          // 笔刷覆盖层实例
};

// ===== 通用笔刷覆盖层（用于 PDF / 文档 / 表格 / 图片 预览） =====
// 用法：
//   const brush = createBrushOverlay(container, { fileId, kind, getPageKey, ... });
//   brush.setTool('pen'); brush.setColor('#ff0000');
//   brush.load().then(() => brush.render());
//   brush.destroy();
function createBrushOverlay(container, opts = {}) {
  if (!container) return null;
  const state = {
    fileId: opts.fileId || null,
    kind: opts.kind || 'pdf',         // pdf | document | sheet | image
    pageKey: opts.pageKey || 'main',  // 用于 PDF 多页：'page-1' / 'page-2' / ...
    savePath: opts.savePath || null,  // 自定义保存路径（可选）
    pathsByKey: {},                   // 缓存每个 pageKey 的 paths
    drawing: false,
    tool: 'pen',                      // 'pen' | 'highlight' | 'eraser' | 'none'
    color: opts.defaultColor || '#ff5252',
    size: opts.defaultSize || 4,
    opacity: 1,
    points: [],
    bound: false
  };
  // 创建 SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('brush-overlay-svg');
  svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:auto;z-index:5;touch-action:none;';
  // SVG 内容
  const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  inner.classList.add('brush-overlay-inner');
  svg.appendChild(inner);
  // 橡皮擦指示圆
  const eraserCursor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eraserCursor.setAttribute('r', state.size);
  eraserCursor.setAttribute('fill', 'rgba(255,255,255,0.4)');
  eraserCursor.setAttribute('stroke', '#ff5252');
  eraserCursor.setAttribute('stroke-width', '1.5');
  eraserCursor.setAttribute('stroke-dasharray', '3,2');
  eraserCursor.style.display = 'none';
  eraserCursor.style.pointerEvents = 'none';
  svg.appendChild(eraserCursor);
  container.style.position = 'relative';
  container.appendChild(svg);
  // 监听尺寸变化
  const ro = new ResizeObserver(() => {
    if (svg.clientWidth > 0 && svg.clientHeight > 0) {
      svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
    }
  });
  ro.observe(container);
  // 工具函数
  function getPoint(e) {
    const rect = container.getBoundingClientRect();
    const sx = svg.clientWidth / rect.width;
    const sy = svg.clientHeight / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy
    };
  }
  function getCurrentPaths() {
    if (!state.pathsByKey[state.pageKey]) state.pathsByKey[state.pageKey] = [];
    return state.pathsByKey[state.pageKey];
  }
  function createPathEl(p) {
    if (p.type === 'text') {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', p.points[0].x);
      t.setAttribute('y', p.points[0].y);
      t.setAttribute('fill', p.color);
      t.setAttribute('font-size', Math.max(12, p.size * 3));
      t.setAttribute('opacity', p.opacity || 1);
      t.setAttribute('font-weight', '600');
      t.setAttribute('font-family', 'inherit');
      t.textContent = p.text || '';
      return t;
    }
    if (!p.points || p.points.length < 2) return null;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (p.type === 'highlight') {
      const sw = Math.max(8, p.size * 3);
      path.setAttribute('stroke', p.color);
      path.setAttribute('stroke-width', sw);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', '0.4');
    } else {
      path.setAttribute('stroke', p.color);
      path.setAttribute('stroke-width', p.size);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', p.opacity || 1);
    }
    let d = `M ${p.points[0].x} ${p.points[0].y}`;
    for (let i = 1; i < p.points.length; i++) {
      d += ` L ${p.points[i].x} ${p.points[i].y}`;
    }
    path.setAttribute('d', d);
    return path;
  }
  function render() {
    inner.innerHTML = '';
    const list = getCurrentPaths();
    for (const p of list) {
      const el = createPathEl(p);
      if (el) inner.appendChild(el);
    }
  }
  // 检测一条路径的任意点是否落在橡皮擦圆内
  function pathHitByEraser(p, cx, cy, r) {
    if (!p.points || p.points.length === 0) return false;
    const eraserSize = state.size; // 笔刷大小即橡皮擦半径
    // 文字批注按点检测
    if (p.type === 'text') {
      for (const pt of p.points) {
        const dx = pt.x - cx, dy = pt.y - cy;
        if (dx * dx + dy * dy <= (eraserSize + 12) * (eraserSize + 12)) return true;
      }
      return false;
    }
    // 线段/曲线检测：依次检查点到圆的距离，使用更宽的笔迹容差
    const tolerance = eraserSize + (p.size || 0);
    for (let i = 0; i < p.points.length; i++) {
      const pt = p.points[i];
      const dx = pt.x - cx, dy = pt.y - cy;
      if (dx * dx + dy * dy <= tolerance * tolerance) return true;
    }
    return false;
  }
  // 事件
  function onDown(e) {
    if (state.tool === 'none' || !state.tool) return;
    e.preventDefault();
    e.stopPropagation();
    if (state.tool === 'eraser') {
      state.erasing = true;
      const p = getPoint(e);
      eraseAt(p.x, p.y);
      return;
    }
    state.drawing = true;
    state.points = [getPoint(e)];
  }
  function onMove(e) {
    if (state.erasing) {
      e.preventDefault();
      e.stopPropagation();
      const p = getPoint(e);
      eraseAt(p.x, p.y);
      return;
    }
    if (!state.drawing) return;
    e.preventDefault();
    e.stopPropagation();
    state.points.push(getPoint(e));
    // 临时绘制最后一段
    const last = inner.lastElementChild;
    if (last && last.tagName === 'path' && last.dataset.temp) inner.removeChild(last);
    const p = {
      type: state.tool === 'highlight' ? 'highlight' : 'pen',
      color: state.color,
      size: state.size,
      opacity: state.opacity,
      points: state.points.slice()
    };
    const el = createPathEl(p);
    if (el) {
      el.dataset.temp = '1';
      inner.appendChild(el);
    }
  }
  function onUp(e) {
    if (state.erasing) {
      state.erasing = false;
      scheduleSave();
      return;
    }
    if (!state.drawing) return;
    state.drawing = false;
    // 移除临时
    const last = inner.lastElementChild;
    if (last && last.tagName === 'path' && last.dataset.temp) inner.removeChild(last);
    if (state.points.length < 2) {
      state.points = [];
      return;
    }
    const p = {
      id: 'p' + Date.now() + Math.random().toString(36).slice(2, 6),
      type: state.tool === 'highlight' ? 'highlight' : 'pen',
      color: state.color,
      size: state.size,
      opacity: state.opacity,
      points: state.points.slice()
    };
    getCurrentPaths().push(p);
    state.points = [];
    const el = createPathEl(p);
    if (el) inner.appendChild(el);
    // 自动保存（防抖）
    scheduleSave();
  }
  let saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => save().catch(e => console.warn('笔刷保存失败', e)), 600);
  }
  // 事件绑定（保存 window 级 handler 引用，destroy 时移除，防止内存泄漏）
  svg.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  svg.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
  // 加载与保存
  async function load() {
    if (!state.fileId) return;
    try {
      const data = await api(`/api/upload/files/${state.fileId}/annotations`);
      const ann = data.annotations || {};
      // ann 结构: { 'main': [...], 'page-1': [...] }
      state.pathsByKey = ann && typeof ann === 'object' ? ann : {};
    } catch (e) { /* ignore */ }
    render();
  }
  let saving = false;
  let lastSaved = '';
  async function save() {
    if (!state.fileId) return;
    const payload = JSON.stringify(state.pathsByKey);
    if (payload === lastSaved) return;
    saving = true;
    try {
      await api(`/api/upload/files/${state.fileId}/annotations`, {
        method: 'PUT',
        body: JSON.stringify({ annotations: state.pathsByKey })
      });
      lastSaved = payload;
    } finally { saving = false; }
  }
  function setPageKey(key) {
    state.pageKey = key;
    render();
  }
  function setTool(tool) {
    state.tool = tool;
    const isNone = tool === 'none' || !tool;
    svg.style.pointerEvents = isNone ? 'none' : 'auto';
    if (tool === 'eraser') {
      svg.style.cursor = 'none';
      eraserCursor.style.display = '';
    } else if (tool === 'pen' || tool === 'highlight') {
      svg.style.cursor = 'crosshair';
      eraserCursor.style.display = 'none';
    } else {
      svg.style.cursor = 'default';
      eraserCursor.style.display = 'none';
    }
  }
  function setColor(c) { state.color = c; }
  function setSize(s) {
    state.size = Math.max(1, parseInt(s, 10) || 4);
    eraserCursor.setAttribute('r', state.size);
  }
  function setOpacity(o) { state.opacity = Math.max(0, Math.min(1, parseFloat(o) || 0)); }
  function eraseAt(x, y) {
    // 更新橡皮擦光标位置
    eraserCursor.setAttribute('cx', x);
    eraserCursor.setAttribute('cy', y);
    const list = getCurrentPaths();
    if (list.length === 0) return;
    const before = list.length;
    const remaining = list.filter(p => !pathHitByEraser(p, x, y, state.size));
    if (remaining.length !== before) {
      state.pathsByKey[state.pageKey] = remaining;
      render();
    }
  }
  function clear() {
    state.pathsByKey[state.pageKey] = [];
    render();
    scheduleSave();
  }
  function undo() {
    const list = getCurrentPaths();
    if (list.length === 0) return;
    list.pop();
    render();
    scheduleSave();
  }
  function getAllPaths() {
    return state.pathsByKey;
  }
  function destroy() {
    try { ro.disconnect(); } catch (_) {}
    try { svg.remove(); } catch (_) {}
    // 移除 window 级监听器，防止闭包与已脱离文档的元素持续累积（内存泄漏）
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
  }
  // 初始化
  setTool('none');
  // 立即异步加载
  load();
  return {
    setTool, setColor, setSize, setOpacity,
    setPageKey, clear, undo, save, load, render,
    getAllPaths, destroy,
    get tool() { return state.tool; },
    get size() { return state.size; },
    get color() { return state.color; }
  };
}

// 打开 PDF 阅读器模态框
async function openPdfViewerModal(url, filename, fileId) {
  if (typeof pdfjsLib === 'undefined') {
    toast('PDF.js 未加载，请检查网络', 'error');
    return;
  }
  setupPdfJsWorker();
  const modal = document.getElementById('pdf-viewer-modal');
  if (!modal) return;
  pdfViewerState.fileId = fileId || null;
  // 重置 UI
  const fnEl = document.getElementById('pdf-viewer-modal-filename');
  if (fnEl) { fnEl.textContent = filename || '未命名.pdf'; fnEl.title = filename || ''; }
  const totalEl = document.getElementById('pdf-viewer-page-total');
  if (totalEl) totalEl.textContent = '0';
  const inputEl = document.getElementById('pdf-viewer-page-input');
  if (inputEl) inputEl.value = 1;
  const zoomEl = document.getElementById('pdf-viewer-zoom-value');
  if (zoomEl) zoomEl.textContent = Math.round(pdfViewerState.scale * 100) + '%';
  const loading = document.getElementById('pdf-viewer-loading');
  if (loading) loading.style.display = '';
  // 重置笔刷工具条
  const brushTools = document.getElementById('pdf-brush-tools');
  if (brushTools) brushTools.style.display = 'none';
  // 显示模态框
  modal.style.display = '';
  document.body.style.overflow = 'hidden';
  // 绑定事件（仅一次）
  if (!pdfViewerState.bound) {
    bindPdfViewerEvents();
    pdfViewerState.bound = true;
  }
  // 加载 PDF
  const ok = await loadPdfForViewer(url, filename);
  if (!ok) {
    closePdfViewerModal();
  }
  // 初始化笔刷（仅当有 fileId 时）
  if (ok && pdfViewerState.fileId) {
    const host = document.getElementById('pdf-viewer-page-host');
    if (host) {
      // 销毁旧的笔刷实例
      if (pdfViewerState.brush && typeof pdfViewerState.brush.destroy === 'function') {
        pdfViewerState.brush.destroy();
      }
      pdfViewerState.brush = createBrushOverlay(host, {
        fileId: pdfViewerState.fileId,
        kind: 'pdf',
        pageKey: 'page-1'
      });
    }
  }
}

// 关闭 PDF 阅读器
function closePdfViewerModal() {
  const modal = document.getElementById('pdf-viewer-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
  if (pdfViewerState.renderTask) {
    try { pdfViewerState.renderTask.cancel(); } catch (_) {}
    pdfViewerState.renderTask = null;
  }
  if (pdfViewerState.pdfDoc) {
    try { pdfViewerState.pdfDoc.destroy(); } catch (_) {}
    pdfViewerState.pdfDoc = null;
  }
  // 保存并销毁笔刷
  if (pdfViewerState.brush) {
    try { pdfViewerState.brush.save(); } catch (_) {}
    try { pdfViewerState.brush.destroy(); } catch (_) {}
    pdfViewerState.brush = null;
  }
  pdfViewerState.pageNum = 1;
  pdfViewerState.totalPages = 0;
  pdfViewerState.url = '';
  pdfViewerState.filename = '';
  pdfViewerState.fileId = null;
  const loading = document.getElementById('pdf-viewer-loading');
  if (loading) loading.style.display = '';
  // 清空 canvas
  const canvas = document.getElementById('pdf-viewer-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// 加载 PDF 到阅读器
async function loadPdfForViewer(pdfUrl, filename) {
  // 卸载旧文档
  if (pdfViewerState.pdfDoc) {
    try { pdfViewerState.pdfDoc.destroy(); } catch (_) {}
    pdfViewerState.pdfDoc = null;
  }
  const canvas = document.getElementById('pdf-viewer-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  try {
    const token = state.token;
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    const resp = await fetch(pdfUrl, { headers, credentials: 'include' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    const buf = await resp.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: buf });
    const pdf = await loadingTask.promise;
    pdfViewerState.pdfDoc = pdf;
    pdfViewerState.url = pdfUrl;
    pdfViewerState.filename = filename || '';
    pdfViewerState.totalPages = pdf.numPages;
    pdfViewerState.pageNum = 1;
    // 更新 UI
    const totalEl = document.getElementById('pdf-viewer-page-total');
    if (totalEl) totalEl.textContent = pdf.numPages;
    const inputEl = document.getElementById('pdf-viewer-page-input');
    if (inputEl) { inputEl.max = pdf.numPages; inputEl.value = 1; }
    // 隐藏 loading
    const loading = document.getElementById('pdf-viewer-loading');
    if (loading) loading.style.display = 'none';
    // 渲染首页
    await renderPdfViewerPage(1);
    return true;
  } catch (err) {
    console.error('PDF 加载失败:', err);
    toast('PDF 加载失败：' + (err.message || '未知错误'), 'error');
    return false;
  }
}

// 渲染指定页
async function renderPdfViewerPage(num) {
  if (!pdfViewerState.pdfDoc) return;
  num = Math.max(1, Math.min(pdfViewerState.totalPages, num));
  pdfViewerState.pageNum = num;
  const pageInput = document.getElementById('pdf-viewer-page-input');
  if (pageInput) pageInput.value = num;
  // 取消上一次渲染
  if (pdfViewerState.renderTask) {
    try { pdfViewerState.renderTask.cancel(); } catch (_) {}
    pdfViewerState.renderTask = null;
  }
  const page = await pdfViewerState.pdfDoc.getPage(num);
  // 计算可用宽度（用于适应宽度）
  let scale = pdfViewerState.scale;
  if (pdfViewerState.fitWidth) {
    const body = document.getElementById('pdf-viewer-modal-body');
    // 用 body 的可视宽度（含 padding）减去左右 padding，得到实际可用宽度
    const bodyStyle = body ? getComputedStyle(body) : null;
    const padL = bodyStyle ? parseFloat(bodyStyle.paddingLeft) || 0 : 0;
    const padR = bodyStyle ? parseFloat(bodyStyle.paddingRight) || 0 : 0;
    const availW = (body ? body.clientWidth - padL - padR : 800) - 16;
    const baseViewport = page.getViewport({ scale: 1 });
    scale = Math.max(0.5, Math.min(3, availW / baseViewport.width));
  }
  const viewport = page.getViewport({ scale });
  const canvas = document.getElementById('pdf-viewer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = viewport.width + 'px';
  canvas.style.height = viewport.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  pdfViewerState.renderTask = page.render({
    canvasContext: ctx,
    viewport: page.getViewport({ scale: scale * dpr })
  });
  try {
    await pdfViewerState.renderTask.promise;
  } catch (e) {
    if (e.name !== 'RenderingCancelledException') console.warn('PDF 渲染错误', e);
  } finally {
    pdfViewerState.renderTask = null;
  }
  // 更新缩放显示（fit 时显示实际缩放）
  const zoomEl = document.getElementById('pdf-viewer-zoom-value');
  if (zoomEl) zoomEl.textContent = Math.round(scale * 100) + '%';
  // 同步笔刷 pageKey
  if (pdfViewerState.brush) {
    pdfViewerState.brush.setPageKey('page-' + num);
  }
}

// 设置缩放
function setPdfViewerScale(s) {
  pdfViewerState.scale = Math.max(0.5, Math.min(3, s));
  pdfViewerState.fitWidth = false;
  const zoomEl = document.getElementById('pdf-viewer-zoom-value');
  if (zoomEl) zoomEl.textContent = Math.round(pdfViewerState.scale * 100) + '%';
  if (pdfViewerState.pdfDoc) renderPdfViewerPage(pdfViewerState.pageNum);
}

// 绑定 PDF 阅读器事件
function bindPdfViewerEvents() {
  document.getElementById('pdf-viewer-prev').addEventListener('click', () => {
    if (!pdfViewerState.pdfDoc) return;
    renderPdfViewerPage(pdfViewerState.pageNum - 1);
  });
  document.getElementById('pdf-viewer-next').addEventListener('click', () => {
    if (!pdfViewerState.pdfDoc) return;
    renderPdfViewerPage(pdfViewerState.pageNum + 1);
  });
  document.getElementById('pdf-viewer-zoom-in').addEventListener('click', () => {
    setPdfViewerScale(pdfViewerState.scale + 0.1);
  });
  document.getElementById('pdf-viewer-zoom-out').addEventListener('click', () => {
    setPdfViewerScale(pdfViewerState.scale - 0.1);
  });
  document.getElementById('pdf-viewer-fit').addEventListener('click', () => {
    pdfViewerState.fitWidth = true;
    if (pdfViewerState.pdfDoc) renderPdfViewerPage(pdfViewerState.pageNum);
  });
  const pageInput = document.getElementById('pdf-viewer-page-input');
  if (pageInput) {
    pageInput.addEventListener('change', (e) => {
      if (!pdfViewerState.pdfDoc) return;
      const n = parseInt(e.target.value, 10);
      if (!isNaN(n) && n >= 1 && n <= pdfViewerState.totalPages) {
        renderPdfViewerPage(n);
      } else {
        e.target.value = pdfViewerState.pageNum;
      }
    });
  }
  document.getElementById('pdf-viewer-download').addEventListener('click', () => {
    if (!pdfViewerState.url) return;
    const a = document.createElement('a');
    a.href = pdfViewerState.url;
    a.download = pdfViewerState.filename || 'document.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  // 关闭按钮
  document.querySelectorAll('[data-close="pdf-viewer"]').forEach(el => {
    el.addEventListener('click', closePdfViewerModal);
  });
  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('pdf-viewer-modal');
    if (!modal || modal.style.display === 'none') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePdfViewerModal();
    } else if (e.key === 'ArrowLeft' || (e.ctrlKey && e.key === 'PageUp')) {
      e.preventDefault();
      if (pdfViewerState.pdfDoc) renderPdfViewerPage(pdfViewerState.pageNum - 1);
    } else if (e.key === 'ArrowRight' || (e.ctrlKey && e.key === 'PageDown')) {
      e.preventDefault();
      if (pdfViewerState.pdfDoc) renderPdfViewerPage(pdfViewerState.pageNum + 1);
    } else if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
      e.preventDefault();
      setPdfViewerScale(pdfViewerState.scale + 0.1);
    } else if (e.ctrlKey && e.key === '-') {
      e.preventDefault();
      setPdfViewerScale(pdfViewerState.scale - 0.1);
    } else if (e.ctrlKey && e.key === '0') {
      e.preventDefault();
      setPdfViewerScale(1.0);
    }
  });
  // 窗口尺寸变化时，若处于 fit 模式则重排
  window.addEventListener('resize', () => {
    const modal = document.getElementById('pdf-viewer-modal');
    if (!modal || modal.style.display === 'none') return;
    if (pdfViewerState.fitWidth && pdfViewerState.pdfDoc) {
      renderPdfViewerPage(pdfViewerState.pageNum);
    }
  });
  // 笔刷工具事件 =====
  const brushToggle = document.getElementById('pdf-viewer-brush-toggle');
  if (brushToggle) {
    brushToggle.addEventListener('click', () => {
      if (!pdfViewerState.fileId) {
        toast('请通过"我的文件"打开 PDF 才能批注', 'info');
        return;
      }
      const tools = document.getElementById('pdf-brush-tools');
      if (!tools) return;
      const visible = tools.style.display !== 'none';
      tools.style.display = visible ? 'none' : 'flex';
      if (pdfViewerState.brush) {
        pdfViewerState.brush.setTool(visible ? 'none' : 'pen');
        syncPdfToolBtns(visible ? 'none' : 'pen');
      }
      brushToggle.classList.toggle('active', !visible);
    });
  }
  const penBtn = document.getElementById('pdf-brush-pen');
  const hlBtn = document.getElementById('pdf-brush-highlight');
  const eraserBtn = document.getElementById('pdf-brush-eraser');
  const undoBtn = document.getElementById('pdf-brush-undo');
  const clearBtn = document.getElementById('pdf-brush-clear');
  const saveBtn = document.getElementById('pdf-brush-save');
  const colorInput = document.getElementById('pdf-brush-color');
  const sizeInput = document.getElementById('pdf-brush-size');
  function syncPdfToolBtns(tool) {
    penBtn && penBtn.setAttribute('aria-pressed', tool === 'pen' ? 'true' : 'false');
    hlBtn && hlBtn.setAttribute('aria-pressed', tool === 'highlight' ? 'true' : 'false');
    eraserBtn && eraserBtn.setAttribute('aria-pressed', tool === 'eraser' ? 'true' : 'false');
  }
  if (penBtn) penBtn.addEventListener('click', () => {
    if (pdfViewerState.brush) {
      pdfViewerState.brush.setTool('pen');
      syncPdfToolBtns('pen');
    }
  });
  if (hlBtn) hlBtn.addEventListener('click', () => {
    if (pdfViewerState.brush) {
      pdfViewerState.brush.setTool('highlight');
      syncPdfToolBtns('highlight');
    }
  });
  if (eraserBtn) eraserBtn.addEventListener('click', () => {
    if (pdfViewerState.brush) {
      pdfViewerState.brush.setTool('eraser');
      syncPdfToolBtns('eraser');
    }
  });
  if (undoBtn) undoBtn.addEventListener('click', () => {
    if (pdfViewerState.brush) pdfViewerState.brush.undo();
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (pdfViewerState.brush) {
      if (confirm('确定清空当前页的所有批注？')) pdfViewerState.brush.clear();
    }
  });
  if (saveBtn) saveBtn.addEventListener('click', async () => {
    if (pdfViewerState.brush) {
      try {
        await pdfViewerState.brush.save();
        toast('已保存批注', 'success');
      } catch (e) { toast('保存失败：' + e.message, 'error'); }
    }
  });
  if (colorInput) colorInput.addEventListener('input', e => {
    if (pdfViewerState.brush) pdfViewerState.brush.setColor(e.target.value);
  });
  if (sizeInput) sizeInput.addEventListener('input', e => {
    if (pdfViewerState.brush) pdfViewerState.brush.setSize(e.target.value);
  });
}

// 统一文件查看/编辑模态框（文本/文档/表格）
const fileViewerState = {
  id: null,
  kind: null,           // 'text' | 'document' | 'other'
  filename: '',
  originalName: '',
  url: '',
  size: 0,
  folder: '',
  dirty: false,         // 文本是否有未保存修改
  sheets: [],           // xlsx 工作表缓存
  currentSheet: 0,
  brush: null           // 笔刷覆盖层实例
};

// 打开文件查看/编辑模态框（根据 fileId 自动判断类型）
async function openFileViewerModal(fileId) {
  try {
    const data = await api(`/api/upload/files`);
    const f = (data.items || []).find(x => x.id === fileId);
    if (!f) {
      toast('文件不存在', 'error');
      return;
    }
    await openFileViewerFromMeta(f);
  } catch (e) {
    toast(e.message, 'error');
  }
}

// 直接用文件元信息打开（避免再次请求）
async function openFileViewerFromMeta(f) {
  fileViewerState.id = f.id;
  fileViewerState.kind = f.kind;
  fileViewerState.filename = f.filename;
  fileViewerState.originalName = f.original_name || f.filename;
  fileViewerState.url = f.url;
  fileViewerState.size = f.size;
  fileViewerState.dirty = false;
  fileViewerState.sheets = [];
  fileViewerState.currentSheet = 0;
  // 重置 UI
  const modal = document.getElementById('file-viewer-modal');
  if (!modal) return;
  const fnEl = document.getElementById('file-viewer-modal-filename');
  if (fnEl) { fnEl.textContent = fileViewerState.originalName; fnEl.title = fileViewerState.originalName; }
  const kindEl = document.getElementById('file-viewer-modal-kind');
  if (kindEl) kindEl.textContent = kindLabel(f.kind, fileViewerState.originalName);
  const iconEl = document.getElementById('file-viewer-icon');
  if (iconEl) iconEl.innerHTML = kindIcon(f.kind);
  const saveBtn = document.getElementById('file-viewer-save');
  if (saveBtn) saveBtn.style.display = f.kind === 'text' ? '' : 'none';
  const brushToggleBtn = document.getElementById('file-viewer-brush-toggle');
  // 笔刷按钮：除图片/其他外都允许（PDF 在专门的 PDF 阅读器中批注）
  if (brushToggleBtn) brushToggleBtn.style.display = (f.kind === 'text' || f.kind === 'document') ? '' : 'none';
  const brushTools = document.getElementById('file-brush-tools');
  if (brushTools) brushTools.style.display = 'none';
  const loading = document.getElementById('file-viewer-loading');
  const textHost = document.getElementById('file-viewer-text-host');
  const docHost = document.getElementById('file-viewer-doc-host');
  const sheetHost = document.getElementById('file-viewer-sheet-host');
  const audioHost = document.getElementById('file-viewer-audio-host');
  if (loading) loading.style.display = '';
  if (textHost) textHost.style.display = 'none';
  if (docHost) docHost.style.display = 'none';
  if (sheetHost) sheetHost.style.display = 'none';
  if (audioHost) audioHost.style.display = 'none';
  const status = document.getElementById('file-viewer-status');
  if (status) status.textContent = '就绪';
  // 显示模态框
  modal.style.display = '';
  document.body.style.overflow = 'hidden';
  // 销毁旧的笔刷实例
  if (fileViewerState.brush) {
    try { fileViewerState.brush.destroy(); } catch (_) {}
    fileViewerState.brush = null;
  }
  // 绑定事件（仅一次）
  if (!fileViewerState.bound) {
    bindFileViewerEvents();
    fileViewerState.bound = true;
  }
  // 按类型加载
  try {
    if (f.kind === 'text') {
      await loadTextFile(f);
    } else if (f.kind === 'document') {
      // xlsx/xls 用 SheetJS 解析表格，docx 用 mammoth
      const ext = (f.original_name || f.filename || '').toLowerCase();
      if (/\.(xlsx|xls|xlsb|ods)$/i.test(ext)) {
        await loadSheetFile(f);
      } else {
        await loadDocumentFile(f);
      }
    } else if (f.kind === 'audio') {
      await loadAudioFile(f);
    } else if (f.kind === 'other') {
      // 其他类型不支持预览，仅提供下载
      showDownloadOnly(f);
    } else {
      toast('暂不支持该类型文件的预览', 'info');
    }
  } catch (e) {
    console.error('文件加载失败:', e);
    if (loading) {
      loading.textContent = '加载失败：' + (e.message || '未知错误');
    }
  }
  // 初始化笔刷覆盖层（doc-host / sheet-content）
  initFileViewerBrush();
}

// 初始化文件查看器笔刷覆盖层（仅 doc/sheet 类型）
function initFileViewerBrush() {
  if (!fileViewerState.id) return;
  if (fileViewerState.kind === 'document') {
    // 文档（docx/rtf 等）→ 笔刷在 doc-host 上
    // 表格（xlsx）→ 笔刷在 sheet-content 上
    const ext = (fileViewerState.originalName || fileViewerState.filename || '').toLowerCase();
    const isSheet = /\.(xlsx|xls|xlsb|ods)$/i.test(ext);
    const target = isSheet
      ? document.getElementById('file-viewer-sheet-content')
      : document.getElementById('file-viewer-doc-host');
    if (target) {
      fileViewerState.brush = createBrushOverlay(target, {
        fileId: fileViewerState.id,
        kind: isSheet ? 'sheet' : 'document',
        pageKey: isSheet ? ('sheet-' + fileViewerState.currentSheet) : 'main'
      });
    }
  }
}

// 加载文本文件
async function loadTextFile(f) {
  const data = await api(`/api/upload/file/${f.id}/text`);
  const textHost = document.getElementById('file-viewer-text-host');
  const ta = document.getElementById('file-viewer-textarea');
  const loading = document.getElementById('file-viewer-loading');
  if (loading) loading.style.display = 'none';
  if (textHost) textHost.style.display = '';
  if (ta) {
    ta.value = data.content || '';
    fileViewerState.dirty = false;
    updateFileViewerStatus('已加载 · ' + (data.size || 0) + ' 字节');
    setTimeout(() => ta.focus(), 50);
  }
}

// 加载文档（docx/rtf 等）→ mammoth 转换为 HTML
async function loadDocumentFile(f) {
  const loading = document.getElementById('file-viewer-loading');
  const docHost = document.getElementById('file-viewer-doc-host');
  const docContent = document.getElementById('file-viewer-doc-content');
  if (loading) loading.textContent = '文档解析中…';
  // 获取原始 ArrayBuffer
  const token = state.token;
  const resp = await fetch(f.url, {
    headers: token ? { 'Authorization': 'Bearer ' + token } : {},
    credentials: 'include'
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = await resp.arrayBuffer();
  if (typeof mammoth === 'undefined') {
    throw new Error('mammoth.js 未加载');
  }
  // docx 用 mammoth，其他格式给出友好提示
  const ext = (f.original_name || f.filename || '').toLowerCase();
  let html = '';
  if (ext.endsWith('.docx')) {
    const result = await mammoth.convertToHtml({ arrayBuffer: buf });
    html = result.value || '';
  } else if (ext.endsWith('.doc')) {
    // 老版本 .doc 不被 mammoth 支持，提示用户
    throw new Error('暂不支持 .doc 二进制格式，请使用 .docx');
  } else if (ext.endsWith('.rtf')) {
    // RTF 简单转 HTML（用浏览器文本流）
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(buf);
    html = `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(text)}</pre>`;
  } else if (ext.endsWith('.pptx') || ext.endsWith('.ppt')) {
    throw new Error('PPT 暂不支持在线预览，请下载后用 PowerPoint 查看');
  } else {
    // 尝试作为纯文本
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(buf);
    html = `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(text)}</pre>`;
  }
  if (loading) loading.style.display = 'none';
  if (docHost) docHost.style.display = '';
  if (docContent) docContent.innerHTML = html;
}

// 加载表格（xlsx 等）→ SheetJS 解析
async function loadSheetFile(f) {
  const loading = document.getElementById('file-viewer-loading');
  const sheetHost = document.getElementById('file-viewer-sheet-host');
  const sheetTabs = document.getElementById('file-viewer-sheet-tabs');
  const sheetContent = document.getElementById('file-viewer-sheet-content');
  if (loading) loading.textContent = '表格解析中…';
  const token = state.token;
  const resp = await fetch(f.url, {
    headers: token ? { 'Authorization': 'Bearer ' + token } : {},
    credentials: 'include'
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = await resp.arrayBuffer();
  if (typeof XLSX === 'undefined') {
    throw new Error('SheetJS 未加载');
  }
  const workbook = XLSX.read(buf, { type: 'array' });
  fileViewerState.sheets = workbook.SheetNames.map(name => ({
    name,
    html: renderSheetToHtml(workbook.Sheets[name])
  }));
  if (fileViewerState.sheets.length === 0) {
    throw new Error('工作表为空');
  }
  if (loading) loading.style.display = 'none';
  if (sheetHost) sheetHost.style.display = '';
  // 渲染 tabs
  if (sheetTabs) {
    sheetTabs.innerHTML = fileViewerState.sheets.map((s, i) =>
      `<button class="sheet-tab${i === 0 ? ' active' : ''}" data-idx="${i}">${escapeHtml(s.name)}</button>`
    ).join('');
    sheetTabs.querySelectorAll('.sheet-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        sheetTabs.querySelectorAll('.sheet-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = parseInt(btn.dataset.idx, 10);
        fileViewerState.currentSheet = idx;
        if (sheetContent) sheetContent.innerHTML = fileViewerState.sheets[idx].html;
        // 重新初始化笔刷（不同 sheet 用不同 pageKey）
        if (fileViewerState.brush) {
          try { fileViewerState.brush.destroy(); } catch (_) {}
        }
        fileViewerState.brush = createBrushOverlay(sheetContent, {
          fileId: fileViewerState.id,
          kind: 'sheet',
          pageKey: 'sheet-' + idx
        });
      });
    });
  }
  if (sheetContent) sheetContent.innerHTML = fileViewerState.sheets[0].html;
}

// 把 SheetJS 工作表转为 HTML 表格
function renderSheetToHtml(ws) {
  if (!ws) return '<p style="color:var(--fg-muted);">空表</p>';
  // 用 sheet_to_html 但要包到我们的容器
  const raw = XLSX.utils.sheet_to_html(ws, { editable: false });
  // 去掉 XLSX 注入的全局 ID 防止冲突
  return raw.replace(/id="[^"]*"/g, '');
}

// 关闭
function closeFileViewerModal() {
  const modal = document.getElementById('file-viewer-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
  // 保存并销毁笔刷
  if (fileViewerState.brush) {
    try { fileViewerState.brush.save(); } catch (_) {}
    try { fileViewerState.brush.destroy(); } catch (_) {}
    fileViewerState.brush = null;
  }
  // 如果有未保存修改，提示
  if (fileViewerState.dirty && fileViewerState.kind === 'text') {
    // 不强提示，由用户主动 Ctrl+S 或点击保存
  }
  fileViewerState.id = null;
  fileViewerState.dirty = false;
}

// 文件图标（按 kind）
function kindIcon(kind) {
  const icons = {
    audio: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    text: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
    document: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    image: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    other: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>'
  };
  return icons[kind] || icons.other;
}

function kindLabel(kind, name) {
  // 先按 kind 分类，再根据扩展名细分
  if (kind === 'document' && name) {
    if (/\.(xlsx|xls|xlsb|ods)$/i.test(name)) return '表格';
    if (/\.(pptx|ppt|odp)$/i.test(name)) return '幻灯片';
    if (/\.(docx|doc|odt|rtf)$/i.test(name)) return '文档';
    return '文档';
  }
  const labels = {
    text: '文本',
    document: '文档',
    pdf: 'PDF',
    image: '图片',
    audio: '音频',
    other: '文件'
  };
  return labels[kind] || '文件';
}

// 音频预览：Bearer 拉取 blob → 本地对象 URL 播放（兼容鉴权媒体加载）
async function loadAudioFile(f) {
  const host = document.getElementById('file-viewer-audio-inner');
  const loading = document.getElementById('file-viewer-loading');
  const audioHost = document.getElementById('file-viewer-audio-host');
  if (!host) return;
  try {
    const res = await fetch(f.url, { headers: { Authorization: 'Bearer ' + state.token } });
    if (!res.ok) throw new Error('加载失败 (' + res.status + ')');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    host.innerHTML = `<audio controls autoplay preload="metadata" src="${objectUrl}"></audio>`;
    if (loading) loading.style.display = 'none';
    if (audioHost) audioHost.style.display = '';
  } catch (e) {
    if (loading) loading.textContent = '音频加载失败：' + (e.message || '未知错误');
  }
}

// 仅下载模式
function showDownloadOnly(f) {
  const loading = document.getElementById('file-viewer-loading');
  if (loading) {
    loading.innerHTML = `<div style="text-align:center;">
      <p>此文件类型不支持在线预览</p>
      <button class="btn btn-primary" id="file-viewer-download-only">下载文件</button>
    </div>`;
    const btn = document.getElementById('file-viewer-download-only');
    if (btn) btn.addEventListener('click', () => downloadUserFile(f));
  }
}

// 下载文件
function downloadUserFile(f) {
  if (!f.url) return;
  // 文本/文档/其他：通过 fetch + Authorization 头获取 blob
  if (f.kind === 'text' || f.kind === 'document' || f.kind === 'other') {
    const token = state.token;
    fetch(f.url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {}, credentials: 'include' })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = f.original_name || f.filename || 'file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      })
      .catch(e => toast('下载失败：' + e.message, 'error'));
  } else {
    // 图片/PDF：直接下载
    const a = document.createElement('a');
    a.href = f.url;
    a.download = f.original_name || f.filename || 'file';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// 更新状态栏
function updateFileViewerStatus(text) {
  const status = document.getElementById('file-viewer-status');
  if (status) status.textContent = text;
}

// 保存文本
async function saveTextFile() {
  if (fileViewerState.kind !== 'text' || !fileViewerState.id) return;
  const ta = document.getElementById('file-viewer-textarea');
  if (!ta) return;
  try {
    updateFileViewerStatus('保存中…');
    await api(`/api/upload/file/${fileViewerState.id}/text`, {
      method: 'PATCH',
      body: JSON.stringify({ content: ta.value })
    });
    fileViewerState.dirty = false;
    updateFileViewerStatus('已保存 · ' + ta.value.length + ' 字符 · ' + new Date().toLocaleTimeString());
    toast('已保存', 'success');
  } catch (e) {
    updateFileViewerStatus('保存失败：' + e.message);
    toast(e.message, 'error');
  }
}

// 绑定事件
function bindFileViewerEvents() {
  // 关闭
  document.querySelectorAll('[data-close="file-viewer"]').forEach(el => {
    el.addEventListener('click', () => {
      if (fileViewerState.dirty) {
        showModal('有未保存的修改', '是否保存当前修改？', async () => {
          await saveTextFile();
          closeFileViewerModal();
        }, { confirmText: '保存并关闭' });
        // 这里简化：直接关闭时再次弹原生确认
      } else {
        closeFileViewerModal();
      }
    });
  });
  // 保存
  document.getElementById('file-viewer-save').addEventListener('click', saveTextFile);
  // 下载
  document.getElementById('file-viewer-download').addEventListener('click', () => {
    if (!fileViewerState.id) return;
    downloadUserFile({
      id: fileViewerState.id,
      kind: fileViewerState.kind,
      url: fileViewerState.url,
      filename: fileViewerState.filename,
      original_name: fileViewerState.originalName
    });
  });
  // 重命名按钮
  const renameBtn = document.getElementById('file-viewer-rename');
  if (renameBtn) {
    renameBtn.addEventListener('click', () => {
      if (!fileViewerState.id) return;
      openRenameFileModal(fileViewerState.id, fileViewerState.originalName);
    });
  }
  // 文本输入
  const ta = document.getElementById('file-viewer-textarea');
  if (ta) {
    ta.addEventListener('input', () => {
      fileViewerState.dirty = true;
      const lines = ta.value.split('\n').length;
      updateFileViewerStatus(`编辑中 · ${lines} 行 · ${ta.value.length} 字符`);
    });
  }
  // 笔刷工具按钮
  const brushToggle = document.getElementById('file-viewer-brush-toggle');
  if (brushToggle) {
    brushToggle.addEventListener('click', () => {
      if (!fileViewerState.brush) {
        toast('该文件暂不支持批注（仅文档/表格可批注）', 'info');
        return;
      }
      const tools = document.getElementById('file-brush-tools');
      if (!tools) return;
      const visible = tools.style.display !== 'none';
      tools.style.display = visible ? 'none' : 'flex';
      if (fileViewerState.brush) {
        fileViewerState.brush.setTool(visible ? 'none' : 'pen');
        syncFileToolBtns(visible ? 'none' : 'pen');
      }
      brushToggle.classList.toggle('active', !visible);
    });
  }
  const penBtn = document.getElementById('file-brush-pen');
  const hlBtn = document.getElementById('file-brush-highlight');
  const eraserBtn = document.getElementById('file-brush-eraser');
  const undoBtn = document.getElementById('file-brush-undo');
  const clearBtn = document.getElementById('file-brush-clear');
  const saveBtn = document.getElementById('file-brush-save');
  const colorInput = document.getElementById('file-brush-color');
  const sizeInput = document.getElementById('file-brush-size');
  function syncFileToolBtns(tool) {
    penBtn && penBtn.setAttribute('aria-pressed', tool === 'pen' ? 'true' : 'false');
    hlBtn && hlBtn.setAttribute('aria-pressed', tool === 'highlight' ? 'true' : 'false');
    eraserBtn && eraserBtn.setAttribute('aria-pressed', tool === 'eraser' ? 'true' : 'false');
  }
  if (penBtn) penBtn.addEventListener('click', () => {
    if (fileViewerState.brush) {
      fileViewerState.brush.setTool('pen');
      syncFileToolBtns('pen');
    }
  });
  if (hlBtn) hlBtn.addEventListener('click', () => {
    if (fileViewerState.brush) {
      fileViewerState.brush.setTool('highlight');
      syncFileToolBtns('highlight');
    }
  });
  if (eraserBtn) eraserBtn.addEventListener('click', () => {
    if (fileViewerState.brush) {
      fileViewerState.brush.setTool('eraser');
      syncFileToolBtns('eraser');
    }
  });
  if (undoBtn) undoBtn.addEventListener('click', () => {
    if (fileViewerState.brush) fileViewerState.brush.undo();
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (fileViewerState.brush) {
      if (confirm('确定清空当前视图的所有批注？')) fileViewerState.brush.clear();
    }
  });
  if (saveBtn) saveBtn.addEventListener('click', async () => {
    if (fileViewerState.brush) {
      try {
        await fileViewerState.brush.save();
        toast('已保存批注', 'success');
      } catch (e) { toast('保存失败：' + e.message, 'error'); }
    }
  });
  if (colorInput) colorInput.addEventListener('input', e => {
    if (fileViewerState.brush) fileViewerState.brush.setColor(e.target.value);
  });
  if (sizeInput) sizeInput.addEventListener('input', e => {
    if (fileViewerState.brush) fileViewerState.brush.setSize(e.target.value);
  });
  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('file-viewer-modal');
    if (!modal || modal.style.display === 'none') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      const closeEl = document.querySelector('[data-close="file-viewer"]');
      if (closeEl) closeEl.click();
    } else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (fileViewerState.kind === 'text') saveTextFile();
    }
  });
}

// ===== 我的文件（图片 + PDF） =====
let currentFileFilter = 'all';
let currentFileFolder = ''; // 当前文件夹路径（空字符串 = 根目录）

function loadFiles() {
  showView('files');
  refreshFiles();
  loadFileFolders();
}

// 加载并渲染文件列表（含存储使用情况）
async function refreshFiles() {
  const grid = document.getElementById('files-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:40px;color:var(--fg-muted);">加载中...</div>';
  // 同步过滤按钮激活态
  document.querySelectorAll('.files-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFileFilter);
  });
  try {
    const params = [];
    if (currentFileFilter && currentFileFilter !== 'all') params.push(`kind=${encodeURIComponent(currentFileFilter)}`);
    if (currentFileFolder) params.push(`folder=${encodeURIComponent(currentFileFolder)}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    const [data, storage] = await Promise.all([
      api(`/api/upload/files${qs}`),
      api('/api/upload/storage').catch(() => null)
    ]);
    renderFilesStorageBar(storage);
    renderFilesBreadcrumb();
    if (!data.items || !data.items.length) {
      const emptyMap = {
        all: { title: currentFileFolder ? '此文件夹为空' : '还没有任何文件', hint: currentFileFolder ? '点击右上角"上传文件"按钮往此文件夹添加文件' : '点击右上角"上传文件"按钮开始上传' },
        image: { title: '暂无图片', hint: '切换到"全部"或上传图片试试' },
        pdf: { title: '暂无 PDF', hint: '切换到"全部"或上传 PDF 试试' },
        document: { title: '暂无文档', hint: '上传 Word/Excel/PPT 文件试试' },
        text: { title: '暂无文本文件', hint: '上传 txt/md/json/csv 等文件试试' },
        other: { title: '暂无其他文件', hint: '切换到"全部"试试' }
      };
      const e = emptyMap[currentFileFilter] || emptyMap.all;
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-illustration">${ILLUSTRATIONS.emptyImage}</div>
          <h3>${e.title}</h3>
          <p>${e.hint}</p>
        </div>`;
      return;
    }
    grid.innerHTML = data.items.map(file => renderFileItem(file)).join('');
    bindFileItemEvents(grid);
  } catch (e) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;color:var(--danger);">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

// 渲染单个文件项
function renderFileItem(f) {
  const kind = f.kind || 'other';
  const isPdf = kind === 'pdf';
  const isImg = kind === 'image';
  const isText = kind === 'text';
  const isDoc = kind === 'document';
  const isAudio = kind === 'audio';
  const name = f.original_name || f.filename || '未命名';
  const sizeText = formatFileSize(f.size);
  const dateText = formatDate(f.created_at);
  const ext = (name.split('.').pop() || '').toLowerCase();
  // 细分文档类型：表格 vs 文档
  const isSheet = /\.(xlsx|xls|xlsb|ods)$/i.test(name);
  const isPpt = /\.(pptx|ppt|odp)$/i.test(name);
  const isWord = /\.(docx|doc|odt|rtf)$/i.test(name);
  // 缩略图
  let thumb;
  let badgeLabel = ext.toUpperCase() || (isPdf ? 'PDF' : isImg ? 'IMG' : isText ? 'TXT' : 'FILE');
  if (isImg) {
    // 图片需鉴权访问：<img> 标签本身无法携带 Authorization 头，且浏览器在某些场景下
    // 不会自动发送 HttpOnly cookie（嵌入、跨域、隐私模式、SameSite 限制等），图片加载
    // 失败会显示 broken 图标。改为渲染后异步用 fetch + Bearer token 拉一次，成功后
    // 转 blob URL 赋给 <img>，无论 cookie 是否带都能正确显示。同时保留 onerror fallback。
    const safeUrl = escapeHtml(f.url);
    const safeName = escapeHtml(name);
    const safeExt = escapeHtml(ext || 'IMG');
    const safeId = String(f.id);
    thumb = `<div class="file-img-wrap" data-img-wrap="${safeId}" data-img-url="${safeUrl}">`
      + `<div class="file-img-fallback" data-img-fallback="${safeId}">`
      + `<div class="file-img-fallback-ext">${safeExt.toUpperCase()}</div>`
      + `</div>`
      + `<img data-img="${safeId}" alt="${safeName}" loading="lazy" style="display:none;">`
      + `</div>`;
  } else if (isPdf) {
    badgeLabel = 'PDF';
    thumb = `<div class="file-pdf-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isAudio) {
    badgeLabel = 'AUD';
    thumb = `<div class="file-pdf-icon file-audio-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isDoc && isSheet) {
    badgeLabel = 'XLS';
    thumb = `<div class="file-pdf-icon file-doc-icon file-sheet-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isDoc && isPpt) {
    badgeLabel = 'PPT';
    thumb = `<div class="file-pdf-icon file-doc-icon file-ppt-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isDoc && isWord) {
    badgeLabel = 'DOC';
    thumb = `<div class="file-pdf-icon file-doc-icon file-word-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isDoc) {
    thumb = `<div class="file-pdf-icon file-doc-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else if (isText) {
    thumb = `<div class="file-pdf-icon file-text-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel || 'TXT')}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  } else {
    thumb = `<div class="file-pdf-icon"><span class="file-pdf-ext">${escapeHtml(badgeLabel)}</span><span class="file-pdf-name">${escapeHtml(truncateName(name, 14))}</span></div>`;
  }
  // 操作按钮
  const actions = [];
  if (isImg) {
    actions.push(`<button class="file-action copy-md-btn" data-md="![${escapeHtml(name)}](${escapeHtml(f.url)})" title="复制 Markdown">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    </button>`);
  }
  if (isPdf) {
    actions.push(`<button class="file-action bind-pdf-btn" data-id="${f.id}" data-url="${escapeHtml(f.url)}" data-name="${escapeHtml(name)}" title="绑定到当前日记">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>`);
  }
  if (isAudio) {
    const audioMd = '<audio controls src="' + f.url + '"></audio>';
    actions.push(`<button class="file-action copy-md-btn" data-md="${escapeHtml(audioMd)}" title="复制 Markdown 音频代码">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    </button>`);
  }
  // 所有类型都有预览按钮（点击 file-item 时也会触发，这里显式提供）
  actions.push(`<button class="file-action open-file-btn" data-id="${f.id}" title="打开/预览">
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  </button>`);
  actions.push(`<button class="file-action rename-file-btn" data-id="${f.id}" data-name="${escapeHtml(name)}" data-kind="${escapeHtml(kind)}" title="重命名">
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
  </button>`);
  actions.push(`<button class="file-action danger del-file-btn" data-id="${f.id}" data-name="${escapeHtml(name)}" title="删除">
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
  </button>`);

  return `
    <div class="file-item file-${kind}${isAudio ? ' file-audio-card' : ''}" data-id="${f.id}" data-kind="${kind}" data-url="${escapeHtml(f.url)}" data-name="${escapeHtml(name)}" data-meta='${escapeHtml(JSON.stringify({id:f.id,kind,url:f.url,filename:f.filename,original_name:f.original_name,size:f.size,mime_type:f.mime_type}))}'>
      ${thumb}
      <div class="file-info" title="${escapeHtml(name)} · ${sizeText} · ${dateText}">
        <span class="file-name">${escapeHtml(truncateName(name, 22))}</span>
        <span class="file-meta">${sizeText} · ${kindLabel(kind, name)}</span>
      </div>
      ${isAudio ? `<div class="file-audio-player"><audio controls preload="metadata" src="${escapeHtml(f.url)}"></audio></div>` : ''}
      <div class="file-item-actions">
        ${actions.join('')}
      </div>
    </div>`;
}

function truncateName(name, max = 22) {
  if (!name) return '';
  if (name.length <= max) return name;
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  const base = name.slice(0, max - ext.length - 1);
  return base + '…' + ext;
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// 渲染存储使用情况
function renderFilesStorageBar(storage) {
  const bar = document.getElementById('files-storage-bar');
  if (!bar) return;
  if (!storage) { bar.innerHTML = ''; return; }
  const percent = Math.min(100, storage.percent || 0);
  const used = formatFileSize(storage.used);
  const limit = formatFileSize(storage.limit);
  const avail = formatFileSize(storage.available);
  bar.innerHTML = `
    <span class="storage-summary">已用 <strong>${used}</strong> / ${limit} · 剩余 ${avail}</span>
    <div class="storage-bar-track">
      <div class="storage-bar-fill" style="width:${percent.toFixed(1)}%;"></div>
    </div>
    <span class="storage-count">${storage.imageCount || 0} 图片 · ${storage.pdfCount || 0} PDF</span>
  `;
}

// 打开文件查看器（按 kind 路由到对应查看器）
function openFileByKind(f) {
  if (!f) return;
  if (f.kind === 'image') {
    openImageLightbox(f.url, f.original_name || f.filename, f.id);
  } else if (f.kind === 'pdf') {
    openPdfViewerModal(f.url, f.original_name || f.filename, f.id);
  } else if (f.kind === 'text' || f.kind === 'document' || f.kind === 'other') {
    openFileViewerFromMeta(f);
  } else if (f.kind === 'audio') {
    openFileViewerFromMeta(f);
  } else {
    window.open(f.url, '_blank');
  }
}

// 异步为文件网格中的图片缩略图加载 blob URL
// 用 fetch + Bearer token 取代 <img src>，解决：
//   1. <img> 无法携带 Authorization 头（之前仅依赖 HttpOnly cookie，
//      在嵌入/跨域/隐私模式/cookie 过期等场景下会 broken）
//   2. 用 IntersectionObserver 懒加载图片，节省带宽
// 失败时显示 fallback（文件类型大写标签），不让用户看到 broken 图标
const _imgObserver = (typeof IntersectionObserver !== 'undefined')
  ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const wrap = entry.target;
      _imgObserver.unobserve(wrap);
      _loadOneImage(wrap);
    });
  }, { rootMargin: '200px' })
  : null;

async function _loadOneImage(wrap) {
  const id = wrap.dataset.imgWrap;
  const url = wrap.dataset.imgUrl;
  const img = wrap.querySelector(`[data-img="${id}"]`);
  const fallback = wrap.querySelector(`[data-img-fallback="${id}"]`);
  if (!img || !url) return;
  try {
    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + state.token } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    // 释放前一次对象 URL 避免泄漏
    if (img.dataset.blobUrl) URL.revokeObjectURL(img.dataset.blobUrl);
    img.dataset.blobUrl = blobUrl;
    img.src = blobUrl;
    img.style.display = '';
    if (fallback) fallback.style.display = 'none';
  } catch (_) {
    // 加载失败：保持 fallback 显示
    if (fallback) fallback.style.display = 'flex';
  }
}

function loadImageThumbs(grid) {
  const wraps = grid.querySelectorAll('[data-img-wrap]');
  wraps.forEach(wrap => {
    if (_imgObserver) {
      _imgObserver.observe(wrap);
    } else {
      _loadOneImage(wrap);
    }
  });
}

// 绑定文件项事件（点击、按钮）
function bindFileItemEvents(grid) {
  grid.querySelectorAll('.copy-md-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    navigator.clipboard.writeText(b.dataset.md).then(() => toast('已复制 Markdown', 'success'));
  }));
  // 重命名按钮
  grid.querySelectorAll('.rename-file-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const id = parseInt(b.dataset.id, 10);
    const name = b.dataset.name || '';
    openRenameFileModal(id, name);
  }));
  grid.querySelectorAll('.del-file-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const id = b.dataset.id;
    const name = b.dataset.name || '该文件';
    showModal('删除文件', `确定要删除「${escapeHtml(name)}」吗？物理文件将一并删除。`, async () => {
      try {
        await api(`/api/upload/files/${id}`, { method: 'DELETE' });
        toast('已删除', 'success');
        refreshFiles();
      } catch (e) { toast(e.message, 'error'); }
    }, { danger: true, confirmText: '删除' });
  }));
  // 兼容旧版 open-pdf-btn（如果存在）
  grid.querySelectorAll('.open-pdf-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const item = b.closest('.file-item');
    const id = item ? parseInt(item.dataset.id, 10) : null;
    openPdfViewerModal(b.dataset.url, b.closest('.file-item')?.dataset.name || '', id);
  }));
  // 图片缩略图：异步 fetch + Bearer token 加载，避开 <img> 无法带 Authorization 的问题
  loadImageThumbs(grid);
  // 统一打开按钮
  grid.querySelectorAll('.open-file-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const item = b.closest('.file-item');
    if (!item) return;
    let meta = {};
    try { meta = JSON.parse(item.dataset.meta || '{}'); } catch (_) {}
    openFileByKind(meta);
  }));
  // 绑定到当前日记
  grid.querySelectorAll('.bind-pdf-btn').forEach(b => b.addEventListener('click', async e => {
    e.stopPropagation();
    const id = b.dataset.id;
    const url = b.dataset.url;
    const name = b.dataset.name || '该 PDF';
    // 必须先有当前打开的日记
    const diaryId = state.editingId || brushState.diaryId;
    if (!diaryId) {
      toast('请先打开或新建一篇日记，再绑定 PDF', 'error');
      return;
    }
    try {
      await api(`/api/diaries/${diaryId}/bind-pdf`, {
        method: 'POST',
        body: JSON.stringify({ fileId: parseInt(id, 10) })
      });
      toast(`已绑定 PDF：${name}`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }));
  // 点击文件项：按 kind 打开对应查看器
  grid.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('.file-item-actions')) return;
      let meta = {};
      try { meta = JSON.parse(item.dataset.meta || '{}'); } catch (_) {}
      openFileByKind(meta);
    });
  });
}

// 更新文件页上传进度条
function setFilesUploadProgress(active, percent, label) {
  const bar = document.getElementById('files-upload-progress');
  const fill = document.getElementById('files-upload-progress-fill');
  const labelEl = document.getElementById('files-upload-progress-label');
  if (!bar || !fill || !labelEl) return;
  bar.style.display = active ? 'flex' : 'none';
  if (active) {
    fill.style.width = Math.max(2, Math.min(100, percent)) + '%';
    labelEl.textContent = label || '';
  }
}

// 单个文件通过 XHR 上传（支持真实进度事件）
function uploadOneFile(file, targetFolder) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    const url = targetFolder
      ? `/api/upload/file?folder=${encodeURIComponent(targetFolder)}`
      : '/api/upload/file';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + state.token);
    xhr.timeout = 5 * 60 * 1000;
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setFilesUploadProgress(true, (e.loaded / e.total) * 100, `正在上传：${file.name}（${formatFileSize(e.loaded)} / ${formatFileSize(e.total)}）`);
      }
    });
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText || '{}'); } catch (_) {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || `上传失败（HTTP ${xhr.status}）`));
    };
    xhr.onerror = () => reject(new Error('网络错误，上传失败'));
    xhr.ontimeout = () => reject(new Error('上传超时'));
    xhr.send(fd);
  });
}

// 上传文件（input change / 拖拽触发），带进度条与批量汇总
async function uploadFiles(fileList, folder) {
  if (!fileList || !fileList.length) return;
  const files = Array.from(fileList);
  const maxSize = 50 * 1024 * 1024;
  const tooBig = files.filter(f => f.size > maxSize);
  if (tooBig.length) {
    const names = tooBig.slice(0, 3).map(f => f.name).join('、');
    toast(`已跳过超过 50MB 的文件：${names}${tooBig.length > 3 ? ' 等' : ''}`, 'error');
  }
  const validFiles = files.filter(f => f.size <= maxSize);
  if (!validFiles.length) return;

  const totalSize = validFiles.reduce((s, f) => s + f.size, 0);
  // 预检：存储配额
  try {
    const storage = await api('/api/upload/storage');
    if (storage.available < totalSize) {
      toast(`存储空间不足，剩余 ${formatFileSize(storage.available)}`, 'error');
      return;
    }
  } catch (_) {}

  const targetFolder = folder || '';
  let okCount = 0;
  const failed = [];
  setFilesUploadProgress(true, 0, `准备上传 ${validFiles.length} 个文件...`);
  for (let i = 0; i < validFiles.length; i++) {
    const f = await compressImageFile(validFiles[i]);
    setFilesUploadProgress(true, (i / validFiles.length) * 100, `上传中 ${i + 1}/${validFiles.length}：${f.name}`);
    try {
      await uploadOneFile(f, targetFolder);
      okCount++;
    } catch (e) {
      failed.push({ name: f.name, error: e.message });
    }
  }
  setFilesUploadProgress(false, 100, '');
  if (okCount > 0) {
    toast(`已上传 ${okCount} 个文件${failed.length ? `，失败 ${failed.length} 个` : ''}`, okCount === validFiles.length ? 'success' : 'info');
  }
  failed.slice(0, 3).forEach(x => toast(`${x.name} 上传失败：${x.error}`, 'error'));
  refreshFiles();
}

// 初始化"我的文件"页面事件（仅绑定一次）
function initFilesView() {
  // 过滤按钮
  document.querySelectorAll('.files-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFileFilter = btn.dataset.filter || 'all';
      refreshFiles();
    });
  });
  // 上传 input（带 folder 参数）
  const input = document.getElementById('files-upload-input');
  if (input) {
    input.addEventListener('change', e => {
      uploadFiles(e.target.files, currentFileFolder);
      e.target.value = '';
    });
  }
  // 新建文件夹按钮
  const createFolderBtn = document.getElementById('btn-create-folder');
  if (createFolderBtn) {
    createFolderBtn.addEventListener('click', () => openNewFolderModal(currentFileFolder));
  }
  // 面包屑点击
  const breadcrumb = document.getElementById('files-breadcrumb');
  if (breadcrumb) {
    breadcrumb.addEventListener('click', e => {
      const crumb = e.target.closest('.crumb');
      if (!crumb || crumb.classList.contains('current')) return;
      const folder = crumb.dataset.folder || '';
      selectFileFolder(folder);
    });
  }
  // 重命名文件模态框事件
  initRenameFileModal();
  // 新建文件夹模态框事件
  initNewFolderModal();
  // 图片灯箱事件
  initImageLightbox();
}

// ===== 文件夹侧边栏（"我的文件"页面） =====
// 缓存文件文件夹树：{ id, name, parent, children: [] }
let fileFolderTree = [];
let fileFolderMap = {}; // path -> {id, name, parent}

async function loadFileFolders() {
  try {
    // 加载所有层级（递归子目录）
    const all = await loadAllFileFolders('');
    fileFolderTree = all;
    // 重建 path -> node 索引
    fileFolderMap = {};
    const walk = (nodes, basePath) => {
      for (const n of nodes) {
        const path = basePath ? basePath + '/' + n.name : n.name;
        fileFolderMap[path] = n;
        if (n.children && n.children.length) walk(n.children, path);
      }
    };
    walk(fileFolderTree, '');
    renderFileFolderSidebar();
  } catch (e) {
    console.warn('加载文件文件夹失败:', e.message);
  }
}

async function loadAllFileFolders(parent) {
  const data = await api(`/api/upload/folders?parent=${encodeURIComponent(parent || '')}`);
  const items = data.items || [];
  const result = [];
  for (const it of items) {
    const node = { id: it.id, name: it.name, parent: it.parent || '', children: [] };
    try {
      node.children = await loadAllFileFolders(it.parent ? it.parent + '/' + it.name : it.name);
    } catch (_) { node.children = []; }
    result.push(node);
  }
  return result;
}

function renderFileFolderSidebar() {
  const container = document.getElementById('file-folder-list');
  if (!container) return;
  const FOLDER_ICON = '<svg class="file-folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
  const renderNode = (node, basePath, depth) => {
    const path = basePath ? basePath + '/' + node.name : node.name;
    const active = currentFileFolder === path;
    const html = `<div class="file-folder-item ${active ? 'active' : ''}" data-folder="${escapeHtml(path)}" title="${escapeHtml(node.name)}">
      ${FOLDER_ICON}
      <span class="file-folder-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${escapeHtml(node.name)}</span>
      <span class="file-folder-actions">
        <button class="file-folder-action rename-file-folder-btn" data-path="${escapeHtml(path)}" data-name="${escapeHtml(node.name)}" title="重命名">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="file-folder-action danger del-file-folder-btn" data-path="${escapeHtml(path)}" data-name="${escapeHtml(node.name)}" title="删除">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </span>
    </div>`;
    const childrenHtml = (node.children || []).map(c => renderNode(c, path, depth + 1)).join('');
    return html + (childrenHtml ? `<div class="file-folder-children">${childrenHtml}</div>` : '');
  };
  const rootActive = currentFileFolder === '';
  const allHtml = `<div class="file-folder-item ${rootActive ? 'active' : ''}" data-folder="" title="所有文件（根目录）">
    <svg class="file-folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span class="file-folder-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">所有文件</span>
  </div>`;
  const treeHtml = fileFolderTree.map(n => renderNode(n, '', 0)).join('');
  container.innerHTML = allHtml + treeHtml;
  // 绑定点击切换
  container.querySelectorAll('.file-folder-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('.file-folder-action')) return;
      const path = item.dataset.folder || '';
      selectFileFolder(path);
    });
  });
  // 重命名按钮
  container.querySelectorAll('.rename-file-folder-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const path = btn.dataset.path || '';
      const name = btn.dataset.name || '';
      openRenameFolderModal(path, name);
    });
  });
  // 删除按钮
  container.querySelectorAll('.del-file-folder-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const path = btn.dataset.path || '';
      const name = btn.dataset.name || '';
      confirmDeleteFileFolder(path, name);
    });
  });
}

function selectFileFolder(path) {
  currentFileFolder = path || '';
  renderFileFolderSidebar();
  refreshFiles();
}

function renderFilesBreadcrumb() {
  const el = document.getElementById('files-breadcrumb');
  if (!el) return;
  const parts = currentFileFolder ? currentFileFolder.split('/') : [];
  let html = `<span class="crumb" data-folder="" title="返回根目录">我的文件</span>`;
  let acc = '';
  for (const p of parts) {
    acc = acc ? acc + '/' + p : p;
    const isLast = acc === currentFileFolder;
    html += `<span class="crumb-sep">/</span>`;
    if (isLast) {
      html += `<span class="crumb current" data-folder="${escapeHtml(acc)}">${escapeHtml(p)}</span>`;
    } else {
      html += `<span class="crumb" data-folder="${escapeHtml(acc)}">${escapeHtml(p)}</span>`;
    }
  }
  el.innerHTML = html;
}

async function confirmDeleteFileFolder(path, name) {
  showModal('删除文件夹', `确定要删除文件夹「${name}」吗？此文件夹下的所有文件及子文件夹都会被一并删除，且无法恢复。`, async () => {
    try {
      // 找到 folder id（递归构建时可能没有，需要再查一次）
      const parent = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
      const data = await api(`/api/upload/folders?parent=${encodeURIComponent(parent)}`);
      const target = (data.items || []).find(x => x.name === name);
      if (!target) throw new Error('文件夹不存在');
      await api(`/api/upload/folders/${target.id}`, { method: 'DELETE' });
      toast('已删除文件夹', 'success');
      // 如果当前在该文件夹下，退出到根目录
      if (currentFileFolder === path) selectFileFolder('');
      else loadFileFolders();
    } catch (e) {
      toast(e.message, 'error');
    }
  }, { danger: true, confirmText: '删除' });
}

function openRenameFolderModal(path, name) {
  const newName = prompt('重命名文件夹', name);
  if (!newName || newName === name) return;
  if (newName.includes('/')) {
    toast('文件夹名不能包含 /', 'error');
    return;
  }
  (async () => {
    try {
      const parent = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
      const data = await api(`/api/upload/folders?parent=${encodeURIComponent(parent)}`);
      const target = (data.items || []).find(x => x.name === name);
      if (!target) throw new Error('文件夹不存在');
      await api(`/api/upload/folders/${target.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newName.trim() })
      });
      toast('已重命名', 'success');
      loadFileFolders();
    } catch (e) {
      toast(e.message, 'error');
    }
  })();
}

// ===== 新建文件夹模态框 =====
function openNewFolderModal(parentPath) {
  const modal = document.getElementById('new-folder-modal');
  const input = document.getElementById('new-folder-input');
  if (!modal || !input) return;
  input.value = '';
  input.dataset.parent = parentPath || '';
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}

function initNewFolderModal() {
  const modal = document.getElementById('new-folder-modal');
  if (!modal) return;
  modal.querySelectorAll('[data-close="new-folder"]').forEach(el => {
    el.addEventListener('click', () => { modal.style.display = 'none'; });
  });
  const confirmBtn = document.getElementById('new-folder-confirm');
  const input = document.getElementById('new-folder-input');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const name = (input.value || '').trim();
      if (!name) { toast('请输入文件夹名', 'error'); return; }
      if (name.includes('/')) { toast('文件夹名不能包含 /', 'error'); return; }
      const parent = input.dataset.parent || '';
      try {
        await api('/api/upload/folders', {
          method: 'POST',
          body: JSON.stringify({ name, parent })
        });
        modal.style.display = 'none';
        toast('已创建文件夹', 'success');
        loadFileFolders();
      } catch (e) {
        toast(e.message, 'error');
      }
    });
  }
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); confirmBtn && confirmBtn.click(); }
    });
  }
}

// ===== 重命名文件模态框 =====
let renameFileTargetId = null;

function openRenameFileModal(id, name) {
  const modal = document.getElementById('rename-file-modal');
  const input = document.getElementById('rename-file-input');
  if (!modal || !input) return;
  renameFileTargetId = id;
  // 智能拆分文件名与扩展名
  const dotIdx = name.lastIndexOf('.');
  if (dotIdx > 0 && dotIdx < name.length - 1) {
    input.value = name;
  } else {
    input.value = name;
  }
  modal.style.display = 'flex';
  setTimeout(() => {
    input.focus();
    // 选中主体（不含扩展名）
    if (dotIdx > 0 && dotIdx < name.length - 1) {
      input.setSelectionRange(0, dotIdx);
    } else {
      input.select();
    }
  }, 50);
}

function initRenameFileModal() {
  const modal = document.getElementById('rename-file-modal');
  if (!modal) return;
  modal.querySelectorAll('[data-close="rename-file"]').forEach(el => {
    el.addEventListener('click', () => {
      modal.style.display = 'none';
      renameFileTargetId = null;
    });
  });
  const confirmBtn = document.getElementById('rename-file-confirm');
  const input = document.getElementById('rename-file-input');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!renameFileTargetId) { modal.style.display = 'none'; return; }
      const newName = (input.value || '').trim();
      if (!newName) { toast('请输入新文件名', 'error'); return; }
      try {
        await api(`/api/upload/files/${renameFileTargetId}`, {
          method: 'PATCH',
          body: JSON.stringify({ original_name: newName })
        });
        const renamedId = renameFileTargetId;
        modal.style.display = 'none';
        renameFileTargetId = null;
        toast('已重命名', 'success');
        refreshFiles();
        // 如果当前正在查看该文件，刷新查看器标题
        if (fileViewerState.id === renamedId) {
          const fnEl = document.getElementById('file-viewer-modal-filename');
          if (fnEl) {
            fnEl.textContent = newName;
            fnEl.title = newName;
          }
          fileViewerState.originalName = newName;
        }
      } catch (e) {
        toast(e.message, 'error');
      }
    });
  }
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); confirmBtn && confirmBtn.click(); }
      else if (e.key === 'Escape') { modal.style.display = 'none'; renameFileTargetId = null; }
    });
  }
}

// ===== 图片灯箱（带笔刷） =====
const imageLightboxState = {
  url: '',
  filename: '',
  fileId: null,
  scale: 1,
  brush: null
};

function openImageLightbox(url, filename, fileId) {
  const modal = document.getElementById('image-lightbox-modal');
  if (!modal) {
    // 兜底：直接新窗口打开
    window.open(url, '_blank');
    return;
  }
  imageLightboxState.url = url;
  imageLightboxState.filename = filename || '图片';
  imageLightboxState.fileId = fileId || null;
  imageLightboxState.scale = 1;
  const fnEl = document.getElementById('image-lightbox-filename');
  if (fnEl) { fnEl.textContent = filename || '图片'; fnEl.title = filename || ''; }
  const zoomEl = document.getElementById('image-lightbox-zoom-value');
  if (zoomEl) zoomEl.textContent = '100%';
  const img = document.getElementById('image-lightbox-img');
  if (img) img.src = url;
  const brushTools = document.getElementById('image-brush-tools');
  if (brushTools) brushTools.style.display = 'none';
  // 显示模态框
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // 销毁旧笔刷
  if (imageLightboxState.brush) {
    try { imageLightboxState.brush.destroy(); } catch (_) {}
    imageLightboxState.brush = null;
  }
  // 初始化笔刷（仅当有 fileId 时）
  if (fileId) {
    const stage = document.getElementById('image-lightbox-stage');
    if (stage) {
      // 等图片加载完成后再创建笔刷，确保尺寸正确
      const onImgLoad = () => {
        if (imageLightboxState.brush) {
          try { imageLightboxState.brush.destroy(); } catch (_) {}
        }
        imageLightboxState.brush = createBrushOverlay(stage, {
          fileId: fileId,
          kind: 'image',
          pageKey: 'main'
        });
        img.removeEventListener('load', onImgLoad);
      };
      if (img.complete && img.naturalWidth > 0) {
        onImgLoad();
      } else {
        img.addEventListener('load', onImgLoad);
      }
    }
  }
}

function closeImageLightbox() {
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
  if (imageLightboxState.brush) {
    try { imageLightboxState.brush.save(); } catch (_) {}
    try { imageLightboxState.brush.destroy(); } catch (_) {}
    imageLightboxState.brush = null;
  }
  const img = document.getElementById('image-lightbox-img');
  if (img) img.src = '';
  imageLightboxState.url = '';
  imageLightboxState.filename = '';
  imageLightboxState.fileId = null;
  imageLightboxState.scale = 1;
}

function setImageLightboxScale(s) {
  imageLightboxState.scale = Math.max(0.2, Math.min(5, s));
  const stage = document.getElementById('image-lightbox-stage');
  if (stage) stage.style.transform = `scale(${imageLightboxState.scale})`;
  const zoomEl = document.getElementById('image-lightbox-zoom-value');
  if (zoomEl) zoomEl.textContent = Math.round(imageLightboxState.scale * 100) + '%';
}

function initImageLightbox() {
  // 关闭按钮
  document.querySelectorAll('[data-close="image-lightbox"]').forEach(el => {
    el.addEventListener('click', closeImageLightbox);
  });
  // 缩放控制
  const zin = document.getElementById('image-lightbox-zoom-in');
  const zout = document.getElementById('image-lightbox-zoom-out');
  const zreset = document.getElementById('image-lightbox-reset');
  if (zin) zin.addEventListener('click', () => setImageLightboxScale(imageLightboxState.scale + 0.1));
  if (zout) zout.addEventListener('click', () => setImageLightboxScale(imageLightboxState.scale - 0.1));
  if (zreset) zreset.addEventListener('click', () => setImageLightboxScale(1));
  // 下载
  const dl = document.getElementById('image-lightbox-download');
  if (dl) dl.addEventListener('click', () => {
    if (!imageLightboxState.url) return;
    const a = document.createElement('a');
    a.href = imageLightboxState.url;
    a.download = imageLightboxState.filename || 'image';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  // 笔刷切换
  const brushToggle = document.getElementById('image-lightbox-brush-toggle');
  if (brushToggle) {
    brushToggle.addEventListener('click', () => {
      if (!imageLightboxState.fileId) {
        toast('请通过"我的文件"打开图片才能批注', 'info');
        return;
      }
      const tools = document.getElementById('image-brush-tools');
      if (!tools) return;
      const visible = tools.style.display !== 'none';
      tools.style.display = visible ? 'none' : 'flex';
      if (imageLightboxState.brush) {
        imageLightboxState.brush.setTool(visible ? 'none' : 'pen');
        syncImageToolBtns(visible ? 'none' : 'pen');
      }
      brushToggle.classList.toggle('active', !visible);
    });
  }
  // 笔刷按钮
  const penBtn = document.getElementById('image-brush-pen');
  const hlBtn = document.getElementById('image-brush-highlight');
  const eraserBtn = document.getElementById('image-brush-eraser');
  const undoBtn = document.getElementById('image-brush-undo');
  const clearBtn = document.getElementById('image-brush-clear');
  const saveBtn = document.getElementById('image-brush-save');
  const colorInput = document.getElementById('image-brush-color');
  const sizeInput = document.getElementById('image-brush-size');
  function syncImageToolBtns(tool) {
    penBtn && penBtn.setAttribute('aria-pressed', tool === 'pen' ? 'true' : 'false');
    hlBtn && hlBtn.setAttribute('aria-pressed', tool === 'highlight' ? 'true' : 'false');
    eraserBtn && eraserBtn.setAttribute('aria-pressed', tool === 'eraser' ? 'true' : 'false');
  }
  if (penBtn) penBtn.addEventListener('click', () => {
    if (imageLightboxState.brush) {
      imageLightboxState.brush.setTool('pen');
      syncImageToolBtns('pen');
    }
  });
  if (hlBtn) hlBtn.addEventListener('click', () => {
    if (imageLightboxState.brush) {
      imageLightboxState.brush.setTool('highlight');
      syncImageToolBtns('highlight');
    }
  });
  if (eraserBtn) eraserBtn.addEventListener('click', () => {
    if (imageLightboxState.brush) {
      imageLightboxState.brush.setTool('eraser');
      syncImageToolBtns('eraser');
    }
  });
  if (undoBtn) undoBtn.addEventListener('click', () => {
    if (imageLightboxState.brush) imageLightboxState.brush.undo();
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (imageLightboxState.brush) {
      if (confirm('确定清空当前图片的所有批注？')) imageLightboxState.brush.clear();
    }
  });
  if (saveBtn) saveBtn.addEventListener('click', async () => {
    if (imageLightboxState.brush) {
      try {
        await imageLightboxState.brush.save();
        toast('已保存批注', 'success');
      } catch (e) { toast('保存失败：' + e.message, 'error'); }
    }
  });
  if (colorInput) colorInput.addEventListener('input', e => {
    if (imageLightboxState.brush) imageLightboxState.brush.setColor(e.target.value);
  });
  if (sizeInput) sizeInput.addEventListener('input', e => {
    if (imageLightboxState.brush) imageLightboxState.brush.setSize(e.target.value);
  });
  // 滚轮缩放
  const body = document.getElementById('image-lightbox-body');
  if (body) {
    body.addEventListener('wheel', e => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      if (e.deltaY < 0) setImageLightboxScale(imageLightboxState.scale + 0.1);
      else setImageLightboxScale(imageLightboxState.scale - 0.1);
    }, { passive: false });
  }
  // ESC 关闭 + 键盘快捷键
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('image-lightbox-modal');
    if (!modal || modal.style.display === 'none') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeImageLightbox();
    } else if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
      e.preventDefault();
      setImageLightboxScale(imageLightboxState.scale + 0.1);
    } else if (e.ctrlKey && e.key === '-') {
      e.preventDefault();
      setImageLightboxScale(imageLightboxState.scale - 0.1);
    } else if (e.ctrlKey && e.key === '0') {
      e.preventDefault();
      setImageLightboxScale(1);
    }
  });
}

// ===== 个人设置 =====
function loadProfileView() {
  showView('profile');
  document.getElementById('profile-username').value = state.user.username;
  document.getElementById('profile-nickname').value = state.user.nickname || '';
  document.getElementById('profile-bio').value = state.user.bio || '';
  renderProfileAvatarPreview();
  loadUserStorage();
  // 顺带加载主题设置与我的数据（已并入个人设置页）
  if (typeof loadThemeSettings === 'function') loadThemeSettings();
  if (typeof loadMyData === 'function') loadMyData();
}

// 渲染个人设置页的头像预览（含图片或首字母）
function renderProfileAvatarPreview() {
  const el = document.getElementById('profile-avatar-preview');
  if (!el || !state.user) return;
  const name = state.user.nickname || state.user.username || '?';
  if (state.user.avatar) {
    el.innerHTML = `<img src="${escapeHtml(state.user.avatar)}" alt="${escapeHtml(name)}">`;
  } else {
    el.textContent = name.charAt(0).toUpperCase();
  }
  const removeBtn = document.getElementById('btn-remove-avatar');
  if (removeBtn) removeBtn.style.display = state.user.avatar ? '' : 'none';
}

// ===== 头像选择 / 裁切 / 上传 =====
let avatarCropState = null;
let avatarFileInput = null;

function openAvatarSourceModal() {
  document.getElementById('avatar-source-modal').style.display = 'flex';
}
function closeAvatarSourceModal() {
  document.getElementById('avatar-source-modal').style.display = 'none';
}

function openAvatarPicker() {
  closeAvatarSourceModal();
  const grid = document.getElementById('avatar-picker-grid');
  grid.innerHTML = '<div class="avatar-picker-empty">加载中...</div>';
  document.getElementById('avatar-picker-modal').style.display = 'flex';
  // 优先从统一 files 表读取图片（包含旧版 images 表迁移过来的记录）
  api('/api/upload/files?kind=image').then(data => {
    if (!data.items || !data.items.length) {
      grid.innerHTML = '<div class="avatar-picker-empty">暂无图片，请先在「我的文件」中上传图片。</div>';
      return;
    }
    grid.innerHTML = data.items.map(img => `
      <div class="avatar-picker-item" data-url="${escapeHtml(img.url)}">
        <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.original_name || '')}" loading="lazy">
      </div>
    `).join('');
    grid.querySelectorAll('.avatar-picker-item').forEach(item => {
      item.addEventListener('click', () => openAvatarCrop(item.dataset.url));
    });
  }).catch(err => {
    grid.innerHTML = `<div class="avatar-picker-empty">加载失败：${escapeHtml(err.message)}</div>`;
  });
}
function closeAvatarPicker() {
  document.getElementById('avatar-picker-modal').style.display = 'none';
}

function triggerAvatarFileUpload() {
  if (!avatarFileInput) {
    avatarFileInput = document.createElement('input');
    avatarFileInput.type = 'file';
    avatarFileInput.accept = 'image/*';
    avatarFileInput.style.display = 'none';
    avatarFileInput.addEventListener('change', () => {
      const file = avatarFileInput.files && avatarFileInput.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      openAvatarCrop(url);
      avatarFileInput.value = '';
    });
    document.body.appendChild(avatarFileInput);
  }
  avatarFileInput.click();
}

function openAvatarCrop(imageUrl) {
  closeAvatarPicker();
  closeAvatarSourceModal();
  const modal = document.getElementById('avatar-crop-modal');
  const imgEl = document.getElementById('avatar-crop-image');
  const container = document.getElementById('avatar-crop-container');
  const slider = document.getElementById('avatar-crop-zoom-slider');
  modal.style.display = 'flex';
  // 强制布局，确保 getBoundingClientRect 拿到正确尺寸
  void container.offsetWidth;
  imgEl.style.opacity = '0';
  imgEl.style.transform = 'translate(0,0) scale(1)';
  avatarCropState = null;
  imgEl.onload = () => {
    imgEl.style.opacity = '1';
    const rect = container.getBoundingClientRect();
    const containerSize = rect.width || 280;
    const naturalW = imgEl.naturalWidth;
    const naturalH = imgEl.naturalHeight;
    if (!naturalW || !naturalH) {
      toast('图片加载失败', 'error');
      closeAvatarCrop();
      return;
    }
    const baseScale = containerSize / Math.min(naturalW, naturalH);
    const minScale = baseScale;
    const maxScale = Math.max(baseScale * 6, 4);
    const scale = baseScale;
    const x = (containerSize - naturalW * scale) / 2;
    const y = (containerSize - naturalH * scale) / 2;
    avatarCropState = {
      img: imgEl,
      container,
      containerSize,
      naturalW, naturalH,
      baseScale, minScale, maxScale,
      scale, x, y,
      pointers: new Map(),
      dragStart: null,
      pinchStart: null
    };
    slider.min = minScale;
    slider.max = maxScale;
    slider.step = 0.01;
    slider.value = scale;
    renderAvatarCrop();
  };
  imgEl.onerror = () => {
    toast('图片加载失败', 'error');
    closeAvatarCrop();
  };
  imgEl.src = imageUrl;
}

function closeAvatarCrop() {
  const modal = document.getElementById('avatar-crop-modal');
  if (modal) modal.style.display = 'none';
  if (avatarCropState) {
    avatarCropState.pointers.clear();
    avatarCropState = null;
  }
}

function renderAvatarCrop() {
  if (!avatarCropState) return;
  const { img, scale, x, y } = avatarCropState;
  img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function clampAvatarCropPos(x, y) {
  if (!avatarCropState) return { x: 0, y: 0 };
  const { containerSize, naturalW, naturalH, scale } = avatarCropState;
  const dispW = naturalW * scale;
  const dispH = naturalH * scale;
  const maxX = Math.min(0, containerSize - dispW);
  const maxY = Math.min(0, containerSize - dispH);
  return {
    x: Math.max(maxX, Math.min(0, x)),
    y: Math.max(maxY, Math.min(0, y))
  };
}

function setAvatarCropScale(newScale, centerCx, centerCy) {
  if (!avatarCropState) return;
  const { scale, x, y, containerSize, minScale, maxScale } = avatarCropState;
  const ns = Math.max(minScale, Math.min(maxScale, newScale));
  if (ns === scale) return;
  const cx = (centerCx === undefined) ? containerSize / 2 : centerCx;
  const cy = (centerCy === undefined) ? containerSize / 2 : centerCy;
  // 让容器内 (cx, cy) 对应的图片点在新缩放下保持不动
  const imgX = (cx - x) / scale;
  const imgY = (cy - y) / scale;
  const nx = cx - imgX * ns;
  const ny = cy - imgY * ns;
  const clamped = clampAvatarCropPos(nx, ny);
  avatarCropState.scale = ns;
  avatarCropState.x = clamped.x;
  avatarCropState.y = clamped.y;
  const slider = document.getElementById('avatar-crop-zoom-slider');
  if (slider) slider.value = ns;
  renderAvatarCrop();
}

async function cropAndUploadAvatar() {
  if (!avatarCropState) return;
  const { img, naturalW, naturalH, scale, x, y, containerSize } = avatarCropState;
  // 容器可视区域映射到原图坐标
  const sx = Math.max(0, -x / scale);
  const sy = Math.max(0, -y / scale);
  const sWidth = Math.min(naturalW - sx, containerSize / scale);
  const sHeight = Math.min(naturalH - sy, containerSize / scale);
  if (sWidth <= 0 || sHeight <= 0) {
    toast('裁切区域无效', 'error');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 256, 256);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    toast('裁切失败', 'error');
    return;
  }
  const confirmBtn = document.getElementById('avatar-crop-confirm');
  confirmBtn.disabled = true;
  confirmBtn.textContent = '上传中...';
  try {
    const uploadData = await apiUpload(new File([blob], 'avatar.png', { type: 'image/png' }));
    const data = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ avatar: uploadData.url })
    });
    state.user = data.user;
    localStorage.setItem('treeks_user', JSON.stringify(data.user));
    renderUserCard();
    renderProfileAvatarPreview();
    toast('头像已更新', 'success');
    closeAvatarCrop();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = '确认裁切并上传';
  }
}

async function removeAvatar() {
  try {
    const data = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ avatar: '' })
    });
    state.user = data.user;
    localStorage.setItem('treeks_user', JSON.stringify(data.user));
    renderUserCard();
    renderProfileAvatarPreview();
    toast('已移除头像', 'success');
  } catch (err) {
    toast(err.message, 'error');
  }
}

function bindAvatarCropInteraction() {
  const container = document.getElementById('avatar-crop-container');
  const slider = document.getElementById('avatar-crop-zoom-slider');
  const zoomIn = document.getElementById('avatar-crop-zoom-in');
  const zoomOut = document.getElementById('avatar-crop-zoom-out');
  const confirmBtn = document.getElementById('avatar-crop-confirm');

  // 拖动 + 双指缩放（Pointer Events，同时支持鼠标和触摸）
  container.addEventListener('pointerdown', e => {
    if (!avatarCropState) return;
    try { container.setPointerCapture(e.pointerId); } catch (_) {}
    avatarCropState.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (avatarCropState.pointers.size === 1) {
      avatarCropState.dragStart = {
        startClientX: e.clientX, startClientY: e.clientY,
        startImgX: avatarCropState.x, startImgY: avatarCropState.y
      };
      avatarCropState.pinchStart = null;
    } else if (avatarCropState.pointers.size === 2) {
      const pts = Array.from(avatarCropState.pointers.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      avatarCropState.pinchStart = {
        dist: Math.hypot(dx, dy) || 1,
        scale: avatarCropState.scale
      };
      avatarCropState.dragStart = null;
    }
  });
  container.addEventListener('pointermove', e => {
    if (!avatarCropState) return;
    if (!avatarCropState.pointers.has(e.pointerId)) return;
    avatarCropState.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = container.getBoundingClientRect();
    if (avatarCropState.pinchStart && avatarCropState.pointers.size >= 2) {
      const pts = Array.from(avatarCropState.pointers.values()).slice(0, 2);
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const newDist = Math.hypot(dx, dy) || 1;
      const ratio = newDist / avatarCropState.pinchStart.dist;
      const newScale = avatarCropState.pinchStart.scale * ratio;
      const midClientX = (pts[0].x + pts[1].x) / 2;
      const midClientY = (pts[0].y + pts[1].y) / 2;
      setAvatarCropScale(newScale, midClientX - rect.left, midClientY - rect.top);
    } else if (avatarCropState.dragStart) {
      const ds = avatarCropState.dragStart;
      const nx = ds.startImgX + (e.clientX - ds.startClientX);
      const ny = ds.startImgY + (e.clientY - ds.startClientY);
      const clamped = clampAvatarCropPos(nx, ny);
      avatarCropState.x = clamped.x;
      avatarCropState.y = clamped.y;
      renderAvatarCrop();
    }
  });
  const releasePointer = e => {
    if (!avatarCropState) return;
    avatarCropState.pointers.delete(e.pointerId);
    if (avatarCropState.pointers.size < 2) avatarCropState.pinchStart = null;
    if (avatarCropState.pointers.size === 0) avatarCropState.dragStart = null;
  };
  container.addEventListener('pointerup', releasePointer);
  container.addEventListener('pointercancel', releasePointer);

  // 滚轮缩放（桌面端）
  container.addEventListener('wheel', e => {
    if (!avatarCropState) return;
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = Math.exp(-e.deltaY * 0.0025);
    setAvatarCropScale(avatarCropState.scale * factor, cx, cy);
  }, { passive: false });

  // 缩放滑块与按钮
  slider.addEventListener('input', () => {
    if (!avatarCropState) return;
    setAvatarCropScale(parseFloat(slider.value));
  });
  zoomIn.addEventListener('click', () => {
    if (avatarCropState) setAvatarCropScale(avatarCropState.scale * 1.2);
  });
  zoomOut.addEventListener('click', () => {
    if (avatarCropState) setAvatarCropScale(avatarCropState.scale / 1.2);
  });

  confirmBtn.addEventListener('click', cropAndUploadAvatar);

  // 关闭按钮（data-close 属性）
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      const which = el.dataset.close;
      if (which === 'avatar-source') closeAvatarSourceModal();
      else if (which === 'avatar-picker') closeAvatarPicker();
      else if (which === 'avatar-crop') closeAvatarCrop();
    });
  });
}

async function loadUserStorage() {
  const bar = document.getElementById('user-storage-bar');
  if (!bar) return;
  bar.innerHTML = '<div style="font-size:12px;color:var(--fg-muted);">加载中...</div>';
  try {
    const s = await api('/api/upload/storage');
    const pctClass = s.percent > 90 ? 'danger' : (s.percent > 70 ? 'warn' : '');
    bar.innerHTML = `
      <div class="storage-bar-track"><div class="storage-bar-fill" style="width:${s.percent}%"></div></div>
      <div class="storage-bar-text">
        <span>已用 ${formatBytes(s.used)}（${s.count} 个图片）</span>
        <span>共 ${formatBytes(s.limit)} · 剩余 ${formatBytes(s.available)}</span>
      </div>
    `;
  } catch (e) {
    bar.innerHTML = `<div style="font-size:12px;color:var(--fg-muted);">${escapeHtml(e.message)}</div>`;
  }
}

// ============================================================
//  Treeks 增强编辑器功能：双向同步滚动、快捷键与拖拽上传
// ============================================================

// ===== 编辑器顶部/底部可收起 =====
const EDITOR_TOP_COLLAPSE_KEY = 'treeks:editor-top-collapsed';
const EDITOR_FOOTER_COLLAPSE_KEY = 'treeks:editor-footer-collapsed';

// 收起顶部时，在紧凑栏同步显示当前日记标题
function updateEditorCollapsedTitle() {
  const titleEl = document.getElementById('editor-collapsed-title');
  const input = document.getElementById('editor-title');
  if (!titleEl || !input) return;
  const text = input.value.trim();
  titleEl.textContent = text ? text : '无标题';
  titleEl.title = text || '无标题';
}

// 应用持久化的收起状态（每次打开编辑器时调用）
function applyEditorCollapseState() {
  const view = document.getElementById('view-editor');
  if (!view) return;
  let topCollapsed = false;
  let footerCollapsed = false;
  try {
    topCollapsed = localStorage.getItem(EDITOR_TOP_COLLAPSE_KEY) === '1';
    footerCollapsed = localStorage.getItem(EDITOR_FOOTER_COLLAPSE_KEY) === '1';
  } catch (_) {}
  view.classList.toggle('editor-top-collapsed', topCollapsed);
  view.classList.toggle('editor-footer-collapsed', footerCollapsed);
  updateEditorCollapsedTitle();
}

// 初始化编辑器顶部/底部收起控件（仅绑定一次）
function initEditorCollapse() {
  const view = document.getElementById('view-editor');
  if (!view) return;
  const topBtn = document.getElementById('btn-editor-top-toggle');
  const footerBtn = document.getElementById('btn-editor-footer-toggle');
  const titleInput = document.getElementById('editor-title');

  applyEditorCollapseState();

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      const collapsed = view.classList.toggle('editor-top-collapsed');
      topBtn.title = collapsed ? '展开编辑器顶部（标题、属性、工具栏）' : '收起编辑器顶部（标题、属性、工具栏）';
      topBtn.setAttribute('aria-label', topBtn.title);
      try { localStorage.setItem(EDITOR_TOP_COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_) {}
      // 顶部收起/展开会改变预览区尺寸，重算标注层与笔刷画板
      if (typeof resizeAnnotationLayer === 'function') resizeAnnotationLayer();
    });
  }

  if (footerBtn) {
    footerBtn.addEventListener('click', () => {
      const collapsed = view.classList.toggle('editor-footer-collapsed');
      footerBtn.title = collapsed ? '展开编辑器底部（状态栏与操作区）' : '收起编辑器底部（状态栏与操作区）';
      footerBtn.setAttribute('aria-label', footerBtn.title);
      try { localStorage.setItem(EDITOR_FOOTER_COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_) {}
    });
  }

  if (titleInput) {
    titleInput.addEventListener('input', updateEditorCollapsedTitle);
    titleInput.addEventListener('change', updateEditorCollapsedTitle);
  }
}

let isSyncScrolling = false;
function setupEditorSyncScroll() {
  const textarea = document.getElementById('editor-textarea');
  const previewPane = document.querySelector('.preview-pane');
  if (!textarea || !previewPane) return;

  textarea.addEventListener('scroll', () => {
    const editorBody = document.querySelector('.editor-body');
    if (!editorBody || !editorBody.classList.contains('mode-split')) return;
    if (isSyncScrolling) return;

    isSyncScrolling = true;
    const maxTextareaScroll = textarea.scrollHeight - textarea.clientHeight;
    if (maxTextareaScroll > 0) {
      const scrollRatio = textarea.scrollTop / maxTextareaScroll;
      const maxPreviewScroll = previewPane.scrollHeight - previewPane.clientHeight;
      previewPane.scrollTop = scrollRatio * maxPreviewScroll;
    }
    requestAnimationFrame(() => {
      isSyncScrolling = false;
    });
  });

  previewPane.addEventListener('scroll', () => {
    const editorBody = document.querySelector('.editor-body');
    if (!editorBody || !editorBody.classList.contains('mode-split')) return;
    if (isSyncScrolling) return;

    isSyncScrolling = true;
    const maxPreviewScroll = previewPane.scrollHeight - previewPane.clientHeight;
    if (maxPreviewScroll > 0) {
      const scrollRatio = previewPane.scrollTop / maxPreviewScroll;
      const maxTextareaScroll = textarea.scrollHeight - textarea.clientHeight;
      textarea.scrollTop = scrollRatio * maxTextareaScroll;
    }
    requestAnimationFrame(() => {
      isSyncScrolling = false;
    });
  });
}

function setupEditorKeybindings() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;

  textarea.addEventListener('keydown', (e) => {
    // A. Tab & Shift+Tab 缩进与反缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      if (start === end) {
        if (e.shiftKey) {
          const lineStart = val.lastIndexOf('\n', start - 1) + 1;
          if (val.substring(lineStart, lineStart + 2) === '  ') {
            textarea.value = val.substring(0, lineStart) + val.substring(lineStart + 2);
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
          }
        } else {
          textarea.value = val.substring(0, start) + '  ' + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      } else {
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? val.length : lineEnd;
        const selectedText = val.substring(lineStart, effectiveEnd);
        const lines = selectedText.split('\n');

        let modifiedLines;
        if (e.shiftKey) {
          modifiedLines = lines.map(line => line.startsWith('  ') ? line.substring(2) : (line.startsWith(' ') ? line.substring(1) : line));
        } else {
          modifiedLines = lines.map(line => '  ' + line);
        }

        const newText = modifiedLines.join('\n');
        textarea.value = val.substring(0, lineStart) + newText + val.substring(effectiveEnd);
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + newText.length;
      }
      updatePreview();
      updateWordCount();
      return;
    }

    // B. Enter 键智能列表自动续行与退出
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const start = textarea.selectionStart;
      const val = textarea.value;
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const currentLine = val.substring(lineStart, start);

      const taskMatch = currentLine.match(/^(\s*)(-|\*)\s+\[([ xX])\]\s+(.*)/);
      const ulMatch = currentLine.match(/^(\s*)(-|\*)\s+(.*)/);
      const olMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.*)/);

      if (taskMatch) {
        const indent = taskMatch[1];
        const bullet = taskMatch[2];
        const content = taskMatch[4];
        if (!content.trim()) {
          e.preventDefault();
          textarea.value = val.substring(0, lineStart) + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = lineStart;
        } else {
          e.preventDefault();
          const prefix = `\n${indent}${bullet} [ ] `;
          textarea.value = val.substring(0, start) + prefix + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
        }
        updatePreview();
        updateWordCount();
        return;
      }

      if (ulMatch) {
        const indent = ulMatch[1];
        const bullet = ulMatch[2];
        const content = ulMatch[3];
        if (!content.trim()) {
          e.preventDefault();
          textarea.value = val.substring(0, lineStart) + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = lineStart;
        } else {
          e.preventDefault();
          const prefix = `\n${indent}${bullet} `;
          textarea.value = val.substring(0, start) + prefix + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
        }
        updatePreview();
        updateWordCount();
        return;
      }

      if (olMatch) {
        const indent = olMatch[1];
        const num = parseInt(olMatch[2], 10);
        const content = olMatch[3];
        if (!content.trim()) {
          e.preventDefault();
          textarea.value = val.substring(0, lineStart) + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = lineStart;
        } else {
          e.preventDefault();
          const prefix = `\n${indent}${num + 1}. `;
          textarea.value = val.substring(0, start) + prefix + val.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
        }
        updatePreview();
        updateWordCount();
        return;
      }
    }

    // C. 选中文本时的符号成对包围
    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    if (pairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        e.preventDefault();
        const val = textarea.value;
        const selected = val.substring(start, end);
        const open = e.key;
        const close = pairs[e.key];
        textarea.value = val.substring(0, start) + open + selected + close + val.substring(end);
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
        updatePreview();
        updateWordCount();
      }
    }
  });
}

function setupEditorDragUpload() {
  const pane = document.getElementById('editor-pane');
  const dropzone = document.getElementById('editor-dropzone');
  if (!pane || !dropzone) return;

  let dragCounter = 0;

  pane.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      dropzone.classList.add('active');
      dropzone.style.display = 'flex';
    }
  });

  pane.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  pane.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      dropzone.classList.remove('active');
      setTimeout(() => {
        if (!dropzone.classList.contains('active')) dropzone.style.display = 'none';
      }, 200);
    }
  });

  pane.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    dropzone.classList.remove('active');
    setTimeout(() => { dropzone.style.display = 'none'; }, 200);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleImageUpload(files);
    }
  });
}

// 全局阻止浏览器拖放默认打开文件行为
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());

function setupFilesDragUpload() {
  const viewFiles = document.getElementById('view-files');
  const dropzone = document.getElementById('files-dropzone');
  if (!viewFiles || !dropzone) return;

  let dragCounter = 0;

  viewFiles.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      dropzone.classList.add('active');
      dropzone.style.display = 'flex';
    }
  });

  viewFiles.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  viewFiles.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      dropzone.classList.remove('active');
      setTimeout(() => {
        if (!dropzone.classList.contains('active')) dropzone.style.display = 'none';
      }, 200);
    }
  });

  viewFiles.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    dropzone.classList.remove('active');
    setTimeout(() => { dropzone.style.display = 'none'; }, 200);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      const curFolder = currentFileFolder || '';
      if (typeof uploadFiles === 'function') {
        uploadFiles(files, curFolder);
      }
    }
  });
}

function setupMsgChatDragUpload() {
  const chatSection = document.getElementById('msg-chat');
  const dropzone = document.getElementById('msg-chat-dropzone');
  if (!chatSection || !dropzone) return;

  let dragCounter = 0;

  chatSection.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!msgState || !msgState.peerId) return;
    dragCounter++;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      dropzone.classList.add('active');
      dropzone.style.display = 'flex';
    }
  });

  chatSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  chatSection.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      dropzone.classList.remove('active');
      setTimeout(() => {
        if (!dropzone.classList.contains('active')) dropzone.style.display = 'none';
      }, 200);
    }
  });

  chatSection.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    dropzone.classList.remove('active');
    setTimeout(() => { dropzone.style.display = 'none'; }, 200);

    if (!msgState || !msgState.peerId) {
      toast('请先选择聊天好友', 'error');
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length) {
      for (const file of files) {
        toast(`正在发送文件: ${file.name}...`, 'info');
        try {
          const res = await apiUpload(await compressImageFile(file));
          await api('/api/messages', {
            method: 'POST',
            body: JSON.stringify({
              recipientId: msgState.peerId,
              content: `发送了文件: ${file.name}`,
              fileId: res.id
            })
          });
          toast(`已发送文件: ${file.name}`, 'success');
        } catch (err) {
          toast(`发送失败: ${err.message}`, 'error');
        }
      }
      loadMsgHistory(msgState.peerId);
    }
  });
}

// ============================================================
//  Treeks 平台全方位 UX 升级：Command Palette、AutoSave、全能文件预览器
// ============================================================

let cmdState = { items: [], activeIndex: 0, isOpen: false };
function setupCommandPalette() {
  const modal = document.getElementById('cmd-modal');
  const backdrop = document.getElementById('cmd-backdrop');
  const input = document.getElementById('cmd-input');
  const list = document.getElementById('cmd-list');
  if (!modal || !input || !list) return;

  const defaultCommands = [
    { icon: '📝', title: '新建日记', group: '快捷动作', action: () => openEditor() },
    { icon: '✉️', title: '写信给好友', group: '快捷动作', action: () => openComposeLetterModal(null) },
    { icon: '📂', title: '上传新文件', group: '快捷动作', action: () => showView('files') },
    { icon: '📅', title: '新建日程', group: '快捷动作', action: () => showScheduleModal() },
    { icon: '📖', title: '跳转到 日记列表', group: '页面导航', action: () => showView('list') },
    { icon: '💬', title: '跳转到 消息对话', group: '页面导航', action: () => showView('messages') },
    { icon: '📂', title: '跳转到 我的文件库', group: '页面导航', action: () => showView('files') },
    { icon: '📊', title: '跳转到 统计概览', group: '页面导航', action: () => showView('stats') },
    { icon: '⚙️', title: '跳转到 个人设置', group: '页面导航', action: () => showView('profile') },
    { icon: '🌿', title: '切换为 森林绿 主题', group: '主题风格', action: () => changeTheme('green') },
    { icon: '🌊', title: '切换为 海洋蓝 主题', group: '主题风格', action: () => changeTheme('blue') },
    { icon: '💜', title: '切换为 薰衣草 主题', group: '主题风格', action: () => changeTheme('purple') },
    { icon: '🌅', title: '切换为 暖阳橙 主题', group: '主题风格', action: () => changeTheme('orange') }
  ];

  const openCmd = () => {
    cmdState.isOpen = true;
    modal.style.display = 'flex';
    input.value = '';
    cmdState.activeIndex = 0;
    renderCmdItems(defaultCommands);
    setTimeout(() => input.focus(), 50);
  };

  const closeCmd = () => {
    cmdState.isOpen = false;
    modal.style.display = 'none';
  };

  if (backdrop) backdrop.addEventListener('click', closeCmd);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdState.isOpen) closeCmd();
      else openCmd();
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      cmdState.activeIndex = 0;
      renderCmdItems(defaultCommands);
      return;
    }
    const filtered = defaultCommands.filter(c => c.title.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
    cmdState.activeIndex = 0;
    renderCmdItems(filtered);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdState.items.length) {
        cmdState.activeIndex = (cmdState.activeIndex + 1) % cmdState.items.length;
        updateCmdActiveItem();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdState.items.length) {
        cmdState.activeIndex = (cmdState.activeIndex - 1 + cmdState.items.length) % cmdState.items.length;
        updateCmdActiveItem();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (cmdState.items[cmdState.activeIndex]) {
        const item = cmdState.items[cmdState.activeIndex];
        closeCmd();
        item.action();
      }
    } else if (e.key === 'Escape') {
      closeCmd();
    }
  });

  function renderCmdItems(items) {
    cmdState.items = items;
    if (!items.length) {
      list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--fg-muted);font-size:13px;">无相关搜索命令</div>';
      return;
    }
    list.innerHTML = items.map((item, idx) => `
      <div class="cmd-item ${idx === cmdState.activeIndex ? 'active' : ''}" data-cmd-idx="${idx}">
        <div class="cmd-item-main">
          <span class="cmd-item-icon">${item.icon}</span>
          <span class="cmd-item-title">${escapeHtml(item.title)}</span>
        </div>
        <span class="cmd-item-meta">${escapeHtml(item.group)}</span>
      </div>
    `).join('');

    list.querySelectorAll('[data-cmd-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.cmdIdx, 10);
        if (items[idx]) {
          closeCmd();
          items[idx].action();
        }
      });
    });
  }

  function updateCmdActiveItem() {
    list.querySelectorAll('.cmd-item').forEach((el, idx) => {
      if (idx === cmdState.activeIndex) {
        el.classList.add('active');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('active');
      }
    });
  }
}

let _autoSaveTimer = null;
function setupAutoSave() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    if (!state.editingId && !textarea.value.trim()) return;
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => {
      if (state.currentView === 'editor') {
        saveDiarySilent();
      }
    }, 2500);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      if (state.currentView === 'editor') {
        e.preventDefault();
        saveDiary();
      }
    }
  });

  // 离开页面前提示未保存内容（配合 2.5s 自动保存兜底，防止误关闭丢失字迹）
  window.addEventListener('beforeunload', (e) => {
    const ta = document.getElementById('editor-textarea');
    if (!ta || !ta.value.trim() || state.currentView !== 'editor') return;
    if (state.editingId && ta.value === state._lastSavedContent) return;
    e.preventDefault();
    e.returnValue = '';
  });
}

async function saveDiarySilent() {
  const title = document.getElementById('editor-title').value.trim();
  const content = document.getElementById('editor-textarea').value;
  if (!content.trim() && !title) return;

  const mood = document.getElementById('editor-mood').value.trim();
  const weather = document.getElementById('editor-weather').value.trim();
  const tagsStr = document.getElementById('editor-tags').value.trim();
  const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
  const is_pinned = document.getElementById('editor-pinned').checked;
  const visibility = document.getElementById('editor-visibility').value;
  const is_public = visibility === 'public' ? 1 : 0;

  const body = { title, content, mood, weather, tags, is_pinned, is_public, visibility };
  setSaveStatus('自动保存中', 'saving');
  try {
    if (state.editingId) {
      await api(`/api/diaries/${state.editingId}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      // 新日记：先创建获得 id，使后续自动保存走 PUT（避免新建内容丢失）
      const created = await api('/api/diaries', { method: 'POST', body: JSON.stringify(body) });
      if (created && created.id) state.editingId = created.id;
    }
    state._lastSavedContent = content;
    setSaveStatus('已自动保存', 'saved');
  } catch (e) {
    setSaveStatus('修改未保存', 'draft');
  }
}

function openUniversalFilePreview(file) {
  const modal = document.getElementById('universal-file-modal');
  const title = document.getElementById('universal-file-title');
  const body = document.getElementById('universal-file-body');
  const backdrop = document.getElementById('universal-file-backdrop');
  const closeBtn = document.getElementById('universal-file-close');
  const copyBtn = document.getElementById('btn-universal-file-copy-link');
  const downloadLink = document.getElementById('btn-universal-file-download');
  if (!modal || !body) return;

  const fname = file.original_name || file.filename || '文件预览';
  title.textContent = fname;
  downloadLink.href = file.url;
  downloadLink.download = fname;

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.url);
  const isPdf = /\.pdf$/i.test(file.url);
  const isTxt = /\.(txt|md|json|js|ts|css|html|xml|py|go|rs|sh|sql|log|env|yml|yaml|ini)$/i.test(file.url);

  if (isImage) {
    body.innerHTML = `<div class="universal-preview-box"><img src="${file.url}" class="universal-preview-image" alt="${escapeHtml(fname)}"></div>`;
  } else if (isPdf) {
    body.innerHTML = `<div class="universal-preview-box" style="height:480px;"><iframe src="${file.url}" style="width:100%;height:100%;border:none;border-radius:6px;"></iframe></div>`;
  } else if (isTxt) {
    body.innerHTML = `<div class="universal-preview-box"><pre class="universal-preview-text">加载文本预览中...</pre></div>`;
    fetch(file.url).then(r => r.text()).then(t => {
      const pre = body.querySelector('pre');
      if (pre) pre.textContent = t.slice(0, 50000);
    }).catch(e => {
      body.innerHTML = `<div class="universal-preview-box" style="color:var(--fg-muted);">暂时无法直接文本预览</div>`;
    });
  } else {
    body.innerHTML = `<div class="universal-preview-box" style="flex-direction:column;gap:12px;color:var(--fg-muted);">
      <div style="font-size:36px;">📁</div>
      <div>该类型文件不支持直接在网页中预览</div>
      <div style="font-size:12px;opacity:0.7;">（请点击右下角按钮下载原文件查看）</div>
    </div>`;
  }

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(window.location.origin + file.url).then(() => {
      toast('文件链接已复制到剪贴板', 'success');
    });
  };

  const close = () => { modal.style.display = 'none'; };
  closeBtn.onclick = close;
  backdrop.onclick = close;
  modal.style.display = 'flex';
}

function setupEscCloseModals() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const quickPop = document.getElementById('quick-template-popover');
      if (quickPop && quickPop.style.display !== 'none') {
        quickPop.style.display = 'none';
        return;
      }
      const tplModal = document.getElementById('template-gallery-modal');
      if (tplModal && tplModal.style.display !== 'none') {
        tplModal.style.display = 'none';
        return;
      }
      const cmdModal = document.getElementById('cmd-modal');
      if (cmdModal && cmdModal.style.display !== 'none') {
        cmdModal.style.display = 'none';
        return;
      }
      const universalModal = document.getElementById('universal-file-modal');
      if (universalModal && universalModal.style.display !== 'none') {
        universalModal.style.display = 'none';
        return;
      }
      if (typeof closeModal === 'function') {
        closeModal();
      }
    }
  });
}

// ===== 移动端下拉刷新（日记列表页） =====
function setupPullToRefresh() {
  if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  const view = document.getElementById('view-list');
  const ptr = document.getElementById('pull-to-refresh');
  const text = document.getElementById('ptr-text');
  if (!view || !ptr) return;

  const PTR_THRESHOLD = 56;
  let startY = 0;
  let pulling = false;
  let tracking = false;

  view.addEventListener('touchstart', (e) => {
    if (view.scrollTop > 0) return;
    if (state.currentView !== 'list' && state.currentNav !== 'list') return;
    if (e.touches.length !== 1) return;
    if (state.selectMode) return;
    startY = e.touches[0].clientY;
    tracking = true;
    pulling = false;
  }, { passive: true });

  view.addEventListener('touchmove', (e) => {
    if (!tracking) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0 || view.scrollTop > 0) return;
    // 下拉距离（带阻尼）
    const dist = Math.min(dy * 0.5, 90);
    if (dist > 4) pulling = true;
    ptr.style.display = 'flex';
    ptr.style.transform = `scaleY(${Math.min(dist / PTR_THRESHOLD, 1)})`;
    const ready = dist >= PTR_THRESHOLD;
    text.textContent = ready ? '松开刷新' : '下拉刷新';
    ptr.querySelector('.ptr-spinner').classList.toggle('pull', !ready);
    ptr.style.opacity = Math.min(dist / PTR_THRESHOLD, 1);
  }, { passive: true });

  const finish = () => {
    if (!pulling) { tracking = false; return; }
    ptr.style.transform = '';
    ptr.style.opacity = '';
    ptr.querySelector('.ptr-spinner').classList.remove('pull');
    if (text.textContent === '松开刷新') {
      text.textContent = '刷新中...';
      ptr.querySelector('.ptr-spinner').classList.add('pull');
      const isPinned = state.currentNav === 'pinned';
      Promise.resolve(isPinned ? loadDiaries({ pinned: true }) : loadDiaries()).finally(() => {
        if (typeof loadFolders === 'function') loadFolders();
        toast('已刷新', 'success');
        ptr.style.display = 'none';
      });
    } else {
      ptr.style.display = 'none';
    }
    tracking = false;
    pulling = false;
  };
  view.addEventListener('touchend', finish, { passive: true });
  view.addEventListener('touchcancel', () => {
    ptr.style.display = 'none';
    tracking = false;
    pulling = false;
  }, { passive: true });
}

function setupMobileNav() {
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.mobileView;
      if (view === 'editor') {
        openEditor();
      } else if (view === 'list') {
        navigateTo('list');
      } else if (view === 'friends' || view === 'letters') {
        // 好友 / 信件已并入消息页
        navigateTo(view);
      } else {
        showView(view);
      }
    });
  });
}

// ===== 日记历史版本与 Diff 对比 =====
let _verState = { current: null, versions: [], selectedVer: null };

async function openVersionHistoryModal() {
  if (!state.editingId) {
    toast('请先打开或新建一篇已保存的日记', 'error');
    return;
  }
  const modal = document.getElementById('version-history-modal');
  const backdrop = document.getElementById('version-history-backdrop');
  const closeBtn = document.getElementById('version-history-close');
  const cancelBtn = document.getElementById('version-history-cancel');
  const revertBtn = document.getElementById('version-history-revert-btn');
  const listEl = document.getElementById('version-history-list');
  const diffBox = document.getElementById('version-history-diff-box');
  const diffHeader = document.getElementById('version-history-diff-header');
  if (!modal || !listEl) return;

  const close = () => { modal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = close;
  if (cancelBtn) cancelBtn.onclick = close;
  if (backdrop) backdrop.onclick = close;

  listEl.innerHTML = '<div style="padding:12px;color:var(--fg-muted);font-size:12px;">加载版本记录中...</div>';
  diffBox.innerHTML = '<div style="color:var(--fg-muted);font-size:13px;">请选择左侧历史快照查看修改变动</div>';
  revertBtn.style.display = 'none';
  revertBtn.disabled = true;
  modal.style.display = 'flex';

  try {
    const data = await api(`/api/diaries/${state.editingId}/versions`);
    _verState.current = data.current || null;
    _verState.versions = data.versions || [];
    _verState.selectedVer = null;

    if (!_verState.versions.length) {
      listEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--fg-muted);font-size:12.5px;">尚无历史修改记录</div>';
      return;
    }

    listEl.innerHTML = _verState.versions.map((v, idx) => `
      <div class="version-item ${idx === 0 ? 'active' : ''}" data-ver-idx="${idx}">
        <div class="version-item-time">${formatMsgTime(v.created_at)}</div>
        <div class="version-item-title">${escapeHtml(v.title || '无标题')}</div>
      </div>
    `).join('');

    const selectVer = (idx) => {
      const v = _verState.versions[idx];
      if (!v) return;
      _verState.selectedVer = v;
      listEl.querySelectorAll('.version-item').forEach((el, i) => {
        if (i === idx) el.classList.add('active');
        else el.classList.remove('active');
      });

      diffHeader.innerHTML = `正在对比【当前版本】与【${formatMsgTime(v.created_at)} 快照】`;
      diffBox.innerHTML = renderLineDiff(_verState.current ? _verState.current.content : '', v.content || '');
      revertBtn.style.display = 'inline-flex';
      revertBtn.disabled = false;
      revertBtn.onclick = () => revertToVersion(v.id);
    };

    listEl.querySelectorAll('[data-ver-idx]').forEach(el => {
      el.addEventListener('click', () => {
        selectVer(parseInt(el.dataset.verIdx, 10));
      });
    });

    if (_verState.versions.length > 0) {
      selectVer(0);
    }
  } catch (e) {
    listEl.innerHTML = `<div style="padding:12px;color:var(--danger);font-size:12px;">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

function renderLineDiff(currText, oldText) {
  const currLines = (currText || '').split('\n');
  const oldLines = (oldText || '').split('\n');
  let html = '';

  const maxLen = Math.max(currLines.length, oldLines.length);
  for (let i = 0; i < maxLen; i++) {
    const cLine = currLines[i];
    const oLine = oldLines[i];
    if (cLine === oLine && cLine !== undefined) {
      html += `<div class="diff-line diff-line-normal">  ${escapeHtml(cLine)}</div>`;
    } else {
      if (oLine !== undefined) {
        html += `<div class="diff-line diff-line-deleted">- ${escapeHtml(oLine)}</div>`;
      }
      if (cLine !== undefined) {
        html += `<div class="diff-line diff-line-added">+ ${escapeHtml(cLine)}</div>`;
      }
    }
  }
  return html || '<div style="color:var(--fg-muted);">内容无显著变动</div>';
}

async function revertToVersion(versionId) {
  if (!state.editingId || !versionId) return;
  if (!confirm('确定将当前日记恢复到选中的历史版本吗？')) return;

  try {
    const updated = await api(`/api/diaries/${state.editingId}/revert/${versionId}`, { method: 'POST' });
    document.getElementById('editor-title').value = updated.title || '';
    document.getElementById('editor-textarea').value = updated.content || '';
    if (typeof _runUpdatePreview === 'function') _runUpdatePreview();
    if (typeof updateWordCount === 'function') updateWordCount();

    const modal = document.getElementById('version-history-modal');
    if (modal) modal.style.display = 'none';
    toast('已成功恢复至历史版本！', 'success');
  } catch (e) {
    toast(`还原失败：${e.message}`, 'error');
  }
}

// ===== 事件绑定 =====
function bindEvents() {
  // GoodNotes 常用快选色球
  document.querySelectorAll('.quick-color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.quick-color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const color = dot.dataset.color;
      if (color && typeof setBrushColor === 'function') {
        setBrushColor(color);
      }
    });
  });

  // 历史版本按钮
  const verBtn = document.getElementById('btn-version-history');
  if (verBtn) verBtn.addEventListener('click', openVersionHistoryModal);

  // 那年今日记忆胶囊
  const otdBtn = document.getElementById('btn-nav-on-this-day');
  if (otdBtn) otdBtn.addEventListener('click', openOnThisDayModal);
  const closeOtd = document.getElementById('btn-close-on-this-day');
  if (closeOtd) closeOtd.addEventListener('click', () => {
    document.getElementById('on-this-day-modal').style.display = 'none';
  });

  // 模板功能绑定：写日记界面【模板】按钮唤起快捷极速应用弹窗，侧边栏按钮切入大屏工坊
  const tplBtn = document.getElementById('btn-template-gallery');
  if (tplBtn) {
    tplBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickTemplatePopover();
    });
  }
  const navTplBtn = document.getElementById('btn-nav-template-gallery');
  if (navTplBtn) {
    navTplBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('templates');
    });
  }

  // 私密锁按钮
  const lockBtn = document.getElementById('btn-lock-diary');
  if (lockBtn) lockBtn.addEventListener('click', openLockDiaryPrompt);
  const closePin = document.getElementById('btn-close-pin-unlock');
  if (closePin) closePin.addEventListener('click', () => {
    document.getElementById('pin-unlock-modal').style.display = 'none';
  });

  // 触控快捷指令按钮
  const touchCmdBtn = document.getElementById('btn-touch-cmd');
  if (touchCmdBtn) {
    touchCmdBtn.addEventListener('click', () => {
      const modal = document.getElementById('cmd-modal');
      if (modal) modal.style.display = 'flex';
      const input = document.getElementById('cmd-input');
      if (input) setTimeout(() => input.focus(), 50);
    });
  }

  // 平台高级 UX 功能与移动端触控优化
  setupMobileNav();
  setupPullToRefresh();
  setupCommandPalette();
  setupAutoSave();
  setupEscCloseModals();
  setupEditorSyncScroll();
  initEditorCollapse();
  setupEditorKeybindings();
  setupEditorDragUpload();
  if (typeof setupTemplateGalleryEvents === 'function') {
    setupTemplateGalleryEvents();
  }
  setupFilesDragUpload();
  setupMsgChatDragUpload();

  // 认证 Tab 切换
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      document.getElementById(tab.dataset.tab + '-form').classList.add('active');
      document.getElementById('auth-message').textContent = '';
    });
  });

  // 登录
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const msg = document.getElementById('auth-message');
    if (!username || !password) { msg.textContent = '请填写用户名和密码'; msg.className = 'auth-message error'; return; }
    try {
      const data = await api('/api/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password })
      });
      setAuth(data.token, data.user);
      msg.textContent = '';
      showMainView();
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'auth-message error';
    }
  });

  // 注册
  document.getElementById('register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const nickname = document.getElementById('reg-nickname').value.trim();
    const password = document.getElementById('reg-password').value;
    const msg = document.getElementById('auth-message');
    if (!username || !password) { msg.textContent = '请填写用户名和密码'; msg.className = 'auth-message error'; return; }
    try {
      const data = await api('/api/auth/register', {
        method: 'POST', body: JSON.stringify({ username, password, nickname })
      });
      setAuth(data.token, data.user);
      msg.textContent = '';
      showMainView();
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'auth-message error';
    }
  });

  // 侧边栏导航
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.nav);
      // 移动端：点击导航后自动收起抽屉
      if (window.innerWidth <= 768) closeSidebarDrawer();
    });
  });

  // 新建日记
  document.getElementById('btn-new-diary').addEventListener('click', () => {
    state.page = 1;
    openEditor(null);
    if (window.innerWidth <= 768) closeSidebarDrawer();
  });

  // 移动端：抽屉式侧边栏开关
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarEl = document.querySelector('.sidebar');
  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', toggleSidebarDrawer);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebarDrawer);
  }

  // 桌面端：侧栏收起/展开（sidebar-expand-btn 通过 FabManager 支持拖拽 + 位置持久化）
  const mainView = document.getElementById('main-view');
  const btnCollapseSidebar = document.getElementById('btn-collapse-sidebar');
  const btnExpandSidebar = document.getElementById('btn-expand-sidebar');
  const toggleDesktopSidebar = (collapse) => {
    if (!mainView) return;
    if (collapse === undefined) {
      collapse = !mainView.classList.contains('sidebar-collapsed');
    }
    mainView.classList.toggle('sidebar-collapsed', collapse);
    try { localStorage.setItem('treeks:sidebar-collapsed', collapse ? '1' : '0'); } catch (e) {}
    // 收起时触发 sidebar-expand-btn 的淡入动画
    if (collapse && btnExpandSidebar) {
      btnExpandSidebar.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => btnExpandSidebar.classList.add('visible'));
      });
    } else if (!collapse && btnExpandSidebar) {
      btnExpandSidebar.classList.remove('visible');
      setTimeout(() => {
        if (!btnExpandSidebar.classList.contains('visible')) btnExpandSidebar.style.display = 'none';
      }, 380);
    }
  };
  if (btnCollapseSidebar) {
    btnCollapseSidebar.addEventListener('click', () => toggleDesktopSidebar(true));
  }
  // 通过 FabManager 注册（支持拖拽 + 位置持久化 + 短按展开）
  if (btnExpandSidebar) {
    FabManager.register(btnExpandSidebar, 'sidebar', () => toggleDesktopSidebar(false));
  }
  // 恢复上次状态
  try {
    if (localStorage.getItem('treeks:sidebar-collapsed') === '1') {
      mainView.classList.add('sidebar-collapsed');
      // 若初始为收起状态，需显示 sidebar-expand-btn（无动画）
      if (btnExpandSidebar) {
        btnExpandSidebar.style.display = 'flex';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => btnExpandSidebar.classList.add('visible'));
        });
      }
    }
  } catch (e) {}
  window.__toggleDesktopSidebar = toggleDesktopSidebar;
  // 点击遮罩或再次点击品牌区也关闭
  function toggleSidebarDrawer() {
    if (!sidebarEl) return;
    const isOpen = sidebarEl.classList.toggle('open');
    if (sidebarOverlay) sidebarOverlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeSidebarDrawer() {
    if (!sidebarEl) return;
    sidebarEl.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  // 暴露给其他模块使用（如点击导航后关闭）
  window.__closeSidebarDrawer = closeSidebarDrawer;

  // ===== 移动端手势：边缘滑动打开/关闭侧边栏 =====
  // 设计：从屏幕左边缘右滑打开抽屉；从抽屉右侧左滑关闭抽屉
  // 仅在 ≤768px 屏幕宽度下启用，避免影响桌面端
  let touchStartX = 0, touchStartY = 0, touchStartTime = 0, isTrackingSwipe = false;
  const EDGE_SWIPE_THRESHOLD = 30;     // 触发边缘滑动的最小距离（从屏幕边缘起）
  const EDGE_SWIPE_DISTANCE = 60;      // 滑动距离阈值
  const EDGE_SWIPE_VERTICAL_TOLERANCE = 50; // 垂直方向容忍度（防止上下滑动误触发）

  document.addEventListener('touchstart', (e) => {
    if (window.innerWidth > 768) return;
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
    // 仅在抽屉关闭时跟踪左边缘滑动；在抽屉打开时跟踪任意滑动（用于关闭）
    const isOpen = sidebarEl && sidebarEl.classList.contains('open');
    if (!isOpen && t.clientX <= EDGE_SWIPE_THRESHOLD) {
      isTrackingSwipe = true;
    } else if (isOpen) {
      isTrackingSwipe = true;
    } else {
      isTrackingSwipe = false;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (window.innerWidth > 768 || !isTrackingSwipe) {
      isTrackingSwipe = false;
      return;
    }
    isTrackingSwipe = false;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const elapsed = Date.now() - touchStartTime;
    // 必须是横向滑动（|dx| > |dy|）且时间在 800ms 内
    if (Math.abs(dx) < EDGE_SWIPE_DISTANCE) return;
    if (Math.abs(dy) > EDGE_SWIPE_VERTICAL_TOLERANCE) return;
    if (elapsed > 800) return;
    const isOpen = sidebarEl && sidebarEl.classList.contains('open');
    // 右滑 + 抽屉关闭 → 打开
    if (dx > 0 && !isOpen) {
      toggleSidebarDrawer();
    }
    // 左滑 + 抽屉打开 → 关闭
    else if (dx < 0 && isOpen) {
      closeSidebarDrawer();
    }
  }, { passive: true });

  // ===== 移动端：双指捏合调整字体大小（日记内容区 + Markdown 预览区） =====
  let lastPinchDistance = 0;
  let currentFontSize = 16;
  const applyPinchZoomTarget = () => {
    // 预览模式/全屏预览时缩放 Markdown 预览内容；否则缩放日记详情内容
    const viewEditor = document.getElementById('view-editor');
    const inEditorPreview = viewEditor && (viewEditor.classList.contains('preview-fullscreen') || (document.querySelector('.editor-body') && document.querySelector('.editor-body').classList.contains('mode-preview')));
    return inEditorPreview
      ? document.querySelector('.preview-content')
      : document.querySelector('.diary-content');
  };
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastPinchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !lastPinchDistance) return;
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const scale = dist / lastPinchDistance;
    // 缩放目标：预览模式预览区或日记内容区
    const contentEl = applyPinchZoomTarget();
    if (!contentEl) return;
    let newSize = Math.round(currentFontSize * scale);
    newSize = Math.max(12, Math.min(28, newSize));
    if (newSize !== currentFontSize) {
      contentEl.style.fontSize = newSize + 'px';
      try { localStorage.setItem('treeks:diary-font-size', String(newSize)); } catch (_) {}
    }
  }, { passive: true });
  document.addEventListener('touchend', () => {
    lastPinchDistance = 0;
    currentFontSize = parseInt(localStorage.getItem('treeks:diary-font-size') || '16', 10);
  }, { passive: true });
  // 恢复上次字号
  try {
    const saved = parseInt(localStorage.getItem('treeks:diary-font-size') || '0', 10);
    if (saved >= 12 && saved <= 28) {
      currentFontSize = saved;
    }
  } catch (_) {}

  // 移动端：顶栏新建日记按钮
  const btnNewDiaryMobile = document.getElementById('btn-new-diary-mobile');
  if (btnNewDiaryMobile) {
    btnNewDiaryMobile.addEventListener('click', () => {
      state.page = 1;
      openEditor(null);
    });
  }

  // 窗口尺寸变化时重置抽屉状态（避免桌面端残留 open 类）
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebarDrawer();
  });

  // 退出登录
  document.getElementById('btn-logout').addEventListener('click', () => {
    showModal('退出登录', '确定要退出当前账号吗？', () => {
      logout();
      toast('已退出登录');
    });
  });

  // 个人设置
  document.getElementById('btn-profile').addEventListener('click', loadProfileView);

  // 搜索
  let searchTimer;
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    document.getElementById('clear-search').style.display = searchInput.value ? '' : 'none';
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.filter.keyword = searchInput.value.trim();
      state.page = 1;
      // 搜索过滤时不显示骨架屏（仅 300ms 防抖，骨架屏会闪烁）
      if (state.currentView === 'list') loadDiaries({ silent: true });
    }, 300);
  });
  document.getElementById('clear-search').addEventListener('click', () => {
    searchInput.value = '';
    state.filter.keyword = '';
    document.getElementById('clear-search').style.display = 'none';
    state.page = 1;
    loadDiaries();
  });

  // 标签筛选
  document.getElementById('filter-tag').addEventListener('change', e => {
    state.filter.tag = e.target.value;
    state.page = 1;
    loadDiaries();
  });

  // 日期筛选
  document.getElementById('filter-date').addEventListener('change', e => {
    state.filter.date = e.target.value;
    state.page = 1;
    loadDiaries();
  });

  document.getElementById('btn-reset-filter').addEventListener('click', () => {
    state.filter = { keyword: '', tag: '', date: '' };
    searchInput.value = '';
    document.getElementById('filter-tag').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('clear-search').style.display = 'none';
    state.page = 1;
    loadDiaries();
  });

  // 新建文件夹按钮
  const btnAddFolder = document.getElementById('btn-add-folder');
  if (btnAddFolder) {
    btnAddFolder.addEventListener('click', () => openFolderForm({}));
  }

  // 全局点击关闭"移动到文件夹"下拉菜单（处理菜单外部点击）
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.move-folder-wrap') && !e.target.closest('.move-folder-menu')) {
      closeAllMoveFolderMenus();
    }
  });

  // 编辑器
  document.getElementById('btn-back-list').addEventListener('click', () => {
    if (state.editingId) collabLeave(state.editingId);
    state.editingId = null;
    navigateTo('list');
  });

  document.getElementById('btn-save-diary').addEventListener('click', saveDiary);

  document.getElementById('btn-delete-diary').addEventListener('click', () => {
    if (!state.editingId) return;
    const id = state.editingId;
    showModal('删除日记', '确定要删除这篇日记吗？此操作无法撤销。', async () => {
      try {
        await api(`/api/diaries/${id}`, { method: 'DELETE' });
        toast('已删除', 'success');
        state.editingId = null;
        collabLeave(id);
        navigateTo('list');
        loadTags();
      } catch (e) { toast(e.message, 'error'); }
    }, { danger: true, confirmText: '删除' });
  });

  // 协作者管理
  document.getElementById('btn-collaborators').addEventListener('click', openCollaboratorModal);

  // 发送信件（从编辑器）
  document.getElementById('btn-send-letter').addEventListener('click', async () => {
    if (!state.editingId) {
      const title = document.getElementById('editor-title').value.trim();
      const content = document.getElementById('editor-textarea').value;
      if (!content.trim() && !title) { toast('请先输入日记内容', 'error'); return; }
      toast('正在保存日记...', '');
      await saveDiary();
      if (!state.editingId) return;
    }
    openComposeLetterModal(state.editingId);
  });

  // 添加好友
  document.getElementById('btn-add-friend').addEventListener('click', openAddFriendModal);

  // 写信
  document.getElementById('btn-compose-letter').addEventListener('click', () => openComposeLetterModal(null));

  // 信件 tabs
  document.querySelectorAll('.letters-tabs .letter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.letters-tabs .letter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadLettersList(btn.dataset.tab);
    });
  });

  // 共享 tabs
  document.querySelectorAll('[data-shared-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-shared-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.sharedTab;
      sharedState.tab = tab;
      if (tab === 'blocked') {
        loadBlockedUsers();
      } else {
        loadSharedList(tab);
      }
    });
  });

  // Markdown 工具栏 - 阻止 mousedown 默认行为以保留 textarea 焦点与选区
  document.querySelectorAll('.tool-btn[data-md]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => applyMarkdown(btn.dataset.md));
  });

  // 编辑器模式切换
  document.querySelectorAll('#editor-mode-toggle .mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      document.querySelectorAll('#editor-mode-toggle .mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const body = document.querySelector('.editor-body');
      body.classList.remove('mode-edit', 'mode-preview', 'mode-split');
      if (mode === 'edit') body.classList.add('mode-edit');
      else if (mode === 'preview') body.classList.add('mode-preview');
      else body.classList.add('mode-split');
      // 预览模式全屏：隐藏顶栏三栏（topbar/editor-header/editor-toolbar），仅保留笔刷栏
      const viewEditor = document.getElementById('view-editor');
      if (viewEditor) {
        viewEditor.classList.toggle('preview-fullscreen', mode === 'preview');
      }
      // 切换到预览或分屏时刷新预览（立即渲染，避免防抖延迟导致首次切换空白）
      if (mode === 'preview' || mode === 'split') {
        updatePreview({ immediate: true });
      }
      // 显示/隐藏笔刷工具栏（仅预览模式可见）
      updateBrushToolbarVisibility();
    });
  });

  // ===== 全屏预览模式：点击退出按钮切回分屏 =====
  const exitPreviewBtn = document.getElementById('exit-preview-btn');
  if (exitPreviewBtn) {
    exitPreviewBtn.addEventListener('click', () => {
      const splitBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="split"]');
      if (splitBtn) splitBtn.click();
    });
  }

  // ===== 编辑/预览滚动跟随（split 模式下双向同步）=====
  setupScrollSync();

  // ===== 预览模式双击进入编辑 =====
  setupPreviewDblClick();

  // ===== 预览模式笔刷标注 =====
  setupBrushAnnotations();
  // ===== PDF 阅读器事件绑定 =====
  setupPdfViewer();

  // 编辑器实时预览
  const textarea = document.getElementById('editor-textarea');
  // 移动端 IME（中文/日文/韩文输入法）输入处理：
  // 在 composition 过程中，input 事件会反复触发（每次按键一次），
  // 此时 textarea 的 value 并非最终结果，若同步触发预览重渲染和协同广播，
  // 会与 IME 自身的字符插入产生时序冲突，导致视觉上"打字顺序反向"。
  // 因此在 composition 期间跳过耗时的预览/协同/计数更新，
  // 待 compositionend 后再统一执行一次。
  let isComposing = false;
  let pendingAfterComposition = false;

  const runPostInput = () => {
    updatePreview();
    updateWordCount();
    setSaveStatus('编辑中…', 'saving');
    clearTimeout(setSaveStatus._draftTimer);
    setSaveStatus._draftTimer = setTimeout(() => {
      setSaveStatus._draftTimer = null;
      setSaveStatus('未保存', 'draft');
    }, 800);
    collabSendEdit('content', textarea.value);
  };

  textarea.addEventListener('compositionstart', () => {
    isComposing = true;
    pendingAfterComposition = false;
  });

  textarea.addEventListener('compositionend', () => {
    isComposing = false;
    if (pendingAfterComposition) {
      pendingAfterComposition = false;
      runPostInput();
    }
  });

  textarea.addEventListener('input', () => {
    if (isComposing) {
      // IME 输入过程中标记待处理，等 compositionend 统一执行
      pendingAfterComposition = true;
      return;
    }
    runPostInput();
    // 记录当前光标位置（模板插入等场景使用）
    state.editorCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };
  });

  // 点击/键盘移动/选择时持续记录编辑器光标位置
  textarea.addEventListener('click', () => {
    state.editorCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };
  });
  textarea.addEventListener('keyup', () => {
    state.editorCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };
  });
  textarea.addEventListener('select', () => {
    state.editorCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };
  });

  // 标题变更广播
  document.getElementById('editor-title').addEventListener('input', (e) => {
    collabSendEdit('title', e.target.value);
  });

  // 标题同样需要 IME 处理，避免移动端打字顺序反向
  let titleComposing = false;
  const titleInput = document.getElementById('editor-title');
  titleInput.addEventListener('compositionstart', () => { titleComposing = true; });
  titleInput.addEventListener('compositionend', () => { titleComposing = false; });

  // 可见性切换：选"指定用户"时自动弹出选择框；切换到其他选项时清空缓存
  const visibilitySelectEl = document.getElementById('editor-visibility');
  if (visibilitySelectEl) {
    visibilitySelectEl.addEventListener('change', async (e) => {
      const val = e.target.value;
      if (val === 'specific') {
        // 已有可见用户则不强制重新选择（保留已加载的列表）
        if (!state.visibleTo || state.visibleTo.length === 0) {
          await openVisibleToPicker();
          // 若用户取消且未选过，回退到 private 避免保存时阻塞
          if (!state.visibleTo || state.visibleTo.length === 0) {
            e.target.value = 'private';
          }
        }
      } else {
        // 切换到非 specific 时清空缓存（不影响已保存的日记下次再切回时重新加载）
        state.visibleTo = [];
        state.visibleToUsers = [];
        renderVisibleToBadge();
      }
    });
  }

  // 快捷键
  textarea.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveDiary();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      applyMarkdown('bold');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      applyMarkdown('italic');
    }
    // Tab 缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      updatePreview();
    }
  });

  // 粘贴图片
  textarea.addEventListener('paste', e => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.type && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length) {
      e.preventDefault();
      handleImageUpload(files);
    }
  });

  // 拖拽图片到编辑器
  textarea.addEventListener('dragover', e => { e.preventDefault(); });
  textarea.addEventListener('drop', e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) handleImageUpload(files);
  });

  // 上传按钮
  document.getElementById('upload-input').addEventListener('change', e => {
    handleImageUpload(Array.from(e.target.files));
    e.target.value = '';
  });

  // ===== 移动端软键盘适配 =====
  // 软键盘弹起时 visualViewport 高度缩小，使用 dvh 无法感知键盘高度；
  // 通过 visualViewport 动态调整编辑器正文区高度，避免底部被键盘遮挡
  if (window.visualViewport) {
    const editorBodyEl = document.querySelector('.editor-body');
    const onVvpResize = () => {
      if (window.innerWidth > 768) return; // 仅手机端
      const isFocused = document.activeElement === textarea;
      if (!isFocused) return;
      const vv = window.visualViewport;
      const topBar = document.getElementById('editor-header-wrapper');
      const toolBar = document.getElementById('editor-toolbar-wrapper');
      const topOffset = (topBar ? topBar.offsetHeight : 0) + (toolBar ? toolBar.offsetHeight : 0) + (document.querySelector('.mobile-topbar') && getComputedStyle(document.querySelector('.mobile-topbar')).display !== 'none' ? document.querySelector('.mobile-topbar').offsetHeight : 0);
      if (editorBodyEl) {
        editorBodyEl.style.height = Math.max(120, vv.height - topOffset - 60) + 'px';
      }
    };
    window.visualViewport.addEventListener('resize', onVvpResize);
    window.visualViewport.addEventListener('scroll', onVvpResize);
    // 聚焦/失焦也触发一次校准
    textarea.addEventListener('focus', () => setTimeout(onVvpResize, 50));
    textarea.addEventListener('blur', () => {
      if (editorBodyEl) editorBodyEl.style.height = '';
    });
  }

  // 图片库上传（兼容旧 ID #gallery-upload，转发到通用 files 上传）
  const galleryInput = document.getElementById('gallery-upload');
  if (galleryInput) {
    galleryInput.addEventListener('change', async e => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      for (const f of files) {
        try { await apiUpload(await compressImageFile(f)); } catch (err) { toast(err.message, 'error'); }
      }
      toast(`已上传 ${files.length} 张图片`, 'success');
      if (typeof refreshFiles === 'function') refreshFiles();
      e.target.value = '';
    });
  }

  // 个人资料表单
  document.getElementById('profile-form').addEventListener('submit', async e => {
    e.preventDefault();
    const nickname = document.getElementById('profile-nickname').value.trim();
    const bio = document.getElementById('profile-bio').value.trim();
    try {
      const data = await api('/api/auth/profile', {
        method: 'PUT', body: JSON.stringify({ nickname, bio })
      });
      state.user = data.user;
      localStorage.setItem('treeks_user', JSON.stringify(data.user));
      renderUserCard();
      toast('资料已更新', 'success');
    } catch (err) { toast(err.message, 'error'); }
  });

  // 头像设置：更换 / 移除 / 来源选择 / 裁切交互
  document.getElementById('btn-change-avatar').addEventListener('click', openAvatarSourceModal);
  document.getElementById('avatar-source-pick').addEventListener('click', openAvatarPicker);
  document.getElementById('avatar-source-upload').addEventListener('click', () => {
    closeAvatarSourceModal();
    triggerAvatarFileUpload();
  });
  document.getElementById('btn-remove-avatar').addEventListener('click', () => {
    showModal('移除头像', '确定要移除当前头像吗？将恢复为首字母头像。', async () => {
      await removeAvatar();
    }, { danger: true, confirmText: '移除' });
  });
  bindAvatarCropInteraction();

  // 修改密码
  document.getElementById('password-form').addEventListener('submit', async e => {
    e.preventDefault();
    const oldPassword = document.getElementById('pwd-old').value;
    const newPassword = document.getElementById('pwd-new').value;
    try {
      await api('/api/auth/password', {
        method: 'PUT', body: JSON.stringify({ oldPassword, newPassword })
      });
      document.getElementById('pwd-old').value = '';
      document.getElementById('pwd-new').value = '';
      toast('密码已修改', 'success');
    } catch (err) { toast(err.message, 'error'); }
  });

  // ===== 管理员事件 =====
  const refreshDash = document.getElementById('btn-refresh-dashboard');
  if (refreshDash) refreshDash.addEventListener('click', loadAdminDashboard);
  const refreshSys = document.getElementById('btn-refresh-system');
  if (refreshSys) refreshSys.addEventListener('click', loadAdminSystem);
  const refreshData = document.getElementById('btn-refresh-data');
  if (refreshData) refreshData.addEventListener('click', loadAdminData);

  const userSearch = document.getElementById('admin-user-search');
  if (userSearch) {
    let searchTimer;
    userSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => loadAdminUsers(1), 350);
    });
  }
  const userStatusFilter = document.getElementById('admin-user-status');
  if (userStatusFilter) userStatusFilter.addEventListener('change', () => loadAdminUsers(1));
  const userRefresh = document.getElementById('admin-user-refresh');
  if (userRefresh) userRefresh.addEventListener('click', () => loadAdminUsers());

  // ===== 日历事件 =====
  const calPrev = document.getElementById('cal-prev');
  if (calPrev) calPrev.addEventListener('click', () => {
    calState.month--;
    if (calState.month < 0) { calState.month = 11; calState.year--; }
    loadCalendar();
  });
  const calNext = document.getElementById('cal-next');
  if (calNext) calNext.addEventListener('click', () => {
    calState.month++;
    if (calState.month > 11) { calState.month = 0; calState.year++; }
    loadCalendar();
  });
  const calToday = document.getElementById('cal-today');
  if (calToday) calToday.addEventListener('click', () => {
    const now = new Date();
    calState.year = now.getFullYear();
    calState.month = now.getMonth();
    calState.selectedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    loadCalendar();
  });
  const calAdd = document.getElementById('cal-add-schedule');
  if (calAdd) calAdd.addEventListener('click', () => showScheduleModal());

  // ===== 导出相关事件 =====
  // 编辑器导出按钮
  const btnExportDiary = document.getElementById('btn-export-diary');
  if (btnExportDiary) btnExportDiary.addEventListener('click', () => {
    if (!state.editingId) {
      toast('请先保存日记后再导出', 'error');
      return;
    }
    openExportModal([state.editingId], 'editor');
  });

  // 列表批量选择切换
  const btnToggleSelect = document.getElementById('btn-toggle-select');
  if (btnToggleSelect) btnToggleSelect.addEventListener('click', toggleSelectMode);

  // 取消批量选择
  const btnCancelSelect = document.getElementById('btn-cancel-select');
  if (btnCancelSelect) btnCancelSelect.addEventListener('click', () => toggleSelectMode(false));

  // 全选当前页
  const selectAllCb = document.getElementById('select-all-checkbox');
  if (selectAllCb) selectAllCb.addEventListener('change', e => {
    document.querySelectorAll('.batch-checkbox').forEach(cb => { cb.checked = e.target.checked; });
    updateBatchCount();
  });

  // 批量导出按钮
  const btnBatchExport = document.getElementById('btn-batch-export');
  if (btnBatchExport) btnBatchExport.addEventListener('click', () => {
    const ids = Array.from(document.querySelectorAll('.batch-checkbox:checked')).map(cb => parseInt(cb.dataset.id, 10));
    if (ids.length === 0) { toast('请先选择要导出的日记', 'error'); return; }
    openExportModal(ids, 'batch');
  });

  // 导出全部（当前筛选条件下的所有日记）
  const btnExportAll = document.getElementById('btn-export-all');
  if (btnExportAll) btnExportAll.addEventListener('click', async () => {
    try {
      const params = new URLSearchParams();
      if (state.filter.keyword) params.set('keyword', state.filter.keyword);
      if (state.filter.tag) params.set('tag', state.filter.tag);
      if (state.filter.date) params.set('date', state.filter.date);
      params.set('page', 1);
      params.set('limit', 1000);
      const data = await api('/api/diaries?' + params.toString());
      if (!data.items.length) { toast('没有可导出的日记', 'error'); return; }
      openExportModal(data.items.map(d => d.id), 'all');
    } catch (e) { toast(e.message, 'error'); }
  });

  // 导出模态框事件
  const exportModal = document.getElementById('export-modal');
  document.getElementById('export-modal-close').addEventListener('click', closeExportModal);
  document.getElementById('export-modal-cancel').addEventListener('click', closeExportModal);
  exportModal.querySelector('.modal-backdrop').addEventListener('click', closeExportModal);
  document.getElementById('export-modal-confirm').addEventListener('click', performExport);

  // 格式切换时显示/隐藏模板选择
  document.querySelectorAll('input[name="export-format"]').forEach(r => {
    r.addEventListener('change', () => {
      const fmt = document.querySelector('input[name="export-format"]:checked').value;
      document.getElementById('template-section').style.display = (fmt === 'pdf' || fmt === 'pdf-merged') ? '' : 'none';
    });
  });
}

// ===== 导出功能 =====
function toggleSelectMode(force) {
  const next = typeof force === 'boolean' ? force : !state.selectMode;
  state.selectMode = next;
  const bar = document.getElementById('batch-select-bar');
  const cards = document.querySelectorAll('.diary-card-select');
  if (next) {
    bar.style.display = 'flex';
    cards.forEach(c => c.style.display = 'flex');
    document.querySelectorAll('.diary-card').forEach(c => c.classList.add('selectable'));
  } else {
    bar.style.display = 'none';
    cards.forEach(c => c.style.display = 'none');
    document.querySelectorAll('.batch-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.diary-card').forEach(c => c.classList.remove('selectable'));
    const selectAll = document.getElementById('select-all-checkbox');
    if (selectAll) selectAll.checked = false;
    updateBatchCount();
  }
}

function updateBatchCount() {
  const checked = document.querySelectorAll('.batch-checkbox:checked');
  const countEl = document.getElementById('batch-count');
  const btn = document.getElementById('btn-batch-export');
  if (countEl) countEl.textContent = `已选 ${checked.length} 篇`;
  if (btn) btn.disabled = checked.length === 0;
  const selectAll = document.getElementById('select-all-checkbox');
  const all = document.querySelectorAll('.batch-checkbox');
  if (selectAll && all.length) {
    selectAll.checked = checked.length === all.length;
    selectAll.indeterminate = checked.length > 0 && checked.length < all.length;
  }
}

async function loadExportTemplates() {
  if (state.exportTemplates.length) return state.exportTemplates;
  try {
    const data = await api('/api/diaries/templates');
    state.exportTemplates = data.templates || [];
  } catch (e) {
    state.exportTemplates = [{ id: 'default', name: '默认', description: '', file: 'default.html' }];
  }
  return state.exportTemplates;
}

async function openExportModal(ids, source = 'list') {
  state.exportContext = { ids, source };
  const modal = document.getElementById('export-modal');
  const titleEl = document.getElementById('export-modal-title');
  const summaryEl = document.getElementById('export-summary');

  const count = ids.length;
  if (source === 'editor') {
    titleEl.textContent = '导出当前日记';
  } else if (source === 'all') {
    titleEl.textContent = '导出全部日记';
  } else {
    titleEl.textContent = '批量导出日记';
  }
  summaryEl.textContent = `已选择 ${count} 篇日记`;

  // 重置格式为 md
  const mdRadio = document.querySelector('input[name="export-format"][value="md"]');
  if (mdRadio) mdRadio.checked = true;
  document.getElementById('template-section').style.display = 'none';

  // 加载模板列表
  const templates = await loadExportTemplates();
  const grid = document.getElementById('export-template-grid');
  grid.innerHTML = templates.map((t, i) => `
    <label class="export-template-option">
      <input type="radio" name="export-template" value="${escapeHtml(t.id)}" ${i === 0 ? 'checked' : ''}>
      <div class="export-template-card">
        <div class="export-template-name">${escapeHtml(t.name)}</div>
        <div class="export-template-desc">${escapeHtml(t.description || '')}</div>
      </div>
    </label>
  `).join('');

  // 隐藏进度
  document.getElementById('export-progress').style.display = 'none';
  document.getElementById('export-progress-fill').style.width = '0%';

  modal.style.display = 'flex';
}

function closeExportModal() {
  document.getElementById('export-modal').style.display = 'none';
}

function setExportProgress(percent, text) {
  const bar = document.getElementById('export-progress');
  const fill = document.getElementById('export-progress-fill');
  const txt = document.getElementById('export-progress-text');
  bar.style.display = percent < 100 ? 'block' : 'none';
  fill.style.width = percent + '%';
  if (text) txt.textContent = text;
}

async function performExport() {
  const { ids, source } = state.exportContext;
  if (!ids || !ids.length) { toast('没有可导出的日记', 'error'); return; }

  const format = document.querySelector('input[name="export-format"]:checked').value;
  const templateRadio = document.querySelector('input[name="export-template"]:checked');
  const template = templateRadio ? templateRadio.value : 'default';

  const confirmBtn = document.getElementById('export-modal-confirm');
  const origHTML = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '导出中...';

  try {
    if (ids.length === 1 && format !== 'pdf-merged') {
      // 单篇直接下载
      setExportProgress(50, '正在生成文件...');
      const id = ids[0];
      let url;
      if (format === 'md') {
        url = `/api/diaries/${id}/export.md`;
      } else {
        url = `/api/diaries/${id}/export.pdf?template=${encodeURIComponent(template)}`;
      }
      await downloadExportFile(url, state.token);
      setExportProgress(100, '完成');
      toast('已导出', 'success');
      setTimeout(closeExportModal, 600);
    } else {
      // 批量导出
      setExportProgress(20, '正在准备导出...');
      await downloadFilePost('/api/diaries/export', { ids, format, template }, state.token);
      setExportProgress(100, '完成');
      toast(`已导出 ${ids.length} 篇日记`, 'success');
      setTimeout(closeExportModal, 600);
    }
  } catch (e) {
    setExportProgress(0, '');
    toast(e.message || '导出失败', 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = origHTML;
  }
}

// 通用下载工具：GET 请求带 token，触发浏览器下载
async function downloadExportFile(url, token) {
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) {
    let msg = `导出失败 (${res.status})`;
    try { const d = await res.json(); msg = d.error || msg; } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  // 从 Content-Disposition 获取文件名
  const cd = res.headers.get('Content-Disposition') || '';
  let filename = 'export';
  const m1 = cd.match(/filename\*=UTF-8''([^;]+)/);
  const m2 = cd.match(/filename="([^"]+)"/);
  if (m1) filename = decodeURIComponent(m1[1]);
  else if (m2) filename = decodeURIComponent(m2[1]);
  saveBlob(blob, filename);
}

// POST 下载（用于批量导出）
async function downloadFilePost(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let msg = `导出失败 (${res.status})`;
    try { const d = await res.json(); msg = d.error || msg; } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  const cd = res.headers.get('Content-Disposition') || '';
  let filename = 'export';
  const m1 = cd.match(/filename\*=UTF-8''([^;]+)/);
  const m2 = cd.match(/filename="([^"]+)"/);
  if (m1) filename = decodeURIComponent(m1[1]);
  else if (m2) filename = decodeURIComponent(m2[1]);
  saveBlob(blob, filename);
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ===== 工具函数：字节大小格式化 =====
function formatBytes(n) {
  if (n == null || isNaN(n)) return '-';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
function formatDuration(s) {
  if (s < 60) return Math.floor(s) + ' 秒';
  if (s < 3600) return Math.floor(s / 60) + ' 分';
  if (s < 86400) return Math.floor(s / 3600) + ' 小时';
  return Math.floor(s / 86400) + ' 天';
}

// ===== 管理员：概览 =====
const adminState = { usersPage: 1, logsPage: 1 };

async function loadAdminDashboard() {
  const c = document.getElementById('admin-dashboard-content');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  try {
    const data = await api('/api/admin/dashboard');
    const trendUsersMax = Math.max(1, ...data.trends.recentUsers.map(d => d.count));
    const trendDiariesMax = Math.max(1, ...data.trends.recentDiaries.map(d => d.count));
    const trendActiveMax = Math.max(1, ...data.trends.recentActive.map(d => d.count));

    const trendUsersSum = data.trends.recentUsers.reduce((s, d) => s + d.count, 0);
    const trendDiariesSum = data.trends.recentDiaries.reduce((s, d) => s + d.count, 0);
    const trendActiveSum = data.trends.recentActive.reduce((s, d) => s + d.count, 0);

    const renderTrend = (arr, max, label) => arr.map(d => {
      const pct = (d.count / max) * 100;
      return `
        <div class="trend-bar" style="height:${Math.max(pct, d.count > 0 ? 8 : 2)}%" data-label="${d.date}: ${d.count}">
          <div class="trend-bar-tip">${d.date} · ${label}: <strong>${d.count}</strong></div>
        </div>
      `;
    }).join('');

    const renderTrendAxis = (arr) => arr.map(d => {
      // 兼容斜杠格式并追加 T00:00:00 强制按本地时间解析（避免 YYYY-MM-DD 被当作 UTC）
      const dObj = new Date(String(d.date).replace(/\//g, '-') + 'T00:00:00');
      const label = isNaN(dObj) ? String(d.date).slice(5) : `${dObj.getMonth() + 1}/${dObj.getDate()}`;
      return `<div class="trend-axis-label">${label}</div>`;
    }).join('');

    const storagePct = data.storage.totalLimit > 0
      ? Math.min(100, (data.storage.used / data.storage.totalLimit) * 100)
      : 0;

    const rankStyles = [
      'rank-gold',
      'rank-silver',
      'rank-bronze'
    ];

    c.innerHTML = `
      <div class="admin-stats-grid">
        <div class="admin-stat stat-users">
          <div class="admin-stat-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="admin-stat-body">
            <div class="admin-stat-label">总用户数</div>
            <div class="admin-stat-value">${data.users.total}</div>
            <div class="admin-stat-sub">活跃 ${data.users.active} · 停用 ${data.users.disabled} · 管理员 ${data.users.admins}</div>
          </div>
        </div>
        <div class="admin-stat stat-diaries">
          <div class="admin-stat-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="admin-stat-body">
            <div class="admin-stat-label">日记总数</div>
            <div class="admin-stat-value">${data.content.diaries}</div>
            <div class="admin-stat-sub">${data.users.total > 0 ? `人均 ${(data.content.diaries / data.users.total).toFixed(1)} 篇` : ''}</div>
          </div>
        </div>
        <div class="admin-stat stat-images">
          <div class="admin-stat-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div class="admin-stat-body">
            <div class="admin-stat-label">图片总数</div>
            <div class="admin-stat-value">${data.content.images}</div>
            <div class="admin-stat-sub">占用 ${formatBytes(data.content.totalImageSize)}</div>
          </div>
        </div>
        <div class="admin-stat stat-storage">
          <div class="admin-stat-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
          <div class="admin-stat-body">
            <div class="admin-stat-label">存储配额</div>
            <div class="admin-stat-value">${formatBytes(data.storage.used)}</div>
            <div class="admin-stat-sub">总配额 ${formatBytes(data.storage.totalLimit)} · ${storagePct.toFixed(1)}%</div>
            <div class="admin-stat-progress"><div class="admin-stat-progress-fill" style="width:${storagePct}%"></div></div>
          </div>
        </div>
      </div>

      <div class="admin-charts-row">
        <div class="admin-chart-card">
          <div class="admin-chart-header">
            <div>
              <div class="admin-chart-title">最近 7 天注册用户</div>
              <div class="admin-chart-sub">合计 <strong>${trendUsersSum}</strong> 人</div>
            </div>
            <div class="admin-chart-badge">${data.trends.recentUsers.length} 天</div>
          </div>
          <div class="trend-chart">${renderTrend(data.trends.recentUsers, trendUsersMax, '注册')}</div>
          <div class="trend-axis">${renderTrendAxis(data.trends.recentUsers)}</div>
        </div>

        <div class="admin-chart-card">
          <div class="admin-chart-header">
            <div>
              <div class="admin-chart-title">最近 7 天日记数量</div>
              <div class="admin-chart-sub">合计 <strong>${trendDiariesSum}</strong> 篇</div>
            </div>
            <div class="admin-chart-badge">${data.trends.recentDiaries.length} 天</div>
          </div>
          <div class="trend-chart">${renderTrend(data.trends.recentDiaries, trendDiariesMax, '日记')}</div>
          <div class="trend-axis">${renderTrendAxis(data.trends.recentDiaries)}</div>
        </div>
      </div>

      <div class="admin-chart-card">
        <div class="admin-chart-header">
          <div>
            <div class="admin-chart-title">最近 14 天活跃用户</div>
            <div class="admin-chart-sub">合计 <strong>${trendActiveSum}</strong> 人次</div>
          </div>
          <div class="admin-chart-badge">${data.trends.recentActive.length} 天</div>
        </div>
        <div class="trend-chart">${renderTrend(data.trends.recentActive, trendActiveMax, '活跃')}</div>
        <div class="trend-axis">${renderTrendAxis(data.trends.recentActive)}</div>
      </div>

      <div class="admin-chart-card">
        <div class="admin-chart-header">
          <div>
            <div class="admin-chart-title">最活跃用户 Top 5</div>
            <div class="admin-chart-sub">按日记数量排序</div>
          </div>
          <div class="admin-chart-badge">Top ${data.topUsers.length}</div>
        </div>
        <div class="top-users-list">
          ${data.topUsers.map((u, i) => `
            <div class="top-user-item">
              <span class="top-user-rank ${rankStyles[i] || ''}">${i + 1}</span>
              <div class="avatar top-user-avatar">${(u.nickname || u.username).charAt(0).toUpperCase()}</div>
              <div class="top-user-info">
                <div class="top-user-name">${escapeHtml(u.nickname || u.username)}</div>
                <div class="top-user-username">@${escapeHtml(u.username)}</div>
              </div>
              <div class="top-user-stat">
                <span class="top-user-count">${u.diary_count}</span>
                <span class="top-user-unit">篇</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-state-illustration">${ILLUSTRATIONS.emptyFilter}</div><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

// ===== 管理员：用户管理 =====
async function loadAdminUsers(page) {
  if (page) adminState.usersPage = page;
  const c = document.getElementById('admin-users-content');
  const pag = document.getElementById('admin-users-pagination');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  pag.innerHTML = '';
  try {
    const keyword = document.getElementById('admin-user-search').value.trim();
    const status = document.getElementById('admin-user-status').value;
    const params = new URLSearchParams({ page: adminState.usersPage, limit: 15 });
    if (keyword) params.set('keyword', keyword);
    if (status) params.set('status', status);
    const data = await api('/api/admin/users?' + params.toString());
    if (!data.items.length) {
      c.innerHTML = `<div class="empty-state"><div class="empty-state-illustration">${ILLUSTRATIONS.emptyFilter}</div><h3>暂无用户</h3><p>没有符合条件的用户</p></div>`;
      return;
    }
    c.innerHTML = `
      <div class="admin-table-wrap" style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>状态</th>
              <th>日记</th>
              <th>图片</th>
              <th>存储</th>
              <th>注册时间</th>
              <th style="text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(u => {
              const pct = u.storage_limit > 0 ? Math.min(100, (u.used_storage / u.storage_limit) * 100) : 100;
              const pctClass = pct > 90 ? 'danger' : (pct > 70 ? 'warn' : '');
              const isSelf = state.user && u.id === state.user.id;
              return `
              <tr data-id="${u.id}">
                <td>
                  <div class="user-cell">
                    <div class="avatar">${(u.nickname || u.username).charAt(0).toUpperCase()}</div>
                    <div class="user-cell-info">
                      <span class="user-cell-name">${escapeHtml(u.nickname || u.username)} ${u.is_admin ? '<span class="badge badge-admin">管理员</span>' : ''} ${isSelf ? '<span class="badge badge-active">我</span>' : ''}</span>
                      <span class="user-cell-username">@${escapeHtml(u.username)}</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge ${u.status === 'active' ? 'badge-active' : 'badge-disabled'}">${u.status === 'active' ? '正常' : '已停用'}</span></td>
                <td>${u.diary_count}</td>
                <td>${u.image_count}</td>
                <td>
                  <div style="min-width:120px;">
                    <div class="progress-bar"><div class="progress-bar-fill ${pctClass}" style="width:${pct}%"></div></div>
                    <div style="font-size:11px;color:var(--fg-muted);margin-top:3px;">${formatBytes(u.used_storage)} / ${formatBytes(u.storage_limit)}</div>
                  </div>
                </td>
                <td style="font-size:12px;color:var(--fg-muted);">${formatDate(u.created_at)}</td>
                <td>
                  <div class="admin-row-actions">
                    <button class="action-icon-btn" data-action="edit" data-id="${u.id}" title="编辑">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </button>
                    <button class="action-icon-btn" data-action="toggle" data-id="${u.id}" title="${u.status === 'active' ? '停用' : '启用'}">
                      ${u.status === 'active'
                        ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
                        : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>'}
                    </button>
                    <button class="action-icon-btn" data-action="password" data-id="${u.id}" title="重置密码">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                    </button>
                    <button class="action-icon-btn danger" data-action="delete" data-id="${u.id}" ${isSelf ? 'disabled' : ''} title="删除">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    pag.innerHTML = renderAdminPagination(data, () => loadAdminUsers());
    // 绑定操作按钮
    c.querySelectorAll('.action-icon-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id, 10);
        if (action === 'edit') adminEditUser(id);
        else if (action === 'toggle') adminToggleUser(id);
        else if (action === 'password') adminResetPassword(id);
        else if (action === 'delete') adminDeleteUser(id);
      });
    });
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderAdminPagination(data, onChange) {
  if (data.totalPages <= 1) return '';
  let html = '';
  const addBtn = (label, page, opts = {}) => {
    html += `<button class="page-btn ${opts.active ? 'active' : ''}" ${opts.disabled ? 'disabled' : ''} data-page="${page}">${label}</button>`;
  };
  addBtn('‹', data.page - 1, { disabled: data.page <= 1 });
  const start = Math.max(1, data.page - 2);
  const end = Math.min(data.totalPages, data.page + 2);
  for (let i = start; i <= end; i++) addBtn(i, i, { active: i === data.page });
  addBtn('›', data.page + 1, { disabled: data.page >= data.totalPages });
  setTimeout(() => {
    document.querySelectorAll('#admin-users-pagination .page-btn').forEach(b => {
      b.addEventListener('click', () => onChange(parseInt(b.dataset.page, 10)));
    });
  }, 0);
  return html;
}

async function adminEditUser(id) {
  try {
    const { user } = await api('/api/admin/users/' + id);
    const body = `
      <div class="form-group">
        <label>用户名</label>
        <input type="text" value="${escapeHtml(user.username)}" disabled>
      </div>
      <div class="form-group">
        <label>昵称</label>
        <input type="text" id="admin-edit-nickname" value="${escapeHtml(user.nickname || '')}">
      </div>
      <div class="form-group">
        <label>存储空间配额（字节，当前 ${formatBytes(user.storage_limit)}）</label>
        <input type="number" id="admin-edit-storage" value="${user.storage_limit}" min="1048576" step="1048576">
        <div style="font-size:11px;color:var(--fg-muted);margin-top:4px;">
          快捷：${[100*1024*1024, 500*1024*1024, 1024*1024*1024, 5*1024*1024*1024].map(n =>
            `<a href="#" data-set="${n}" style="margin-right:8px;">${formatBytes(n)}</a>`
          ).join('')}
        </div>
      </div>
      <div class="form-group">
        <label>管理员权限</label>
        <label class="checkbox"><input type="checkbox" id="admin-edit-isadmin" ${user.is_admin ? 'checked' : ''}> 设为管理员</label>
      </div>
      <div class="form-group">
        <label>账户状态</label>
        <select id="admin-edit-status" class="filter-select" style="width:100%;">
          <option value="active" ${user.status === 'active' ? 'selected' : ''}>正常</option>
          <option value="disabled" ${user.status === 'disabled' ? 'selected' : ''}>停用</option>
        </select>
      </div>
      <div class="form-group">
        <label>已用空间</label>
        <div class="storage-bar">
          <div class="storage-bar-track"><div class="storage-bar-fill" style="width:${Math.min(100, user.storage_limit > 0 ? user.used_storage / user.storage_limit * 100 : 100)}%"></div></div>
          <div class="storage-bar-text"><span>${formatBytes(user.used_storage)}</span><span>${formatBytes(user.storage_limit)}</span></div>
        </div>
      </div>
    `;
    showModal('编辑用户 · @' + user.username, body, async () => {
      const payload = {
        nickname: document.getElementById('admin-edit-nickname').value.trim() || null,
        storage_limit: parseInt(document.getElementById('admin-edit-storage').value, 10),
        is_admin: document.getElementById('admin-edit-isadmin').checked,
        status: document.getElementById('admin-edit-status').value
      };
      try {
        await api('/api/admin/users/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        toast('用户已更新', 'success');
        closeModal();
        loadAdminUsers();
      } catch (e) { toast(e.message, 'error'); }
    }, { confirmText: '保存' });
    // 快捷设置存储空间
    setTimeout(() => {
      document.querySelectorAll('#modal-body [data-set]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          document.getElementById('admin-edit-storage').value = a.dataset.set;
        });
      });
    }, 50);
  } catch (e) { toast(e.message, 'error'); }
}

async function adminToggleUser(id) {
  try {
    const { user } = await api('/api/admin/users/' + id);
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    await api('/api/admin/users/' + id, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    toast(newStatus === 'active' ? '已启用' : '已停用', 'success');
    loadAdminUsers();
  } catch (e) { toast(e.message, 'error'); }
}

async function adminResetPassword(id) {
  const body = `
    <div class="form-group">
      <label>新密码（至少 6 位）</label>
      <input type="password" id="admin-reset-pwd" minlength="6" required>
    </div>
    <p style="font-size:12px;color:var(--fg-muted);">重置后，该用户需要使用新密码重新登录。</p>
  `;
  showModal('重置用户密码', body, async () => {
    const pwd = document.getElementById('admin-reset-pwd').value;
    if (!pwd || pwd.length < 6) { toast('密码至少 6 位', 'error'); return; }
    try {
      await api('/api/admin/users/' + id + '/reset-password', {
        method: 'POST', body: JSON.stringify({ newPassword: pwd })
      });
      toast('密码已重置', 'success');
      closeModal();
    } catch (e) { toast(e.message, 'error'); }
  }, { confirmText: '重置' });
}

async function adminDeleteUser(id) {
  showModal('确认删除用户', '<p>删除后该用户的所有日记、图片和数据将被永久清除，且无法恢复。</p><p style="color:var(--danger);font-weight:600;">此操作不可撤销！</p>', async () => {
    try {
      await api('/api/admin/users/' + id, { method: 'DELETE' });
      toast('用户已删除', 'success');
      closeModal();
      loadAdminUsers();
    } catch (e) { toast(e.message, 'error'); }
  }, { confirmText: '确认删除', danger: true });
}

// ===== 管理员：平台设置 =====
async function loadAdminSettings() {
  const c = document.getElementById('admin-settings-content');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  try {
    const { settings } = await api('/api/admin/settings');
    c.innerHTML = `
      <div class="admin-settings-card">
        <h3>注册与访问</h3>
        <div class="setting-row">
          <div class="setting-row-label">
            <div class="setting-row-title">开放注册</div>
            <div class="setting-row-desc">关闭后，新用户将无法自行注册账户，需管理员手动创建。</div>
          </div>
          <div class="setting-row-control">
            <label class="switch">
              <input type="checkbox" id="setting-allow-register" ${settings.allow_register ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-row-label">
            <div class="setting-row-title">站点名称</div>
            <div class="setting-row-desc">显示在登录页和浏览器标题。</div>
          </div>
          <div class="setting-row-control">
            <input type="text" id="setting-site-name" class="filter-input" style="max-width:200px;" value="${escapeHtml(settings.site_name || '')}" maxlength="50">
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-row-label">
            <div class="setting-row-title">站点公告</div>
            <div class="setting-row-desc">显示在登录页顶部，留空则不显示。</div>
          </div>
          <div class="setting-row-control">
            <textarea id="setting-site-notice" class="filter-input" style="max-width:320px;min-height:60px;" maxlength="500">${escapeHtml(settings.site_notice || '')}</textarea>
          </div>
        </div>
      </div>

      <div class="admin-settings-card" style="margin-top:16px;">
        <h3>存储配额</h3>
        <div class="setting-row">
          <div class="setting-row-label">
            <div class="setting-row-title">新用户默认存储空间</div>
            <div class="setting-row-desc">新注册用户的初始可用空间，已有用户不受影响。</div>
          </div>
          <div class="setting-row-control">
            <input type="number" id="setting-default-storage" class="filter-input" style="max-width:160px;" value="${settings.default_storage_limit}" min="1048576" step="1048576">
            <span style="margin-left:8px;font-size:12px;color:var(--fg-muted);">${formatBytes(parseInt(document.getElementById('setting-default-storage')?.value || settings.default_storage_limit, 10))}</span>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-row-label">
            <div class="setting-row-title">快捷选项</div>
          </div>
          <div class="setting-row-control">
            ${[100*1024*1024, 500*1024*1024, 1024*1024*1024, 5*1024*1024*1024].map(n =>
              `<button class="btn btn-ghost" data-quick="${n}" style="margin-left:6px;">${formatBytes(n)}</button>`
            ).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top:18px;">
        <button class="btn btn-primary" id="btn-save-settings">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
          保存设置
        </button>
      </div>
    `;

    // 快捷设置默认空间
    c.querySelectorAll('[data-quick]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('setting-default-storage').value = btn.dataset.quick;
      });
    });

    document.getElementById('btn-save-settings').addEventListener('click', async () => {
      const payload = {
        allow_register: document.getElementById('setting-allow-register').checked,
        site_name: document.getElementById('setting-site-name').value.trim(),
        site_notice: document.getElementById('setting-site-notice').value.trim(),
        default_storage_limit: parseInt(document.getElementById('setting-default-storage').value, 10)
      };
      try {
        await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
        toast('设置已保存', 'success');
      } catch (e) { toast(e.message, 'error'); }
    });
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

// ===== 管理员：系统性能 =====
async function loadAdminSystem() {
  const c = document.getElementById('admin-system-content');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  try {
    const [data, cleanup] = await Promise.all([
      api('/api/admin/system'),
      api('/api/admin/system/cleanup/preview').catch(() => null)
    ]);
    const memPct = data.os.totalMemory > 0 ? (data.os.totalMemory - data.os.freeMemory) / data.os.totalMemory * 100 : 0;
    const heapPct = data.node.memory.heapTotal > 0 ? data.node.memory.heapUsed / data.node.memory.heapTotal * 100 : 0;

    // 清理区域 HTML
    let cleanupHtml = '';
    if (cleanup) {
      const totalSize = cleanup.summary.totalSize;
      const totalItems = cleanup.summary.totalItems;
      const dbInfo = cleanup.summary.dbInfo;
      cleanupHtml = `
        <div class="sys-cleanup-section">
          <div class="sys-cleanup-header">
            <div class="sys-cleanup-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              <div>
                <div class="cleanup-name">系统清理</div>
                <div class="cleanup-subtitle">扫描并清理项目运行产生的垃圾文件，不会删除用户数据</div>
              </div>
            </div>
            <div class="sys-cleanup-summary">
              <span class="cleanup-stat"><span class="stat-num">${totalItems}</span><span class="stat-label">项可清理</span></span>
              <span class="cleanup-stat highlight"><span class="stat-num">${formatBytes(totalSize)}</span><span class="stat-label">可释放</span></span>
            </div>
          </div>

          <div class="cleanup-groups">
            ${cleanup.groups.map(g => `
              <div class="cleanup-group-card" data-group="${g.id}">
                <div class="cleanup-group-header">
                  <label class="cleanup-checkbox-wrap">
                    <input type="checkbox" class="cleanup-target" value="${g.id}" ${g.items.length > 0 ? '' : 'disabled'}>
                    <span class="cleanup-checkbox-custom"></span>
                  </label>
                  <div class="cleanup-group-info">
                    <div class="cleanup-group-title">${g.title}</div>
                    <div class="cleanup-group-desc">${g.description}</div>
                  </div>
                  <div class="cleanup-group-meta">
                    <span class="cleanup-count">${g.items.length} 项</span>
                    <span class="cleanup-size">${g.totalSize > 0 ? formatBytes(g.totalSize) : '-'}</span>
                  </div>
                </div>
                ${g.items.length > 0 ? `
                  <details class="cleanup-items-details">
                    <summary>查看文件列表（${g.items.length}）</summary>
                    <ul class="cleanup-items-list">
                      ${g.items.slice(0, 50).map(it => `
                        <li>
                          <span class="item-path">${escapeHtml(it.path)}</span>
                          <span class="item-size">${it.size > 0 ? formatBytes(it.size) : '-'}</span>
                        </li>
                      `).join('')}
                      ${g.items.length > 50 ? `<li class="more-items">... 还有 ${g.items.length - 50} 项</li>` : ''}
                    </ul>
                  </details>
                ` : '<div class="cleanup-empty">暂无可清理项</div>'}
              </div>
            `).join('')}
          </div>

          <div class="cleanup-actions">
            <button class="btn btn-ghost" id="btn-refresh-cleanup">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              重新扫描
            </button>
            <button class="btn btn-danger" id="btn-execute-cleanup" ${totalItems === 0 ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              执行清理
            </button>
          </div>

          <div class="cleanup-result" id="cleanup-result" style="display:none;"></div>

          <div class="cleanup-safety-note">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>清理操作严格保护用户数据：用户日记、有效图片、账户信息不会被删除。仅清理测试产物、孤儿文件和数据库日志。</span>
          </div>
        </div>
      `;
    }

    c.innerHTML = `
      <div class="sys-info-grid">
        <div class="sys-info-card">
          <h3>Node.js 进程</h3>
          <div class="sys-info-row"><span class="label">Node 版本</span><span class="value">${data.node.version}</span></div>
          <div class="sys-info-row"><span class="label">运行时长</span><span class="value">${formatDuration(data.node.uptime)}</span></div>
          <div class="sys-info-row"><span class="label">PID</span><span class="value">${data.node.pid}</span></div>
          <div class="sys-info-row"><span class="label">平台</span><span class="value">${data.node.platform} / ${data.node.arch}</span></div>
          <div class="sys-info-row"><span class="label">RSS 内存</span><span class="value">${formatBytes(data.node.memory.rss)}</span></div>
          <div class="sys-info-row"><span class="label">堆已用</span><span class="value">${formatBytes(data.node.memory.heapUsed)} / ${formatBytes(data.node.memory.heapTotal)}</span></div>
          <div style="margin-top:8px;"><div class="progress-bar"><div class="progress-bar-fill ${heapPct > 90 ? 'danger' : (heapPct > 70 ? 'warn' : '')}" style="width:${heapPct}%"></div></div></div>
          <div class="sys-info-row"><span class="label">外部内存</span><span class="value">${formatBytes(data.node.memory.external)}</span></div>
        </div>

        <div class="sys-info-card">
          <h3>操作系统</h3>
          <div class="sys-info-row"><span class="label">主机名</span><span class="value">${escapeHtml(data.os.hostname)}</span></div>
          <div class="sys-info-row"><span class="label">系统</span><span class="value">${escapeHtml(data.os.type)} ${escapeHtml(data.os.release)}</span></div>
          <div class="sys-info-row"><span class="label">运行时长</span><span class="value">${formatDuration(data.os.uptime)}</span></div>
          <div class="sys-info-row"><span class="label">CPU 核心</span><span class="value">${data.os.cpus}</span></div>
          <div class="sys-info-row"><span class="label">CPU 型号</span><span class="value" style="font-size:11px;">${escapeHtml(data.os.cpuModel)}</span></div>
          <div class="sys-info-row"><span class="label">内存使用</span><span class="value">${formatBytes(data.os.totalMemory - data.os.freeMemory)} / ${formatBytes(data.os.totalMemory)}</span></div>
          <div style="margin-top:8px;"><div class="progress-bar"><div class="progress-bar-fill ${memPct > 90 ? 'danger' : (memPct > 70 ? 'warn' : '')}" style="width:${memPct}%"></div></div></div>
            ${data.os.loadavg && data.os.loadavg.length ? `<div class="sys-info-row"><span class="label">负载（1/5/15分）</span><span class="value">${data.os.loadavg.map(l => l.toFixed(2)).join(' / ')}</span></div>` : ''}
        </div>

        <div class="sys-info-card">
          <h3>存储</h3>
          <div class="sys-info-row"><span class="label">上传目录</span><span class="value" style="font-size:11px;">${escapeHtml(data.storage.uploadsDir)}</span></div>
          <div class="sys-info-row"><span class="label">文件数量</span><span class="value">${data.storage.uploadsFiles}</span></div>
          <div class="sys-info-row"><span class="label">占用空间</span><span class="value">${formatBytes(data.storage.uploadsSize)}</span></div>
          <div class="sys-info-row"><span class="label">数据库路径</span><span class="value" style="font-size:11px;">${escapeHtml(data.db.path)}</span></div>
        </div>
      </div>

      ${cleanupHtml}
    `;

    // 绑定清理事件
    const refreshCleanup = document.getElementById('btn-refresh-cleanup');
    const execCleanup = document.getElementById('btn-execute-cleanup');
    if (refreshCleanup) refreshCleanup.addEventListener('click', loadAdminSystem);
    if (execCleanup) execCleanup.addEventListener('click', executeSystemCleanup);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

// 执行系统清理
async function executeSystemCleanup() {
  const checks = document.querySelectorAll('.cleanup-target:checked');
  const targets = Array.from(checks).map(c => c.value);
  if (targets.length === 0) {
    toast('请选择至少一项要清理的内容', 'error');
    return;
  }
  if (!confirm(`确认清理选中的 ${targets.length} 类项目？\n\n此操作将删除选定的垃圾文件，用户数据不会被删除。`)) {
    return;
  }
  const resultEl = document.getElementById('cleanup-result');
  resultEl.style.display = 'block';
  resultEl.className = 'cleanup-result loading';
  resultEl.innerHTML = '<span class="data-spinner"></span> 正在清理...';
  const btn = document.getElementById('btn-execute-cleanup');
  btn.disabled = true;
  try {
    const data = await api('/api/admin/system/cleanup', {
      method: 'POST',
      body: JSON.stringify({ targets })
    });
    const r = data.result;
    resultEl.className = 'cleanup-result success';
    resultEl.innerHTML = `
      <div class="result-title">清理完成</div>
      <div class="result-stats">
        <span class="result-stat">删除文件 ${r.deletedFiles}</span>
        <span class="result-stat">删除目录 ${r.deletedDirs}</span>
        <span class="result-stat">释放空间 ${formatBytes(r.freedSize)}</span>
        ${r.checkpointed ? '<span class="result-stat">数据库已整理</span>' : ''}
      </div>
      ${r.errors.length ? `<details class="result-errors"><summary>错误 ${r.errors.length} 条</summary><pre>${escapeHtml(r.errors.join('\\n'))}</pre></details>` : ''}
    `;
    toast(`清理完成，释放 ${formatBytes(r.freedSize)}`, 'success');
    // 3 秒后刷新
    setTimeout(() => loadAdminSystem(), 1500);
  } catch (e) {
    resultEl.className = 'cleanup-result error';
    resultEl.innerHTML = `<div class="result-title">清理失败</div><div class="result-msg">${escapeHtml(e.message)}</div>`;
    toast(e.message, 'error');
    btn.disabled = false;
  }
}

// ===== 管理员：操作日志 =====
async function loadAdminLogs(page) {
  if (page) adminState.logsPage = page;
  const c = document.getElementById('admin-logs-content');
  const pag = document.getElementById('admin-logs-pagination');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  pag.innerHTML = '';
  try {
    const params = new URLSearchParams({ page: adminState.logsPage, limit: 30 });
    const data = await api('/api/admin/logs?' + params.toString());
    if (!data.items.length) {
      c.innerHTML = `<div class="empty-state"><div class="empty-state-illustration">${ILLUSTRATIONS.emptyFilter}</div><h3>暂无日志</h3><p>管理员操作记录将显示在这里</p></div>`;
      return;
    }
    const actionLabel = (a) => {
      const map = {
        update_settings: ['更新设置', ''],
        update_user: ['更新用户', ''],
        reset_password: ['重置密码', 'warn'],
        delete_user: ['删除用户', 'danger']
      };
      return map[a] || [a, ''];
    };
    c.innerHTML = data.items.map(l => {
      const [label, cls] = actionLabel(l.action);
      let detail = '';
      try { detail = l.detail ? JSON.stringify(JSON.parse(l.detail)) : ''; } catch { detail = l.detail || ''; }
      return `
        <div class="log-item">
          <span class="log-action-tag ${cls}">${label}</span>
          <span style="color:var(--fg);">${escapeHtml(l.admin_nickname || l.admin_username || '管理员')}</span>
          ${l.target ? `<span style="color:var(--fg-muted);">→ 目标 #${escapeHtml(l.target)}</span>` : ''}
          ${detail ? `<span class="log-detail">${escapeHtml(detail).slice(0, 100)}</span>` : ''}
          <span class="log-time">${formatDate(l.created_at)} ${escapeHtml(l.created_at.slice(11, 19))}</span>
        </div>
      `;
    }).join('');
    pag.innerHTML = renderAdminLogsPagination(data, () => loadAdminLogs());
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderAdminLogsPagination(data, onChange) {
  if (data.totalPages <= 1) return '';
  let html = '';
  const addBtn = (label, page, opts = {}) => {
    html += `<button class="page-btn ${opts.active ? 'active' : ''}" ${opts.disabled ? 'disabled' : ''} data-page="${page}">${label}</button>`;
  };
  addBtn('‹', data.page - 1, { disabled: data.page <= 1 });
  const start = Math.max(1, data.page - 2);
  const end = Math.min(data.totalPages, data.page + 2);
  for (let i = start; i <= end; i++) addBtn(i, i, { active: i === data.page });
  addBtn('›', data.page + 1, { disabled: data.page >= data.totalPages });
  setTimeout(() => {
    document.querySelectorAll('#admin-logs-pagination .page-btn').forEach(b => {
      b.addEventListener('click', () => onChange(parseInt(b.dataset.page, 10)));
    });
  }, 0);
  return html;
}

// ===== 数据管理（管理员） =====
async function loadAdminData() {
  const c = document.getElementById('admin-data-content');
  c.innerHTML = '<p style="color:var(--fg-muted);padding:20px;">加载中...</p>';
  try {
    const preview = await api('/api/admin/export/preview');
    const stats = preview.meta.stats;

    c.innerHTML = `
      <div class="data-mgmt-section">
        <div id="storage-location-card"></div>

        <div class="data-mgmt-card data-export-card">
          <div class="data-mgmt-icon export-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div class="data-mgmt-body">
            <div class="data-mgmt-title">一键导出平台数据</div>
            <div class="data-mgmt-desc">导出所有用户、日记、图片元数据、日程和平台设置。可用于备份或迁移。</div>
            <div class="data-mgmt-stats">
              <span class="data-stat-pill">用户 ${stats.users}</span>
              <span class="data-stat-pill">日记 ${stats.diaries}</span>
              <span class="data-stat-pill">图片 ${stats.images}</span>
              <span class="data-stat-pill">日程 ${stats.schedules}</span>
              <span class="data-stat-pill">设置 ${stats.settings}</span>
            </div>
            <div class="data-mgmt-actions">
              <button class="btn btn-primary" id="btn-export-platform-json">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                导出 JSON
              </button>
              <button class="btn btn-secondary" id="btn-export-platform-zip">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                导出 ZIP（含图片）
              </button>
            </div>
          </div>
        </div>

        <div class="data-mgmt-card data-import-card">
          <div class="data-mgmt-icon import-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div class="data-mgmt-body">
            <div class="data-mgmt-title">导入平台数据</div>
            <div class="data-mgmt-desc">从 JSON 文件导入平台数据。已存在的用户名会跳过，日记按标题+内容+时间去重。</div>
            <div class="data-mgmt-form">
              <label class="data-checkbox">
                <input type="checkbox" id="import-skip-dup" checked>
                <span>跳过重复日记</span>
              </label>
              <label class="data-checkbox">
                <input type="checkbox" id="import-overwrite-settings">
                <span>覆盖平台设置</span>
              </label>
            </div>
            <div class="data-mgmt-actions">
              <label class="btn btn-primary" for="admin-import-file">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                选择 JSON 文件导入
              </label>
              <input type="file" id="admin-import-file" accept=".json,application/json" style="display:none;">
            </div>
            <div class="data-import-result" id="admin-import-result" style="display:none;"></div>
          </div>
        </div>

        <div class="data-mgmt-card data-note-card">
          <div class="data-mgmt-icon note-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="data-mgmt-body">
            <div class="data-mgmt-title">说明</div>
            <ul class="data-note-list">
              <li>JSON 导出包含所有数据，但不包含用户密码（出于安全考虑）。</li>
              <li>导入用户时使用随机密码，需管理员在用户管理中重置。</li>
              <li>导入用户不会自动获得管理员权限（防止提权）。</li>
              <li>ZIP 导出会打包所有图片文件，JSON 导出仅包含图片元数据。</li>
              <li>建议定期导出 JSON 作为平台备份。</li>
              <li>切换存储位置后需重启服务才能生效，原数据会保留作为备份。</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // 绑定事件
    document.getElementById('btn-export-platform-json').onclick = () => {
      toast('正在导出 JSON...', 'success');
      downloadAuthenticatedUrl('/api/admin/export/all?images=0');
    };
    document.getElementById('btn-export-platform-zip').onclick = () => {
      toast('正在打包 ZIP（含图片），请稍候...', 'success');
      downloadAuthenticatedUrl('/api/admin/export/all?images=1');
    };
    document.getElementById('admin-import-file').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const resultEl = document.getElementById('admin-import-result');
      resultEl.style.display = 'block';
      resultEl.className = 'data-import-result loading';
      resultEl.innerHTML = '<span class="data-spinner"></span> 正在导入...';
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('skipDuplicate', document.getElementById('import-skip-dup').checked ? '1' : '0');
        fd.append('overwriteSettings', document.getElementById('import-overwrite-settings').checked ? '1' : '0');
        const res = await fetch('/api/admin/import', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + state.token },
          body: fd
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '导入失败');
        const r = data.result;
        resultEl.className = 'data-import-result success';
        resultEl.innerHTML = `
          <div class="result-title">导入完成</div>
          <div class="result-stats">
            <span class="result-stat">新增用户 ${r.users}</span>
            <span class="result-stat">跳过用户 ${r.skippedUsers}</span>
            <span class="result-stat">新增日记 ${r.diaries}</span>
            <span class="result-stat">跳过日记 ${r.skippedDiaries}</span>
            <span class="result-stat">新增日程 ${r.schedules}</span>
            <span class="result-stat">导入设置 ${r.settings}</span>
          </div>
          ${r.errors.length ? `<details class="result-errors"><summary>错误 ${r.errors.length} 条</summary><pre>${escapeHtml(r.errors.join('\n'))}</pre></details>` : ''}
        `;
        toast('导入完成', 'success');
        // 刷新概览数据
        setTimeout(() => loadAdminData(), 1000);
      } catch (err) {
        resultEl.className = 'data-import-result error';
        resultEl.innerHTML = `<div class="result-title">导入失败</div><div class="result-msg">${escapeHtml(err.message)}</div>`;
        toast(err.message, 'error');
      }
      e.target.value = '';
    };

    // 加载存储位置卡片
    loadStorageLocationCard();
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-state-illustration">${ILLUSTRATIONS.emptyFilter}</div><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

// ===== 存储位置管理（管理员） =====
async function loadStorageLocationCard() {
  const c = document.getElementById('storage-location-card');
  if (!c) return;
  c.innerHTML = '<p style="color:var(--fg-muted);padding:12px;">加载存储位置信息...</p>';
  try {
    const data = await api('/api/admin/storage-location');
    const cur = data.current;
    const st = data.stats;
    const totalSize = (st.dbSize || 0) + (st.uploadSize || 0);

    const driveBadges = (data.drives || []).map(d => {
      const sysTag = d.system ? '<span class="storage-drive-sys">系统</span>' : '';
      return `<button class="storage-drive-pill" data-path="${escapeHtml(d.path)}" title="${escapeHtml(d.path)}">${escapeHtml(d.label)}${sysTag}</button>`;
    }).join('');

    const needsRestartBanner = data.needsRestart
      ? `<div class="storage-restart-banner">
           <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
           <span>已切换存储位置，需重启服务才能生效</span>
         </div>`
      : '';

    const modeBadge = cur.isCustom
      ? `<span class="storage-mode-badge custom">自定义位置</span>`
      : `<span class="storage-mode-badge default">默认位置</span>`;

    c.innerHTML = `
      <div class="data-mgmt-card data-storage-card">
        <div class="data-mgmt-icon storage-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
        </div>
        <div class="data-mgmt-body">
          <div class="data-mgmt-title-row">
            <div class="data-mgmt-title">平台数据存储位置</div>
            ${modeBadge}
          </div>
          <div class="data-mgmt-desc">选择平台数据（数据库 + 上传文件）的存储位置，可用于将数据迁移到其他盘符或挂载点。切换后需重启服务生效。</div>

          ${needsRestartBanner}

          <div class="storage-info-grid">
            <div class="storage-info-item">
              <div class="storage-info-label">当前数据库目录</div>
              <div class="storage-info-value" title="${escapeHtml(cur.dbDir)}">${escapeHtml(cur.dbDir)}</div>
            </div>
            <div class="storage-info-item">
              <div class="storage-info-label">当前上传目录</div>
              <div class="storage-info-value" title="${escapeHtml(cur.uploadDir)}">${escapeHtml(cur.uploadDir)}</div>
            </div>
            <div class="storage-info-item">
              <div class="storage-info-label">数据库大小</div>
              <div class="storage-info-value">${formatBytes(st.dbSize)}</div>
            </div>
            <div class="storage-info-item">
              <div class="storage-info-label">上传文件大小</div>
              <div class="storage-info-value">${formatBytes(st.uploadSize)} <span class="storage-info-sub">(${st.uploadFiles || 0} 个文件)</span></div>
            </div>
            <div class="storage-info-item storage-info-total">
              <div class="storage-info-label">总占用</div>
              <div class="storage-info-value">${formatBytes(totalSize)}</div>
            </div>
          </div>

          <div class="storage-default-hint">
            默认位置：${escapeHtml(cur.defaultDbDir)} + ${escapeHtml(cur.defaultUploadDir)}
          </div>

          ${driveBadges ? `<div class="storage-drives-row">
            <div class="storage-drives-label">快速选择：</div>
            <div class="storage-drives-list">${driveBadges}</div>
          </div>` : ''}

          <div class="storage-switch-form">
            <div class="storage-input-row">
              <input type="text" id="storage-target-path" class="storage-input" placeholder="输入目标路径，例如 D:\\treeks-data 或 /mnt/data/treeks">
              <button class="btn btn-secondary" id="btn-validate-storage-path">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                校验
              </button>
            </div>
            <label class="data-checkbox">
              <input type="checkbox" id="storage-migrate" checked>
              <span>迁移现有数据到新位置（推荐）</span>
            </label>
            <div class="data-mgmt-actions">
              <button class="btn btn-primary" id="btn-switch-storage">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                切换存储位置
              </button>
              ${cur.isCustom ? `<button class="btn btn-ghost" id="btn-reset-storage">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                恢复默认位置
              </button>` : ''}
            </div>
            <div class="storage-validate-result" id="storage-validate-result" style="display:none;"></div>
          </div>
        </div>
      </div>
    `;

    // 绑定快速选择盘符
    c.querySelectorAll('.storage-drive-pill').forEach(btn => {
      btn.onclick = () => {
        const p = btn.dataset.path;
        const input = document.getElementById('storage-target-path');
        if (input) {
          // 默认在盘符下加 treeks-data 子目录，避免直接污染盘根
          const sep = p.includes('/') && !p.includes('\\') ? '/' : '\\';
          const candidate = p.endsWith(sep) ? p + 'treeks-data' : p + sep + 'treeks-data';
          input.value = candidate;
        }
      };
    });

    // 校验路径
    const validateBtn = document.getElementById('btn-validate-storage-path');
    if (validateBtn) {
      validateBtn.onclick = async () => {
        const targetPath = document.getElementById('storage-target-path').value.trim();
        const resultEl = document.getElementById('storage-validate-result');
        if (!targetPath) {
          resultEl.style.display = 'block';
          resultEl.className = 'storage-validate-result error';
          resultEl.innerHTML = '请输入目标路径';
          return;
        }
        resultEl.style.display = 'block';
        resultEl.className = 'storage-validate-result loading';
        resultEl.innerHTML = '<span class="data-spinner"></span> 校验中...';
        try {
          const res = await fetch('/api/admin/storage-location/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token },
            body: JSON.stringify({ targetPath })
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            resultEl.className = 'storage-validate-result error';
            resultEl.innerHTML = `<span>${escapeHtml(data.error || '校验失败')}</span>`;
          } else {
            resultEl.className = 'storage-validate-result success';
            resultEl.innerHTML = `<span>路径可用：${escapeHtml(data.abs)}</span>`;
          }
        } catch (err) {
          resultEl.className = 'storage-validate-result error';
          resultEl.innerHTML = escapeHtml(err.message);
        }
      };
    }

    // 切换存储位置
    const switchBtn = document.getElementById('btn-switch-storage');
    if (switchBtn) {
      switchBtn.onclick = async () => {
        const targetPath = document.getElementById('storage-target-path').value.trim();
        if (!targetPath) {
          toast('请输入目标路径', 'error');
          return;
        }
        const migrate = document.getElementById('storage-migrate').checked;
        if (!confirm(`确认将平台数据切换到以下位置？\n\n${targetPath}\n\n${migrate ? '✓ 将迁移现有数据' : '✗ 不迁移数据（仅切换配置）'}\n\n切换后需重启服务才能生效。`)) {
          return;
        }
        switchBtn.disabled = true;
        switchBtn.innerHTML = '<span class="data-spinner"></span> 切换中...';
        try {
          const res = await fetch('/api/admin/storage-location/switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token },
            body: JSON.stringify({ targetPath, migrate })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || '切换失败');
          const r = data.result;
          toast('存储位置已切换，请重启服务生效', 'success');
          // 显示结果详情
          loadStorageLocationCard();
          alert(
            `存储位置切换成功！\n\n` +
            `目标位置: ${r.targetPath}\n` +
            `数据库目录: ${r.newDbDir}\n` +
            `上传目录: ${r.newUploadDir}\n\n` +
            `迁移情况:\n` +
            `- 数据库: ${r.migrated.db ? '✓ 已迁移 (' + formatBytes(r.migrated.dbSize) + ')' : '✗ 未迁移'}\n` +
            `- 上传文件: ${r.migrated.uploads ? '✓ 已迁移 (' + formatBytes(r.migrated.uploadSize) + ', ' + r.migrated.uploadFiles + ' 个文件)' : '✗ 未迁移'}\n\n` +
            `请重启服务以应用新的存储位置。`
          );
        } catch (err) {
          toast(err.message, 'error');
          switchBtn.disabled = false;
          switchBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> 切换存储位置';
        }
      };
    }

    // 恢复默认
    const resetBtn = document.getElementById('btn-reset-storage');
    if (resetBtn) {
      resetBtn.onclick = async () => {
        if (!confirm('确认恢复为默认存储位置？\n\n注意：已迁移到自定义位置的数据不会被删除，需手动处理。\n\n重启服务后生效。')) {
          return;
        }
        resetBtn.disabled = true;
        try {
          const res = await fetch('/api/admin/storage-location/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || '恢复失败');
          toast('已恢复默认存储位置，请重启服务生效', 'success');
          loadStorageLocationCard();
        } catch (err) {
          toast(err.message, 'error');
          resetBtn.disabled = false;
        }
      };
    }
  } catch (e) {
    c.innerHTML = `<div class="data-mgmt-card data-storage-card"><div class="data-mgmt-body"><div class="data-mgmt-title">平台数据存储位置</div><p style="color:var(--fg-muted);font-size:13px;">加载失败：${escapeHtml(e.message)}</p></div></div>`;
  }
}

// ===== 我的数据（用户级导出/导入） =====
async function loadMyData() {
  const c = document.getElementById('my-data-content');
  const userName = state.user ? (state.user.nickname || state.user.username) : '用户';

  // 获取本用户日记数（用于显示统计）
  let diaryCount = 0;
  let imageCount = 0;
  let scheduleCount = 0;
  try {
    const stats = await api('/api/diaries?limit=1');
    diaryCount = stats.total || 0;
  } catch (_) {}
  try {
    const fileStats = await api('/api/upload/files?kind=image');
    imageCount = fileStats.items ? fileStats.items.length : 0;
  } catch (_) {}

  c.innerHTML = `
    <div class="data-mgmt-section">
      <div class="data-mgmt-card data-export-card">
        <div class="data-mgmt-icon export-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div class="data-mgmt-body">
          <div class="data-mgmt-title">导出我的数据</div>
          <div class="data-mgmt-desc">导出你的所有日记、图片元数据和日程，可用于备份或迁移到其他平台。</div>
          <div class="data-mgmt-stats">
            <span class="data-stat-pill">日记 ${diaryCount}</span>
            <span class="data-stat-pill">图片 ${imageCount}</span>
          </div>
          <div class="data-mgmt-actions">
            <button class="btn btn-primary" id="btn-export-my-json">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              导出 JSON
            </button>
            <button class="btn btn-secondary" id="btn-export-my-zip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
              导出 ZIP（含图片）
            </button>
          </div>
        </div>
      </div>

      <div class="data-mgmt-card data-import-card">
        <div class="data-mgmt-icon import-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div class="data-mgmt-body">
          <div class="data-mgmt-title">导入数据</div>
          <div class="data-mgmt-desc">从其他平台导出的 JSON 文件导入数据。日记会合并到当前账号下，按标题+内容+时间去重。</div>
          <div class="data-mgmt-form">
            <label class="data-checkbox">
              <input type="checkbox" id="my-import-skip-dup" checked>
              <span>跳过重复日记</span>
            </label>
            <label class="data-checkbox">
              <input type="checkbox" id="my-import-image-meta">
              <span>导入图片元数据（不包含图片文件）</span>
            </label>
          </div>
          <div class="data-mgmt-actions">
            <label class="btn btn-primary" for="my-import-file">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              选择 JSON 文件导入
            </label>
            <input type="file" id="my-import-file" accept=".json,application/json" style="display:none;">
          </div>
          <div class="data-import-result" id="my-import-result" style="display:none;"></div>
        </div>
      </div>

      <div class="data-mgmt-card data-note-card">
        <div class="data-mgmt-icon note-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="data-mgmt-body">
          <div class="data-mgmt-title">说明</div>
          <ul class="data-note-list">
            <li>JSON 导出包含你的日记、日程和图片元数据。</li>
            <li>ZIP 导出会额外打包图片文件本身。</li>
            <li>导入数据不会覆盖现有日记，相同标题+内容+时间的日记会被跳过。</li>
            <li>导入的图片仅为元数据，图片文件需另行上传。</li>
            <li>建议定期导出 JSON 作为个人数据备份。</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-export-my-json').onclick = () => {
    toast('正在导出 JSON...', 'success');
    downloadAuthenticatedUrl('/api/diaries/user-data/export?images=0');
  };
  document.getElementById('btn-export-my-zip').onclick = () => {
    toast('正在打包 ZIP（含图片），请稍候...', 'success');
    downloadAuthenticatedUrl('/api/diaries/user-data/export?images=1');
  };
  document.getElementById('my-import-file').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resultEl = document.getElementById('my-import-result');
    resultEl.style.display = 'block';
    resultEl.className = 'data-import-result loading';
    resultEl.innerHTML = '<span class="data-spinner"></span> 正在导入...';
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('skipDuplicate', document.getElementById('my-import-skip-dup').checked ? '1' : '0');
      fd.append('importImageMeta', document.getElementById('my-import-image-meta').checked ? '1' : '0');
      const res = await fetch('/api/diaries/user-data/import', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + state.token },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '导入失败');
      const r = data.result;
      resultEl.className = 'data-import-result success';
      resultEl.innerHTML = `
        <div class="result-title">导入完成</div>
        <div class="result-stats">
          <span class="result-stat">新增日记 ${r.diaries}</span>
          <span class="result-stat">新增日程 ${r.schedules}</span>
          <span class="result-stat">跳过 ${r.skipped}</span>
          <span class="result-stat">图片元数据 ${r.images}</span>
        </div>
        ${r.errors.length ? `<details class="result-errors"><summary>错误 ${r.errors.length} 条</summary><pre>${escapeHtml(r.errors.join('\n'))}</pre></details>` : ''}
      `;
      toast('导入完成', 'success');
      setTimeout(() => loadMyData(), 1000);
    } catch (err) {
      resultEl.className = 'data-import-result error';
      resultEl.innerHTML = `<div class="result-title">导入失败</div><div class="result-msg">${escapeHtml(err.message)}</div>`;
      toast(err.message, 'error');
    }
    e.target.value = '';
  };
}
async function loadSiteInfo() {
  try {
    const info = await api('/api/auth/site-info');
    // 站点名称
    const nameEl = document.getElementById('site-name');
    if (nameEl && info.site_name) nameEl.textContent = info.site_name;
    document.title = (info.site_name || 'Treeks') + ' · 日记';
    // 站点公告
    const noticeEl = document.getElementById('site-notice');
    if (noticeEl) {
      if (info.site_notice) {
        noticeEl.textContent = info.site_notice;
        noticeEl.style.display = '';
      } else {
        noticeEl.style.display = 'none';
      }
    }
    // 注册开关
    const regTab = document.getElementById('register-tab');
    if (regTab) {
      regTab.style.display = info.allow_register ? '' : 'none';
      if (!info.allow_register) {
        // 切到登录
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        document.getElementById('login-form').classList.add('active');
      }
    }
  } catch (e) {
    // 静默失败
  }
}

// ===== 日历日程 =====
const calState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  selectedDate: null,
  schedules: [],
  diaries: []
};

async function loadCalendar() {
  await loadCalendarData();
  renderCalendar();
  renderDayDetail();
}

async function loadCalendarData() {
  const month = `${calState.year}-${String(calState.month + 1).padStart(2, '0')}`;
  try {
    const [sched, diaries] = await Promise.all([
      api(`/api/schedules?month=${month}`),
      api(`/api/diaries/stats/heatmap?year=${calState.year}`)
    ]);
    calState.schedules = sched.items || [];
    requestScheduleNotificationPermission();
    // 后端 weeks 是数组的数组（每个内部数组含 7 个 day 对象），扁平化为按日期映射
    const map = {};
    (diaries.weeks || []).forEach(week => {
      const days = Array.isArray(week) ? week : (week.days || []);
      days.forEach(day => {
        if (day && day.date) map[day.date] = day;
      });
    });
    calState.diaries = map;
  } catch (e) {
    calState.schedules = [];
    calState.diaries = {};
  }
}

function getDiaryCountForDate(dateStr) {
  const day = calState.diaries[dateStr];
  return day ? (day.count || 0) : 0;
}

// 获取某天的日记标题列表（最多 5 篇）
function getDiariesForDate(dateStr) {
  const day = calState.diaries[dateStr];
  return day ? (day.titles || []) : [];
}

function getSchedulesForDate(dateStr) {
  return calState.schedules.filter(s => s.schedule_date === dateStr);
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const title = document.getElementById('cal-title');
  title.textContent = `${calState.year}年${calState.month + 1}月`;

  const firstDay = new Date(calState.year, calState.month, 1);
  const lastDay = new Date(calState.year, calState.month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  let html = '<div class="cal-weekdays">';
  for (const w of weekdays) {
    html += `<div class="cal-weekday">${w}</div>`;
  }
  html += '</div><div class="cal-days">';

  // 前置空格
  for (let i = 0; i < startWeekday; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calState.year}-${String(calState.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const daySchedules = getSchedulesForDate(dateStr);
    const diaryCount = getDiaryCountForDate(dateStr);
    const dayDiaries = getDiariesForDate(dateStr);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === calState.selectedDate;
    const hasContent = daySchedules.length > 0 || diaryCount > 0;

    // 日历格子内最多显示 2 条日记标题（截断），多了用 +N 表示
    const maxDiaryShow = 2;
    const diaryShowCount = Math.min(dayDiaries.length, maxDiaryShow);
    const diaryRemain = dayDiaries.length - maxDiaryShow;

    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasContent ? 'has-content' : ''}" data-date="${dateStr}">
      <div class="cal-day-num">${d}</div>
      ${diaryCount > 0 ? `<div class="cal-dot cal-dot-diary" title="${diaryCount} 篇日记"></div>` : ''}
      ${dayDiaries.slice(0, maxDiaryShow).map(di => `<div class="cal-event cal-event-diary" title="${escapeHtml(di.title)}">${escapeHtml(di.title).slice(0, 10)}${di.title.length > 10 ? '…' : ''}</div>`).join('')}
      ${diaryRemain > 0 ? `<div class="cal-more">+${diaryRemain} 篇</div>` : ''}
      ${daySchedules.slice(0, 2).map(s => `<div class="cal-event" style="border-left-color:${s.color || '#4c995c'}" title="${escapeHtml(s.title)}">${escapeHtml(s.title).slice(0, 8)}${s.start_time ? ' ' + s.start_time.slice(0, 5) : ''}</div>`).join('')}
      ${daySchedules.length > 2 ? `<div class="cal-more">+${daySchedules.length - 2} 日程</div>` : ''}
    </div>`;
  }
  html += '</div>';
  grid.innerHTML = html;

  // 绑定日期点击
  grid.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
    el.addEventListener('click', () => {
      calState.selectedDate = el.dataset.date;
      renderCalendar();
      renderDayDetail();
    });
  });
}

function renderDayDetail() {
  const dateEl = document.getElementById('day-detail-date');
  const contentEl = document.getElementById('day-detail-content');
  const date = calState.selectedDate;

  if (!date) {
    dateEl.textContent = '选择一天';
    contentEl.innerHTML = '<p class="day-detail-empty">点击日历上的日期查看详情</p>';
    return;
  }

  const d = new Date(date + 'T00:00:00');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  dateEl.textContent = `${d.getMonth() + 1}月${d.getDate()}日 · ${weekdays[d.getDay()]}`;

  const schedules = getSchedulesForDate(date);
  const diaryCount = getDiaryCountForDate(date);
  const dayDiaries = getDiariesForDate(date);

  let html = '';

  if (diaryCount > 0) {
    html += `
      <div class="day-section">
        <div class="day-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          日记 (${diaryCount})
        </div>
        <div class="day-diary-list">
          ${dayDiaries.map(di => `
            <div class="day-diary-item" data-action="open-diary" data-id="${di.id}" title="${escapeHtml(di.title)}">
              ${di.is_pinned ? '<span class="pin-icon">📌</span>' : ''}
              <span class="day-diary-title">${escapeHtml(di.title)}</span>
            </div>
          `).join('')}
          ${diaryCount > dayDiaries.length ? `<a href="#" class="day-link" data-action="view-diaries" data-date="${date}">查看全部 ${diaryCount} 篇 →</a>` : ''}
        </div>
      </div>
    `;
  }

  if (schedules.length > 0) {
    html += '<div class="day-section"><div class="day-section-title">日程 (' + schedules.length + ')</div>';
    html += '<div class="schedule-list">';
    schedules.forEach(s => {
      html += `
        <div class="schedule-item ${s.is_done ? 'done' : ''}" data-id="${s.id}">
          <div class="schedule-color" style="background:${s.color || '#4c995c'}"></div>
          <div class="schedule-info">
            <div class="schedule-title">${escapeHtml(s.title)}</div>
            ${s.start_time || s.end_time ? `<div class="schedule-time">${s.start_time ? s.start_time.slice(0, 5) : ''}${s.end_time ? ' - ' + s.end_time.slice(0, 5) : ''}</div>` : ''}
            ${s.description ? `<div class="schedule-desc">${escapeHtml(s.description)}</div>` : ''}
          </div>
          <div class="schedule-actions">
            <button class="action-icon-btn" data-action="toggle-schedule" data-id="${s.id}" title="${s.is_done ? '标记未完成' : '标记完成'}">
              ${s.is_done
                ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
                : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'}
            </button>
            <button class="action-icon-btn" data-action="edit-schedule" data-id="${s.id}" title="编辑">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            </button>
            <button class="action-icon-btn danger" data-action="delete-schedule" data-id="${s.id}" title="删除">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </div>
      `;
    });
    html += '</div></div>';
  }

  if (diaryCount === 0 && schedules.length === 0) {
    html += '<p class="day-detail-empty">这一天还没有日记或日程</p>';
  }

  html += `<button class="btn btn-ghost btn-block" data-action="add-schedule-date" data-date="${date}" style="margin-top:12px;">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    为这天添加日程
  </button>`;

  contentEl.innerHTML = html;

  // 绑定操作
  contentEl.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const action = el.dataset.action;
      const id = el.dataset.id ? parseInt(el.dataset.id, 10) : null;
      const date = el.dataset.date;
      if (action === 'view-diaries') {
        document.getElementById('filter-date').value = date;
        document.getElementById('filter-tag').value = '';
        document.getElementById('search-input').value = '';
        navigateTo('list');
      } else if (action === 'open-diary') {
        // 在日历详情中点击日记标题直接打开编辑
        if (id) openEditor(id);
      } else if (action === 'toggle-schedule') {
        toggleSchedule(id);
      } else if (action === 'edit-schedule') {
        editSchedule(id);
      } else if (action === 'delete-schedule') {
        deleteSchedule(id);
      } else if (action === 'add-schedule-date') {
        showScheduleModal(date);
      }
    });
  });
}

// 新建日程（dateStr 为可选默认日期）
function showScheduleModal(dateStr) {
  const defaultDate = dateStr || calState.selectedDate || '';
  const body = `
    <div class="form-group">
      <label>日程标题</label>
      <input type="text" id="schedule-input-title" class="form-input" maxlength="200" placeholder="日程标题" />
    </div>
    <div class="form-group">
      <label>日期</label>
      <input type="date" id="schedule-input-date" class="form-input" value="${escapeHtml(defaultDate)}" />
    </div>
    <div class="form-group" style="display:flex;gap:12px;">
      <div style="flex:1;">
        <label>开始时间</label>
        <input type="time" id="schedule-input-start" class="form-input" />
      </div>
      <div style="flex:1;">
        <label>结束时间</label>
        <input type="time" id="schedule-input-end" class="form-input" />
      </div>
    </div>
    <div class="form-group">
      <label>备注</label>
      <textarea id="schedule-input-desc" class="form-input" rows="2" maxlength="4000"></textarea>
    </div>`;
  showModal('新建日程', body, async () => {
    const title = document.getElementById('schedule-input-title').value.trim();
    const date = document.getElementById('schedule-input-date').value;
    if (!title) { toast('请输入日程标题', 'error'); return false; }
    if (!date) { toast('请选择日期', 'error'); return false; }
    const payload = {
      title,
      schedule_date: date,
      start_time: document.getElementById('schedule-input-start').value || null,
      end_time: document.getElementById('schedule-input-end').value || null,
      description: document.getElementById('schedule-input-desc').value.trim() || ''
    };
    try {
      await api('/api/schedules', { method: 'POST', body: JSON.stringify(payload) });
      toast('日程已创建', 'success');
      await loadCalendarData();
      renderCalendar();
      renderDayDetail();
    } catch (e) { toast(e.message, 'error'); return false; }
  }, { confirmText: '创建' });
}

// 编辑日程
function editSchedule(id) {
  const s = calState.schedules.find(x => x.id === id);
  if (!s) return;
  const body = `
    <div class="form-group">
      <label>日程标题</label>
      <input type="text" id="schedule-input-title" class="form-input" maxlength="200" value="${escapeHtml(s.title || '')}" />
    </div>
    <div class="form-group">
      <label>日期</label>
      <input type="date" id="schedule-input-date" class="form-input" value="${escapeHtml(s.schedule_date || '')}" />
    </div>
    <div class="form-group" style="display:flex;gap:12px;">
      <div style="flex:1;">
        <label>开始时间</label>
        <input type="time" id="schedule-input-start" class="form-input" value="${escapeHtml(s.start_time || '')}" />
      </div>
      <div style="flex:1;">
        <label>结束时间</label>
        <input type="time" id="schedule-input-end" class="form-input" value="${escapeHtml(s.end_time || '')}" />
      </div>
    </div>
    <div class="form-group">
      <label>备注</label>
      <textarea id="schedule-input-desc" class="form-input" rows="2" maxlength="4000">${escapeHtml(s.description || '')}</textarea>
    </div>`;
  showModal('编辑日程', body, async () => {
    const title = document.getElementById('schedule-input-title').value.trim();
    const date = document.getElementById('schedule-input-date').value;
    if (!title) { toast('请输入日程标题', 'error'); return false; }
    if (!date) { toast('请选择日期', 'error'); return false; }
    const payload = {
      title,
      schedule_date: date,
      start_time: document.getElementById('schedule-input-start').value || null,
      end_time: document.getElementById('schedule-input-end').value || null,
      description: document.getElementById('schedule-input-desc').value.trim() || ''
    };
    try {
      await api('/api/schedules/' + id, { method: 'PUT', body: JSON.stringify(payload) });
      toast('日程已更新', 'success');
      await loadCalendarData();
      renderCalendar();
      renderDayDetail();
    } catch (e) { toast(e.message, 'error'); return false; }
  }, { confirmText: '保存' });
}

async function toggleSchedule(id) {
  const s = calState.schedules.find(x => x.id === id);
  if (!s) return;
  try {
    await api('/api/schedules/' + id, {
      method: 'PUT', body: JSON.stringify({ is_done: !s.is_done })
    });
    await loadCalendarData();
    renderCalendar();
    renderDayDetail();
    toast(s.is_done ? '已标记未完成' : '已完成', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteSchedule(id) {
  showModal('确认删除', '<p>确定要删除这个日程吗？</p>', async () => {
    try {
      await api('/api/schedules/' + id, { method: 'DELETE' });
      toast('日程已删除', 'success');
      await loadCalendarData();
      renderCalendar();
      renderDayDetail();
      closeModal();
    } catch (e) { toast(e.message, 'error'); }
  }, { confirmText: '删除', danger: true });
}

function renderLettersList(items, tab) {
  const c = document.getElementById('msg-letters-content') || document.getElementById('letters-content');
  if (!items.length) {
    c.innerHTML = `<div class="empty-state"><p>${tab === 'inbox' ? '收件箱为空' : '发件箱为空'}</p></div>`;
    return;
  }
  c.innerHTML = '<div class="letters-list">' + items.map(l => {
    const user = tab === 'inbox' ? {
      id: l.sender_id, username: l.sender_username, nickname: l.sender_nickname, avatar: l.sender_avatar
    } : {
      id: l.recipient_id, username: l.recipient_username, nickname: l.recipient_nickname, avatar: l.recipient_avatar
    };
    const label = tab === 'inbox' ? '来自' : '发给';
    const unread = tab === 'inbox' && !l.is_read;
    const hasDiary = !!l.diary_title;
    const hasFile = !!l.file_id;
    return `<div class="letter-card ${unread ? 'letter-unread' : ''}" data-letter-id="${l.id}">
      ${userAvatarHtml(user, 40)}
      <div class="letter-body">
        <div class="letter-header">
          <span class="letter-from">${label} <strong>${escapeHtml(user.nickname || user.username)}</strong></span>
          <span class="letter-date">${formatDate(l.created_at)}</span>
        </div>
        <div class="letter-subject">${escapeHtml(l.subject || '(无主题)')} ${unread ? '<span class="unread-dot"></span>' : ''}</div>
        <div class="letter-preview">${escapeHtml((l.content || '').slice(0, 80))}${l.content && l.content.length > 80 ? '...' : ''}</div>
        <div class="letter-attached-tags">
          ${hasDiary ? `<span class="letter-attached-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> 日记: ${escapeHtml(l.diary_title)}</span>` : ''}
          ${hasFile ? `<span class="letter-attached-tag file-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> 附件: ${escapeHtml(l.file_name)}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';

  c.querySelectorAll('[data-letter-id]').forEach(card => {
    card.addEventListener('click', () => openLetterDetail(parseInt(card.dataset.letterId, 10)));
  });
}

async function openLetterDetail(id) {
  try {
    const l = await api(`/api/letters/${id}`);
    const hasFile = !!l.file;
    const isImage = hasFile && l.file.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(l.file.url);
    const isPdf = hasFile && l.file.url && /\.pdf$/i.test(l.file.url);

    const body = `
      <div class="letter-detail">
        <div class="letter-detail-header">
          ${userAvatarHtml(l.sender, 48)}
          <div class="letter-detail-meta">
            <div class="letter-detail-from">${escapeHtml(l.sender.nickname || l.sender.username)}</div>
            <div class="letter-detail-date">${formatDate(l.created_at)}</div>
          </div>
          <button class="btn btn-danger btn-sm letter-delete-btn" data-id="${l.id}" title="删除信件">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            <span>删除</span>
          </button>
        </div>
        <h3 class="letter-detail-subject">${escapeHtml(l.subject || '(无主题)')}</h3>
        <div class="letter-detail-content">${escapeHtml(l.content || '').replace(/\n/g, '<br>')}</div>
        
        ${l.diary ? `<div class="letter-detail-diary">
          <div class="attached-diary-label">附带日记：</div>
          <h4>${escapeHtml(l.diary.title || '(无标题)')}</h4>
          <button class="btn btn-ghost btn-sm" data-open-diary="${l.diary.id}">在编辑器中打开</button>
        </div>` : ''}

        ${hasFile ? `
          <div class="letter-detail-file-card">
            <div class="letter-file-icon">📎</div>
            <div class="letter-file-info">
              <div class="letter-file-name" title="${escapeHtml(l.file.original_name || l.file.filename)}">${escapeHtml(l.file.original_name || l.file.filename)}</div>
              <div class="letter-file-size">${formatBytes(l.file.size || 0)}</div>
            </div>
            <div class="letter-file-actions">
              ${isImage || isPdf ? `<a href="${l.file.url}" target="_blank" class="btn btn-ghost btn-sm">在线预览</a>` : ''}
              <a href="${l.file.url}" download="${escapeHtml(l.file.original_name || l.file.filename)}" class="btn btn-primary btn-sm">下载文件</a>
            </div>
          </div>
          ${isImage ? `<div class="letter-image-preview"><img src="${l.file.url}" alt="图片预览"></div>` : ''}
        ` : ''}
      </div>
    `;
    showModal(l.subject || '信件', body, null, { hideCancel: true, confirmText: '关闭' });
    const openBtn = document.querySelector('[data-open-diary]');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        closeModal();
        openEditor(l.diary.id);
      });
    }
    const deleteBtn = document.querySelector('.letter-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal('删除信件',
          `<p>确定要删除这封信件吗？</p><p style="color:var(--fg-muted);font-size:13px;margin-top:8px;">此操作无法撤销。</p>`,
          async () => {
            try {
              await api(`/api/letters/${l.id}`, { method: 'DELETE' });
              toast('信件已删除', 'success');
              closeModal();
              loadLettersList(lettersState.tab);
              if (lettersState.tab === 'inbox') updateNavBadges();
            } catch (err) {
              toast(err.message || '删除失败', 'error');
              return false;
            }
          },
          { danger: true, confirmText: '删除' }
        );
      });
    }
  } catch (e) { toast(e.message, 'error'); }
}

function openComposeLetterModal(diaryId, presetRecipientId) {
  const body = `
    <div class="compose-form">
      <div class="form-group">
        <label>收件人</label>
        <select id="compose-recipient" class="filter-select">
          <option value="">选择好友...</option>
        </select>
      </div>
      <div class="form-group">
        <label>主题</label>
        <input type="text" id="compose-subject" class="filter-input" placeholder="信件主题" maxlength="200">
      </div>
      <div class="form-group">
        <label>内容</label>
        <textarea id="compose-content" rows="6" class="compose-textarea" placeholder="写下你想说的话..."></textarea>
      </div>
      <div class="form-group">
        <label>附带文件附件（可选）</label>
        <div class="compose-file-picker">
          <select id="compose-file-select" class="filter-select" style="flex:1;">
            <option value="">不附带文件</option>
          </select>
          <label class="btn btn-ghost btn-sm compose-upload-label" title="上传新文件作为附件">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>上传附件</span>
            <input type="file" id="compose-file-upload-input" style="display:none;">
          </label>
        </div>
      </div>
      <div id="compose-attached-info" style="display:none;" class="compose-attached-info">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span id="compose-attached-text">附带当前日记</span>
      </div>
    </div>
  `;
  showModal('写信', body, async () => {
    const recipientId = parseInt(document.getElementById('compose-recipient').value, 10);
    const subject = document.getElementById('compose-subject').value.trim();
    const content = document.getElementById('compose-content').value;
    const fileId = document.getElementById('compose-file-select').value;
    if (!recipientId) { toast('请选择收件人', 'error'); return false; }
    if (!content.trim()) { toast('请输入信件内容', 'error'); return false; }
    try {
      const payload = { recipientId, subject, content };
      if (diaryId) payload.diaryId = diaryId;
      if (fileId) payload.fileId = parseInt(fileId, 10);
      await api('/api/letters', { method: 'POST', body: JSON.stringify(payload) });
      toast('信件已发送', 'success');
      if (typeof loadLettersList === 'function' && lettersState.tab === 'sent') {
        loadLettersList('sent');
      }
    } catch (e) { toast(e.message, 'error'); return false; }
  }, { confirmText: '发送' });

  api('/api/friends').then(data => {
    const sel = document.getElementById('compose-recipient');
    (data.items || []).forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.nickname || f.username} (@${f.username})`;
      if (presetRecipientId === f.id) opt.selected = true;
      sel.appendChild(opt);
    });
  }).catch(e => toast('加载好友列表失败: ' + e.message, 'error'));

  const loadUserFilesSelect = (selectFileId = null) => {
    api('/api/upload/files').then(data => {
      const fileSel = document.getElementById('compose-file-select');
      if (!fileSel) return;
      fileSel.innerHTML = '<option value="">不附带文件</option>';
      (data.items || []).forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = `📎 ${f.original_name || f.filename} (${formatBytes(f.size || 0)})`;
        if (selectFileId && selectFileId === f.id) opt.selected = true;
        fileSel.appendChild(opt);
      });
    }).catch(() => {});
  };
  loadUserFilesSelect();

  setTimeout(() => {
    const uploadInput = document.getElementById('compose-file-upload-input');
    if (uploadInput) {
      uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        toast(`正在上传附件: ${file.name}...`, 'info');
        try {
          const res = await apiUpload(await compressImageFile(file));
          toast(`附件已上传`, 'success');
          loadUserFilesSelect(res.id);
        } catch (err) {
          toast(`附件上传失败: ${err.message}`, 'error');
        }
      });
    }
  }, 100);

  if (diaryId) {
    document.getElementById('compose-attached-info').style.display = '';
    api(`/api/diaries/${diaryId}`).then(d => {
      document.getElementById('compose-attached-text').textContent = '附带日记: ' + (d.title || '(无标题)');
    }).catch(e => toast('加载日记信息失败', 'error'));
  }
}

// ===== 主题设置 =====
// ===== 主题系统：调色板 + 明暗模式 =====
const THEME_PALETTES = [
  { id: 'green',  name: '森林绿',  desc: '清新自然，默认主题',  light: '#4c995c', dark: '#10b981', bg: '#ebf2eb' },
  { id: 'blue',   name: '海洋蓝',  desc: '宁静深邃',            light: '#3b82f6', dark: '#3b82f6', bg: '#dbeafe' },
  { id: 'purple', name: '薰衣草',  desc: '优雅浪漫',            light: '#8b5cf6', dark: '#a78bfa', bg: '#ede9fe' },
  { id: 'orange', name: '暖阳橙',  desc: '温暖活力',            light: '#f59e0b', dark: '#fbbf24', bg: '#fef3c7' },
  { id: 'pink',   name: '樱花粉',  desc: '柔和甜美',            light: '#ec4899', dark: '#f472b6', bg: '#fce7f3' },
  { id: 'rose',   name: '玫瑰红',  desc: '热情鲜活',            light: '#f43f5e', dark: '#fb7185', bg: '#ffe4e6' },
  { id: 'teal',   name: '青碧',    desc: '沉静如海',            light: '#14b8a6', dark: '#2dd4bf', bg: '#ccfbf1' },
  { id: 'indigo', name: '靛蓝',    desc: '稳重神秘',            light: '#6366f1', dark: '#818cf8', bg: '#e0e7ff' }
];
const THEME_MODES = [
  { id: 'light', name: '浅色', icon: 'sun' },
  { id: 'dark',  name: '深色', icon: 'moon' }
];

// 将数据库 theme 字符串解析为 { palette, mode, auto }
function parseThemeValue(theme) {
  if (!theme || theme === 'auto') return { palette: 'green', mode: 'light', auto: true };
  // 旧值兼容：green/blue/purple/orange/pink → palette:light；dark → green:dark
  const legacy = ['green', 'blue', 'purple', 'orange', 'pink'];
  if (legacy.includes(theme)) return { palette: theme, mode: 'light', auto: false };
  if (theme === 'dark') return { palette: 'green', mode: 'dark', auto: false };
  // 新格式 palette:mode
  const [p, m] = theme.split(':');
  if (THEME_PALETTES.find(t => t.id === p) && THEME_MODES.find(t => t.id === m)) {
    return { palette: p, mode: m, auto: false };
  }
  return { palette: 'green', mode: 'light', auto: false };
}

// 当前生效的 { palette, mode }（auto 模式根据系统偏好推导）
function resolveCurrentTheme() {
  const stored = state.user?.theme || localStorage.getItem('treeks_theme') || 'green';
  const parsed = parseThemeValue(stored);
  if (parsed.auto) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { palette: parsed.palette, mode: prefersDark ? 'dark' : 'light', auto: true };
  }
  return { palette: parsed.palette, mode: parsed.mode, auto: false };
}

async function loadThemeSettings() {
  const c = document.getElementById('theme-settings-content');
  if (!c) return;
  const cur = resolveCurrentTheme();
  const stored = state.user?.theme || localStorage.getItem('treeks_theme') || 'green';
  const parsed = parseThemeValue(stored);
  const isAuto = parsed.auto;

  c.innerHTML = `
    <div class="theme-settings-v2">
      <!-- 明暗模式切换 -->
      <div class="theme-section">
        <div class="theme-section-title">
          <span>明暗模式</span>
          <label class="theme-auto-toggle">
            <input type="checkbox" id="theme-auto-checkbox" ${isAuto ? 'checked' : ''}>
            <span class="theme-auto-label">跟随系统</span>
          </label>
        </div>
        <div class="theme-mode-row" ${isAuto ? 'style="opacity:0.4;pointer-events:none;"' : ''}>
          ${THEME_MODES.map(m => `
            <button class="theme-mode-card ${cur.mode === m.id && !isAuto ? 'active' : ''}" data-mode="${m.id}">
              ${m.icon === 'sun'
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
              }
              <span>${m.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 调色板选择 -->
      <div class="theme-section">
        <div class="theme-section-title"><span>主题色</span></div>
        <div class="theme-palette-grid">
          ${THEME_PALETTES.map(p => {
            const active = cur.palette === p.id;
            const previewColor = cur.mode === 'dark' ? p.dark : p.light;
            const previewBg = cur.mode === 'dark' ? '#1c1c1e' : p.bg;
            return `
              <button class="theme-palette-card ${active ? 'active' : ''}" data-palette="${p.id}" title="${p.name} · ${p.desc}">
                <div class="palette-preview" style="background:${previewBg};">
                  <div class="palette-accent-bar" style="background:${previewColor};"></div>
                  <div class="palette-mini-card">
                    <div class="palette-mini-dot" style="background:${previewColor};"></div>
                    <div class="palette-mini-line"></div>
                    <div class="palette-mini-line short"></div>
                  </div>
                </div>
                <div class="palette-info">
                  <div class="palette-name">${p.name}</div>
                  <div class="palette-swatch" style="background:${previewColor};"></div>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 预览 -->
      <div class="theme-section">
        <div class="theme-section-title"><span>实时预览</span></div>
        <div class="theme-live-preview" id="theme-live-preview">
          <div class="tlp-topbar">
            <div class="tlp-logo"></div>
            <div class="tlp-title">Treeks</div>
            <div class="tlp-actions">
              <div class="tlp-btn"></div>
              <div class="tlp-btn primary"></div>
            </div>
          </div>
          <div class="tlp-body">
            <div class="tlp-sidebar">
              <div class="tlp-nav-item active"></div>
              <div class="tlp-nav-item"></div>
              <div class="tlp-nav-item"></div>
              <div class="tlp-nav-item"></div>
            </div>
            <div class="tlp-content">
              <div class="tlp-card">
                <div class="tlp-card-header"></div>
                <div class="tlp-card-line"></div>
                <div class="tlp-card-line short"></div>
                <div class="tlp-card-tag"></div>
              </div>
              <div class="tlp-card">
                <div class="tlp-card-header"></div>
                <div class="tlp-card-line"></div>
                <div class="tlp-card-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 事件绑定
  const autoCheckbox = document.getElementById('theme-auto-checkbox');
  autoCheckbox?.addEventListener('change', async (e) => {
    const auto = e.target.checked;
    const newTheme = auto ? 'auto' : `${cur.palette}:${cur.mode}`;
    await saveThemeSetting(newTheme);
    loadThemeSettings();
  });

  c.querySelectorAll('.theme-mode-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const mode = btn.dataset.mode;
      await saveThemeSetting(`${cur.palette}:${mode}`);
      loadThemeSettings();
    });
  });

  c.querySelectorAll('.theme-palette-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const palette = btn.dataset.palette;
      await saveThemeSetting(`${palette}:${cur.mode}`);
      loadThemeSettings();
    });
  });
}

// 兼容命令面板：切换主题（立即应用并持久化到服务端）
function changeTheme(theme) {
  saveThemeSetting(theme);
}

async function saveThemeSetting(theme) {
  try {
    await api('/api/auth/theme', { method: 'PUT', body: JSON.stringify({ theme }) });
    if (state.user) {
      state.user.theme = theme;
      localStorage.setItem('treeks_user', JSON.stringify(state.user));
    }
    localStorage.setItem('treeks_theme', theme);
    applyTheme(theme);
    toast('主题已更新', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function applyTheme(theme) {
  const { palette, mode } = resolveCurrentThemeForValue(theme);
  const root = document.documentElement;
  // 双属性方案
  root.setAttribute('data-palette', palette);
  root.setAttribute('data-mode', mode);
  // 兼容旧 data-theme（仍设置一个）
  root.setAttribute('data-theme', mode === 'dark' ? 'dark' : palette);
  // 持久化原始值（保留 auto/palette:mode 信息）
  if (theme) localStorage.setItem('treeks_theme', theme);

  // 同步 highlight.js 主题
  const hljsLink = document.getElementById('hljs-theme');
  if (hljsLink) {
    hljsLink.href = mode === 'dark'
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css';
  }
}

// 给定 theme 值，返回生效的 { palette, mode }
function resolveCurrentThemeForValue(theme) {
  const parsed = parseThemeValue(theme);
  if (parsed.auto) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { palette: parsed.palette, mode: prefersDark ? 'dark' : 'light' };
  }
  return { palette: parsed.palette, mode: parsed.mode };
}

// 监听系统主题变化（auto 模式）
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.user && state.user.theme === 'auto') {
      applyTheme('auto');
    }
  });
}

// ===== PWA / 离线 / 日程提醒 / 语音备忘 =====
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}
window.addEventListener('offline', () => toast('网络已断开，可继续浏览已缓存内容', 'warning'));
window.addEventListener('online', () => toast('网络已恢复', 'success'));

let notifiedScheduleIds = new Set();
try { notifiedScheduleIds = new Set(JSON.parse(localStorage.getItem('treeks_notified_schedules') || '[]')); } catch (_) {}
function requestScheduleNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}
function checkScheduleReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  const months = [
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}`
  ];
  Promise.all(months.map(m => api(`/api/schedules?month=${m}`).catch(() => null))).then(results => {
    results.forEach(data => {
      ((data && data.items) || []).forEach(s => {
        if (notifiedScheduleIds.has(s.id)) return;
        const start = s.start_time || '09:00';
        const when = new Date(`${s.schedule_date}T${start}:00`);
        const mins = (when - now) / 60000;
        if (mins >= 0 && mins <= 15) {
          notifiedScheduleIds.add(s.id);
          const ids = [...notifiedScheduleIds].slice(-300);
          try { localStorage.setItem('treeks_notified_schedules', JSON.stringify(ids)); } catch (_) {}
          try {
            new Notification('⏰ 日程提醒', { body: s.title + (s.description ? ' — ' + s.description : ''), tag: 'schedule-' + s.id });
          } catch (_) {}
        }
      });
    });
  });
}

let voiceRecorder = null;
let voiceChunks = [];
let voiceStream = null;
function insertAtEditorCursor(text) {
  const ta = document.getElementById('editor-textarea');
  if (!ta) return false;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  ta.value = ta.value.substring(0, start) + text + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = start + text.length;
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}
async function toggleVoiceMemo() {
  const btn = document.getElementById('btn-voice-memo');
  if (voiceRecorder && voiceRecorder.state === 'recording') {
    voiceRecorder.stop();
    if (btn) { btn.classList.remove('recording'); btn.title = '语音备忘（录音并插入日记）'; }
    return;
  }
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    toast('当前浏览器不支持录音', 'error');
    return;
  }
  try {
    voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    voiceChunks = [];
    voiceRecorder = new MediaRecorder(voiceStream);
    voiceRecorder.ondataavailable = e => { if (e.data && e.data.size) voiceChunks.push(e.data); };
    voiceRecorder.onstop = async () => {
      if (voiceStream) voiceStream.getTracks().forEach(t => t.stop());
      const type = voiceRecorder.mimeType || 'audio/webm';
      const blob = new Blob(voiceChunks, { type });
      if (blob.size < 1024) {
        toast('录音时间太短，未插入', 'warning');
        voiceRecorder = null;
        return;
      }
      toast('正在上传语音...', 'info');
      try {
        const data = await apiUpload(new File([blob], '语音备忘-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + (type.includes('mp4') ? '.m4a' : '.webm'), { type }));
        insertAtEditorCursor(`\n<audio controls src="${data.url}"></audio>\n`);
        updatePreview();
        updateWordCount();
        toast('语音备忘已插入', 'success');
      } catch (e) {
        toast('语音上传失败：' + e.message, 'error');
      }
      voiceRecorder = null;
    };
    voiceRecorder.start();
    if (btn) { btn.classList.add('recording'); btn.title = '停止录音'; }
    toast('录音中… 再次点击停止并插入', 'info');
  } catch (e) {
    toast('无法访问麦克风：' + (e.name === 'NotAllowedError' ? '请允许麦克风权限' : e.message), 'error');
  }
}

// ===== 初始化 =====
async function init() {
  bindEvents();
  registerServiceWorker();
  setInterval(checkScheduleReminders, 60 * 1000);
  const voiceBtn = document.getElementById('btn-voice-memo');
  if (voiceBtn) voiceBtn.addEventListener('click', toggleVoiceMemo);
  // 初始化"我的文件"页面（绑定上传/过滤事件，幂等）
  if (typeof initFilesView === 'function') initFilesView();
  loadSiteInfo();

  // 检查登录状态
  if (state.token) {
    try {
      const data = await api('/api/auth/me');
      state.user = data.user;
      localStorage.setItem('treeks_user', JSON.stringify(data.user));
      applyTheme(data.user.theme || 'green');
      showMainView();
    } catch (e) {
      logout();
    }
  } else {
    // 未登录也应用本地保存的主题
    const savedTheme = localStorage.getItem('treeks_theme') || 'green';
    applyTheme(savedTheme);
    showAuthView();
  }
}

// ===== 好友 / 信件 / 协作 / 共享 =====

function avatarText(name) {
  return (name || '?').charAt(0).toUpperCase();
}

function avatarColor(id) {
  const colors = ['#4c995c', '#3b7dd8', '#d97a3b', '#9c5cb8', '#c94f7a', '#5c8bb8', '#b89c3b'];
  return colors[(id - 1) % colors.length] || '#4c995c';
}

function userAvatarHtml(user, size) {
  const s = size || 36;
  const name = user.nickname || user.username || '?';
  const color = avatarColor(user.id);
  if (user.avatar) {
    return `<img class="avatar-img" src="${escapeHtml(user.avatar)}" style="width:${s}px;height:${s}px;border-radius:50%;object-fit:cover;">`;
  }
  return `<div class="avatar-circle" style="width:${s}px;height:${s}px;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:600;font-size:${Math.floor(s*0.4)}px;">${escapeHtml(avatarText(name))}</div>`;
}

// 更新导航徽标（好友请求数 + 未读信件数）
async function updateNavBadges() {
  if (!state.token) return;
  try {
    const fs = await api('/api/friends/summary');
    const badgeF = document.getElementById('badge-friends');
    if (fs.pendingRequests > 0) {
      badgeF.textContent = fs.pendingRequests;
      badgeF.style.display = '';
    } else { badgeF.style.display = 'none'; }
    const tabBadgeF = document.getElementById('msg-tab-badge-friends');
    if (tabBadgeF) {
      if (fs.pendingRequests > 0) {
        tabBadgeF.textContent = fs.pendingRequests;
        tabBadgeF.style.display = '';
      } else { tabBadgeF.style.display = 'none'; }
    }

    const ls = await api('/api/letters/unread/count');
    const badgeL = document.getElementById('badge-letters');
    if (ls.unread > 0) {
      badgeL.textContent = ls.unread;
      badgeL.style.display = '';
    } else { badgeL.style.display = 'none'; }
    const tabBadgeL = document.getElementById('msg-tab-badge-letters');
    if (tabBadgeL) {
      if (ls.unread > 0) {
        tabBadgeL.textContent = ls.unread;
        tabBadgeL.style.display = '';
      } else { tabBadgeL.style.display = 'none'; }
    }

    // 消息未读数
    try {
      const ms = await api('/api/messages/unread/count');
      const badgeM = document.getElementById('badge-messages');
      const totalUnread = (ms.unread || 0) + (ls.unread || 0);
      if (totalUnread > 0) {
        badgeM.textContent = totalUnread > 99 ? '99+' : String(totalUnread);
        badgeM.style.display = '';
      } else { badgeM.style.display = 'none'; }
    } catch {}
  } catch {}
}

// ===== 好友页面 =====
let friendsRefreshTimer = null;
function clearFriendsRefreshTimer() {
  if (friendsRefreshTimer) {
    clearInterval(friendsRefreshTimer);
    friendsRefreshTimer = null;
  }
}
async function loadFriendsView() {
  const c = document.getElementById('msg-friends-content') || document.getElementById('friends-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const [friends, requests, sentReqs] = await Promise.all([
      api('/api/friends'),
      api('/api/friends/requests'),
      api('/api/friends/requests/sent')
    ]);
    renderFriendsView(friends.items || [], requests.items || [], sentReqs.items || []);
    // 定时刷新在线状态（30 秒），仅在好友视图激活时生效
    clearFriendsRefreshTimer();
    friendsRefreshTimer = setInterval(() => {
      if (state.currentNav === 'messages' && msgState.tab === 'friends' && document.getElementById('msg-friends-content')) {
        loadFriendsView();
      } else {
        clearFriendsRefreshTimer();
      }
    }, 30000);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderFriendsView(friends, requests, sentReqs) {
  const c = document.getElementById('msg-friends-content') || document.getElementById('friends-content');
  let html = '';

  // 待处理请求
  if (requests.length) {
    html += '<div class="friends-section"><h3 class="friends-section-title">好友请求</h3>';
    html += '<div class="friends-grid">';
    requests.forEach(r => {
      html += `<div class="friend-card friend-request-card">
        ${userAvatarHtml({ id: r.from_user_id, username: r.from_username, nickname: r.from_nickname, avatar: r.from_avatar }, 44)}
        <div class="friend-info">
          <div class="friend-name">${escapeHtml(r.from_nickname || r.from_username)}</div>
          <div class="friend-handle">@${escapeHtml(r.from_username)}</div>
          ${r.message ? `<div class="friend-msg">${escapeHtml(r.message)}</div>` : ''}
        </div>
        <div class="friend-actions">
          <button class="btn btn-primary btn-sm" data-accept-request="${r.id}">接受</button>
          <button class="btn btn-ghost btn-sm" data-reject-request="${r.id}">拒绝</button>
        </div>
      </div>`;
    });
    html += '</div></div>';
  }

  // 已发送请求
  if (sentReqs.length) {
    const pending = sentReqs.filter(r => r.status === 'pending');
    if (pending.length) {
      html += '<div class="friends-section"><h3 class="friends-section-title">已发送请求</h3>';
      html += '<div class="friends-grid">';
      pending.forEach(r => {
        html += `<div class="friend-card">
          ${userAvatarHtml({ id: r.to_user_id, username: r.to_username, nickname: r.to_nickname, avatar: r.to_avatar }, 44)}
          <div class="friend-info">
            <div class="friend-name">${escapeHtml(r.to_nickname || r.to_username)}</div>
            <div class="friend-handle">@${escapeHtml(r.to_username)}</div>
            <div class="friend-status">等待确认</div>
          </div>
        </div>`;
      });
      html += '</div></div>';
    }
  }

  // 好友列表
  html += '<div class="friends-section"><h3 class="friends-section-title">我的好友</h3>';
  if (friends.length) {
    html += '<div class="friends-grid">';
    friends.forEach(f => {
      const online = !!f.is_online;
      html += `<div class="friend-card">
        <div class="friend-avatar-wrap">
          ${userAvatarHtml(f, 44)}
          <span class="friend-status-dot ${online ? 'online' : 'offline'}" title="${online ? '在线' : '离线'}"></span>
        </div>
        <div class="friend-info">
          <div class="friend-name">${escapeHtml(f.nickname || f.username)}</div>
          <div class="friend-handle">@${escapeHtml(f.username)}</div>
          <div class="friend-presence ${online ? 'is-online' : 'is-offline'}">${online ? '在线' : '离线'}</div>
          ${f.bio ? `<div class="friend-bio">${escapeHtml(f.bio)}</div>` : ''}
        </div>
        <div class="friend-actions">
          <button class="btn btn-primary btn-sm" data-msg-chat="${f.id}" title="开始聊天">聊天</button>
          <button class="btn btn-ghost btn-sm" data-letter-to="${f.id}" title="发信件">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button class="btn btn-ghost btn-sm" data-remove-friend="${f.id}" title="删除好友">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    });
    html += '</div>';
  } else {
    html += `<div class="empty-state">
      <p>还没有好友，点击右上角"添加好友"开始吧！</p>
    </div>`;
  }
  html += '</div>';

  c.innerHTML = html;

  // 绑定事件
  c.querySelectorAll('[data-accept-request]').forEach(b => {
    b.addEventListener('click', async () => {
      try {
        await api(`/api/friends/requests/${b.dataset.acceptRequest}/accept`, { method: 'POST' });
        toast('已添加好友', 'success');
        loadFriendsView();
        updateNavBadges();
      } catch (e) { toast(e.message, 'error'); }
    });
  });
  c.querySelectorAll('[data-reject-request]').forEach(b => {
    b.addEventListener('click', async () => {
      try {
        await api(`/api/friends/requests/${b.dataset.rejectRequest}/reject`, { method: 'POST' });
        toast('已拒绝', '');
        loadFriendsView();
        updateNavBadges();
      } catch (e) { toast(e.message, 'error'); }
    });
  });
  c.querySelectorAll('[data-remove-friend]').forEach(b => {
    b.addEventListener('click', () => {
      const fid = b.dataset.removeFriend;
      showModal('删除好友', '确定要删除该好友吗？', async () => {
        try {
          await api(`/api/friends/${fid}`, { method: 'DELETE' });
          toast('已删除好友', '');
          loadFriendsView();
        } catch (e) { toast(e.message, 'error'); }
      }, { danger: true, confirmText: '删除' });
    });
  });
  c.querySelectorAll('[data-letter-to]').forEach(b => {
    b.addEventListener('click', () => openComposeLetterModal(null, parseInt(b.dataset.letterTo, 10)));
  });
  c.querySelectorAll('[data-msg-chat]').forEach(b => {
    b.addEventListener('click', () => {
      const peerId = parseInt(b.dataset.msgChat, 10);
      switchMsgMainTab('chat');
      openConversation(peerId);
    });
  });
}

// 添加好友弹窗
function openAddFriendModal() {
  const body = `
    <div class="friend-search-box">
      <input type="text" id="friend-search-input" class="filter-input" placeholder="搜索用户名或昵称..." autocomplete="off">
    </div>
    <div id="friend-search-results" class="friend-search-results">
      <p class="search-hint">输入用户名或昵称搜索用户</p>
    </div>
  `;
  showModal('添加好友', body, null, { hideCancel: true, confirmText: '关闭' });

  const input = document.getElementById('friend-search-input');
  const results = document.getElementById('friend-search-results');
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { results.innerHTML = '<p class="search-hint">输入用户名或昵称搜索用户</p>'; return; }
    timer = setTimeout(async () => {
      try {
        const data = await api(`/api/friends/search?q=${encodeURIComponent(q)}`);
        if (!data.items.length) {
          results.innerHTML = '<p class="search-hint">未找到匹配的用户</p>';
          return;
        }
        results.innerHTML = data.items.map(u => `
          <div class="search-user-card">
            ${userAvatarHtml(u, 36)}
            <div class="search-user-info">
              <div class="search-user-name">${escapeHtml(u.nickname || u.username)}</div>
              <div class="search-user-handle">@${escapeHtml(u.username)}</div>
            </div>
            ${u.is_friend ? '<span class="badge badge-friend">已是好友</span>' :
              u.request_pending ? '<span class="badge badge-pending">已申请</span>' :
              `<button class="btn btn-primary btn-sm" data-send-request="${u.id}">加好友</button>`}
          </div>
        `).join('');
        results.querySelectorAll('[data-send-request]').forEach(b => {
          b.addEventListener('click', async () => {
            try {
              const res = await api('/api/friends/requests', {
                method: 'POST', body: JSON.stringify({ toUserId: parseInt(b.dataset.sendRequest, 10) })
              });
              toast(res.message || res.becameFriends ? '已互加为好友' : '请求已发送', 'success');
              if (res.becameFriends) loadFriendsView();
              openAddFriendModal(); // 刷新
              updateNavBadges();
            } catch (e) { toast(e.message, 'error'); }
          });
        });
      } catch (e) { results.innerHTML = `<p class="search-hint">${escapeHtml(e.message)}</p>`; }
    }, 300);
  });
  setTimeout(() => input.focus(), 100);
}

// ===== 信件页面 =====
let lettersState = { tab: 'inbox' };

async function loadLettersView() {
  lettersState.tab = 'inbox';
  document.querySelectorAll('.letters-tabs .letter-tab').forEach(b => b.classList.remove('active'));
  document.querySelector('.letters-tabs .letter-tab[data-tab="inbox"]').classList.add('active');
  loadLettersList('inbox');
}

async function loadLettersList(tab) {
  lettersState.tab = tab;
  const c = document.getElementById('msg-letters-content') || document.getElementById('letters-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const data = await api(`/api/letters/${tab}`);
    renderLettersList(data.items || [], tab);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderLettersListLegacy(items, tab) {
  const c = document.getElementById('letters-content');
  if (!items.length) {
    c.innerHTML = `<div class="empty-state"><p>${tab === 'inbox' ? '收件箱为空' : '发件箱为空'}</p></div>`;
    return;
  }
  c.innerHTML = '<div class="letters-list">' + items.map(l => {
    const user = tab === 'inbox' ? {
      id: l.sender_id, username: l.sender_username, nickname: l.sender_nickname, avatar: l.sender_avatar
    } : {
      id: l.recipient_id, username: l.recipient_username, nickname: l.recipient_nickname, avatar: l.recipient_avatar
    };
    const label = tab === 'inbox' ? '来自' : '发给';
    const unread = tab === 'inbox' && !l.is_read;
    return `<div class="letter-card ${unread ? 'letter-unread' : ''}" data-letter-id="${l.id}">
      ${userAvatarHtml(user, 40)}
      <div class="letter-body">
        <div class="letter-header">
          <span class="letter-from">${label} <strong>${escapeHtml(user.nickname || user.username)}</strong></span>
          <span class="letter-date">${formatDate(l.created_at)}</span>
        </div>
        <div class="letter-subject">${escapeHtml(l.subject || '(无主题)')} ${unread ? '<span class="unread-dot"></span>' : ''}</div>
        <div class="letter-preview">${escapeHtml((l.content || '').slice(0, 80))}${l.content && l.content.length > 80 ? '...' : ''}</div>
        ${l.diary_title ? `<div class="letter-attached"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> 附带日记: ${escapeHtml(l.diary_title)}</div>` : ''}
      </div>
    </div>`;
  }).join('') + '</div>';

  c.querySelectorAll('[data-letter-id]').forEach(card => {
    card.addEventListener('click', () => openLetterDetail(parseInt(card.dataset.letterId, 10)));
  });
}

async function openLetterDetailLegacy(id) {
  try {
    const l = await api(`/api/letters/${id}`);
    const body = `
      <div class="letter-detail">
        <div class="letter-detail-header">
          ${userAvatarHtml(l.sender, 48)}
          <div class="letter-detail-meta">
            <div class="letter-detail-from">${escapeHtml(l.sender.nickname || l.sender.username)}</div>
            <div class="letter-detail-date">${formatDate(l.created_at)}</div>
          </div>
          <button class="btn btn-danger btn-sm letter-delete-btn" data-id="${l.id}" title="删除信件">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            <span>删除</span>
          </button>
        </div>
        <h3 class="letter-detail-subject">${escapeHtml(l.subject || '(无主题)')}</h3>
        <div class="letter-detail-content">${escapeHtml(l.content || '').replace(/\n/g, '<br>')}</div>
        ${l.diary ? `<div class="letter-detail-diary">
          <div class="attached-diary-label">附带日记：</div>
          <h4>${escapeHtml(l.diary.title || '(无标题)')}</h4>
          <button class="btn btn-ghost btn-sm" data-open-diary="${l.diary.id}">在编辑器中打开</button>
        </div>` : ''}
      </div>
    `;
    showModal(l.subject || '信件', body, null, { hideCancel: true, confirmText: '关闭' });
    const openBtn = document.querySelector('[data-open-diary]');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        closeModal();
        openEditor(l.diary.id);
      });
    }
    const deleteBtn = document.querySelector('.letter-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal('删除信件',
          `<p>确定要删除这封信件吗？</p><p style="color:var(--fg-muted);font-size:13px;margin-top:8px;">此操作无法撤销。</p>`,
          async () => {
            try {
              await api(`/api/letters/${l.id}`, { method: 'DELETE' });
              toast('信件已删除', 'success');
              closeModal();
              loadLettersList(lettersState.tab);
              if (lettersState.tab === 'inbox') updateNavBadges();
            } catch (err) {
              toast(err.message || '删除失败', 'error');
              return false;
            }
          },
          { danger: true, confirmText: '删除' }
        );
      });
    }
    // 如果在收件箱，刷新未读数
    if (lettersState.tab === 'inbox') updateNavBadges();
  } catch (e) { toast(e.message, 'error'); }
}

// 写信弹窗
function openComposeLetterModalLegacy(diaryId, presetRecipientId) {
  const body = `
    <div class="compose-form">
      <div class="form-group">
        <label>收件人</label>
        <select id="compose-recipient" class="filter-select">
          <option value="">选择好友...</option>
        </select>
      </div>
      <div class="form-group">
        <label>主题</label>
        <input type="text" id="compose-subject" class="filter-input" placeholder="信件主题" maxlength="200">
      </div>
      <div class="form-group">
        <label>内容</label>
        <textarea id="compose-content" rows="8" class="compose-textarea" placeholder="写下你想说的话..."></textarea>
      </div>
      <div id="compose-attached-info" style="display:none;" class="compose-attached-info">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span id="compose-attached-text">附带当前日记</span>
      </div>
    </div>
  `;
  showModal('写信', body, async () => {
    const recipientId = parseInt(document.getElementById('compose-recipient').value, 10);
    const subject = document.getElementById('compose-subject').value.trim();
    const content = document.getElementById('compose-content').value;
    if (!recipientId) { toast('请选择收件人', 'error'); return false; }
    if (!content.trim()) { toast('请输入信件内容', 'error'); return false; }
    try {
      const body = { recipientId, subject, content };
      if (diaryId) body.diaryId = diaryId;
      await api('/api/letters', { method: 'POST', body: JSON.stringify(body) });
      toast('信件已发送', 'success');
    } catch (e) { toast(e.message, 'error'); return false; }
  }, { confirmText: '发送' });

  // 加载好友列表
  api('/api/friends').then(data => {
    const sel = document.getElementById('compose-recipient');
    (data.items || []).forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.nickname || f.username} (@${f.username})`;
      if (presetRecipientId === f.id) opt.selected = true;
      sel.appendChild(opt);
    });
  }).catch(e => toast('加载好友列表失败: ' + e.message, 'error'));

  if (diaryId) {
    document.getElementById('compose-attached-info').style.display = '';
    api(`/api/diaries/${diaryId}`).then(d => {
      document.getElementById('compose-attached-text').textContent = '附带日记: ' + (d.title || '(无标题)');
    }).catch(e => toast('加载日记信息失败', 'error'));
  }
}

// ===== 共享日记页面 =====
let sharedState = { tab: 'shared' };

async function loadSharedView() {
  sharedState.tab = 'shared';
  document.querySelectorAll('[data-shared-tab]').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-shared-tab="shared"]').classList.add('active');
  loadSharedList('shared');
}

async function loadSharedList(tab) {
  sharedState.tab = tab;
  const c = document.getElementById('shared-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const endpoint = tab === 'collaborating' ? '/api/diaries/collaborating/list' : '/api/diaries/shared/list';
    const data = await api(endpoint);
    renderSharedList(data.items || [], tab);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderSharedList(items, tab) {
  const c = document.getElementById('shared-content');
  if (!items.length) {
    c.innerHTML = `<div class="empty-state"><p>${tab === 'collaborating' ? '暂无协作日记' : '暂无好友分享的日记'}</p></div>`;
    return;
  }
  c.innerHTML = '<div class="diary-list">' + items.map(d => {
    const author = {
      id: d.author_id, username: d.author_username, nickname: d.author_nickname, avatar: d.author_avatar
    };
    const preview = (d.content || '').replace(/[#*`>\-\[\]]/g, '').slice(0, 120);
    const visLabel = { public: '公开', friends: '好友可见', specific: '指定可见' }[d.visibility] || '';
    return `<div class="diary-card shared-diary-card" data-open-shared="${d.id}">
      <button class="shared-block-btn" data-block-author="${d.author_id}" data-author-name="${escapeHtml(author.nickname || author.username)}" title="屏蔽该作者" aria-label="屏蔽该作者">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
      </button>
      <div class="diary-card-header">
        ${userAvatarHtml(author, 28)}
        <span class="diary-author">${escapeHtml(author.nickname || author.username)}</span>
        ${visLabel ? `<span class="vis-badge vis-${d.visibility}">${visLabel}</span>` : ''}
        ${d.my_role ? `<span class="role-badge role-${d.my_role}">${d.my_role === 'editor' ? '可编辑' : '只读'}</span>` : ''}
        <span class="diary-date">${formatDate(d.created_at)}</span>
      </div>
      <h3 class="diary-title">${escapeHtml(d.title || '(无标题)')}</h3>
      <p class="diary-preview">${escapeHtml(preview)}${d.content && d.content.length > 120 ? '...' : ''}</p>
      ${(d.tags || []).length ? `<div class="diary-tags">${d.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('') + '</div>';

  c.querySelectorAll('[data-open-shared]').forEach(card => {
    card.addEventListener('click', (e) => {
      // 屏蔽按钮的点击不触发打开日记
      if (e.target.closest('[data-block-author]')) return;
      openEditor(parseInt(card.dataset.openShared, 10));
    });
  });
  c.querySelectorAll('[data-block-author]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const userId = parseInt(btn.dataset.blockAuthor, 10);
      const name = btn.dataset.authorName || '该作者';
      blockAuthor(userId, name);
    });
  });
}

// 屏蔽作者：二次确认后调用 API，刷新当前共享列表
function blockAuthor(userId, name) {
  showModal(
    '屏蔽用户',
    `<p>确定要屏蔽 <strong>${escapeHtml(name)}</strong> 吗？</p><p style="color:var(--fg-muted);font-size:13px;margin-top:8px;">屏蔽后，该用户的笔记将不再出现在共享列表中。你可以在"已屏蔽用户"中取消屏蔽。</p>`,
    async () => {
      try {
        await api('/api/diaries/blocked-users', {
          method: 'POST',
          body: JSON.stringify({ blockedUserId: userId })
        });
        toast(`已屏蔽 ${name}`, 'success');
        // 屏蔽后刷新当前标签：'blocked' 标签用 loadBlockedUsers，其他用 loadSharedList
        if (sharedState.tab === 'blocked') {
          loadBlockedUsers();
        } else {
          loadSharedList(sharedState.tab);
        }
      } catch (e) {
        toast(e.message, 'error');
      }
    },
    { danger: true, confirmText: '屏蔽' }
  );
}

// 已屏蔽用户列表
async function loadBlockedUsers() {
  const c = document.getElementById('shared-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const data = await api('/api/diaries/blocked-users');
    renderBlockedUsers(data.items || []);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderBlockedUsers(items) {
  const c = document.getElementById('shared-content');
  if (!items.length) {
    c.innerHTML = `<div class="empty-state"><p>暂未屏蔽任何用户</p></div>`;
    return;
  }
  c.innerHTML = '<div class="friends-grid blocked-users-grid">' + items.map(u => {
    return `<div class="friend-card blocked-user-card">
      ${userAvatarHtml({ id: u.id, username: u.username, nickname: u.nickname, avatar: u.avatar }, 44)}
      <div class="friend-info">
        <div class="friend-name">${escapeHtml(u.nickname || u.username)}</div>
        <div class="friend-handle">@${escapeHtml(u.username)}</div>
        ${u.blocked_at ? `<div class="friend-status">已于 ${formatDate(u.blocked_at)} 屏蔽</div>` : ''}
      </div>
      <div class="friend-actions">
        <button class="btn btn-ghost btn-sm" data-unblock-user="${u.id}">取消屏蔽</button>
      </div>
    </div>`;
  }).join('') + '</div>';

  c.querySelectorAll('[data-unblock-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = parseInt(btn.dataset.unblockUser, 10);
      unblockUser(uid);
    });
  });
}

// 取消屏蔽
function unblockUser(userId) {
  showModal(
    '取消屏蔽',
    '<p>确定要取消屏蔽该用户吗？取消后，其笔记将重新出现在共享列表中。</p>',
    async () => {
      try {
        await api(`/api/diaries/blocked-users/${userId}`, { method: 'DELETE' });
        toast('已取消屏蔽', 'success');
        loadBlockedUsers();
      } catch (e) {
        toast(e.message, 'error');
      }
    },
    { confirmText: '取消屏蔽' }
  );
}

// ===== 协作者管理弹窗 =====
async function openCollaboratorModal() {
  if (!state.editingId) {
    // 编辑器有内容时自动保存后再打开协作者管理
    const title = document.getElementById('editor-title').value.trim();
    const content = document.getElementById('editor-textarea').value;
    if (!content.trim() && !title) {
      toast('请先输入日记内容', 'error');
      return;
    }
    toast('正在保存日记...', '');
    await saveDiary();
    if (!state.editingId) return; // 保存失败
  }
  const id = state.editingId;
  const body = `
    <div id="collab-list" class="collab-list">加载中...</div>
    <div class="collab-add-section">
      <h4>添加协作者</h4>
      <select id="collab-add-user" class="filter-select">
        <option value="">选择好友...</option>
      </select>
      <select id="collab-add-role" class="filter-select">
        <option value="editor">可编辑</option>
        <option value="viewer">只读</option>
      </select>
      <button class="btn btn-primary btn-sm" id="collab-add-btn">添加</button>
    </div>
  `;
  showModal('协作者管理', body, null, { hideCancel: true, confirmText: '关闭' });

  // 先绑定"添加"按钮事件（避免 await 期间用户点击无效）
  const addBtn = document.getElementById('collab-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const userId = parseInt(document.getElementById('collab-add-user').value, 10);
      const role = document.getElementById('collab-add-role').value;
      if (!userId) { toast('请选择好友', 'error'); return; }
      try {
        await api(`/api/diaries/${id}/collaborators`, {
          method: 'POST', body: JSON.stringify({ userId, role })
        });
        toast('已添加协作者', 'success');
        openCollaboratorModal();
      } catch (e) { toast(e.message, 'error'); }
    });
  }

  // 加载协作者列表
  try {
    const [collab, friends] = await Promise.all([
      api(`/api/diaries/${id}/collaborators`),
      api('/api/friends')
    ]);
    const list = document.getElementById('collab-list');
    if (!collab.items.length) {
      list.innerHTML = '<p class="search-hint">暂无协作者</p>';
    } else {
      list.innerHTML = collab.items.map(c => `
        <div class="collab-item">
          ${userAvatarHtml(c, 36)}
          <div class="collab-info">
            <div class="collab-name">${escapeHtml(c.nickname || c.username)}</div>
            <div class="collab-role">${c.role === 'editor' ? '可编辑' : '只读'}</div>
          </div>
          <button class="btn btn-ghost btn-sm" data-remove-collab="${c.id}" title="移除">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </button>
        </div>
      `).join('');
      list.querySelectorAll('[data-remove-collab]').forEach(b => {
        b.addEventListener('click', async () => {
          try {
            await api(`/api/diaries/${id}/collaborators/${b.dataset.removeCollab}`, { method: 'DELETE' });
            toast('已移除', '');
            openCollaboratorModal();
          } catch (e) { toast(e.message, 'error'); }
        });
      });
    }
    // 填充好友选择
    const sel = document.getElementById('collab-add-user');
    (friends.items || []).forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.nickname || f.username} (@${f.username})`;
      sel.appendChild(opt);
    });
  } catch (e) {
    const listEl = document.getElementById('collab-list');
    if (listEl) listEl.innerHTML = `<p class="search-hint">${escapeHtml(e.message)}</p>`;
  }
}

// ===== 多选用户弹窗（用于指定可见） =====
function pickUsers(users, title, preselected = []) {
  return new Promise(resolve => {
    let resolved = false;
    const safeResolve = (v) => {
      if (!resolved) { resolved = true; resolve(v); }
    };
    const selectedSet = new Set((preselected || []).map(String));
    const body = `
      <div class="pick-users-list">
        ${users.map(u => `
          <label class="pick-user-item">
            <input type="checkbox" value="${u.id}" ${selectedSet.has(String(u.id)) ? 'checked' : ''}>
            ${userAvatarHtml(u, 32)}
            <span>${escapeHtml(u.nickname || u.username)} <small>@${escapeHtml(u.username)}</small></span>
          </label>
        `).join('')}
      </div>
    `;
    showModal(title || '选择用户', body, () => {
      const checked = Array.from(document.querySelectorAll('.pick-users-list input:checked')).map(c => parseInt(c.value, 10));
      safeResolve(checked);
    }, { confirmText: '确定' });
    // 覆盖取消路径：点击取消/关闭/遮罩时也要 resolve(null)，避免 Promise 永久挂起
    const cancelHandler = () => { closeModal(); safeResolve(null); };
    document.getElementById('modal-cancel').onclick = cancelHandler;
    document.getElementById('modal-close').onclick = cancelHandler;
    document.querySelector('#modal .modal-backdrop').onclick = cancelHandler;
  });
}
// 暴露到 window 供自动化测试使用（生产环境无副作用）
if (typeof window !== 'undefined') window.pickUsers = pickUsers;

// ===== WebSocket 协同编辑 =====
let collabWs = null;
let collabCurrentDiaryId = null;
let collabDebounceTimer = null;
let collabReconnectAttempts = 0;        // 连续失败次数（用于指数退避）
let collabReconnectTimer = null;        // 待执行的重连定时器
const COLLAB_RECONNECT_BASE = 1000;     // 基础间隔 1s
const COLLAB_RECONNECT_MAX = 30000;     // 最大间隔 30s

function collabConnect() {
  if (collabWs && collabWs.readyState === 1) return Promise.resolve();
  if (!state.token) return Promise.reject(new Error('no token'));
  // 页面隐藏时不重连，待 visibilitychange 恢复时再连，避免后台无效连接
  if (document.hidden && collabReconnectAttempts > 0) {
    return Promise.reject(new Error('document hidden'));
  }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return new Promise((resolve, reject) => {
    try {
      collabWs = new WebSocket(`${proto}//${location.host}/collab?token=${state.token}`);
    } catch (e) { reject(e); return; }

    collabWs.onopen = () => {
      collabReconnectAttempts = 0; // 连接成功，重置退避
      resolve();
    };

    collabWs.onmessage = (ev) => {
      let data;
      try { data = JSON.parse(ev.data); } catch { return; }
      if (data.type === 'presence') {
        renderCollabPresence(data.diaryId, data.users);
      } else if (data.type === 'update' && data.diaryId === collabCurrentDiaryId) {
        // 远程更新：同步到编辑器（避免循环）
        const textarea = document.getElementById('editor-textarea');
        const titleInput = document.getElementById('editor-title');
        if (data.field === 'title' && data.title !== undefined && document.activeElement !== titleInput) {
          titleInput.value = data.title;
        } else if (data.content !== undefined && document.activeElement !== textarea) {
          textarea.value = data.content;
          updatePreview();
          updateWordCount();
        } else if (data.title !== undefined && data.content !== undefined) {
          if (document.activeElement !== titleInput) titleInput.value = data.title;
          if (document.activeElement !== textarea) {
            textarea.value = data.content;
            updatePreview();
            updateWordCount();
          }
        }
        setSaveStatus(`${data.username || '协作者'} 已更新`, 'saved');
      } else if (data.type === 'error') {
        console.warn('[Collab]', data.message);
      } else if (data.type === 'message') {
        // 即时消息推送
        handleIncomingWsMessage(data);
      }
    };

    collabWs.onclose = () => {
      collabWs = null;
      // 指数退避重连：1s → 2s → 4s → 8s → 16s → 30s（封顶）
      // 避免服务端故障时高频重连造成"惊群效应"
      if (collabReconnectTimer) clearTimeout(collabReconnectTimer);
      const delay = Math.min(COLLAB_RECONNECT_BASE * Math.pow(2, collabReconnectAttempts), COLLAB_RECONNECT_MAX);
      collabReconnectAttempts++;
      collabReconnectTimer = setTimeout(() => {
        collabReconnectTimer = null;
        if (collabCurrentDiaryId) {
          collabConnect()
            .then(() => { if (collabCurrentDiaryId) collabSendJoin(collabCurrentDiaryId); })
            .catch(() => {});
        }
      }, delay);
    };
    collabWs.onerror = () => {};
  });
}

function collabSend(msg) {
  if (collabWs && collabWs.readyState === 1) {
    collabWs.send(JSON.stringify(msg));
  }
}

function collabSendJoin(diaryId) {
  collabSend({ type: 'join', diaryId });
}

function collabJoin(diaryId) {
  collabCurrentDiaryId = diaryId;
  if (!collabWs || collabWs.readyState !== 1) {
    collabConnect();
    const wait = setInterval(() => {
      if (collabWs && collabWs.readyState === 1) {
        clearInterval(wait);
        collabSendJoin(diaryId);
      }
    }, 200);
    setTimeout(() => clearInterval(wait), 5000);
  } else {
    collabSendJoin(diaryId);
  }
}

function collabLeave(diaryId) {
  collabSend({ type: 'leave', diaryId });
  collabCurrentDiaryId = null;
  const el = document.getElementById('collab-presence');
  if (el) el.style.display = 'none';
}

function collabSendEdit(field, value) {
  if (!collabCurrentDiaryId) return;
  // 防护：仅当协同房间与当前编辑的日记一致时才发送，避免误覆盖
  if (collabCurrentDiaryId !== state.editingId) return;
  clearTimeout(collabDebounceTimer);
  collabDebounceTimer = setTimeout(() => {
    const msg = { type: 'edit', diaryId: collabCurrentDiaryId, field };
    msg[field] = value;
    collabSend(msg);
  }, 500);
}

function renderCollabPresence(diaryId, users) {
  if (diaryId !== collabCurrentDiaryId) return;
  const el = document.getElementById('collab-presence');
  if (!el) return;
  if (!users || !users.length) { el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML = users.slice(0, 5).map(u => {
    const name = u.nickname || u.username || '?';
    return `<div class="collab-avatar" title="${escapeHtml(name)} 在线" style="background:${avatarColor(u.id)};">${escapeHtml(name.charAt(0).toUpperCase())}</div>`;
  }).join('') + (users.length > 5 ? `<div class="collab-avatar collab-more">+${users.length - 5}</div>` : '');
}

document.addEventListener('DOMContentLoaded', init);

// ===== 页面可见性优化 =====
// 用户切换标签页/最小化窗口时暂停高频定时器（心跳/消息轮询/好友刷新），
// 减少后台资源占用与服务端压力；切回时立即触发一次刷新保持数据新鲜。
let _visibilityPaused = {
  heartbeat: false,        // 心跳是否被暂停（原 timer 已被 clear）
  msgPoll: false,          // 消息轮询是否被暂停
  friendsRefresh: false    // 好友刷新是否被暂停
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 进入后台：暂停所有轮询类定时器（不影响协同 WebSocket，让服务端自然清理）
    if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; _visibilityPaused.heartbeat = true; }
    if (typeof msgState !== 'undefined' && msgState.pollTimer) {
      clearInterval(msgState.pollTimer);
      msgState.pollTimer = null;
      _visibilityPaused.msgPoll = true;
    }
    if (typeof friendsRefreshTimer !== 'undefined' && friendsRefreshTimer) {
      clearInterval(friendsRefreshTimer);
      friendsRefreshTimer = null;
      _visibilityPaused.friendsRefresh = true;
    }
  } else {
    // 切回前台：恢复定时器 + 立即触发一次刷新
    if (_visibilityPaused.heartbeat) { startHeartbeat(); _visibilityPaused.heartbeat = false; }
    if (_visibilityPaused.msgPoll && state.currentView === 'messages') {
      if (typeof pollNewMessages === 'function') pollNewMessages();
      if (typeof msgState !== 'undefined') msgState.pollTimer = setInterval(pollNewMessages, 8000);
      _visibilityPaused.msgPoll = false;
    }
    if (_visibilityPaused.friendsRefresh && (state.currentView === 'friends' || (state.currentView === 'messages' && msgState.tab === 'friends'))) {
      if (typeof loadFriendsView === 'function') loadFriendsView();
      _visibilityPaused.friendsRefresh = false;
    }
    // 协同 WebSocket 在前台但已断开时立即重连
    if (collabCurrentDiaryId && (!collabWs || collabWs.readyState !== 1)) {
      if (collabReconnectTimer) { clearTimeout(collabReconnectTimer); collabReconnectTimer = null; }
      collabReconnectAttempts = 0;
      collabConnect()
        .then(() => { if (collabCurrentDiaryId) collabSendJoin(collabCurrentDiaryId); })
        .catch(() => {});
    }
  }
});

// ============================================================
//  日记附件模块
// ============================================================
const ATT_KIND_ICON = { image: 'IMG', pdf: 'PDF', text: 'TXT', document: 'DOC', audio: 'AUD', other: 'FILE' };
const ATT_KIND_LABEL = { image: '图片', pdf: 'PDF', text: '文本', document: '文档', audio: '音频', other: '文件' };

function kindInitial(kind) {
  return ATT_KIND_ICON[kind] || 'FILE';
}

// 刷新编辑器附件徽标
async function refreshAttachmentBadge(diaryId) {
  const badge = document.getElementById('att-count-badge');
  if (!badge) return;
  if (!diaryId) { badge.style.display = 'none'; return; }
  try {
    const data = await api(`/api/diaries/${diaryId}/attachments`);
    const n = (data.items || []).length;
    if (n > 0) {
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  } catch (_) {
    badge.style.display = 'none';
  }
}

// 打开附件管理模态框
async function openAttachmentsModal() {
  const diaryId = state.currentDiary && state.currentDiary.id;
  if (!diaryId) {
    toast('请先打开或新建一篇日记', 'error');
    return;
  }
  const modal = document.getElementById('attachments-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  // 绑定关闭
  modal.querySelectorAll('[data-close="attachments"]').forEach(el => {
    el.onclick = () => { modal.style.display = 'none'; };
  });
  // 加载文件列表 + 当前附件
  await loadAttFilePicker(diaryId);
  await loadAttCurrentList(diaryId);
  // 上传
  const input = document.getElementById('att-upload-input');
  if (input) {
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      await uploadFiles(input.files, null);
      input.value = '';
      await loadAttFilePicker(diaryId);
      toast('文件已上传，可在上方选择添加为附件', 'success');
    };
  }
}

// 加载可选文件列表
async function loadAttFilePicker(diaryId) {
  const box = document.getElementById('att-file-picker');
  if (!box) return;
  box.innerHTML = '<div class="att-loading">加载中…</div>';
  try {
    const data = await api('/api/upload/files?limit=100');
    const items = data.items || [];
    // 取当前已添加附件的 file_id 集合
    let addedIds = new Set();
    try {
      const att = await api(`/api/diaries/${diaryId}/attachments`);
      (att.items || []).forEach(a => addedIds.add(a.file_id));
    } catch (_) {}
    if (!items.length) {
      box.innerHTML = '<div class="att-empty">还没有任何文件，先上传一个吧</div>';
      return;
    }
    box.innerHTML = items.map(f => `
      <div class="att-file-item" data-id="${f.id}">
        <div class="att-file-icon" data-kind="${f.kind}">${kindInitial(f.kind)}</div>
        <div class="att-file-info">
          <div class="att-file-name" title="${escapeHtml(f.original_name || f.filename)}">${escapeHtml(f.original_name || f.filename)}</div>
          <div class="att-file-meta">${escapeHtml(ATT_KIND_LABEL[f.kind] || '文件')} · ${formatFileSize(f.size)}</div>
        </div>
        <button class="att-file-action" data-action="add" data-id="${f.id}">
          ${addedIds.has(f.id) ? '已添加' : '添加'}
        </button>
      </div>
    `).join('');
    box.querySelectorAll('.att-file-action[data-action="add"]').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const fid = parseInt(btn.dataset.id, 10);
        try {
          await api(`/api/diaries/${diaryId}/attachments`, {
            method: 'POST',
            body: JSON.stringify({ fileId: fid })
          });
          toast('已添加附件', 'success');
          await loadAttFilePicker(diaryId);
          await loadAttCurrentList(diaryId);
          refreshAttachmentBadge(diaryId);
        } catch (err) {
          toast('添加失败：' + err.message, 'error');
        }
      };
    });
  } catch (e) {
    box.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

// 加载已添加的附件列表
async function loadAttCurrentList(diaryId) {
  const box = document.getElementById('att-current-list');
  if (!box) return;
  const countEl = document.getElementById('att-current-count');
  box.innerHTML = '<div class="att-loading">加载中…</div>';
  try {
    const data = await api(`/api/diaries/${diaryId}/attachments`);
    const items = data.items || [];
    if (countEl) countEl.textContent = String(items.length);
    if (!items.length) {
      box.innerHTML = '<div class="att-empty">暂无附件</div>';
      return;
    }
    box.innerHTML = items.map(f => `
      <div class="att-file-item" data-id="${f.file_id}">
        <div class="att-file-icon" data-kind="${f.kind}">${kindInitial(f.kind)}</div>
        <div class="att-file-info">
          <div class="att-file-name" title="${escapeHtml(f.original_name || f.filename)}">${escapeHtml(f.original_name || f.filename)}</div>
          <div class="att-file-meta">${escapeHtml(ATT_KIND_LABEL[f.kind] || '文件')} · ${formatFileSize(f.size)}</div>
        </div>
        ${f.kind === 'pdf' ? `<button class="att-file-action" data-action="view" data-url="${escapeHtml(f.url)}" data-name="${escapeHtml(f.original_name || f.filename)}">预览</button>` : ''}
        <button class="att-file-action att-remove" data-action="remove" data-id="${f.file_id}">移除</button>
      </div>
    `).join('');
    box.querySelectorAll('.att-file-action[data-action="remove"]').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const fid = parseInt(btn.dataset.id, 10);
        if (!confirm('确定移除该附件？')) return;
        try {
          await api(`/api/diaries/${diaryId}/attachments/${fid}`, { method: 'DELETE' });
          toast('已移除附件', 'success');
          await loadAttFilePicker(diaryId);
          await loadAttCurrentList(diaryId);
          refreshAttachmentBadge(diaryId);
        } catch (err) {
          toast('移除失败：' + err.message, 'error');
        }
      };
    });
    box.querySelectorAll('.att-file-action[data-action="view"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const url = btn.dataset.url;
        const name = btn.dataset.name;
        if (window.openPdfViewerModal) openPdfViewerModal(url, name);
      };
    });
  } catch (e) {
    box.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

// ============================================================
//  我的消息模块
// ============================================================
const msgState = {
  tab: 'chat',
  peerId: null,
  peer: null,
  messages: [],
  conversations: [],
  pollTimer: null,
  searchKeyword: ''
};

// 消息页主 Tab 切换（聊天 / 好友 / 信件）
function switchMsgMainTab(tab) {
  msgState.tab = tab || 'chat';
  document.querySelectorAll('.msg-main-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.msgTab === msgState.tab);
  });
  document.querySelectorAll('.msg-panel[data-msg-panel]').forEach(p => {
    p.style.display = p.dataset.msgPanel === msgState.tab ? '' : 'none';
  });
  if (msgState.tab === 'friends') {
    loadMsgFriendsTab();
  } else if (msgState.tab === 'letters') {
    loadMsgLettersTab();
  }
}

function loadMsgFriendsTab() {
  const c = document.getElementById('msg-friends-content');
  if (!c) return;
  loadFriendsView();
}

function loadMsgLettersTab() {
  const c = document.getElementById('msg-letters-content');
  if (!c) return;
  loadLettersList(lettersState.tab || 'inbox');
}

async function loadMessagesView() {
  await loadMsgConversations();
  await refreshMsgUnreadBadge();
  // 启动轮询
  if (msgState.pollTimer) clearInterval(msgState.pollTimer);
  msgState.pollTimer = setInterval(pollNewMessages, 8000);
  // 绑定事件
  bindMsgEvents();
}

function bindMsgEvents() {
  const sendBtn = document.getElementById('msg-send-btn');
  const input = document.getElementById('msg-input');
  const attachBtn = document.getElementById('msg-attach-btn');
  const backBtn = document.getElementById('msg-back-btn');
  const searchInput = document.getElementById('msg-search-input');
  if (sendBtn) sendBtn.onclick = sendMsg;
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
      }
    };
  }
  if (attachBtn) attachBtn.onclick = openMsgFilePicker;
  const voiceBtn = document.getElementById('msg-voice-btn');
  if (voiceBtn) voiceBtn.onclick = toggleMsgVoice;
  if (backBtn) backBtn.onclick = () => {
    stopMsgVoiceIfRecording();
    msgState.peerId = null;
    document.getElementById('msg-chat-active').style.display = 'none';
    document.getElementById('msg-chat-empty').style.display = '';
    document.querySelector('.messages-layout').classList.remove('has-active-chat');
  };
  if (searchInput) {
    searchInput.oninput = () => {
      msgState.searchKeyword = searchInput.value.trim().toLowerCase();
      renderMsgConversations();
    };
  }
  // 主 Tab 切换
  document.querySelectorAll('.msg-main-tab').forEach(btn => {
    btn.onclick = () => switchMsgMainTab(btn.dataset.msgTab);
  });
  // 好友/写信按钮（合并进消息页后的入口）
  const addFriendBtn = document.getElementById('msg-btn-add-friend');
  if (addFriendBtn) addFriendBtn.onclick = openAddFriendModal;
  const composeLetterBtn = document.getElementById('msg-btn-compose-letter');
  if (composeLetterBtn) composeLetterBtn.onclick = () => openComposeLetterModal(null, null);
  // 信件 Tab（合并面板）
  document.querySelectorAll('#msg-letters-tabs .letter-tab').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#msg-letters-tabs .letter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadLettersList(btn.dataset.tab);
    };
  });
  // 表情包选择器
  const emojiBtn = document.getElementById('msg-emoji-btn');
  if (emojiBtn) emojiBtn.onclick = toggleMsgStickerPicker;
  document.querySelectorAll('.msg-sticker-tab').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.msg-sticker-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.msg-sticker-body[data-sticker-body]').forEach(bd => {
        bd.style.display = bd.dataset.stickerBody === btn.dataset.stickerTab ? '' : 'none';
      });
      if (btn.dataset.stickerTab === 'stickers') loadMsgStickerGrid();
    };
  });
  const stickerUploadBtn = document.getElementById('msg-sticker-upload-btn');
  if (stickerUploadBtn) stickerUploadBtn.onclick = openStickerUploadModal;
}

// ===== 消息表情包（Emoji + 自定义动图表情）=====
const MSG_COMMON_EMOJIS = ['😀','😄','😂','🤣','😊','😍','😘','😜','🤔','😎','🥳','😭','😤','😡','🥺','😱','🤯','😴','👍','👎','👏','🙏','💪','🤝','👌','✌️','🤞','❤️','💔','💯','🔥','✨','🎉','🎂','🌹','🌈','☀️','🍀','🐶','🐱','🦊','🍺','☕','🍜','🏆','🚀','💡','📌','💰'];

function renderMsgEmojiGrid() {
  const grid = document.getElementById('msg-emoji-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="msg-emoji-grid">' + MSG_COMMON_EMOJIS.map(e =>
    `<button type="button" class="msg-emoji-item" data-emoji="${escapeHtml(e)}">${e}</button>`
  ).join('') + '</div>';
  grid.querySelectorAll('.msg-emoji-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('msg-input');
      if (input) {
        const val = input.value + btn.dataset.emoji;
        input.value = val;
        input.focus();
      }
    });
  });
}

function toggleMsgStickerPicker() {
  if (!msgState.peerId) {
    toast('请先选择对话对象', 'error');
    return;
  }
  const panel = document.getElementById('msg-sticker-picker');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = '';
    renderMsgEmojiGrid();
    // 默认切到常用表情
    document.querySelectorAll('.msg-sticker-tab').forEach(b => b.classList.toggle('active', b.dataset.stickerTab === 'emoji'));
    document.querySelectorAll('.msg-sticker-body[data-sticker-body]').forEach(bd => {
      bd.style.display = bd.dataset.stickerBody === 'emoji' ? '' : 'none';
    });
  } else {
    panel.style.display = 'none';
  }
}

async function loadMsgStickerGrid() {
  const grid = document.getElementById('msg-sticker-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="att-loading">加载中…</div>';
  try {
    const data = await api('/api/stickers?limit=500');
    const items = data.items || [];
    if (!items.length) {
      grid.innerHTML = '<div class="att-empty">还没有表情包，点上方按钮上传第一个吧！</div>';
      return;
    }
    grid.innerHTML = items.map(s => `
      <div class="msg-sticker-item" data-sticker-id="${s.id}" data-file-id="${s.file.id || ''}" data-url="${escapeHtml(s.file.url)}" data-name="${escapeHtml(s.name || s.file.original_name || '表情')}" title="${escapeHtml(s.name || s.file.original_name || '表情')}">
        <img src="${escapeHtml(s.file.url)}" alt="${escapeHtml(s.name || '表情')}" loading="lazy" />
        <span class="msg-sticker-item-name">${escapeHtml((s.name || '').slice(0, 8))}</span>
        ${s.mine ? '<button type="button" class="msg-sticker-item-del" title="删除表情包" data-del-sticker="' + s.id + '">×</button>' : ''}
      </div>
    `).join('');
    grid.querySelectorAll('.msg-sticker-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-del-sticker]')) return;
        sendStickerMessage(parseInt(el.dataset.stickerId, 10), parseInt(el.dataset.fileId, 10), el.dataset.url, el.dataset.name || '表情包');
      });
    });
    grid.querySelectorAll('[data-del-sticker]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sid = parseInt(btn.dataset.delSticker, 10);
        showModal('删除表情包', '<p>确定要删除这个表情包吗？</p><p style="color:var(--fg-muted);font-size:13px;margin-top:8px;">已发送的消息中仍会保留该表情。</p>', async () => {
          try {
            await api('/api/stickers/' + sid, { method: 'DELETE' });
            toast('表情包已删除', 'success');
            loadMsgStickerGrid();
          } catch (err) { toast(err.message || '删除失败', 'error'); }
        }, { danger: true, confirmText: '删除' });
      });
    });
  } catch (e) {
    grid.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

async function sendStickerMessage(stickerId, fileId, name) {
  if (!msgState.peerId) {
    toast('请先选择对话对象', 'error');
    return;
  }
  // 通过文件消息发送：file_id 在渲染网格时已写入 DOM，避免额外请求
  if (!fileId) { toast('表情包不存在或已删除', 'error'); return; }
  try {
    await api('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ peerId: msgState.peerId, content: '', fileId })
    });
    document.getElementById('msg-sticker-picker').style.display = 'none';
    toast('表情已发送', 'success');
    await loadMsgHistory(msgState.peerId);
    await loadMsgConversations();
  } catch (e) {
    toast('发送失败：' + e.message, 'error');
  }
}

function openStickerUploadModal() {
  const modal = document.getElementById('sticker-upload-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.querySelectorAll('[data-close="sticker-upload"]').forEach(el => {
    el.onclick = () => { modal.style.display = 'none'; };
  });
  const fileInput = document.getElementById('sticker-upload-file');
  const preview = document.getElementById('sticker-upload-preview');
  fileInput.value = '';
  document.getElementById('sticker-upload-name').value = '';
  document.getElementById('sticker-upload-emoji').value = '';
  preview.style.display = 'none';
  fileInput.onchange = () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) { preview.style.display = 'none'; return; }
    preview.innerHTML = `<div class="sticker-upload-preview-inner"><img src="${URL.createObjectURL(f)}" alt="preview" /><span>${escapeHtml(f.name)} · ${formatFileSize(f.size)}</span></div>`;
    preview.style.display = '';
  };
  const confirmBtn = document.getElementById('sticker-upload-confirm');
  confirmBtn.onclick = async () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) { toast('请选择表情包图片', 'error'); return; }
    const name = document.getElementById('sticker-upload-name').value.trim();
    const emoji = document.getElementById('sticker-upload-emoji').value.trim();
    const fd = new FormData();
    fd.append('file', f);
    fd.append('name', name);
    fd.append('emoji', emoji);
    confirmBtn.disabled = true;
    try {
      await api('/api/stickers', { method: 'POST', body: fd });
      toast('表情包上传成功', 'success');
      modal.style.display = 'none';
      loadMsgStickerGrid();
    } catch (e) {
      toast('上传失败：' + e.message, 'error');
    } finally {
      confirmBtn.disabled = false;
    }
  };
  setTimeout(() => fileInput.focus(), 100);
}

async function loadMsgConversations() {
  const box = document.getElementById('msg-conversations');
  if (!box) return;
  try {
    const data = await api('/api/messages/conversations');
    msgState.conversations = data.items || [];
    // 如果没有会话，显示好友列表作为可发起聊天的对象
    if (msgState.conversations.length === 0) {
      try {
        const fdata = await api('/api/friends');
        msgState.conversations = (fdata.items || []).map(f => ({
          peer: f,
          latest_at: null,
          unread: 0,
          last_message: null
        }));
      } catch (_) {}
    } else {
      // 合并好友中没有聊天记录的（方便发起新聊天）
      let fdata;
      try { fdata = await api('/api/friends'); } catch (_) { fdata = { items: [] }; }
      const existing = new Set(msgState.conversations.map(c => c.peer.id));
      (fdata.items || []).forEach(f => {
        if (!existing.has(f.id)) {
          msgState.conversations.push({ peer: f, latest_at: null, unread: 0, last_message: null });
        }
      });
    }
    renderMsgConversations();
  } catch (e) {
    box.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

function renderMsgConversations() {
  const box = document.getElementById('msg-conversations');
  if (!box) return;
  let list = msgState.conversations || [];
  if (msgState.searchKeyword) {
    list = list.filter(c => {
      const name = (c.peer.nickname || c.peer.username || '').toLowerCase();
      return name.includes(msgState.searchKeyword);
    });
  }
  // 排序：有最后消息的在前，按 latest_at 倒序
  list.sort((a, b) => {
    if (!a.latest_at && !b.latest_at) return 0;
    if (!a.latest_at) return 1;
    if (!b.latest_at) return -1;
    return b.latest_at.localeCompare(a.latest_at);
  });
  if (!list.length) {
    box.innerHTML = '<div class="att-empty">没有匹配的好友</div>';
    return;
  }
  box.innerHTML = list.map(c => {
    const peer = c.peer;
    const isActive = msgState.peerId === peer.id ? ' active' : '';
    const initial = (peer.nickname || peer.username || '?').charAt(0).toUpperCase();
    const avatarHtml = peer.avatar
      ? `<img class="msg-conv-avatar" src="${escapeHtml(peer.avatar)}" alt="" />`
      : `<div class="msg-conv-avatar-ph">${escapeHtml(initial)}</div>`;
    const preview = c.last_message
      ? (c.last_message.content || '[文件]')
      : '点击开始聊天';
    const time = c.latest_at ? formatMsgTime(c.latest_at) : '';
    const unread = c.unread > 0 ? `<span class="msg-conv-unread">${c.unread > 99 ? '99+' : c.unread}</span>` : '';
    return `
      <div class="msg-conv-item${isActive}" data-peer-id="${peer.id}">
        ${avatarHtml}
        <div class="msg-conv-main">
          <div class="msg-conv-top">
            <span class="msg-conv-name">${escapeHtml(peer.nickname || peer.username || '未知')}</span>
            <span class="msg-conv-time">${time}</span>
          </div>
          <div class="msg-conv-preview">${escapeHtml(preview)}</div>
        </div>
        ${unread}
      </div>
    `;
  }).join('');
  box.querySelectorAll('.msg-conv-item').forEach(el => {
    el.onclick = () => openConversation(parseInt(el.dataset.peerId, 10));
  });
}

async function openConversation(peerId) {
  stopMsgVoiceIfRecording();
  msgState.peerId = peerId;
  // 找到 peer 信息
  const conv = msgState.conversations.find(c => c.peer.id === peerId);
  msgState.peer = conv ? conv.peer : null;
  if (!msgState.peer) {
    try {
      const data = await api('/api/friends');
      msgState.peer = (data.items || []).find(f => f.id === peerId);
    } catch (_) {}
  }
  if (!msgState.peer) {
    toast('无法获取对方信息', 'error');
    return;
  }
  // 渲染头部
  const peerName = msgState.peer.nickname || msgState.peer.username || '未知';
  document.getElementById('msg-peer-name').textContent = peerName;
  const avatar = document.getElementById('msg-peer-avatar');
  if (msgState.peer.avatar) {
    avatar.src = msgState.peer.avatar;
    avatar.style.display = '';
  } else {
    avatar.style.display = 'none';
  }
  document.getElementById('msg-peer-status').textContent = '在线状态加载中…';
  // 加载历史
  await loadMsgHistory(peerId);
  // 切换UI
  document.getElementById('msg-chat-empty').style.display = 'none';
  document.getElementById('msg-chat-active').style.display = '';
  document.querySelector('.messages-layout').classList.add('has-active-chat');
  renderMsgConversations();
  // 在线状态
  const online = typeof isUserOnlineLocal === 'function' ? isUserOnlineLocal(peerId) : null;
  const statusEl = document.getElementById('msg-peer-status');
  if (online === true) statusEl.textContent = '在线';
  else if (online === false) statusEl.textContent = '离线';
  else statusEl.textContent = '';
  // 聚焦输入框
  setTimeout(() => { const inp = document.getElementById('msg-input'); if (inp) inp.focus(); }, 100);
}

async function loadMsgHistory(peerId, beforeId) {
  const box = document.getElementById('msg-messages');
  if (!box) return;
  let url = `/api/messages/with/${peerId}?limit=50`;
  if (beforeId) url += `&before=${beforeId}`;
  try {
    const data = await api(url);
    if (!beforeId) {
      msgState.messages = data.items || [];
      renderMsgMessages();
      scrollMsgToBottom();
    } else {
      // 加载更多，前置
      const prevHeight = box.scrollHeight;
      msgState.messages = (data.items || []).concat(msgState.messages);
      renderMsgMessages();
      box.scrollTop = box.scrollHeight - prevHeight;
    }
    await refreshMsgUnreadBadge();
    await loadMsgConversations();
  } catch (e) {
    box.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

function renderMsgMessages() {
  const box = document.getElementById('msg-messages');
  if (!box) return;
  const meId = state.user && state.user.id;
  if (!msgState.messages.length) {
    box.innerHTML = '<div class="att-empty">暂无消息，发送第一条吧</div>';
    return;
  }
  // 加载更多按钮
  const moreHtml = msgState.messages.length >= 50
    ? `<div class="msg-load-more" id="msg-load-more">加载更早消息</div>`
    : '';
  box.innerHTML = moreHtml + msgState.messages.map(m => {
    const mine = m.sender_id === meId;
    const time = formatMsgTime(m.created_at);
    let hasFile = false;
    let fileHtml = '';

    if (m.file_id) {
      hasFile = true;
      const rawFname = m.file_original_name || m.file_filename || '文件';
      const fname = fixChineseFilenameFront(rawFname);
      const fkind = m.file_kind || 'other';
      const furl = m.file_url || '#';
      const isImg = fkind === 'image' || /\.(jpe?g|png|gif|webp|svg)$/i.test(furl);
      const isAudio = fkind === 'audio' || /\.(mp3|wav|ogg|oga|m4a|aac|opus|flac|webm|weba)$/i.test(furl);

      if (isImg && furl !== '#') {
        fileHtml = `<div class="msg-bubble-media-card" data-preview-file data-file-url="${escapeHtml(furl)}" data-file-name="${escapeHtml(fname)}" title="点击查看高清大图">
          <img src="${escapeHtml(furl)}" class="msg-bubble-media-img" alt="${escapeHtml(fname)}" loading="lazy" />
          <div class="msg-bubble-media-glass">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
        </div>`;
      } else if (isAudio && furl !== '#') {
        // 音频消息：内联播放器（语音消息 / 音频附件均可直接播放）
        const audioMd = '<audio controls src="' + furl + '"></audio>';
        fileHtml = `<div class="msg-bubble-audio-card">
          <div class="msg-audio-icon" title="音频消息">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div class="msg-audio-body">
            <div class="msg-audio-name">${escapeHtml(fname)}</div>
            <audio controls preload="metadata" src="${escapeHtml(furl)}"></audio>
          </div>
          <button class="msg-audio-copy" data-audio-md="${escapeHtml(audioMd)}" title="复制音频代码" data-msg-dl>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>`;
      } else {
        fileHtml = `<div class="msg-bubble-file-card" data-preview-file data-file-url="${escapeHtml(furl)}" data-file-name="${escapeHtml(fname)}" title="点击在线预览或阅读 PDF">
          <div class="msg-file-icon-badge" data-kind="${escapeHtml(fkind)}">${kindInitial(fkind)}</div>
          <div class="msg-file-info">
            <div class="msg-file-name">${escapeHtml(fname)}</div>
            <div class="msg-file-meta">${escapeHtml(fkind.toUpperCase())} 附件 · 点击在线预览/阅读</div>
          </div>
          <a class="msg-file-dl-btn" href="${escapeHtml(furl)}" target="_blank" rel="noopener" data-msg-dl title="下载原文件">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </a>
        </div>`;
      }
    }

    const textContent = (m.content || '').trim();
    // 如果是自动生成的"发送了文件: xxx"，剥离冗余的文本框，直接展现通透大方的图片或 PDF 文件卡片
    const showText = textContent && !(hasFile && /^发送了文件:/.test(textContent));

    if (hasFile && !showText) {
      return `
        <div class="msg-bubble-row ${mine ? 'mine' : 'theirs'}">
          <div class="msg-bubble-container">
            ${fileHtml}
            <div class="msg-bubble-time">${time}</div>
          </div>
        </div>
      `;
    }

    const bubbleInner = showText ? escapeHtml(textContent) : '';
    const fullInner = (bubbleInner && fileHtml) ? (bubbleInner + fileHtml) : (bubbleInner || fileHtml);

    let reactionsHtml = '';
    const reacts = m.reactions || [];
    reactionsHtml = `<div class="msg-reaction-bar">
      ${reacts.map(r => `<span class="msg-reaction-pill ${r.mine ? 'mine' : ''}" data-msg-reaction data-msg-id="${m.id}" data-emoji="${escapeHtml(r.emoji)}">${escapeHtml(r.emoji)} ${r.count}</span>`).join('')}
      <span class="msg-reaction-pill" style="opacity:0.6;" data-msg-reaction data-msg-id="${m.id}" data-emoji="👍">+👍</span>
      <span class="msg-reaction-pill" style="opacity:0.6;" data-msg-reaction data-msg-id="${m.id}" data-emoji="❤️">+❤️</span>
    </div>`;

    return `
      <div class="msg-bubble-row ${mine ? 'mine' : 'theirs'}">
        <div class="msg-bubble-container">
          <div class="msg-bubble ${mine ? 'mine' : 'theirs'}">${fullInner}</div>
          ${reactionsHtml}
          <div class="msg-bubble-time">${time}</div>
        </div>
      </div>
    `;
  }).join('');
  const more = document.getElementById('msg-load-more');
  if (more) more.onclick = () => {
    if (msgState.messages.length > 0) {
      loadMsgHistory(msgState.peerId, msgState.messages[0].id);
    }
  };
  // 文件卡片点击预览 / 表情回应：事件委托绑定（避免内联 onclick 的 XSS 风险）
  box.querySelectorAll('[data-preview-file]').forEach(el => {
    el.addEventListener('click', () => {
      openUniversalFilePreview({ url: el.dataset.fileUrl || '', original_name: el.dataset.fileName || '' });
    });
  });
  box.querySelectorAll('[data-msg-reaction]').forEach(el => {
    el.addEventListener('click', () => {
      toggleMsgReaction(parseInt(el.dataset.msgId, 10), el.dataset.emoji || '');
    });
  });
  // 下载按钮：点击时不触发父级卡片预览（原为内联 onclick stopPropagation）
  box.querySelectorAll('[data-msg-dl]').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });
  // 音频消息：复制音频 Markdown 代码
  box.querySelectorAll('.msg-audio-copy').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const md = el.dataset.audioMd || '';
      if (!md) return;
      navigator.clipboard.writeText(md)
        .then(() => toast('音频代码已复制，可粘贴到日记中', 'success'))
        .catch(() => toast('复制失败', 'error'));
    });
  });
}

function scrollMsgToBottom() {
  const box = document.getElementById('msg-messages');
  if (box) box.scrollTop = box.scrollHeight;
}

// ===== 消息语音发送 =====
const msgVoiceState = { recorder: null, chunks: [], stream: null, timer: null, seconds: 0 };

function updateMsgVoiceUI(recording) {
  const btn = document.getElementById('msg-voice-btn');
  const banner = document.getElementById('msg-voice-recording');
  if (recording) {
    if (btn) { btn.classList.add('recording'); btn.title = '停止录音并发送'; }
    if (banner) banner.style.display = 'flex';
  } else {
    if (btn) { btn.classList.remove('recording'); btn.title = '发送语音'; }
    if (banner) banner.style.display = 'none';
    const timerEl = document.getElementById('msg-voice-timer');
    if (timerEl) timerEl.textContent = '0s';
  }
}

function stopMsgVoiceIfRecording() {
  if (msgVoiceState.recorder && msgVoiceState.recorder.state === 'recording') {
    try { msgVoiceState.recorder.stop(); } catch (_) {}
    return true;
  }
  return false;
}

async function toggleMsgVoice() {
  if (msgVoiceState.recorder && msgVoiceState.recorder.state === 'recording') {
    try { msgVoiceState.recorder.stop(); } catch (_) {}
    return;
  }
  if (!msgState.peerId) {
    toast('请先选择对话对象', 'error');
    return;
  }
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    toast('当前浏览器不支持录音', 'error');
    return;
  }
  try {
    msgVoiceState.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    msgVoiceState.chunks = [];
    msgVoiceState.recorder = new MediaRecorder(msgVoiceState.stream);
    msgVoiceState.recorder.ondataavailable = e => { if (e.data && e.data.size) msgVoiceState.chunks.push(e.data); };
    msgVoiceState.recorder.onstop = async () => {
      if (msgVoiceState.timer) { clearInterval(msgVoiceState.timer); msgVoiceState.timer = null; }
      if (msgVoiceState.stream) msgVoiceState.stream.getTracks().forEach(t => t.stop());
      updateMsgVoiceUI(false);
      const type = msgVoiceState.recorder ? (msgVoiceState.recorder.mimeType || 'audio/webm') : 'audio/webm';
      const blob = new Blob(msgVoiceState.chunks, { type });
      msgVoiceState.recorder = null;
      msgVoiceState.chunks = [];
      if (blob.size < 1024) {
        toast('录音时间太短，未发送', 'warning');
        return;
      }
      toast('正在上传语音...', 'info');
      try {
        const ext = type.includes('mp4') ? '.m4a' : type.includes('ogg') ? '.ogg' : '.webm';
        const file = new File([blob], '语音消息-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + ext, { type });
        const data = await apiUpload(file);
        await api('/api/messages', {
          method: 'POST',
          body: JSON.stringify({ peerId: msgState.peerId, content: '', fileId: data.id })
        });
        await loadMsgHistory(msgState.peerId);
        await loadMsgConversations();
        toast('语音已发送', 'success');
      } catch (e) {
        toast('语音发送失败：' + e.message, 'error');
      }
    };
    msgVoiceState.recorder.start();
    msgVoiceState.seconds = 0;
    const timerEl = document.getElementById('msg-voice-timer');
    if (timerEl) timerEl.textContent = '0s';
    msgVoiceState.timer = setInterval(() => {
      msgVoiceState.seconds += 1;
      if (msgVoiceState.seconds >= 60) {
        try { msgVoiceState.recorder.stop(); } catch (_) {}
        return;
      }
      if (timerEl) timerEl.textContent = msgVoiceState.seconds + 's';
    }, 1000);
    updateMsgVoiceUI(true);
    toast('录音中… 再点麦克风停止并发送', 'info');
  } catch (e) {
    toast('无法访问麦克风：' + (e.name === 'NotAllowedError' ? '请允许麦克风权限' : e.message), 'error');
  }
}

async function sendMsg() {
  const input = document.getElementById('msg-input');
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;
  if (!msgState.peerId) {
    toast('请先选择对话对象', 'error');
    return;
  }
  input.value = '';
  try {
    await api('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ peerId: msgState.peerId, content })
    });
    // 立即追加到本地
    const meId = state.user && state.user.id;
    msgState.messages.push({
      id: Date.now(),
      sender_id: meId,
      recipient_id: msgState.peerId,
      content,
      file_id: null,
      created_at: new Date().toISOString()
    });
    renderMsgMessages();
    scrollMsgToBottom();
    await loadMsgConversations();
  } catch (e) {
    toast('发送失败：' + e.message, 'error');
  }
}

async function openMsgFilePicker() {
  if (!msgState.peerId) {
    toast('请先选择对话对象', 'error');
    return;
  }
  const modal = document.getElementById('msg-file-picker-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.querySelectorAll('[data-close="msg-file-picker"]').forEach(el => {
    el.onclick = () => { modal.style.display = 'none'; };
  });
  const list = document.getElementById('msg-file-picker-list');
  if (!list) return;
  list.innerHTML = '<div class="att-loading">加载中…</div>';
  try {
    const data = await api('/api/upload/files?limit=200');
    const items = data.items || [];
    if (!items.length) {
      list.innerHTML = '<div class="att-empty">没有文件，先到「我的文件」上传</div>';
      return;
    }
    list.innerHTML = items.map(f => `
      <div class="att-file-item" data-id="${f.id}">
        <div class="att-file-icon" data-kind="${f.kind}">${kindInitial(f.kind)}</div>
        <div class="att-file-info">
          <div class="att-file-name" title="${escapeHtml(f.original_name || f.filename)}">${escapeHtml(f.original_name || f.filename)}</div>
          <div class="att-file-meta">${escapeHtml(ATT_KIND_LABEL[f.kind] || '文件')} · ${formatFileSize(f.size)}</div>
        </div>
        <button class="att-file-action" data-action="send" data-id="${f.id}">发送</button>
      </div>
    `).join('');
    list.querySelectorAll('.att-file-action[data-action="send"]').forEach(btn => {
      btn.onclick = async () => {
        const fid = parseInt(btn.dataset.id, 10);
        try {
          await api('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ peerId: msgState.peerId, content: '', fileId: fid })
          });
          modal.style.display = 'none';
          toast('文件已发送', 'success');
          await loadMsgHistory(msgState.peerId);
          await loadMsgConversations();
        } catch (err) {
          toast('发送失败：' + err.message, 'error');
        }
      };
    });
  } catch (e) {
    list.innerHTML = `<div class="att-empty">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

async function refreshMsgUnreadBadge() {
  const badge = document.getElementById('badge-messages');
  const top = document.getElementById('msg-unread-badge');
  try {
    const data = await api('/api/messages/unread/count');
    const n = data.unread || 0;
    if (badge) {
      if (n > 0) {
        badge.textContent = n > 99 ? '99+' : String(n);
        badge.style.display = '';
      } else {
        badge.style.display = 'none';
      }
    }
    if (top) {
      if (n > 0) {
        top.textContent = `${n} 未读`;
        top.style.display = '';
      } else {
        top.style.display = 'none';
      }
    }
  } catch (_) {}
}

// 轮询：刷新未读数与会话列表（仅在消息页面活动时）
async function pollNewMessages() {
  if (state.currentNav !== 'messages' || (typeof msgState !== 'undefined' && msgState.tab !== 'chat')) {
    return;
  }
  await refreshMsgUnreadBadge();
  // 仅当未在某个会话中时才刷新列表
  if (!msgState.peerId) {
    await loadMsgConversations();
  }
}

function formatMsgTime(iso) {
  if (!iso) return '';
  const d = new Date(iso.endsWith('Z') ? iso : iso + 'Z');
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}

// 在线状态本地判定（基于心跳）
function isUserOnlineLocal(userId) {
  // 简化：始终返回null表示未知，避免误导
  return null;
}

// WebSocket 消息接收：通过 collab WS 转发
function handleIncomingWsMessage(payload) {
  if (!payload || payload.type !== 'message') return;
  const data = payload.data;
  if (!data) return;
  // 如果当前正在和发送者聊天，立即追加
  if (msgState.peerId === data.sender_id) {
    msgState.messages.push(data);
    renderMsgMessages();
    scrollMsgToBottom();
    // 自动标记已读
    api(`/api/messages/read/${data.sender_id}`, { method: 'POST' }).catch(() => {});
  }
  // 刷新未读与会话
  refreshMsgUnreadBadge();
  if (state.currentNav === 'messages') {
    loadMsgConversations();
  }
}



// ===== 📅 那年今日 (On This Day / Time Capsule) =====
async function openOnThisDayModal() {
  const modal = document.getElementById('on-this-day-modal');
  const body = document.getElementById('on-this-day-body');
  if (!modal || !body) return;

  modal.style.display = 'flex';
  body.innerHTML = '<div class="att-empty">正在调取往年同期的思考与记忆胶囊...</div>';

  try {
    const res = await api('/api/diaries/on-this-day');
    if (!res.items || !res.items.length) {
      body.innerHTML = '<div class="att-empty" style="padding: 40px 0;">🌟 历史上的今天暂未留下思考碎片，继续记录当下吧！</div>';
      return;
    }

    body.innerHTML = res.items.map(d => {
      const year = new Date(d.created_at).getFullYear();
      const yearsAgo = new Date().getFullYear() - year;
      return `
        <div class="card diary-card" style="margin-bottom: 14px;" data-otd-id="${d.id}" data-otd-item>
          <div class="diary-card-header">
            <h4 class="diary-card-title">${escapeHtml(d.title || '无标题')}</h4>
            <span class="badge" style="background:var(--accent-light);color:var(--accent);">${yearsAgo} 年前的今天 (${year})</span>
          </div>
          <div class="diary-card-preview">${escapeHtml(d.content || '').slice(0, 150)}...</div>
          <div class="diary-card-footer" style="margin-top:8px;font-size:12px;color:var(--fg-muted);">
            <span>${d.mood || '🌱 心情'} · ${d.weather || '☀️ 天气'}</span>
            <span>点击查看完整日记 &rarr;</span>
          </div>
        </div>
      `;
    }).join('');
    // 卡片点击打开对应日记（替代内联 onclick）
    body.querySelectorAll('[data-otd-item]').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.otdId, 10);
        modal.style.display = 'none';
        if (id) openEditor(id);
      });
    });
  } catch (e) {
    body.innerHTML = `<div class="att-empty" style="color:var(--error);">加载失败：${escapeHtml(e.message)}</div>`;
  }
}

// ===== 📋 模态精美模板库 (Rich Template Gallery Engine) =====
const DIARY_TEMPLATES = {
  morning: {
    category: 'daily',
    title: '晨间三件事日记',
    mood: '🌅 积极',
    content: `# 🌅 晨间三件事日记

## 🎯 今日 3 个核心目标
1. [ ] 
2. [ ] 
3. [ ] 

## 关注与感恩事项
- 

## 💡 一句给自己的肯定
`
  },
  ninegrid: {
    category: 'daily',
    title: '曼陀罗九宫格复盘',
    mood: '🧩 充实',
    content: `# 🧩 曼陀罗九宫格思考复盘

| 领域 | 思考与进展 |
|---|---|
| 🏃‍♂️ 健康体能 | |
| 💼 事业工作 | |
| 💰 财务理财 | |
| 📚 学习成长 | |
| 🤝 人际社交 | |
| 🏡 家庭生活 | |
| 🎨 兴趣爱好 | |
| 🧘 心灵修养 | |
| 🌟 年度大愿 | |
`
  },
  weekly: {
    category: 'work',
    title: '周度总结与下周规划',
    mood: '📊 专注',
    content: `# 📊 周度总结与下周规划

## ✨ 本周亮点成就
- 

## 🚧 遇到的阻碍与反思
- 

## 🎯 下周关键行动项
1. 
2. 
`
  },
  reading: {
    category: 'read',
    title: '读书/卡片笔记',
    mood: '📖 思考',
    content: `# 📖 读书卡片笔记

- **书名**: 
- **作者**: 
- **推荐指数**: ⭐⭐⭐⭐⭐

## 💬 精彩金句摘录
> 

## 💡 核心启发与行动
- 
`
  },
  movie: {
    category: 'read',
    title: '电影/剧集影评',
    mood: '🎬 触动',
    content: `# 🎬 电影/剧集观影卡片

- **片名**: 
- **导演/主演**: 
- **观影日期**: 
- **个人评分**: ⭐⭐⭐⭐⭐

## 🍿 剧情高光与画面触动
- 

## 💬 记忆最深台词
> 
`
  },
  okr: {
    category: 'work',
    title: 'OKR 目标进度追踪',
    mood: '🎯 目标',
    content: `# 🎯 OKR 目标进度追踪

## 核心目标 O: 
### 关键结果 KR 1:  (进度: 0%)
### 关键结果 KR 2:  (进度: 0%)
### 关键结果 KR 3:  (进度: 0%)

## 📋 支撑关键行动
- [ ] 
`
  },
  night: {
    category: 'life',
    title: '晚间睡前感恩日记',
    mood: '🌙 平和',
    content: `# 🌙 晚间睡前感恩日记

## 🌟 今天发生的 3 件微小幸运
1. 
2. 
3. 

## 🧘 心情释放与自我关怀
- 
`
  },
  travel: {
    category: 'life',
    title: '旅行/游记回忆清单',
    mood: '✈️ 欢快',
    content: `# ✈️ 旅行游记与美好回忆

- **目的地**: 
- **同行伙伴**: 
- **天气与心情**: 

## 📸 行程高光片段
1. 
2. 

## 🍜 当地美食与新奇体验
- 
`
  }
};

async function applyTemplateToEditor(templateKey, insertMode = 'smart') {
  const modal = document.getElementById('template-gallery-modal');
  if (modal) modal.style.display = 'none';

  const tpl = DIARY_TEMPLATES[templateKey];
  if (!tpl) return;

  // 1. 如果当前不在编辑器视图，或者强制新建模式，自动唤起新日记
  if (state.currentView !== 'editor' || insertMode === 'new') {
    if (typeof openEditor === 'function') {
      await openEditor(null);
    } else {
      showView('editor');
    }
  }

  const editorView = document.getElementById('view-editor');
  if (editorView) editorView.classList.add('active');

  // 2. 轮询等待编辑器 DOM 挂载完成
  let retries = 0;
  while (!document.getElementById('editor-textarea') && retries < 20) {
    await new Promise(r => setTimeout(r, 50));
    retries++;
  }

  const textarea = document.getElementById('editor-textarea');
  const titleInput = document.getElementById('editor-title');
  const moodInput = document.getElementById('editor-mood');

  if (textarea) {
    if (insertMode === 'replace') {
      textarea.value = tpl.content;
    } else {
      textarea.value = (textarea.value ? textarea.value + '\n\n' : '') + tpl.content;
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 智能填写标题与心情
    if (titleInput && (!titleInput.value || titleInput.value === '无标题' || insertMode === 'replace' || insertMode === 'new')) {
      const todayStr = new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
      titleInput.value = `${tpl.title} (${todayStr})`;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (moodInput && (!moodInput.value || insertMode === 'replace' || insertMode === 'new')) {
      moodInput.value = tpl.mood;
      moodInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (typeof _runUpdatePreview === 'function') _runUpdatePreview();
    if (typeof updateWordCount === 'function') updateWordCount();
    textarea.focus();

    toast(`已成功载入【${tpl.title}】模态模板！`, 'success');
  } else {
    toast('开启编辑器失败，请重试', 'error');
  }
}

// ===== 🎨 独立模板工坊 & 自定义模板持久化引擎 =====
const TemplateManager = {
  KEY: 'treeks_custom_templates_v2',

  getCustomTemplates() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomTemplate(tpl) {
    const list = this.getCustomTemplates();
    if (tpl.id) {
      const idx = list.findIndex(t => t.id === tpl.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...tpl, updatedAt: Date.now() };
      } else {
        list.push({ ...tpl, createdAt: Date.now() });
      }
    } else {
      tpl.id = 'tpl_custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      tpl.isCustom = true;
      tpl.createdAt = Date.now();
      list.push(tpl);
    }
    localStorage.setItem(this.KEY, JSON.stringify(list));
    return tpl;
  },

  deleteCustomTemplate(id) {
    let list = this.getCustomTemplates();
    list = list.filter(t => t.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  getAllTemplates() {
    const customList = this.getCustomTemplates();
    const presets = Object.keys(DIARY_TEMPLATES).map(k => {
      const item = DIARY_TEMPLATES[k];
      return {
        id: k,
        name: item.title,
        category: item.category || 'preset',
        icon: item.mood ? item.mood.split(' ')[0] : '🌟',
        desc: item.mood || '官方精选开箱即用模板',
        content: item.content,
        isCustom: false
      };
    });
    return [...customList, ...presets];
  }
};

// 渲染大屏模板工坊网格 (疏朗大方 320px 网格)
let currentTemplateCategory = 'all';
let currentTemplateSearch = '';

function renderTemplatePageGrid(filterCat = currentTemplateCategory, searchQuery = currentTemplateSearch) {
  currentTemplateCategory = filterCat;
  currentTemplateSearch = searchQuery;

  const grid = document.getElementById('template-page-grid');
  if (!grid) return;

  let all = TemplateManager.getAllTemplates();

  // 分类筛选
  if (filterCat === 'custom') {
    all = all.filter(t => t.isCustom);
  } else if (filterCat === 'preset') {
    all = all.filter(t => !t.isCustom);
  } else if (filterCat !== 'all') {
    all = all.filter(t => t.category === filterCat);
  }

  // 搜索关键字
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    all = all.filter(t =>
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.desc && t.desc.toLowerCase().includes(q)) ||
      (t.content && t.content.toLowerCase().includes(q))
    );
  }

  if (all.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🎨</div>
        <h3 style="margin-bottom: 8px; color: var(--fg);">暂无匹配的模板</h3>
        <p style="color: var(--fg-muted); margin-bottom: 20px;">试着新建一份您的专属 Markdown 日记模板吧！</p>
        <button class="btn btn-primary" id="btn-empty-create-template">+ 新建自定义模板</button>
      </div>
    `;
    const btn = document.getElementById('btn-empty-create-template');
    if (btn) btn.addEventListener('click', () => openTemplateEditorModal());
    return;
  }

  const iconMap = {
    sunrise: '🌅',
    grid: '🧩',
    star: '🌟',
    target: '🎯',
    book: '📖',
    code: '💻'
  };

  grid.innerHTML = all.map(t => {
    const displayIcon = iconMap[t.icon] || t.icon || '📝';
    return `
    <div class="template-page-card" data-tpl-id="${t.id}">
      <div class="template-card-top">
        <div class="template-card-icon">${displayIcon}</div>
        <div class="template-card-meta">
          <div class="template-card-name" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</div>
          <span class="template-card-badge ${t.isCustom ? 'badge-custom' : ''}">
            ${t.isCustom ? '✍️ 我的自定义' : '🌟 官方精选'}
          </span>
        </div>
      </div>
      <div class="template-card-desc">${escapeHtml(t.desc || '暂无描述')}</div>
      <div class="template-card-preview-box">${escapeHtml(t.content || '')}</div>
      <div class="template-card-actions">
        <button class="btn btn-primary btn-sm btn-use" data-tpl-use="${t.id}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>
          使用此模板
        </button>
        ${t.isCustom ? `
          <button class="btn btn-ghost btn-sm btn-icon-only" data-tpl-edit="${t.id}" title="编辑模板">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-danger-ghost btn-sm btn-icon-only" data-tpl-del="${t.id}" title="删除模板">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        ` : ''}
      </div>
    </div>
  `;
  }).join('');
  // 模板操作按钮事件（替代内联 onclick）
  grid.querySelectorAll('[data-tpl-use]').forEach(b => {
    b.addEventListener('click', () => useTemplateFromGallery(b.dataset.tplUse));
  });
  grid.querySelectorAll('[data-tpl-edit]').forEach(b => {
    b.addEventListener('click', () => editCustomTemplate(b.dataset.tplEdit));
  });
  grid.querySelectorAll('[data-tpl-del]').forEach(b => {
    b.addEventListener('click', () => deleteCustomTemplateItem(b.dataset.tplDel));
  });
}

// 打开自定义模板编辑 Modal
function openTemplateEditorModal(tplData = null) {
  const modal = document.getElementById('template-editor-modal');
  if (!modal) return;

  const titleEl = document.getElementById('template-editor-title');
  const idInput = document.getElementById('template-edit-id');
  const nameInput = document.getElementById('template-edit-name');
  const catInput = document.getElementById('template-edit-category');
  const iconInput = document.getElementById('template-edit-icon');
  const descInput = document.getElementById('template-edit-desc');
  const contentInput = document.getElementById('template-edit-content');

  if (tplData) {
    titleEl.textContent = '编辑自定义日记模板';
    idInput.value = tplData.id || '';
    nameInput.value = tplData.name || '';
    catInput.value = tplData.category || 'custom';
    iconInput.value = tplData.icon || 'star';
    descInput.value = tplData.desc || '';
    contentInput.value = tplData.content || '';
  } else {
    titleEl.textContent = '新建日记模板';
    idInput.value = '';
    nameInput.value = '';
    catInput.value = 'custom';
    iconInput.value = 'star';
    descInput.value = '';
    contentInput.value = `# 📝 我的自定义日记模板\n\n## 1. 今日核心重点\n- \n\n## 2. 启发与反思\n- \n`;
  }

  modal.style.display = 'flex';
  setTimeout(() => nameInput.focus(), 50);
}

// 关闭模板编辑 Modal
function closeTemplateEditorModal() {
  const modal = document.getElementById('template-editor-modal');
  if (modal) modal.style.display = 'none';
}

// 保存模板
function saveTemplateFromEditor() {
  const nameInput = document.getElementById('template-edit-name');
  const contentInput = document.getElementById('template-edit-content');
  const name = (nameInput.value || '').trim();
  const content = (contentInput.value || '').trim();

  if (!name) {
    toast('请输入模板名称', 'warning');
    nameInput.focus();
    return;
  }
  if (!content) {
    toast('请输入模板默认 Markdown 内容', 'warning');
    contentInput.focus();
    return;
  }

  const id = document.getElementById('template-edit-id').value;
  const category = document.getElementById('template-edit-category').value;
  const icon = document.getElementById('template-edit-icon').value;
  const desc = (document.getElementById('template-edit-desc').value || '').trim();

  TemplateManager.saveCustomTemplate({
    id: id || null,
    name,
    category,
    icon,
    desc,
    content,
    isCustom: true
  });

  closeTemplateEditorModal();
  renderTemplatePageGrid();
  toast(id ? '模板修改已保存！' : '新自定义模板已成功创建！', 'success');
}

// 点击「使用此模板」
async function useTemplateFromGallery(id) {
  const modal = document.getElementById('template-gallery-modal');
  if (modal) modal.style.display = 'none';

  const all = TemplateManager.getAllTemplates();
  const tpl = all.find(t => t.id === id);
  if (!tpl) return;

  const isAlreadyInEditor = (state.currentView === 'editor' || document.getElementById('view-editor')?.classList.contains('active'));

  if (!isAlreadyInEditor) {
    if (typeof openEditor === 'function') {
      await openEditor(null);
    } else {
      showView('editor');
    }
  }

  // 轮询等待编辑器文本框挂载
  let retries = 0;
  while (!document.getElementById('editor-textarea') && retries < 20) {
    await new Promise(r => setTimeout(r, 50));
    retries++;
  }

  const textarea = document.getElementById('editor-textarea');
  const titleInput = document.getElementById('editor-title');

  if (textarea) {
    const hasContent = textarea.value.trim().length > 0;
    // 成功提示文案（末尾统一输出，避免被覆盖）
    let successMsg = `已成功套用模板：${tpl.name}`;

    // 有内容时：光标位置插入 / 无光标追加末尾 / 取消则不执行
    if (hasContent) {
      // 光标是否有位置：编辑器中有过光标停留记录（弹窗打开抢焦点后仍可定位）
      const cur = state.editorCursor;
      const cursorInEditor = cur && typeof cur.start === 'number' && cur.start >= 0 && cur.start <= textarea.value.length;
      const modeDesc = cursorInEditor ? '在光标所在位置插入' : '追加到文章末尾';

      if (!confirm(`当前编辑器中已有日记内容。\n点击【确定】将模板${modeDesc}；\n点击【取消】将放弃本次操作。`)) {
        toast('已取消套用模板，内容保持不变', 'info');
        return;
      }

      if (cursorInEditor) {
        // 在光标处插入模板内容
        const pos = cur.start;
        const end = typeof cur.end === 'number' && cur.end >= pos ? cur.end : pos;
        textarea.value = textarea.value.slice(0, pos) + tpl.content + textarea.value.slice(end);
        const newPos = pos + tpl.content.length;
        textarea.setSelectionRange(newPos, newPos);
      } else {
        // 光标无位置：追加到文章末尾并提示
        textarea.value = (textarea.value ? textarea.value + '\n\n' : '') + tpl.content;
        successMsg = '光标不在编辑器正文中，模板已追加到文章末尾';
      }
    } else {
      // 空编辑器：直接填入模板
      textarea.value = tpl.content;
    }

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    // 更新光标记录为模板插入后的位置
    state.editorCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };

    if (titleInput && (!titleInput.value || titleInput.value === '无标题' || !isAlreadyInEditor)) {
      const todayStr = new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
      titleInput.value = `${tpl.name} (${todayStr})`;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (typeof _runUpdatePreview === 'function') _runUpdatePreview();
    if (typeof updateWordCount === 'function') updateWordCount();
    textarea.focus();

    toast(successMsg, successMsg.startsWith('光标') ? 'info' : 'success');
  } else {
    toast('载入模板失败，请重试', 'error');
  }
}

// 编辑已有的自定义模板
function editCustomTemplate(id) {
  const all = TemplateManager.getAllTemplates();
  const tpl = all.find(t => t.id === id && t.isCustom);
  if (tpl) {
    openTemplateEditorModal(tpl);
  }
}

// 删除自定义模板
function deleteCustomTemplateItem(id) {
  if (!confirm('确定要删除这个自定义模板吗？')) return;
  TemplateManager.deleteCustomTemplate(id);
  renderTemplatePageGrid();
  toast('已删除自定义模板', 'success');
}

// 在 setupTemplateGalleryEvents 中绑定页面事件
function setupTemplateGalleryEvents() {
  // 新建模板按钮
  const createBtn = document.getElementById('btn-create-custom-template');
  if (createBtn) createBtn.addEventListener('click', () => openTemplateEditorModal());

  // 模态框关闭与保存按钮
  const closeBtn = document.getElementById('btn-close-template-editor');
  const cancelBtn = document.getElementById('btn-cancel-template-editor');
  const saveBtn = document.getElementById('btn-save-template-editor');
  const overlay = document.getElementById('template-editor-overlay');

  if (closeBtn) closeBtn.addEventListener('click', closeTemplateEditorModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeTemplateEditorModal);
  if (overlay) overlay.addEventListener('click', closeTemplateEditorModal);
  if (saveBtn) saveBtn.addEventListener('click', saveTemplateFromEditor);

  // 搜索框（防抖 200ms，避免每次击键全量重渲染）
  const searchInput = document.getElementById('template-search-input');
  if (searchInput) {
    let searchTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        renderTemplatePageGrid(currentTemplateCategory, e.target.value);
      }, 200);
    });
  }

  // 分类 Tabs
  const tabWrap = document.getElementById('template-category-tabs');
  if (tabWrap) {
    tabWrap.querySelectorAll('.template-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabWrap.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat || 'all';
        renderTemplatePageGrid(cat, currentTemplateSearch);
      });
    });
  }
}

// 🌟 Spotlight 快捷指令级【模板选择弹窗】引擎 (仿照快捷指令窗口制作)
let spotlightSelectedIdx = 0;
let spotlightTemplatesCache = [];

function openTemplateGalleryModal() {
  try {
    const modal = document.getElementById('template-gallery-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    const input = document.getElementById('template-spotlight-input');
    const backdrop = document.getElementById('template-gallery-backdrop');
    const goWorkspaceBtn = document.getElementById('btn-spotlight-go-workspace');

    // 关闭按钮事件绑定
    const closeBtn = document.getElementById('btn-close-template-gallery');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        modal.style.display = 'none';
      };
    }

    const kbdBtn = document.getElementById('btn-kbd-close-template-gallery');
    if (kbdBtn) {
      kbdBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        modal.style.display = 'none';
      };
    }

    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e) e.stopPropagation();
        modal.style.display = 'none';
      };
    }
    if (goWorkspaceBtn) {
      goWorkspaceBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        modal.style.display = 'none';
        navigateTo('templates');
      };
    }

    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }

    renderSpotlightTemplateList('');

    // 绑定事件（单次）
    if (input && !input.dataset.boundSpotlight) {
      input.dataset.boundSpotlight = 'true';

      input.addEventListener('input', (e) => {
        renderSpotlightTemplateList(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        const listEl = document.getElementById('template-spotlight-list');
        if (!listEl) return;
        const items = listEl.querySelectorAll('.cmd-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          spotlightSelectedIdx = (spotlightSelectedIdx + 1) % items.length;
          updateSpotlightSelection(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          spotlightSelectedIdx = (spotlightSelectedIdx - 1 + items.length) % items.length;
          updateSpotlightSelection(items);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (items[spotlightSelectedIdx]) {
            items[spotlightSelectedIdx].click();
          }
        } else if (e.key === 'Escape') {
          modal.style.display = 'none';
        }
      });
    }
  } catch (err) {
    console.error('[TemplateModal] Error openTemplateGalleryModal:', err);
  }
}

function updateSpotlightSelection(items) {
  items.forEach((it, idx) => {
    if (idx === spotlightSelectedIdx) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function renderSpotlightTemplateList(query = '') {
  const listEl = document.getElementById('template-spotlight-list');
  if (!listEl) return;

  const all = TemplateManager.getAllTemplates();
  let filtered = all;

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = all.filter(t => 
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.desc && t.desc.toLowerCase().includes(q)) ||
      (t.content && t.content.toLowerCase().includes(q))
    );
  }

  spotlightTemplatesCache = filtered;
  spotlightSelectedIdx = 0;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="cmd-empty" style="padding: 24px; text-align: center; color: var(--fg-muted);">
        没有匹配的日记模板
      </div>
    `;
    return;
  }

  const iconMap = { sunrise: '🌅', grid: '🧩', star: '🌟', target: '🎯', book: '📖', code: '💻' };

  listEl.innerHTML = filtered.map((t, idx) => {
    const icon = iconMap[t.icon] || t.icon || '📝';
    return `
      <div class="cmd-item ${idx === 0 ? 'active' : ''}" data-spotlight-tpl-id="${t.id}">
        <div class="cmd-item-icon" style="font-size: 20px;">${icon}</div>
        <div class="cmd-item-main">
          <div class="cmd-item-title" style="display:flex;align-items:center;gap:8px;">
            <span>${escapeHtml(t.name)}</span>
            <span class="template-card-badge ${t.isCustom ? 'badge-custom' : ''}" style="font-size: 10px; padding: 1px 6px;">
              ${t.isCustom ? '✍️ 我的自定义' : '🌟 官方精选'}
            </span>
          </div>
          <div class="cmd-item-desc">${escapeHtml(t.desc || '快捷 Markdown 骨架框架模板')}</div>
        </div>
        <div class="cmd-item-action" style="font-size:12px;color:var(--accent);">回车套用</div>
      </div>
    `;
  }).join('');

  // 绑定点击事件
  listEl.querySelectorAll('.cmd-item').forEach(item => {
    item.onclick = () => {
      const id = item.dataset.spotlightTplId;
      const modal = document.getElementById('template-gallery-modal');
      if (modal) modal.style.display = 'none';
      useTemplateFromGallery(id);
    };
  });
}

// ⚡ 极速快捷模板应用弹窗引擎 (Quick Template Floating Popover)
function openQuickTemplatePopover() {
  const popover = document.getElementById('quick-template-popover');
  if (!popover) return;

  popover.style.display = 'flex';

  const backdrop = document.getElementById('quick-tpl-backdrop');
  const closeBtn = document.getElementById('quick-tpl-close-btn');
  const goWorkspace = document.getElementById('quick-tpl-go-workspace');
  const searchInput = document.getElementById('quick-tpl-search');

  const closePopover = () => {
    popover.style.display = 'none';
  };

  if (backdrop) backdrop.onclick = closePopover;
  if (closeBtn) closeBtn.onclick = closePopover;
  if (goWorkspace) {
    goWorkspace.onclick = () => {
      closePopover();
      navigateTo('templates');
    };
  }

  if (searchInput) {
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 50);

    if (!searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => {
        renderQuickTemplateList(e.target.value);
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopover();
      });
    }
  }

  renderQuickTemplateList('');
}

function renderQuickTemplateList(query = '') {
  const body = document.getElementById('quick-tpl-body');
  if (!body) return;

  const all = TemplateManager.getAllTemplates();
  let filtered = all;

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = all.filter(t => 
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.desc && t.desc.toLowerCase().includes(q)) ||
      (t.content && t.content.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    body.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--fg-muted); font-size: 13px;">
        未找到匹配的日记模板
      </div>
    `;
    return;
  }

  const iconMap = { sunrise: '🌅', grid: '🧩', star: '🌟', target: '🎯', book: '📖', code: '💻' };

  body.innerHTML = filtered.map(t => {
    const icon = iconMap[t.icon] || t.icon || '📝';
    return `
      <div class="quick-tpl-item" data-quick-tpl-id="${t.id}">
        <div class="quick-tpl-item-icon">${icon}</div>
        <div class="quick-tpl-item-info">
          <div class="quick-tpl-item-name">
            <span>${escapeHtml(t.name)}</span>
            <span style="font-size:10px; opacity:0.8; font-weight:normal;">${t.isCustom ? '✍️ 自定义' : '🌟 官方'}</span>
          </div>
          <div class="quick-tpl-item-desc">${escapeHtml(t.desc || '快捷 Markdown 骨架模板')}</div>
        </div>
        <div class="quick-tpl-item-btn">套用</div>
      </div>
    `;
  }).join('');

  body.querySelectorAll('.quick-tpl-item').forEach(item => {
    item.onclick = () => {
      const id = item.dataset.quickTplId;
      const popover = document.getElementById('quick-template-popover');
      if (popover) popover.style.display = 'none';
      useTemplateFromGallery(id);
    };
  });
}

// ⚡ 全局零死角捕获【模板】按钮点击，唤起极速快捷应用弹窗
document.addEventListener('click', (e) => {
  const tplBtn = e.target.closest('#btn-template-gallery');
  if (tplBtn) {
    e.preventDefault();
    e.stopPropagation();
    openQuickTemplatePopover();
  }
});

// ===== 🔒 私密锁与 PIN 码设置 =====
let currentPinBuffer = '';
let currentLockingDiaryId = null;

function openLockDiaryPrompt() {
  const pin = prompt('请输入 4 位数字密码设置私密保护锁（留空取消加锁）：');
  if (pin === null) return;

  if (pin.trim() === '') {
    if (state.editingId) {
      api(`/api/diaries/${state.editingId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_locked: 0, pin_code: '' })
      }).then(() => toast('已取消该日记的私密锁！', 'success')).catch(e => toast(e.message, 'error'));
    }
    return;
  }

  if (!/^\d{4}$/.test(pin.trim())) {
    toast('私密密码必须为 4 位纯数字！', 'error');
    return;
  }

  if (state.editingId) {
    api(`/api/diaries/${state.editingId}`, {
      method: 'PUT',
      body: JSON.stringify({ is_locked: 1, pin_code: pin.trim() })
    }).then(() => toast('已为当前日记设置私密锁！', 'success')).catch(e => toast(e.message, 'error'));
  }
}

function promptPinUnlock(diaryId) {
  currentLockingDiaryId = diaryId;
  currentPinBuffer = '';
  updatePinDots();
  const modal = document.getElementById('pin-unlock-modal');
  if (modal) modal.style.display = 'flex';

  document.querySelectorAll('.pin-key[data-val]').forEach(key => {
    key.onclick = () => {
      if (currentPinBuffer.length < 4) {
        currentPinBuffer += key.dataset.val;
        updatePinDots();
      }
    };
  });

  const clearBtn = document.getElementById('btn-pin-clear');
  if (clearBtn) clearBtn.onclick = () => {
    currentPinBuffer = '';
    updatePinDots();
  };

  const submitBtn = document.getElementById('btn-pin-submit');
  if (submitBtn) submitBtn.onclick = submitPinUnlock;
}

function updatePinDots() {
  document.querySelectorAll('#pin-dots .pin-dot').forEach((dot, idx) => {
    if (idx < currentPinBuffer.length) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

async function submitPinUnlock() {
  if (currentPinBuffer.length !== 4) {
    toast('请输入完整的 4 位 PIN 码', 'error');
    return;
  }
  try {
    const res = await api(`/api/diaries/${currentLockingDiaryId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ pin: currentPinBuffer })
    });
    document.getElementById('pin-unlock-modal').style.display = 'none';
    toast('解密成功！', 'success');
    openEditor(currentLockingDiaryId);
  } catch (e) {
    toast(`解锁失败：${e.message}`, 'error');
    currentPinBuffer = '';
    updatePinDots();
  }
}

// ===== 😍 消息 Emoji 表情回应微互动 =====
async function toggleMsgReaction(msgId, emoji) {
  try {
    const res = await api(`/api/messages/${msgId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji })
    });
    // 更新本地状态与渲染
    const m = msgState.messages.find(x => x.id === msgId);
    if (m) {
      m.reactions = res.reactions;
      renderMsgMessages();
    }
  } catch (e) {
    toast(`回应失败：${e.message}`, 'error');
  }
}

// ===== 🟢 过去一年情绪贡献热力墙网格渲染 =====
function renderMoodHeatmap(yearHeatmap) {
  const container = document.getElementById('mood-heatmap-grid');
  if (!container) return;

  if (!yearHeatmap || !yearHeatmap.length) {
    container.innerHTML = '<div class="att-empty" style="padding: 20px 0;">坚持写日记，这里将凝聚您的全彩情绪热力墙！</div>';
    return;
  }

  const map = {};
  yearHeatmap.forEach(h => { map[h.date] = h.count; });

  const html = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = map[dateStr] || 0;
    const level = count > 3 ? 4 : count;
    html.push(`<div class="mood-heatmap-cell" data-level="${level}" title="${dateStr}: ${count} 篇日记"></div>`);
  }
  container.innerHTML = html.join('');
}

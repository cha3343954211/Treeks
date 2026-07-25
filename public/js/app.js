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
  try {
    const raw = marked.parse(text);
    return DOMPurify.sanitize(raw, { ADD_ATTR: ['target'] });
  } catch (e) {
    return '<p style="color:#c75450;">Markdown 解析错误</p>';
  }
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
  const d = new Date(s.replace(' ', 'T'));
  if (isNaN(d)) return s;
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return Math.floor(diff/60) + ' 分钟前';
  if (diff < 86400) return Math.floor(diff/3600) + ' 小时前';
  if (diff < 86400*7) return Math.floor(diff/86400) + ' 天前';
  return d.toLocaleDateString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' });
}

// ===== 状态管理 =====
const state = {
  token: localStorage.getItem('treeks_token'),
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
  exportContext: { ids: [], source: 'list' }
};

// 触发文件下载：使用 fetch + Blob，避免 ORB / 导航中止问题
// url: 请求地址；fallbackFilename: 服务端未返回文件名时使用
async function triggerDownload(url, fallbackFilename) {
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
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  try {
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        logout();
        throw new Error(data.error || '登录已过期');
      }
      throw new Error(data.error || `请求失败 (${res.status})`);
    }
    return data;
  } catch (e) {
    if (e.message === 'Failed to fetch') {
      throw new Error('网络连接失败，请检查服务是否运行');
    }
    throw e;
  }
}

async function apiUpload(file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + state.token },
    body: fd
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '上传失败');
  return data;
}

// ===== Toast =====
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.className = 'toast'; }, 2800);
}

// ===== Modal =====
let closeModal = () => {};

function showModal(title, body, onConfirm, opts = {}) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-cancel').style.display = opts.hideCancel ? 'none' : '';
  document.getElementById('modal-confirm').textContent = opts.confirmText || '确定';
  document.getElementById('modal-confirm').className = 'btn ' + (opts.danger ? 'btn-danger' : 'btn-primary');
  modal.style.display = 'flex';
  const confirmBtn = document.getElementById('modal-confirm');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  const backdrop = modal.querySelector('.modal-backdrop');
  closeModal();
  const close = () => { modal.style.display = 'none'; confirmBtn.onclick = null; };
  closeModal = close;
  const onConfirmHandler = () => {
    if (onConfirm) {
      const result = onConfirm();
      // 如果 onConfirm 返回 false（同步），不关闭模态
      if (result === false) return;
      // 如果是 Promise，等待结果；出错时不关闭
      if (result && typeof result.then === 'function') {
        return;
      }
    }
    close();
  };
  confirmBtn.onclick = onConfirmHandler;
  closeBtn.onclick = close;
  cancelBtn.onclick = close;
  backdrop.onclick = close;
}

// ===== 认证 =====
function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('treeks_token', token);
  localStorage.setItem('treeks_user', JSON.stringify(user));
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('treeks_token');
  localStorage.removeItem('treeks_user');
  showAuthView();
}

function showAuthView() {
  document.getElementById('auth-view').style.display = 'flex';
  document.getElementById('main-view').style.display = 'none';
}

function showMainView() {
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('main-view').style.display = 'grid';
  renderUserCard();
  updateAdminNavVisibility();
  navigateTo('list');
  loadTags();
  updateNavBadges();
}

function renderUserCard() {
  if (!state.user) return;
  const name = state.user.nickname || state.user.username;
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-handle').textContent = '@' + state.user.username;
  document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
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
}

function navigateTo(nav) {
  state.currentNav = nav;
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-item[data-nav="${nav}"]`);
  if (btn) btn.classList.add('active');

  // 离开列表时关闭批量选择模式
  if (state.selectMode && nav !== 'list' && nav !== 'pinned') {
    toggleSelectMode(false);
  }

  // 重置筛选
  if (nav === 'list') {
    state.filter = { keyword: '', tag: '', date: '' };
    document.getElementById('search-input').value = '';
    document.getElementById('filter-tag').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('clear-search').style.display = 'none';
    document.getElementById('list-title').textContent = '全部日记';
    showView('list');
    loadDiaries();
  } else if (nav === 'pinned') {
    document.getElementById('list-title').textContent = '置顶日记';
    showView('list');
    loadDiaries({ pinned: true });
  } else if (nav === 'stats') {
    showView('stats');
    loadStats();
  } else if (nav === 'images') {
    showView('images');
    loadImages();
  } else if (nav === 'calendar') {
    showView('calendar');
    loadCalendar();
  } else if (nav === 'friends') {
    showView('friends');
    loadFriendsView();
  } else if (nav === 'letters') {
    showView('letters');
    loadLettersView();
  } else if (nav === 'shared') {
    showView('shared');
    loadSharedView();
  } else if (nav === 'theme') {
    showView('theme');
    loadThemeSettings();
  } else if (nav === 'my-data') {
    showView('my-data');
    loadMyData();
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

// ===== 加载日记列表 =====
async function loadDiaries(opts = {}) {
  const params = new URLSearchParams();
  if (state.filter.keyword) params.set('keyword', state.filter.keyword);
  if (state.filter.tag) params.set('tag', state.filter.tag);
  if (state.filter.date) params.set('date', state.filter.date);
  params.set('page', state.page);
  params.set('limit', 15);

  try {
    const data = await api('/api/diaries?' + params.toString());
    state.diaries = data.items;
    state.pages = data.pages;
    state.total = data.total;
    renderDiaryList(data, opts);
  } catch (e) {
    toast(e.message, 'error');
  }
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
    <article class="diary-card ${d.is_pinned ? 'pinned' : ''}" data-id="${d.id}">
      <div class="diary-card-select" style="display:none;">
        <input type="checkbox" class="batch-checkbox" data-id="${d.id}">
      </div>
      <div class="diary-card-header">
        <div class="diary-card-title"><span class="diary-card-title-text">${escapeHtml(d.title || '无标题')}</span></div>
        <div class="diary-card-meta">
          ${d.mood ? `<span class="diary-card-meta-item" title="心情">${escapeHtml(d.mood)}</span>` : ''}
          ${d.weather ? `<span class="diary-card-meta-item" title="天气">${escapeHtml(d.weather)}</span>` : ''}
          <span class="diary-card-meta-item date">${formatDate(d.created_at)}</span>
        </div>
      </div>
      <div class="diary-card-excerpt">${escapeHtml(excerpt(d.content))}</div>
      ${d.tags && d.tags.length ? `
        <div class="diary-card-tags">
          ${d.tags.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
      <div class="diary-card-actions">
        <button class="action-btn pin-btn" data-id="${d.id}" title="${d.is_pinned ? '取消置顶' : '置顶'}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="${d.is_pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L8 6v6L4 16h6v6l2-2 2 2v-6h6l-4-4V6l-4-4z"/></svg>
        </button>
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

  // 绑定事件
  list.querySelectorAll('.diary-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.action-btn')) return;
      if (e.target.closest('.batch-checkbox')) return;
      if (e.target.closest('.diary-card-select')) return;
      if (state.selectMode) {
        const cb = card.querySelector('.batch-checkbox');
        if (cb) {
          cb.checked = !cb.checked;
          updateBatchCount();
        }
        return;
      }
      openEditor(parseInt(card.dataset.id, 10));
    });
  });
  list.querySelectorAll('.pin-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    togglePin(parseInt(b.dataset.id, 10));
  }));
  list.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    openEditor(parseInt(b.dataset.id, 10));
  }));
  list.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    confirmDelete(parseInt(b.dataset.id, 10));
  }));
  list.querySelectorAll('.export-card-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    openExportModal([parseInt(b.dataset.id, 10)]);
  }));
  list.querySelectorAll('.batch-checkbox').forEach(cb => cb.addEventListener('change', updateBatchCount));

  renderPagination(data);
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
  state.editingId = id || null;
  showView('editor');

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
    setSaveStatus('草稿', 'draft');
    state.currentDiary = null;
  }
  updatePreview();
  updateWordCount();
}

function setSaveStatus(text, type) {
  const dot = document.getElementById('save-dot');
  const status = document.getElementById('save-status');
  if (dot) {
    dot.className = 'status-dot ' + (type || 'draft');
  }
  if (status) status.textContent = text;
}

function updatePreview() {
  const text = document.getElementById('editor-textarea').value;
  const preview = document.getElementById('editor-preview');
  preview.innerHTML = renderMarkdown(text);
  highlightCodeIn(preview);
}

function updateWordCount() {
  const text = document.getElementById('editor-textarea').value;
  const count = text.replace(/\s/g, '').length;
  document.getElementById('word-count').textContent = count + ' 字';
}

async function saveDiary() {
  const title = document.getElementById('editor-title').value.trim();
  const content = document.getElementById('editor-textarea').value;
  const mood = document.getElementById('editor-mood').value.trim();
  const weather = document.getElementById('editor-weather').value.trim();
  const tagsStr = document.getElementById('editor-tags').value.trim();
  const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
  const is_pinned = document.getElementById('editor-pinned').checked;
  const visibility = document.getElementById('editor-visibility').value;
  const is_public = visibility === 'public' ? 1 : 0;

  if (!content.trim() && !title) {
    toast('请输入日记标题或内容', 'error');
    return;
  }

  // 如果是指定可见，需要选择用户
  let visibleTo = null;
  if (visibility === 'specific') {
    const friends = await api('/api/friends');
    if (!friends.items.length) {
      toast('请先添加好友才能使用指定可见功能', 'error');
      return;
    }
    visibleTo = await pickUsers(friends.items, '选择可见用户');
    if (visibleTo === null) return; // 取消
  }

  const body = { title, content, mood, weather, tags, is_pinned, is_public, visibility };
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
      toast('已创建', 'success');
    }
    setSaveStatus('已保存 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), 'saved');
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
  ta.setSelectionRange(newStart, newEnd);
  updatePreview();
  updateWordCount();
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
      const data = await apiUpload(file);
      insertAtCursor(data.markdown);
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

    container.innerHTML = `
      <div class="stat-card" style="grid-column: 1 / -1;">
        ${renderHeatmapHTML(heatmap)}
      </div>
      <div class="stat-card">
        <h3>日记总数</h3>
        <div class="stat-value">${summary.total}</div>
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
    `;
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

// ===== 图片库 =====
async function loadImages() {
  const grid = document.getElementById('images-grid');
  grid.innerHTML = '<p style="color:#999;">加载中...</p>';
  try {
    const data = await api('/api/upload/images');
    if (!data.items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-illustration">${ILLUSTRATIONS.emptyImage}</div>
          <h3>暂无图片</h3>
          <p>在写日记时上传的图片会显示在这里</p>
          <div class="empty-decoration">用图片记录每一个精彩瞬间</div>
        </div>`;
      return;
    }
    grid.innerHTML = data.items.map(img => `
      <div class="image-item" data-url="${img.url}">
        <img src="${img.url}" alt="${escapeHtml(img.original_name || '')}" loading="lazy">
        <div class="image-item-actions">
          <button class="image-action copy-btn" data-md="![${escapeHtml(img.original_name || '')}](${img.url})">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:2px;"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            复制MD
          </button>
          <button class="image-action danger del-img-btn" data-id="${img.id}">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:2px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            删除
          </button>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('.copy-btn').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      navigator.clipboard.writeText(b.dataset.md).then(() => toast('已复制 Markdown', 'success'));
    }));
    grid.querySelectorAll('.del-img-btn').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const id = b.dataset.id;
      showModal('删除图片', '确定要删除这张图片吗？', async () => {
        try {
          await api(`/api/upload/images/${id}`, { method: 'DELETE' });
          toast('已删除', 'success');
          loadImages();
        } catch (e) { toast(e.message, 'error'); }
      }, { danger: true, confirmText: '删除' });
    }));
  } catch (e) {
    grid.innerHTML = `<p style="color:#c75450;">${escapeHtml(e.message)}</p>`;
  }
}

// ===== 个人设置 =====
function loadProfileView() {
  showView('profile');
  document.getElementById('profile-username').value = state.user.username;
  document.getElementById('profile-nickname').value = state.user.nickname || '';
  document.getElementById('profile-bio').value = state.user.bio || '';
  loadUserStorage();
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

// ===== 事件绑定 =====
function bindEvents() {
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
      if (state.currentView === 'list') loadDiaries();
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
  document.getElementById('btn-send-letter').addEventListener('click', () => {
    if (!state.editingId) { toast('请先保存日记', 'error'); return; }
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
      loadSharedList(btn.dataset.sharedTab);
    });
  });

  // Markdown 工具栏
  document.querySelectorAll('.tool-btn[data-md]').forEach(btn => {
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
      // 切换到预览或分屏时刷新预览
      if (mode === 'preview' || mode === 'split') {
        updatePreview();
      }
    });
  });

  // 编辑器实时预览
  const textarea = document.getElementById('editor-textarea');
  let typingTimer;
  textarea.addEventListener('input', () => {
    updatePreview();
    updateWordCount();
    setSaveStatus('编辑中…', 'saving');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      setSaveStatus('未保存', 'draft');
    }, 800);
    // 协同编辑：广播内容变更
    collabSendEdit('content', textarea.value);
  });

  // 标题变更广播
  document.getElementById('editor-title').addEventListener('input', (e) => {
    collabSendEdit('title', e.target.value);
  });

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

  // 图片库上传
  document.getElementById('gallery-upload').addEventListener('change', async e => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    for (const f of files) {
      try { await apiUpload(f); } catch (err) { toast(err.message, 'error'); }
    }
    toast(`已上传 ${files.length} 张图片`, 'success');
    loadImages();
    e.target.value = '';
  });

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
      await downloadFile(url, state.token);
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
async function downloadFile(url, token) {
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
  triggerDownload(blob, filename);
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
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
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
      const dObj = new Date(d.date);
      const label = isNaN(dObj) ? d.date.slice(5) : `${dObj.getMonth() + 1}/${dObj.getDate()}`;
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
            </ul>
          </div>
        </div>
      </div>
    `;

    // 绑定事件
    document.getElementById('btn-export-platform-json').onclick = () => {
      toast('正在导出 JSON...', 'success');
      triggerDownload('/api/admin/export/all?images=0');
    };
    document.getElementById('btn-export-platform-zip').onclick = () => {
      toast('正在打包 ZIP（含图片），请稍候...', 'success');
      triggerDownload('/api/admin/export/all?images=1');
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
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-state-illustration">${ILLUSTRATIONS.emptyFilter}</div><h3>加载失败</h3><p>${escapeHtml(e.message)}</p></div>`;
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
    const imgStats = await api('/api/upload/images?limit=1');
    imageCount = imgStats.total || 0;
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
    triggerDownload('/api/diaries/user-data/export?images=0');
  };
  document.getElementById('btn-export-my-zip').onclick = () => {
    toast('正在打包 ZIP（含图片），请稍候...', 'success');
    triggerDownload('/api/diaries/user-data/export?images=1');
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
    // 将热力图日记数据转为按日期映射
    calState.diaries = diaries.weeks || [];
  } catch (e) {
    calState.schedules = [];
    calState.diaries = [];
  }
}

function getDiaryCountForDate(dateStr) {
  // 从热力图数据中查找
  for (const week of calState.diaries) {
    for (const day of (week.days || [])) {
      if (day.date === dateStr) return day.count;
    }
  }
  return 0;
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
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === calState.selectedDate;
    const hasContent = daySchedules.length > 0 || diaryCount > 0;

    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasContent ? 'has-content' : ''}" data-date="${dateStr}">
      <div class="cal-day-num">${d}</div>
      ${diaryCount > 0 ? `<div class="cal-dot cal-dot-diary" title="${diaryCount} 篇日记"></div>` : ''}
      ${daySchedules.slice(0, 3).map(s => `<div class="cal-event" style="border-left-color:${s.color || '#4c995c'}" title="${escapeHtml(s.title)}">${escapeHtml(s.title).slice(0, 8)}${s.start_time ? ' ' + s.start_time.slice(0, 5) : ''}</div>`).join('')}
      ${daySchedules.length > 3 ? `<div class="cal-more">+${daySchedules.length - 3}</div>` : ''}
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

  let html = '';

  if (diaryCount > 0) {
    html += `
      <div class="day-section">
        <div class="day-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          日记 (${diaryCount})
        </div>
        <a href="#" class="day-link" data-action="view-diaries" data-date="${date}">查看当天日记 →</a>
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

async function editSchedule(id) {
  const s = calState.schedules.find(x => x.id === id);
  if (!s) return;
  showScheduleModal(s.schedule_date, s);
}

function showScheduleModal(defaultDate, existing) {
  const colors = ['#4c995c', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444', '#6b7280'];
  const today = new Date();
  const defaultD = defaultDate || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const body = `
    <div class="form-group">
      <label>标题</label>
      <input type="text" id="sched-title" value="${existing ? escapeHtml(existing.title) : ''}" placeholder="日程标题" required>
    </div>
    <div class="form-group">
      <label>日期</label>
      <input type="date" id="sched-date" value="${existing ? existing.schedule_date : defaultD}">
    </div>
    <div class="form-group" style="display:flex;gap:12px;">
      <div style="flex:1;">
        <label>开始时间</label>
        <input type="time" id="sched-start" value="${existing && existing.start_time ? existing.start_time.slice(0, 5) : ''}">
      </div>
      <div style="flex:1;">
        <label>结束时间</label>
        <input type="time" id="sched-end" value="${existing && existing.end_time ? existing.end_time.slice(0, 5) : ''}">
      </div>
    </div>
    <div class="form-group">
      <label>描述</label>
      <textarea id="sched-desc" rows="2" placeholder="可选">${existing && existing.description ? escapeHtml(existing.description) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>颜色标记</label>
      <div class="color-picker">
        ${colors.map(c => `<label class="color-option"><input type="radio" name="sched-color" value="${c}" ${(!existing || existing.color === c) ? 'checked' : ''}><span class="color-dot" style="background:${c}"></span></label>`).join('')}
      </div>
    </div>
  `;

  showModal(existing ? '编辑日程' : '新建日程', body, async () => {
    const title = document.getElementById('sched-title').value.trim();
    const date = document.getElementById('sched-date').value;
    if (!title || !date) { toast('标题和日期不能为空', 'error'); return false; }
    const payload = {
      title,
      schedule_date: date,
      start_time: document.getElementById('sched-start').value || null,
      end_time: document.getElementById('sched-end').value || null,
      description: document.getElementById('sched-desc').value.trim() || null,
      color: document.querySelector('input[name="sched-color"]:checked')?.value || '#4c995c'
    };
    try {
      if (existing) {
        await api('/api/schedules/' + existing.id, { method: 'PUT', body: JSON.stringify(payload) });
        toast('日程已更新', 'success');
      } else {
        await api('/api/schedules', { method: 'POST', body: JSON.stringify(payload) });
        toast('日程已创建', 'success');
      }
      await loadCalendarData();
      renderCalendar();
      renderDayDetail();
      closeModal();
    } catch (e) { toast(e.message, 'error'); }
    return false; // 阻止自动关闭，由 closeModal 控制
  }, { confirmText: existing ? '保存' : '创建' });
}

// ===== 主题设置 =====
const THEMES = [
  { id: 'green', name: '森林绿', desc: '清新自然，默认主题', colors: ['#4c995c', '#8fc391', '#ebf2eb'] },
  { id: 'blue', name: '海洋蓝', desc: '宁静深邃', colors: ['#3b82f6', '#60a5fa', '#dbeafe'] },
  { id: 'purple', name: '薰衣草', desc: '优雅浪漫', colors: ['#8b5cf6', '#a78bfa', '#ede9fe'] },
  { id: 'orange', name: '暖阳橙', desc: '温暖活力', colors: ['#f59e0b', '#fbbf24', '#fef3c7'] },
  { id: 'pink', name: '樱花粉', desc: '柔和甜美', colors: ['#ec4899', '#f472b6', '#fce7f3'] },
  { id: 'dark', name: '深夜黑', desc: '护眼暗色', colors: ['#10b981', '#34d399', '#1f2937'] },
  { id: 'auto', name: '跟随系统', desc: '根据系统设置自动切换', colors: ['#4c995c', '#8fc391', '#1f2937'] }
];

async function loadThemeSettings() {
  const c = document.getElementById('theme-settings-content');
  const current = state.user?.theme || 'green';
  c.innerHTML = `
    <div class="theme-grid">
      ${THEMES.map(t => `
        <div class="theme-card ${current === t.id ? 'active' : ''}" data-theme="${t.id}">
          <div class="theme-preview">
            <div class="theme-preview-bar" style="background:${t.colors[0]}"></div>
            <div class="theme-preview-body">
              <div class="theme-preview-bg" style="background:${t.colors[2]}"></div>
              <div class="theme-preview-card" style="border-color:${t.colors[1]}">
                <div class="theme-preview-dot" style="background:${t.colors[1]}"></div>
                <div class="theme-preview-line"></div>
                <div class="theme-preview-line short"></div>
              </div>
            </div>
          </div>
          <div class="theme-info">
            <div class="theme-name">${t.name}</div>
            <div class="theme-desc">${t.desc}</div>
            ${current === t.id ? '<span class="badge badge-active">当前使用</span>' : `<button class="btn btn-ghost btn-sm" data-action="apply-theme" data-theme="${t.id}">使用</button>`}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  c.querySelectorAll('[data-action="apply-theme"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const theme = btn.dataset.theme;
      try {
        await api('/api/auth/theme', { method: 'PUT', body: JSON.stringify({ theme }) });
        state.user.theme = theme;
        localStorage.setItem('treeks_user', JSON.stringify(state.user));
        applyTheme(theme);
        toast('主题已切换', 'success');
        loadThemeSettings();
      } catch (e) { toast(e.message, 'error'); }
    });
  });
}

function applyTheme(theme) {
  let resolved = theme;
  // auto 模式根据系统偏好
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolved = prefersDark ? 'dark' : 'green';
  }
  document.documentElement.setAttribute('data-theme', resolved);
  localStorage.setItem('treeks_theme', theme);

  // 同步切换 highlight.js 主题（暗色主题使用 github-dark）
  const hljsLink = document.getElementById('hljs-theme');
  if (hljsLink) {
    const isDark = resolved === 'dark';
    hljsLink.href = isDark
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css';
  }
}

// 监听系统主题变化（auto 模式）
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.user && state.user.theme === 'auto') {
      applyTheme('auto');
    }
  });
}

// ===== 初始化 =====
async function init() {
  bindEvents();
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

    const ls = await api('/api/letters/unread/count');
    const badgeL = document.getElementById('badge-letters');
    if (ls.unread > 0) {
      badgeL.textContent = ls.unread;
      badgeL.style.display = '';
    } else { badgeL.style.display = 'none'; }
  } catch {}
}

// ===== 好友页面 =====
async function loadFriendsView() {
  const c = document.getElementById('friends-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const [friends, requests, sentReqs] = await Promise.all([
      api('/api/friends'),
      api('/api/friends/requests'),
      api('/api/friends/requests/sent')
    ]);
    renderFriendsView(friends.items || [], requests.items || [], sentReqs.items || []);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderFriendsView(friends, requests, sentReqs) {
  const c = document.getElementById('friends-content');
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
      html += `<div class="friend-card">
        ${userAvatarHtml(f, 44)}
        <div class="friend-info">
          <div class="friend-name">${escapeHtml(f.nickname || f.username)}</div>
          <div class="friend-handle">@${escapeHtml(f.username)}</div>
          ${f.bio ? `<div class="friend-bio">${escapeHtml(f.bio)}</div>` : ''}
        </div>
        <div class="friend-actions">
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
  const c = document.getElementById('letters-content');
  c.innerHTML = '<div class="loading-state">加载中...</div>';
  try {
    const data = await api(`/api/letters/${tab}`);
    renderLettersList(data.items || [], tab);
  } catch (e) {
    c.innerHTML = `<div class="empty-state"><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function renderLettersList(items, tab) {
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

async function openLetterDetail(id) {
  try {
    const l = await api(`/api/letters/${id}`);
    const body = `
      <div class="letter-detail">
        <div class="letter-detail-header">
          ${userAvatarHtml(l.sender, 48)}
          <div>
            <div class="letter-detail-from">${escapeHtml(l.sender.nickname || l.sender.username)}</div>
            <div class="letter-detail-date">${formatDate(l.created_at)}</div>
          </div>
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
    // 如果在收件箱，刷新未读数
    if (lettersState.tab === 'inbox') updateNavBadges();
  } catch (e) { toast(e.message, 'error'); }
}

// 写信弹窗
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
  });

  if (diaryId) {
    document.getElementById('compose-attached-info').style.display = '';
    api(`/api/diaries/${diaryId}`).then(d => {
      document.getElementById('compose-attached-text').textContent = '附带日记: ' + (d.title || '(无标题)');
    });
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
    card.addEventListener('click', () => openEditor(parseInt(card.dataset.openShared, 10)));
  });
}

// ===== 协作者管理弹窗 =====
async function openCollaboratorModal() {
  if (!state.editingId) { toast('请先保存日记', 'error'); return; }
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
    document.getElementById('collab-list').innerHTML = `<p class="search-hint">${escapeHtml(e.message)}</p>`;
  }

  document.getElementById('collab-add-btn').addEventListener('click', async () => {
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

// ===== 多选用户弹窗（用于指定可见） =====
function pickUsers(users, title) {
  return new Promise(resolve => {
    const body = `
      <div class="pick-users-list">
        ${users.map(u => `
          <label class="pick-user-item">
            <input type="checkbox" value="${u.id}">
            ${userAvatarHtml(u, 32)}
            <span>${escapeHtml(u.nickname || u.username)} <small>@${escapeHtml(u.username)}</small></span>
          </label>
        `).join('')}
      </div>
    `;
    showModal(title || '选择用户', body, () => {
      const checked = Array.from(document.querySelectorAll('.pick-users-list input:checked')).map(c => parseInt(c.value, 10));
      resolve(checked);
    }, { confirmText: '确定' });
    // 自定义取消：返回 null
    const oldClose = closeModal;
    closeModal = () => {
      closeModal = oldClose;
      closeModal();
      resolve(null);
    };
  });
}

// ===== WebSocket 协同编辑 =====
let collabWs = null;
let collabCurrentDiaryId = null;
let collabDebounceTimer = null;

function collabConnect() {
  if (collabWs && collabWs.readyState === 1) return Promise.resolve();
  if (!state.token) return Promise.reject(new Error('no token'));
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return new Promise((resolve, reject) => {
    try {
      collabWs = new WebSocket(`${proto}//${location.host}/collab?token=${state.token}`);
    } catch (e) { reject(e); return; }

    collabWs.onopen = () => resolve();

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
      }
    };

    collabWs.onclose = () => {
      collabWs = null;
      // 5秒后尝试重连
      setTimeout(() => { if (collabCurrentDiaryId) collabConnect().then(() => { if (collabCurrentDiaryId) collabSendJoin(collabCurrentDiaryId); }).catch(() => {}); }, 5000);
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

// 日期格式化
function formatDate(s) {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T'));
  if (isNaN(d)) return s;
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
  if (diff < 604800) return Math.floor(diff / 86400) + '天前';
  return d.toLocaleDateString('zh-CN');
}

document.addEventListener('DOMContentLoaded', init);

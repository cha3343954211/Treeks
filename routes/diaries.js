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

// 获取日记列表（支持分页、搜索、标签过滤、日期过滤）
router.get('/', (req, res) => {
  const {
    keyword,
    tag,
    date,
    page = 1,
    limit = 20,
    order = 'desc'
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE user_id = ?';
  const params = [req.user.id];

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
    `SELECT id, title, content, mood, weather, tags, is_pinned, is_public, created_at, updated_at
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

// 获取单篇日记
router.get('/:id', (req, res) => {
  const row = db.prepare(
    'SELECT * FROM diaries WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  res.json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public
  });
});

// 创建日记
router.post('/', (req, res) => {
  const { title, content, mood, weather, tags, is_pinned, is_public } = req.body || {};
  const result = db.prepare(
    `INSERT INTO diaries (user_id, title, content, mood, weather, tags, is_pinned, is_public)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.user.id,
    (title || '').trim(),
    content || '',
    mood || null,
    weather || null,
    stringifyTags(tags),
    is_pinned ? 1 : 0,
    is_public ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM diaries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public
  });
});

// 更新日记
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM diaries WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: '日记不存在' });

  const { title, content, mood, weather, tags, is_pinned, is_public } = req.body || {};

  db.prepare(
    `UPDATE diaries SET
       title = COALESCE(?, title),
       content = COALESCE(?, content),
       mood = COALESCE(?, mood),
       weather = COALESCE(?, weather),
       tags = COALESCE(?, tags),
       is_pinned = COALESCE(?, is_pinned),
       is_public = COALESCE(?, is_public),
       updated_at = datetime('now', 'localtime')
     WHERE id = ? AND user_id = ?`
  ).run(
    title !== undefined ? title : null,
    content !== undefined ? content : null,
    mood !== undefined ? mood : null,
    weather !== undefined ? weather : null,
    tags !== undefined ? stringifyTags(tags) : null,
    is_pinned !== undefined ? (is_pinned ? 1 : 0) : null,
    is_public !== undefined ? (is_public ? 1 : 0) : null,
    req.params.id,
    req.user.id
  );

  const row = db.prepare('SELECT * FROM diaries WHERE id = ?').get(req.params.id);
  res.json({
    ...row,
    tags: parseTags(row.tags),
    is_pinned: !!row.is_pinned,
    is_public: !!row.is_public
  });
});

// 删除日记
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM diaries WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: '日记不存在' });
  res.json({ message: '已删除' });
});

// 置顶/取消置顶
router.patch('/:id/pin', (req, res) => {
  const result = db.prepare(
    'UPDATE diaries SET is_pinned = 1 - is_pinned WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: '日记不存在' });
  const row = db.prepare('SELECT is_pinned FROM diaries WHERE id = ?').get(req.params.id);
  res.json({ is_pinned: !!row.is_pinned });
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
      const dateStr = cursor.toISOString().slice(0, 10);
      const inYear = cursor.getFullYear() === year;
      week.push({
        date: dateStr,
        count: inYear ? (map[dateStr] || 0) : 0,
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
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const startFrom = map[today] ? today : (map[yesterday] ? yesterday : null);
  if (startFrom) {
    const cur = new Date(startFrom);
    while (map[cur.toISOString().slice(0, 10)]) {
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
     AND created_at >= datetime('now', 'localtime', '-7 days')
     GROUP BY date ORDER BY date DESC`
  ).all(req.user.id);

  res.json({ total, pinned, moodStats, topTags, recentDays });
});

module.exports = router;

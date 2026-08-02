const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function validDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function validTime(value) {
  return value == null || value === '' || (typeof value === 'string' && TIME_RE.test(value));
}

router.use(authRequired);

// 列出日程（支持按月份查询）
router.get('/', (req, res) => {
  const { month, date } = req.query;
  let where = 'user_id = ?';
  const params = [req.user.id];

  if (month) {
    // month 格式: YYYY-MM
    where += ' AND substr(schedule_date, 1, 7) = ?';
    params.push(month);
  } else if (date) {
    where += ' AND schedule_date = ?';
    params.push(date);
  }

  const rows = db.prepare(
    `SELECT * FROM schedules WHERE ${where} ORDER BY schedule_date ASC, start_time ASC, id ASC`
  ).all(...params);
  res.json({ items: rows });
});

// 创建日程
router.post('/', (req, res) => {
  const { title, description, schedule_date, start_time, end_time, color } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || !validDate(schedule_date)) {
    return res.status(400).json({ error: '标题和日期不能为空' });
  }
  if (title.trim().length > 200 || (description != null && typeof description !== 'string') || !validTime(start_time) || !validTime(end_time)) {
    return res.status(400).json({ error: '日程参数格式无效' });
  }
  if (start_time && end_time && start_time > end_time) {
    return res.status(400).json({ error: '结束时间不能早于开始时间' });
  }
  const result = db.prepare(
    `INSERT INTO schedules (user_id, title, description, schedule_date, start_time, end_time, color)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.user.id,
    title.trim(),
    description ? description.slice(0, 4000) : null,
    schedule_date,
    start_time || null,
    end_time || null,
    COLOR_RE.test(color || '') ? color : '#4c995c'
  );
  const row = db.prepare('SELECT * FROM schedules WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// 更新日程
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM schedules WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '日程不存在' });

  const { title, description, schedule_date, start_time, end_time, color, is_done } = req.body || {};
  if (title != null && (typeof title !== 'string' || !title.trim() || title.trim().length > 200)) {
    return res.status(400).json({ error: '标题格式无效' });
  }
  if (description != null && typeof description !== 'string') return res.status(400).json({ error: '描述格式无效' });
  if (schedule_date != null && !validDate(schedule_date)) return res.status(400).json({ error: '日期格式无效' });
  if (!validTime(start_time) || !validTime(end_time)) return res.status(400).json({ error: '时间格式无效' });
  const nextStart = start_time != null ? start_time : row.start_time;
  const nextEnd = end_time != null ? end_time : row.end_time;
  if (nextStart && nextEnd && nextStart > nextEnd) return res.status(400).json({ error: '结束时间不能早于开始时间' });
  if (color != null && (typeof color !== 'string' || !COLOR_RE.test(color))) return res.status(400).json({ error: '颜色格式无效' });
  db.prepare(
    `UPDATE schedules SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       schedule_date = COALESCE(?, schedule_date),
       start_time = COALESCE(?, start_time),
       end_time = COALESCE(?, end_time),
       color = COALESCE(?, color),
       is_done = COALESCE(?, is_done),
       updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title != null ? title.trim() : null,
    description != null ? description.slice(0, 4000) : null,
    schedule_date || null,
    start_time != null ? start_time : null,
    end_time != null ? end_time : null,
    color || null,
    is_done === true || is_done === 1 ? 1 : (is_done === false || is_done === 0 ? 0 : null),
    id
  );
  const updated = db.prepare('SELECT * FROM schedules WHERE id = ?').get(id);
  res.json(updated);
});

// 删除日程
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM schedules WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: '日程不存在' });
  db.prepare('DELETE FROM schedules WHERE id = ?').run(id);
  res.json({ message: '日程已删除' });
});

module.exports = router;

const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

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
  if (!title || !schedule_date) {
    return res.status(400).json({ error: '标题和日期不能为空' });
  }
  const result = db.prepare(
    `INSERT INTO schedules (user_id, title, description, schedule_date, start_time, end_time, color)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.user.id,
    title.trim(),
    description || null,
    schedule_date,
    start_time || null,
    end_time || null,
    color || '#4c995c'
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
    description != null ? description : null,
    schedule_date || null,
    start_time != null ? start_time : null,
    end_time != null ? end_time : null,
    color || null,
    is_done != null ? (is_done ? 1 : 0) : null,
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

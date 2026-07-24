const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'data', 'treeks.db'));

db.prepare('DELETE FROM diaries WHERE user_id = 2').run();

const dates = [
  '2026-01-05', '2026-01-05', '2026-01-12',
  '2026-02-01', '2026-02-14', '2026-02-14', '2026-02-15',
  '2026-03-08', '2026-03-20',
  '2026-04-10',
  '2026-05-03', '2026-05-03', '2026-05-03',
  '2026-06-12',
  '2026-07-01', '2026-07-15', '2026-07-24'
];

const insert = db.prepare(
  'INSERT INTO diaries (user_id, title, content, mood, weather, tags, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)'
);
for (const d of dates) {
  const dt = d.replace(/-/g, '/') + ' 12:00:00';
  const tags = JSON.stringify(['demo', d.slice(0, 7)]);
  const mood = (d.includes('01') || d.includes('05')) ? '😊' : '😐';
  const content = '# ' + d + '\n\n这是 **' + d + '** 写的日记';
  insert.run(2, d + ' 日记', content, mood, 'sunny', tags, dt, dt);
}
console.log('inserted', dates.length, 'diaries');
console.log('total now:', db.prepare('SELECT COUNT(*) c FROM diaries WHERE user_id = 2').get().c);

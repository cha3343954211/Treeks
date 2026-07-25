require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { initDatabase } = require('./db');

// 初始化数据库
initDatabase();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/auth', require('./routes/auth'));
// 注意：export 路由需在 diaries 之前挂载，避免 /:id 与 /export、/templates 冲突
app.use('/api/diaries', require('./routes/export'));
app.use('/api/diaries', require('./routes/diaries'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/letters', require('./routes/letters'));

// WebSocket 协同编辑
require('./services/collab').setupWebSocket(server);

// 静态文件访问上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 所有其他路由返回 index.html（SPA 支持）
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `上传失败: ${err.message}` });
  }
  res.status(err.status || 500).json({ error: err.message || '服务器内部错误' });
});

server.listen(PORT, () => {
  console.log(`\n🌲 Treeks 日记应用已启动`);
  console.log(`   本地访问: http://localhost:${PORT}`);
  console.log(`   上传目录: ${uploadDir}\n`);
});

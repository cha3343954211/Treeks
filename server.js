require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');

// 启动前引导：读取自定义存储位置并设置 env 变量（必须在 db 加载前执行）
const { bootstrapStorageConfig, getRuntimeUploadDir } = require('./services/storageLocation');
const storageBootstrap = bootstrapStorageConfig();

const { initDatabase } = require('./db');

// 初始化数据库
initDatabase();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// 确保上传目录存在（使用运行时配置的路径）
const uploadDir = getRuntimeUploadDir();
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
// 时区中间件：为 API 响应中的时间字段附加 +08:00 时区标识，解决跨时区显示偏移
app.use(require('./middleware/timezone').timezoneMiddleware);

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

// 静态文件访问上传的图片（使用运行时配置的上传目录）
app.use('/uploads', express.static(getRuntimeUploadDir()));

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
  console.log(`   数据库目录: ${storageBootstrap.dbDir}`);
  console.log(`   上传目录: ${uploadDir}`);
  if (storageBootstrap.customPath) {
    console.log(`   自定义存储位置: ${storageBootstrap.customPath}`);
  } else {
    console.log(`   存储模式: 默认位置`);
  }
  console.log('');
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');

// 启动前引导：读取自定义存储位置并设置 env 变量（必须在 db 加载前执行）
const { bootstrapStorageConfig, getRuntimeUploadDir, DEFAULT_UPLOAD_DIR } = require('./services/storageLocation');
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
// 自定义 fallthrough 静态服务：优先运行时目录，缺失时回退到默认目录
// 这样即使在切换存储位置时（重启前），老路径的图片仍可访问
// 同时：旧版图片 URL 不带子目录（如 /uploads/17/file.png），新版要求 /uploads/17/images/file.png
//   当旧 URL 找不到文件时，自动尝试插入 images/ 子目录
const runtimeUploadDir = getRuntimeUploadDir();
const defaultUploadDir = DEFAULT_UPLOAD_DIR;
app.use('/uploads', (req, res, next) => {
  // 解码 URL 路径
  const relPath = decodeURIComponent(req.path.replace(/^\/+/, ''));
  // 防止路径穿越
  if (relPath.includes('..')) return res.status(400).end('Bad path');
  const tryServe = (base, p = relPath) => {
    const full = path.join(base, p);
    // 防止解析到 base 外
    if (!full.startsWith(path.resolve(base))) return false;
    return fs.existsSync(full) && fs.statSync(full).isFile() ? full : null;
  };
  let found = tryServe(runtimeUploadDir);
  if (!found && runtimeUploadDir !== defaultUploadDir) {
    found = tryServe(defaultUploadDir);
  }
  // 兜底：旧版 URL 不带子目录时（如 17/file.png），尝试插入 images/ 子目录（17/images/file.png）
  if (!found) {
    const m = relPath.match(/^(\d+\/)([^/]+)$/);
    if (m) {
      const withSub = m[1] + 'images/' + m[2];
      found = tryServe(runtimeUploadDir, withSub);
      if (!found && runtimeUploadDir !== defaultUploadDir) {
        found = tryServe(defaultUploadDir, withSub);
      }
    }
  }
  if (!found) return res.status(404).end('Not Found');
  res.setHeader('Cache-Control', 'private, max-age=600');
  fs.createReadStream(found).pipe(res);
});

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

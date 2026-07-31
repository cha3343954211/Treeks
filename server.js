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

// 初始化数据库（必须在加载 middleware/auth 之前完成，因为 auth 在加载时会读写 settings 表）
initDatabase();

// 启动自动备份服务（初始化数据库后立即启动）
require('./services/backup').initBackup();

// auth 中间件需在 DB 初始化后加载（内部 resolveJwtSecret 会查询 settings 表）
const { verifyToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// 确保上传目录存在（使用运行时配置的路径）
const uploadDir = getRuntimeUploadDir();
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 启动时数据目录一致性检查：确保 DB 目录、上传目录均存在且可写
// 防止因配置错误/磁盘故障导致数据写入失败
function checkDataDirConsistency() {
  const dbDir = require('./services/storageLocation').getRuntimeDbDir();
  const uploadDirRuntime = getRuntimeUploadDir();
  const issues = [];

  // 1) DB 目录检查
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true });
      console.warn(`[Startup] DB 目录不存在，已自动创建: ${dbDir}`);
    } catch (e) {
      issues.push(`DB 目录无法创建: ${dbDir} (${e.message})`);
    }
  }
  if (fs.existsSync(dbDir)) {
    try {
      const testFile = path.join(dbDir, '.write-test-' + Date.now());
      fs.writeFileSync(testFile, 'ok');
      fs.unlinkSync(testFile);
    } catch (e) {
      issues.push(`DB 目录不可写: ${dbDir} (${e.message})`);
    }
  }

  // 2) 上传目录检查
  if (!fs.existsSync(uploadDirRuntime)) {
    try {
      fs.mkdirSync(uploadDirRuntime, { recursive: true });
      console.warn(`[Startup] 上传目录不存在，已自动创建: ${uploadDirRuntime}`);
    } catch (e) {
      issues.push(`上传目录无法创建: ${uploadDirRuntime} (${e.message})`);
    }
  }
  if (fs.existsSync(uploadDirRuntime)) {
    try {
      const testFile = path.join(uploadDirRuntime, '.write-test-' + Date.now());
      fs.writeFileSync(testFile, 'ok');
      fs.unlinkSync(testFile);
    } catch (e) {
      issues.push(`上传目录不可写: ${uploadDirRuntime} (${e.message})`);
    }
  }

  // 3) 备份目录检查
  const backupDir = path.join(dbDir, 'backups');
  if (!fs.existsSync(backupDir)) {
    try {
      fs.mkdirSync(backupDir, { recursive: true });
    } catch (e) {
      issues.push(`备份目录无法创建: ${backupDir} (${e.message})`);
    }
  }

  if (issues.length > 0) {
    console.error('[Startup] ⚠ 数据目录一致性检查失败：');
    issues.forEach(i => console.error('  - ' + i));
    console.error('[Startup] 请立即修复上述问题，否则数据可能丢失或服务异常');
  } else {
    console.log(`[Startup] 数据目录一致性检查通过 (DB: ${dbDir}, Uploads: ${uploadDirRuntime})`);
  }
  return issues;
}
checkDataDirConsistency();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// 静态资源缓存：生产环境 7 天，开发环境禁用
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  etag: true,
  lastModified: true,
  immutable: process.env.NODE_ENV === 'production'
}));
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
app.use('/api/messages', require('./routes/messages'));

// WebSocket 协同编辑
require('./services/collab').setupWebSocket(server);

// 静态文件访问上传的图片（使用运行时配置的上传目录）
// 安全：必须通过 token 鉴权才能访问（Cookie/Authorization 头/?token=xxx 三选一）
//   - Cookie：用于 HTML 中 <img src="/uploads/..."> 场景（浏览器自动随请求发送）
//   - Authorization 头：用于 AJAX / fetch 调用
//   - ?token=xxx：用于浏览器直接打开的下载链接
// 自定义 fallthrough 静态服务：优先运行时目录，缺失时回退到默认目录
// 这样即使在切换存储位置时（重启前），老路径的图片仍可访问
// 同时：旧版图片 URL 不带子目录（如 /uploads/17/file.png），新版要求 /uploads/17/images/file.png
//   当旧 URL 找不到文件时，自动尝试插入 images/ 子目录
const runtimeUploadDir = getRuntimeUploadDir();
const defaultUploadDir = DEFAULT_UPLOAD_DIR;
app.use('/uploads', (req, res, next) => {
  // 鉴权：允许正常图片/媒体静态加载（保障 <img> 标签与 Markdown 预览免受 401 误杀）
  const user = verifyToken(req);
  const isPublicMedia = /\.(jpe?g|png|gif|webp|svg|bmp|ico)$/i.test(req.path);
  if (!user && !isPublicMedia) {
    return res.status(401).end('Unauthorized');
  }
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
  // 防 MIME 嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // SVG 强制附件下载，防存储型 XSS
  if (found.toLowerCase().endsWith('.svg')) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment');
  }
  // 文件流读取：注册 error 事件，防止磁盘错误导致请求挂起或文件描述符泄漏
  const stream = fs.createReadStream(found);
  stream.on('error', (e) => {
    console.error('[Uploads] 文件读取失败:', found, e.message);
    if (!res.headersSent) {
      res.status(500).end('文件读取失败');
    } else {
      // 响应已开始发送，只能强制中断
      res.destroy();
    }
    stream.destroy();
  });
  stream.pipe(res);
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
  // 5xx 错误记录完整堆栈，4xx 仅记录消息
  const status = err.status || 500;
  if (status >= 500) {
    console.error('[ERROR]', err.stack || err.message);
  } else {
    console.warn('[WARN]', status, err.message);
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `上传失败: ${err.message}` });
  }
  // 客户端错误（4xx）保留原始 message，服务端错误（5xx）隐藏内部信息
  if (status >= 500) {
    return res.status(500).json({ error: '服务器内部错误，请稍后重试' });
  }
  res.status(status).json({ error: err.message || '请求失败' });
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

// HTTP 服务器超时配置：防止慢客户端耗尽连接池
server.timeout = 60000;          // 请求超时 60s
server.keepAliveTimeout = 5000;  // keep-alive 超时 5s
server.headersTimeout = 65000;   // 头部超时 65s（需大于 keepAliveTimeout）

// ===== 全局异常兜底：防止未捕获的 Promise rejection 崩溃进程 =====
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UnhandledRejection]', reason);
  // 不退出进程，仅记录；生产环境应配合 pm2 日志监控
});

process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err.stack || err.message);
  // 记录后允许进程继续运行；若数据库损坏等严重错误，仍需人工重启
  // 不在此处 process.exit(1)，避免单次请求异常导致整服务中断
});

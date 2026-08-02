// 统一 E2E 测试运行器：自起临时服务器（随机端口 + 隔离数据目录），
// 按顺序运行各 E2E 测试脚本，结束后关闭服务器。
// 用法：node scripts/run-all-e2e.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = parseInt(process.env.TEST_PORT, 10) || 3199 + Math.floor(Math.random() * 500);

// 隔离的数据/上传目录
const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'treeks-e2e-'));
const dbDir = path.join(tmpBase, 'data');
const uploadDir = path.join(tmpBase, 'uploads');
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const tests = [
  { file: 'scripts/test-e2e-full.js', desc: '上传/绑定/静态服务 E2E' },
  { file: 'scripts/test-online-files.js', desc: '新文件 API + 在线状态' },
  { file: 'scripts/test-storage-switch.js', desc: '存储位置切换' }
];

let server = null;
let serverLog = '';
let failed = false;

function waitReady(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const net = require('net');
      const socket = net.connect(PORT, '127.0.0.1');
      socket.on('connect', () => { socket.destroy(); clearInterval(timer); resolve(); });
      socket.on('error', () => {
        if (Date.now() - start > timeoutMs) { clearInterval(timer); reject(new Error('server not ready')); }
      });
    }, 300);
  });
}

function runTest(file) {
  return new Promise((resolve, reject) => {
    console.log(`\n========== 运行 ${file} ==========`);
    const child = spawn(process.execPath, [file], {
      cwd: ROOT,
      env: {
        ...process.env,
        PORT: String(PORT),
        TEST_PORT: String(PORT),
        // 子进程内 require('../db') / require('./db') 必须指向测试库，否则会误写默认数据
        TREEKS_RUNTIME_DB_DIR: dbDir,
        TREEKS_RUNTIME_UPLOAD_DIR: uploadDir
      },
      stdio: ['ignore', 'inherit', 'inherit']
    });
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${file} exited with ${code}`)));
    child.on('error', reject);
  });
}

(async () => {
  try {
    console.log(`[Runner] 启动临时服务器 (port=${PORT})`);
    server = spawn(process.execPath, ['server.js'], {
      cwd: ROOT,
      env: {
        ...process.env,
        PORT: String(PORT),
        NODE_ENV: 'test',
        JWT_SECRET: crypto.randomBytes(48).toString('hex'),
        TREEKS_RUNTIME_DB_DIR: dbDir,
        TREEKS_RUNTIME_UPLOAD_DIR: uploadDir,
        CORS_ORIGINS: ''
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    server.stdout.on('data', d => { serverLog += d; });
    server.stderr.on('data', d => { serverLog += d; });

    await waitReady();
    console.log('[Runner] 服务器就绪\n');

    for (const t of tests) {
      try {
        await runTest(t.file);
        console.log(`[Runner] ✓ ${t.desc}`);
      } catch (e) {
        failed = true;
        console.error(`[Runner] ✗ ${t.desc} 失败: ${e.message}`);
        break;
      }
    }
  } catch (e) {
    failed = true;
    console.error('[Runner] 初始化失败:', e.message);
    console.error(serverLog.split('\n').slice(-15).join('\n'));
  } finally {
    if (server) server.kill('SIGTERM');
    try { fs.rmSync(tmpBase, { recursive: true, force: true }); } catch (_) {}
    if (failed) process.exit(1);
    console.log('\n[Runner] 全部 E2E 测试通过 ✓');
  }
})();

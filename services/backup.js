/**
 * 数据库自动备份服务
 *
 * 策略：
 *  - 启动时备份一次（startup backup）
 *  - 定时备份（默认每 6 小时一次，可通过 BACKUP_INTERVAL_HOURS 环境变量配置）
 *  - 保留最近 N 份备份（默认 7 份，可通过 BACKUP_MAX_KEEP 环境变量配置）
 *  - 备份文件存放在 <dbDir>/backups/ 目录，文件名 treeks_YYYYMMDD_HHmmss.db
 *  - 备份使用 better-sqlite3 的 backup API，确保数据一致性（自动 checkpoint WAL）
 *
 * 安全保障：
 *  - 备份失败不影响主服务运行
 *  - 老备份自动清理，防止磁盘占用无限增长
 *  - 备份目录通过 .gitignore 排除
 */
const fs = require('fs');
const path = require('path');
const { db } = require('../db');
const { getRuntimeDbDir } = require('./storageLocation');

let backupTimer = null;
let isBackingUp = false;  // 防止并发备份

function getBackupDir() {
  return path.join(getRuntimeDbDir(), 'backups');
}

function ensureBackupDir() {
  const dir = getBackupDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function formatTimestamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/**
 * 执行一次数据库备份（异步）
 * better-sqlite3 的 db.backup() 返回 Promise，解析为 { totalPages, remainingPages }
 * @returns {Promise<{ ok: boolean, file?: string, size?: number, error?: string }>}
 */
async function performBackup() {
  if (isBackingUp) {
    return { ok: false, error: '备份正在进行中，跳过本次' };
  }
  isBackingUp = true;
  try {
    const backupDir = ensureBackupDir();
    const backupFile = path.join(backupDir, `treeks_${formatTimestamp()}.db`);

    // 使用 better-sqlite3 内置 backup API（异步 Promise 形式，自动处理 WAL）
    // 完整备份所有页面
    await db.backup(backupFile);

    const size = fs.existsSync(backupFile) ? fs.statSync(backupFile).size : 0;
    console.log(`[Backup] 数据库已备份: ${backupFile} (${(size / 1024).toFixed(1)} KB)`);

    // 清理老备份
    pruneOldBackups();

    return { ok: true, file: backupFile, size };
  } catch (e) {
    console.error('[Backup] 备份失败:', e.message);
    return { ok: false, error: e.message };
  } finally {
    isBackingUp = false;
  }
}

/**
 * 清理老备份，仅保留最近 N 份
 */
function pruneOldBackups() {
  try {
    const backupDir = getBackupDir();
    if (!fs.existsSync(backupDir)) return;
    const maxKeep = parseInt(process.env.BACKUP_MAX_KEEP || '7', 10) || 7;

    const files = fs.readdirSync(backupDir)
      .filter(f => /^treeks_\d{8}_\d{6}\.db$/.test(f))
      .map(f => {
        const full = path.join(backupDir, f);
        const stat = fs.statSync(full);
        return { name: f, path: full, mtime: stat.mtime, size: stat.size };
      })
      .sort((a, b) => b.mtime - a.mtime);  // 新→旧

    if (files.length <= maxKeep) return;

    const toDelete = files.slice(maxKeep);
    let deleted = 0;
    for (const f of toDelete) {
      try {
        fs.unlinkSync(f.path);
        deleted++;
      } catch (_) {}
    }
    if (deleted > 0) {
      console.log(`[Backup] 清理了 ${deleted} 个老备份（保留最近 ${maxKeep} 份）`);
    }
  } catch (e) {
    console.warn('[Backup] 清理老备份失败:', e.message);
  }
}

/**
 * 列出所有备份
 */
function listBackups() {
  try {
    const backupDir = getBackupDir();
    if (!fs.existsSync(backupDir)) return [];
    return fs.readdirSync(backupDir)
      .filter(f => /^treeks_\d{8}_\d{6}\.db$/.test(f))
      .map(f => {
        const full = path.join(backupDir, f);
        const stat = fs.statSync(full);
        // 从文件名解析时间戳
        const m = f.match(/^treeks_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.db$/);
        let createdAt = stat.mtime;
        if (m) {
          createdAt = new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`);
        }
        return {
          filename: f,
          path: full,
          size: stat.size,
          created_at: createdAt,
          download_url: `/api/admin/backups/download/${f}`
        };
      })
      .sort((a, b) => b.created_at - a.created_at);
  } catch (e) {
    return [];
  }
}

/**
 * 启动定时备份
 */
function startScheduledBackup() {
  if (backupTimer) clearInterval(backupTimer);
  const hours = parseFloat(process.env.BACKUP_INTERVAL_HOURS || '6') || 6;
  const intervalMs = hours * 60 * 60 * 1000;
  backupTimer = setInterval(() => {
    performBackup();
  }, intervalMs);
  console.log(`[Backup] 已启用定时备份，每 ${hours} 小时执行一次`);
}

/**
 * 停止定时备份
 */
function stopScheduledBackup() {
  if (backupTimer) {
    clearInterval(backupTimer);
    backupTimer = null;
  }
}

/**
 * 初始化：启动时执行一次备份 + 启动定时器
 * 仅在 BACKUP_ENABLED 未设为 'false' 时启用
 */
function initBackup() {
  if (process.env.BACKUP_ENABLED === 'false') {
    console.log('[Backup] 备份服务已禁用（BACKUP_ENABLED=false）');
    return;
  }
  // 启动后延迟 5 秒执行首次备份，避免与启动过程竞争 IO
  setTimeout(async () => {
    await performBackup();
    startScheduledBackup();
  }, 5000);
}

/**
 * 从指定备份文件恢复数据库（异步）
 * 注意：恢复操作会替换当前数据库文件，需重启服务后才生效
 * @param {string} backupFilename - 备份文件名（不含路径）
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
async function restoreFromBackup(backupFilename) {
  // 安全：文件名仅允许字母数字下划线点
  if (!/^treeks_(?:prerestore_)?\d{8}_\d{6}\.db$/.test(backupFilename)) {
    return { ok: false, message: '备份文件名格式非法' };
  }
  const backupDir = getBackupDir();
  const backupFile = path.join(backupDir, backupFilename);
  if (!fs.existsSync(backupFile)) {
    return { ok: false, message: '备份文件不存在' };
  }
  const dbFile = db.name;
  // 在恢复前先备份当前数据库（防止恢复后才发现错误）
  try {
    const preRestoreBackup = path.join(backupDir, `treeks_prerestore_${formatTimestamp()}.db`);
    await db.backup(preRestoreBackup);
    console.log(`[Backup] 恢复前已保存当前数据库: ${preRestoreBackup}`);
  } catch (e) {
    return { ok: false, message: `恢复前备份失败: ${e.message}` };
  }
  // 关闭当前数据库连接
  try {
    db.close();
  } catch (e) {
    // 忽略关闭错误（可能已关闭）
  }
  // 复制备份文件到主数据库位置
  try {
    fs.copyFileSync(backupFile, dbFile);
    // 删除 WAL/SHM（确保从干净状态启动）
    if (fs.existsSync(dbFile + '-wal')) fs.unlinkSync(dbFile + '-wal');
    if (fs.existsSync(dbFile + '-shm')) fs.unlinkSync(dbFile + '-shm');
  } catch (e) {
    return { ok: false, message: `恢复失败: ${e.message}（请立即重启服务以避免数据不一致）` };
  }
  return {
    ok: true,
    message: `已从 ${backupFilename} 恢复数据库，请立即重启服务使恢复生效`
  };
}

module.exports = {
  performBackup,
  pruneOldBackups,
  listBackups,
  startScheduledBackup,
  stopScheduledBackup,
  initBackup,
  restoreFromBackup,
  getBackupDir
};

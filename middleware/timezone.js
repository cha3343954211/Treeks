// 时区中间件
// 问题：数据库使用 datetime('now','localtime') 存储服务器本地时间（UTC+8），
// 但时间字符串无时区标识，前端 new Date() 按浏览器本地时区解析，
// 当浏览器与服务器时区不一致时（如浏览器 UTC-8，服务器 UTC+8），时间显示偏移。
//
// 解决方案：在 API 响应中，为时间字段附加服务器时区标识 +08:00，
// 让前端 new Date() 正确解析为绝对时间，再按浏览器本地时区显示。

const SERVER_TZ = '+08:00'; // 服务器时区（Asia/Shanghai）

// 需要处理的时间字段名（以 _at 结尾的字段，以及 join_at 等变体）
const TIME_FIELDS = new Set([
  'created_at', 'updated_at', 'read_at', 'joined_at',
  'last_active_at', 'sent_at', 'received_at', 'handled_at',
  'started_at', 'ended_at', 'deleted_at'
]);

/**
 * 将无时区的时间字符串转换为带时区标识的 ISO 字符串
 * '2026-07-25 15:08:45' → '2026-07-25T15:08:45+08:00'
 * '2026-07-25' → '2026-07-25T00:00:00+08:00'
 */
function toISOWithTZ(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return timeStr;
  // 已带时区或已是 ISO 格式，不处理
  if (timeStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  // YYYY-MM-DD HH:MM:SS → YYYY-MM-DDTHH:MM:SS+08:00
  const dateTimeMatch = timeStr.match(/^(\d{4}-\d{2}-\d{2})[ ](\d{2}:\d{2}:\d{2})$/);
  if (dateTimeMatch) return `${dateTimeMatch[1]}T${dateTimeMatch[2]}${SERVER_TZ}`;
  // YYYY-MM-DD → YYYY-MM-DDT00:00:00+08:00
  if (/^\d{4}-\d{2}-\d{2}$/.test(timeStr)) return `${timeStr}T00:00:00${SERVER_TZ}`;
  return timeStr;
}

/**
 * 递归处理对象中所有时间字段，附加时区标识
 */
function processTimes(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(processTimes);
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (TIME_FIELDS.has(key) && typeof obj[key] === 'string') {
          result[key] = toISOWithTZ(obj[key]);
        } else {
          result[key] = processTimes(obj[key]);
        }
      }
    }
    return result;
  }
  return obj;
}

// Express 中间件：拦截 res.json，统一处理时间字段
function timezoneMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    return originalJson.call(this, processTimes(data));
  };
  next();
}

module.exports = { timezoneMiddleware, toISOWithTZ, processTimes, TIME_FIELDS, SERVER_TZ };

// 时区中间件
// 核心思路：数据库统一存储 UTC 时间（datetime('now')），
// 中间件将无时区的时间字符串转换为带 Z 标识的 ISO 字符串，
// 前端 new Date() 正确解析为绝对 UTC 时间，再按浏览器本地时区显示。

// 需要处理的时间字段名
const TIME_FIELDS = new Set([
  'created_at', 'updated_at', 'read_at', 'joined_at',
  'last_active_at', 'sent_at', 'received_at', 'handled_at',
  'started_at', 'ended_at', 'deleted_at'
]);

/**
 * 将无时区的 UTC 时间字符串转换为带 Z 标识的 ISO 字符串
 * '2026-07-25 15:08:45' → '2026-07-25T15:08:45Z'
 */
function toISOWithTZ(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return timeStr;
  if (timeStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  const dateTimeMatch = timeStr.match(/^(\d{4}-\d{2}-\d{2})[ ](\d{2}:\d{2}:\d{2})$/);
  if (dateTimeMatch) return `${dateTimeMatch[1]}T${dateTimeMatch[2]}Z`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(timeStr)) return `${timeStr}T00:00:00Z`;
  return timeStr;
}

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

function timezoneMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    return originalJson.call(this, processTimes(data));
  };
  next();
}

module.exports = { timezoneMiddleware, toISOWithTZ, processTimes, TIME_FIELDS };

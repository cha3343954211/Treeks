const crypto = require('crypto');
const { db } = require('../db');

function getEncryptionKey() {
  const existing = db.prepare('SELECT value FROM settings WHERE key = ?').get('ai_encryption_key');
  if (existing?.value && /^[a-f0-9]{64}$/i.test(existing.value)) {
    return Buffer.from(existing.value, 'hex');
  }
  const generated = crypto.randomBytes(32).toString('hex');
  db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO NOTHING`
  ).run('ai_encryption_key', generated);
  const saved = db.prepare('SELECT value FROM settings WHERE key = ?').get('ai_encryption_key');
  return Buffer.from(saved.value, 'hex');
}

// 独立于登录 JWT 的持久化加密密钥，轮换登录密钥不会导致已有模型失效。
const KEY = getEncryptionKey();

function encryptSecret(value) {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map(part => part.toString('base64')).join('.');
}

function decryptSecret(value) {
  if (!value) return '';
  try {
    const [ivText, tagText, encryptedText] = value.split('.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(ivText, 'base64'));
    decipher.setAuthTag(Buffer.from(tagText, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64')), decipher.final()]).toString('utf8');
  } catch (error) {
    console.error('[AI] 无法解密模型密钥:', error.message);
    return '';
  }
}

function serializeModel(row) {
  return {
    id: row.id,
    name: row.name,
    base_url: row.base_url,
    model: row.model,
    enabled: Boolean(row.enabled),
    is_default: Boolean(row.is_default),
    has_api_key: Boolean(row.api_key_encrypted),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function getLegacyModel() {
  if (!process.env.AI_API_KEY || !process.env.AI_BASE_URL) return null;
  return {
    id: 'environment',
    name: '环境变量默认模型',
    base_url: process.env.AI_BASE_URL.replace(/\/+$/, ''),
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    enabled: true,
    is_default: true,
    source: 'environment',
    api_key: process.env.AI_API_KEY
  };
}

function getAllModels() {
  return db.prepare('SELECT * FROM ai_models ORDER BY is_default DESC, enabled DESC, id DESC').all().map(serializeModel);
}

function getEnabledModels() {
  const models = db.prepare('SELECT * FROM ai_models WHERE enabled = 1 ORDER BY is_default DESC, id DESC').all();
  if (models.length) return models.map(serializeModel);
  const legacy = getLegacyModel();
  return legacy ? [{ ...legacy, has_api_key: true }] : [];
}

function getSelectedModel(id) {
  if (id === 'environment') return getLegacyModel();
  const row = id
    ? db.prepare('SELECT * FROM ai_models WHERE id = ? AND enabled = 1').get(id)
    : db.prepare('SELECT * FROM ai_models WHERE enabled = 1 ORDER BY is_default DESC, id DESC LIMIT 1').get();
  if (!row) return id ? null : getLegacyModel();
  const apiKey = decryptSecret(row.api_key_encrypted);
  if (!apiKey) return null;
  return {
    id: row.id,
    name: row.name,
    base_url: row.base_url,
    model: row.model,
    enabled: Boolean(row.enabled),
    is_default: Boolean(row.is_default),
    api_key: apiKey
  };
}

function normalizeModelInput(input, current = null) {
  const name = typeof input.name === 'string' ? input.name.trim() : current?.name;
  const baseUrl = typeof input.base_url === 'string' ? input.base_url.trim().replace(/\/+$/, '') : current?.base_url;
  const model = typeof input.model === 'string' ? input.model.trim() : current?.model;
  const apiKey = typeof input.api_key === 'string' ? input.api_key.trim() : null;
  if (!name || name.length > 80) throw new Error('模型名称需为 1 到 80 个字符');
  if (!baseUrl || baseUrl.length > 500 || !/^https?:\/\//i.test(baseUrl)) throw new Error('服务地址必须是有效的 http(s) URL');
  if (!model || model.length > 160) throw new Error('模型标识需为 1 到 160 个字符');
  return { name, baseUrl, model, apiKey };
}

module.exports = { encryptSecret, getAllModels, getEnabledModels, getSelectedModel, normalizeModelInput };

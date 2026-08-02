// 共享权限工具：统一好友校验 / 日记权限判断
// 供 routes 与 server.js 复用，避免各文件重复实现相同 SQL
const { db } = require('../db');

// 判断 a 与 b 是否为好友（a → b 方向）
function isFriend(a, b) {
  return !!db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(a, b);
}

// 判断 user 是否可读某篇日记
// diary 需包含 user_id、visibility 字段（完整行亦可）
function canReadDiary(diary, userId) {
  if (!diary || !userId) return false;
  if (diary.user_id === userId) return true;
  // 协作者可读
  if (db.prepare('SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ?').get(diary.id, userId)) return true;
  const vis = diary.visibility || 'private';
  if (vis === 'public') return true;
  if (vis === 'friends') return isFriend(diary.user_id, userId);
  if (vis === 'specific') {
    return !!db.prepare('SELECT 1 FROM diary_visible_to WHERE diary_id = ? AND user_id = ?').get(diary.id, userId);
  }
  return false;
}

// 判断 user 是否可编辑某篇日记（owner 或 editor 角色协作者）
function canEditDiary(diaryId, userId) {
  if (!userId) return false;
  const diary = db.prepare('SELECT user_id FROM diaries WHERE id = ?').get(diaryId);
  if (!diary) return false;
  if (diary.user_id === userId) return true;
  const c = db.prepare("SELECT 1 FROM diary_collaborators WHERE diary_id = ? AND user_id = ? AND role = 'editor'").get(diaryId, userId);
  return !!c;
}

module.exports = { isFriend, canReadDiary, canEditDiary };

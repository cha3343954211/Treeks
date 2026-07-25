// Treeks 主题验证与截图脚本
// 强制使用白色淡绿（森林绿）主题

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve('docs/screenshots');
const BASE_URL = 'http://localhost:3000';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // 收集所有验证信息
  const results = {};

  try {
    // ===== 步骤 1：访问首页 =====
    console.log('1) 访问首页 http://localhost:3000');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);

    // ===== 步骤 2：强制清除 localStorage 并刷新 =====
    console.log('2) 清除 localStorage 并刷新');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch (e) {}
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(2000);

    // ===== 步骤 3：验证主题 =====
    console.log('3) 验证主题');
    const themeInfo = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      return {
        dataTheme: html.getAttribute('data-theme'),
        bodyBg: getComputedStyle(body).backgroundColor,
        bodyColor: getComputedStyle(body).color,
        treeksTheme: localStorage.getItem('treeks_theme'),
        treeksUser: localStorage.getItem('treeks_user')
      };
    });
    console.log('   主题信息:', JSON.stringify(themeInfo));
    results.initialTheme = themeInfo;

    // ===== 步骤 4：截图 login.png =====
    console.log('4) 截图 login.png');
    const loginPath = path.join(SCREENSHOTS_DIR, 'login.png');
    await page.screenshot({ path: loginPath, fullPage: false });
    results.login = { path: loginPath, dataTheme: themeInfo.dataTheme, bodyBg: themeInfo.bodyBg };
    console.log('   保存到:', loginPath);

    // ===== 步骤 5：登录 =====
    console.log('5) 登录 Chara/admin123');
    await page.waitForSelector('#login-username', { timeout: 10000 });
    await page.type('#login-username', 'Chara');
    await page.type('#login-password', 'admin123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => null),
      page.click('button[type="submit"].btn-primary')
    ]);
    await sleep(2000);

    // 验证登录后主题（后端会强制设置 Chara 为 green）
    const postLoginTheme = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      let user = null;
      try { user = JSON.parse(localStorage.getItem('treeks_user') || 'null'); } catch (e) {}
      return {
        dataTheme: html.getAttribute('data-theme'),
        bodyBg: getComputedStyle(body).backgroundColor,
        treeksTheme: localStorage.getItem('treeks_theme'),
        userTheme: user ? user.theme : null,
        username: user ? user.username : null,
        isAdmin: user ? user.is_admin : null
      };
    });
    console.log('   登录后主题:', JSON.stringify(postLoginTheme));
    results.postLoginTheme = postLoginTheme;

    // 等待日记列表加载
    await sleep(1500);

    // 工具函数：导航到指定页面并截图
    async function navAndShot(selector, fileName, label) {
      console.log(`  导航到: ${label} -> 截图: ${fileName}`);
      await page.evaluate((sel) => {
        const btn = document.querySelector(sel);
        if (btn) btn.click();
        else throw new Error('未找到按钮: ' + sel);
      }, selector);
      // 等待视图切换
      await sleep(2200);
      const theme = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        return {
          dataTheme: html.getAttribute('data-theme'),
          bodyBg: getComputedStyle(body).backgroundColor
        };
      });
      const filePath = path.join(SCREENSHOTS_DIR, fileName);
      await page.screenshot({ path: filePath, fullPage: false });
      results[label] = { path: filePath, dataTheme: theme.dataTheme, bodyBg: theme.bodyBg, file: fileName };
      console.log(`     路径: ${filePath} 主题: ${theme.dataTheme} bodyBg: ${theme.bodyBg}`);
    }

    // ===== 步骤 6：截图 diaries-page.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="list"]', 'diaries-page.png', 'diaries');

    // ===== 步骤 7：截图 editor-mode-split.png =====
    // 点击第一篇日记卡片进入编辑器
    console.log('  点击第一篇日记进入编辑器');
    await page.waitForSelector('.diary-card', { timeout: 10000 });
    await page.evaluate(() => {
      const card = document.querySelector('.diary-card');
      if (card) card.click();
    });
    await sleep(2500);
    // 强制切到分屏模式
    await page.evaluate(() => {
      const splitBtn = document.querySelector('#editor-mode-toggle .mode-btn[data-mode="split"]');
      if (splitBtn) splitBtn.click();
    });
    await sleep(1500);
    {
      const theme = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        const editorBody = document.querySelector('.editor-body');
        return {
          dataTheme: html.getAttribute('data-theme'),
          bodyBg: getComputedStyle(body).backgroundColor,
          mode: editorBody ? editorBody.className : null
        };
      });
      const filePath = path.join(SCREENSHOTS_DIR, 'editor-mode-split.png');
      await page.screenshot({ path: filePath, fullPage: false });
      results.editor = { path: filePath, dataTheme: theme.dataTheme, bodyBg: theme.bodyBg, mode: theme.mode };
      console.log(`     路径: ${filePath} 主题: ${theme.dataTheme} bodyBg: ${theme.bodyBg} mode: ${theme.mode}`);
    }

    // 返回列表
    await page.evaluate(() => {
      const back = document.getElementById('btn-back-list');
      if (back) back.click();
    });
    await sleep(1500);

    // ===== 步骤 8：截图 calendar-schedule.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="calendar"]', 'calendar-schedule.png', 'calendar');

    // ===== 步骤 9：截图 theme-settings.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="theme"]', 'theme-settings.png', 'theme');

    // ===== 步骤 10：截图 data-management.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="admin-data"]', 'data-management.png', 'dataManagement');

    // ===== 步骤 11：截图 admin-overview.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="admin-dashboard"]', 'admin-overview.png', 'adminOverview');

    // ===== 步骤 12：截图 system-performance-full.png =====
    await navAndShot('.sidebar-nav .nav-item[data-nav="admin-system"]', 'system-performance-full.png', 'systemPerformance');
    // 等系统性能页面渲染完整
    await sleep(2500);
    {
      const filePath = path.join(SCREENSHOTS_DIR, 'system-performance-full.png');
      await page.screenshot({ path: filePath, fullPage: true });
      const theme = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        return { dataTheme: html.getAttribute('data-theme'), bodyBg: getComputedStyle(body).backgroundColor };
      });
      results.systemPerformance.path = filePath;
      results.systemPerformance.dataTheme = theme.dataTheme;
      results.systemPerformance.bodyBg = theme.bodyBg;
      console.log(`     全页截图: ${filePath} 主题: ${theme.dataTheme} bodyBg: ${theme.bodyBg}`);
    }

  } catch (err) {
    console.error('错误:', err);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  // 写入报告
  const reportPath = path.join(SCREENSHOTS_DIR, '_theme_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log('\n=== 截图完成 ===');
  console.log('报告:', reportPath);
}

main().catch(e => { console.error(e); process.exit(1); });

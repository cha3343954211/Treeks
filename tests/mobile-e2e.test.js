const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const DELAY_MS = 1200;

// CLI args: --headed to show browser, otherwise headless for CI/remote IDE
const HEADED_MODE = process.argv.includes('--headed');

const results = [];

function log(label, passed, detail = '') {
  const icon = passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`  ${icon} ${color}[${status}]${reset} ${label}${detail ? ' — ' + detail : ''}`);
  results.push({ label, passed, detail });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Navigate via bottom nav using page.evaluate to dispatch the click directly
 * on the DOM element. This is more reliable than page.click() for elements
 * inside containers with hit-test/transform quirks.
 */
async function navTo(page, view) {
  return await page.evaluate((v) => {
    const btn = document.querySelector(`.mobile-nav-item[data-mobile-view="${v}"]`);
    if (!btn) return { ok: false, reason: 'button not found' };
    btn.click();
    return { ok: true };
  }, view);
}

async function isViewActive(page, viewName) {
  return await page.evaluate((v) => {
    const el = document.getElementById('view-' + v);
    if (!el) return { exists: false, active: false, display: 'missing' };
    const cs = window.getComputedStyle(el);
    return {
      exists: true,
      active: el.classList.contains('active'),
      display: cs.display,
      visible: cs.display !== 'none' && el.classList.contains('active'),
    };
  }, viewName);
}

async function isNavItemActive(page, view) {
  return await page.evaluate((v) => {
    const btn = document.querySelector(`.mobile-nav-item[data-mobile-view="${v}"]`);
    return btn ? btn.classList.contains('active') : false;
  }, view);
}

async function runTests() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  let browser;
  try {
    console.log('\n\x1b[1m\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[1m\x1b[36m  Treeks Mobile E2E Test\x1b[0m');
    console.log(`\x1b[1m\x1b[36m  Mode: ${HEADED_MODE ? 'HEADED (browser visible)' : 'HEADLESS (no UI)'} \x1b[0m`);
    console.log('\x1b[1m\x1b[36m  Device: iPhone 14 emulation — 390×844 @3x\x1b[0m');
    console.log('\x1b[1m\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m\n');

    console.log(`\x1b[1mLaunching browser (${HEADED_MODE ? 'HEADED' : 'HEADLESS'})...\x1b[0m`);
    browser = await puppeteer.launch({
      headless: !HEADED_MODE,
      args: [
        '--window-size=1920,1080',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.setDefaultTimeout(30000);

    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    await page.setUserAgent(userAgent);

    const cdpSession = await page.target().createCDPSession();
    await cdpSession.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await cdpSession.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });

    const screenshotPath = (name) => path.join(SCREENSHOT_DIR, `${name}.png`);

    // ── Test 1: Login Page ──
    console.log('\x1b[1m━━━ Test 1: Login Page ━━━\x1b[0m');
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
      log('Navigate to app', true, BASE_URL);

      await page.waitForSelector('#auth-view', { visible: true });
      log('Auth view visible', true);

      const cardVisible = await page.$eval('.auth-card', el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          display: style.display !== 'none',
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        };
      });
      log('Auth card visible', cardVisible.display, `width=${Math.round(cardVisible.width)}px`);

      const viewportWidth = 390;
      const cardCenterX = cardVisible.left + cardVisible.width / 2;
      const pageCenterX = viewportWidth / 2;
      const centerOffset = Math.abs(cardCenterX - pageCenterX);
      log('Auth card horizontally centered', centerOffset < 20, `offset=${centerOffset.toFixed(1)}px`);

      const formVisible = await page.$eval('#login-form', el => el.style.display !== 'none');
      log('Login form visible', formVisible);

      const usernameInput = await page.$('#login-username');
      const passwordInput = await page.$('#login-password');
      log('Username input exists', !!usernameInput);
      log('Password input exists', !!passwordInput);

      await page.screenshot({ path: screenshotPath('01-login-page'), fullPage: false });
      log('Screenshot saved', true, '01-login-page.png');
    } catch (err) {
      log('Login page test', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 2: Login Flow ──
    console.log('\n\x1b[1m━━━ Test 2: Login Flow ━━━\x1b[0m');
    try {
      await page.click('#login-username');
      await page.type('#login-username', 'Chara', { delay: 50 });

      await page.click('#login-password');
      await page.type('#login-password', '123456', { delay: 50 });

      log('Enter credentials', true, 'username=Chara, password=123456');

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => null),
        page.click('#login-form button[type="submit"]'),
      ]);

      await page.waitForSelector('#main-view', { visible: true, timeout: 10000 });
      log('Login successful — main view visible', true);

      // Wait for bottom nav to be visible
      await page.waitForFunction(() => {
        const nav = document.getElementById('mobile-bottom-nav');
        if (!nav) return false;
        return nav.classList.contains('show') || getComputedStyle(nav).display !== 'none';
      }, { timeout: 5000 });
      log('Bottom nav visible after login', true);

      await sleep(DELAY_MS);
      await page.screenshot({ path: screenshotPath('02-after-login'), fullPage: false });
      log('Screenshot saved', true, '02-after-login.png');
    } catch (err) {
      log('Login flow', false, err.message);
    }

    // ── Test 3: Diary List View ──
    console.log('\n\x1b[1m━━━ Test 3: Diary List View ━━━\x1b[0m');
    try {
      const bottomNavExists = await page.$('#mobile-bottom-nav');
      log('Bottom nav exists', !!bottomNavExists);

      const listActive = await isViewActive(page, 'list');
      log('Diary list view is active', listActive.visible, `display=${listActive.display}`);

      const listNavActive = await isNavItemActive(page, 'list');
      log('Diary (list) tab is active', listNavActive);

      const searchInput = await page.$('#search-input');
      log('Search bar exists', !!searchInput);

      const folderSidebar = await page.$('#folder-sidebar');
      log('Folder tabs exist', !!folderSidebar);

      const diaryList = await page.$('#diary-list');
      log('Diary list container exists', !!diaryList);

      const navButtons = await page.$$eval('#mobile-bottom-nav .mobile-nav-item', items =>
        items.map(i => ({
          view: i.getAttribute('data-mobile-view'),
          label: i.querySelector('span')?.textContent?.trim() || '',
        }))
      );
      log('Bottom nav has 5 buttons', navButtons.length === 5, navButtons.map(b => `${b.label}(${b.view})`).join(', '));

      await page.screenshot({ path: screenshotPath('03-diary-list'), fullPage: false });
      log('Screenshot saved', true, '03-diary-list.png');
    } catch (err) {
      log('Diary list view', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 4: Editor Page (写日记) ──
    console.log('\n\x1b[1m━━━ Test 4: Editor Page (写日记) ━━━\x1b[0m');
    try {
      const navResult = await navTo(page, 'editor');
      log('Click editor nav button', navResult.ok);
      await sleep(1500);

      const editorView = await isViewActive(page, 'editor');
      log('Editor view is visible', editorView.visible, `active=${editorView.active}, display=${editorView.display}`);

      const editorTextarea = await page.$('#editor-textarea');
      log('Editor textarea exists', !!editorTextarea);

      const editorHeader = await page.$('#editor-header');
      log('Editor header exists', !!editorHeader);

      const editorToolbar = await page.$('#editor-toolbar');
      log('Editor toolbar exists', !!editorToolbar);

      const editorBodyWidth = await page.evaluate(() => {
        const el = document.querySelector('.editor-body');
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return Math.round(r.width);
      });
      log('Editor body rendered (width > 0)', editorBodyWidth > 0, `width=${editorBodyWidth}px`);

      const editorBtnActive = await isNavItemActive(page, 'editor');
      log('Editor nav button is active', editorBtnActive);

      await page.screenshot({ path: screenshotPath('04-editor-page'), fullPage: false });
      log('Screenshot saved', true, '04-editor-page.png');
    } catch (err) {
      log('Editor page', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 5: Settings Page (设置/profile) ──
    console.log('\n\x1b[1m━━━ Test 5: Settings Page (设置) ━━━\x1b[0m');
    try {
      const navResult = await navTo(page, 'profile');
      log('Click settings nav button', navResult.ok);
      await sleep(1500);

      const profileView = await isViewActive(page, 'profile');
      log('Profile/settings view is visible', profileView.visible, `active=${profileView.active}, display=${profileView.display}`);

      const profileForm = await page.$('#profile-form');
      log('Profile form exists', !!profileForm);

      const usernameField = await page.$('#profile-username');
      log('Username field exists', !!usernameField);

      const nicknameField = await page.$('#profile-nickname');
      log('Nickname field exists', !!nicknameField);

      const profileBtnActive = await isNavItemActive(page, 'profile');
      log('Settings nav button is active', profileBtnActive);

      await page.screenshot({ path: screenshotPath('05-settings-page'), fullPage: false });
      log('Screenshot saved', true, '05-settings-page.png');
    } catch (err) {
      log('Settings page', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 6: Messages Page (消息) ──
    console.log('\n\x1b[1m━━━ Test 6: Messages Page (消息) ━━━\x1b[0m');
    try {
      const navResult = await navTo(page, 'messages');
      log('Click messages nav button', navResult.ok);
      await sleep(1500);

      const messagesView = await isViewActive(page, 'messages');
      log('Messages view is visible', messagesView.visible, `active=${messagesView.active}, display=${messagesView.display}`);

      const msgSearch = await page.$('#msg-search-input');
      log('Message search input exists', !!msgSearch);

      const msgConversations = await page.$('#msg-conversations');
      log('Conversations list exists', !!msgConversations);

      const msgChatArea = await page.$('#msg-chat');
      log('Chat area exists', !!msgChatArea);

      const messagesBtnActive = await isNavItemActive(page, 'messages');
      log('Messages nav button is active', messagesBtnActive);

      await page.screenshot({ path: screenshotPath('06-messages-page'), fullPage: false });
      log('Screenshot saved', true, '06-messages-page.png');
    } catch (err) {
      log('Messages page', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 7: Files Page (文件) ──
    console.log('\n\x1b[1m━━━ Test 7: Files Page (文件) ━━━\x1b[0m');
    try {
      const navResult = await navTo(page, 'files');
      log('Click files nav button', navResult.ok);
      await sleep(1500);

      const filesView = await isViewActive(page, 'files');
      log('Files view is visible', filesView.visible, `active=${filesView.active}, display=${filesView.display}`);

      const filesGrid = await page.$('#files-grid');
      log('Files grid exists', !!filesGrid);

      const filesUploadBtn = await page.$('#btn-upload-files');
      log('Upload button exists', !!filesUploadBtn);

      const filesFilter = await page.$('#files-filter');
      log('File type filters exist', !!filesFilter);

      const filesBtnActive = await isNavItemActive(page, 'files');
      log('Files nav button is active', filesBtnActive);

      await page.screenshot({ path: screenshotPath('07-files-page'), fullPage: false });
      log('Screenshot saved', true, '07-files-page.png');
    } catch (err) {
      log('Files page', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 8: Navigate back to diary list ──
    console.log('\n\x1b[1m━━━ Test 8: Navigation Round-Trip ━━━\x1b[0m');
    try {
      const navResult = await navTo(page, 'list');
      log('Click list nav button', navResult.ok);
      await sleep(1500);

      const listView = await isViewActive(page, 'list');
      log('Returned to diary list', listView.visible, `active=${listView.active}, display=${listView.display}`);

      const listBtnActive = await isNavItemActive(page, 'list');
      log('List nav button is active again', listBtnActive);

      await page.screenshot({ path: screenshotPath('08-back-to-list'), fullPage: false });
      log('Screenshot saved', true, '08-back-to-list.png');
    } catch (err) {
      log('Navigation round-trip', false, err.message);
    }

    await sleep(DELAY_MS);

    // ── Test 9: Full page scroll screenshot of diary list ──
    console.log('\n\x1b[1m━━━ Test 9: Full Page Diary List ━━━\x1b[0m');
    try {
      await page.screenshot({ path: screenshotPath('09-diary-list-fullpage'), fullPage: true });
      log('Full-page screenshot saved', true, '09-diary-list-fullpage.png');

      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      log('Page has scrollable content', pageHeight > 844, `height=${pageHeight}px`);
    } catch (err) {
      log('Full page screenshot', false, err.message);
    }

    // ── Test 10: Editor at iPhone 14 size - check layout dimensions ──
    console.log('\n\x1b[1m━━━ Test 10: Editor Layout Dimensions (390px) ━━━\x1b[0m');
    try {
      await navTo(page, 'editor');
      await sleep(1500);

      const editorLayout = await page.evaluate(() => {
        const body = document.querySelector('.editor-body');
        const textarea = document.querySelector('#editor-textarea');
        const modeBtns = document.querySelectorAll('#editor-mode-toggle .mode-btn');
        if (!body || !textarea) return null;
        const bodyRect = body.getBoundingClientRect();
        const taRect = textarea.getBoundingClientRect();
        return {
          bodyWidth: Math.round(bodyRect.width),
          bodyHeight: Math.round(bodyRect.height),
          textareaWidth: Math.round(taRect.width),
          modeButtonsCount: modeBtns.length,
          previewHidden: (() => {
            const preview = document.querySelector('.preview-pane, .preview-content, [class*="preview"]');
            if (!preview) return 'no-preview-el';
            return window.getComputedStyle(preview).display === 'none';
          })(),
        };
      });
      if (editorLayout) {
        log('Editor body fits 390px viewport', editorLayout.bodyWidth <= 390, `width=${editorLayout.bodyWidth}px`);
        log('Editor body has height', editorLayout.bodyHeight > 100, `height=${editorLayout.bodyHeight}px`);
        log('Editor textarea rendered', editorLayout.textareaWidth > 0, `width=${editorLayout.textareaWidth}px`);
        log('Mode toggle has 3 buttons (split/edit/preview)', editorLayout.modeButtonsCount === 3, `count=${editorLayout.modeButtonsCount}`);
      } else {
        log('Editor layout inspection', false, 'layout elements not found');
      }
    } catch (err) {
      log('Editor layout dimensions', false, err.message);
    }

    // ── Summary ──
    console.log('\n\x1b[1m\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[1m  TEST SUMMARY\x1b[0m');
    console.log('\x1b[1m\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m\n');

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;

    results.forEach(r => {
      const icon = r.passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
      const color = r.passed ? '\x1b[32m' : '\x1b[31m';
      console.log(`  ${icon} ${color}${r.label}\x1b[0m${r.detail ? ' — ' + r.detail : ''}`);
    });

    console.log('');
    console.log(`  \x1b[1mTotal: ${total}  \x1b[32mPassed: ${passed}\x1b[0m  \x1b[31mFailed: ${failed}\x1b[0m`);
    console.log('');

    if (failed > 0) {
      console.log('\x1b[31m  Some tests failed!\x1b[0m\n');
    } else {
      console.log('\x1b[32m  All tests passed!\x1b[0m\n');
    }

    console.log(`  Screenshots saved to: ${SCREENSHOT_DIR}\n`);

    return failed === 0;
  } catch (err) {
    console.error('\x1b[31mFatal error:\x1b[0m', err);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

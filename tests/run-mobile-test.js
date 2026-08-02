const { execSync } = require('child_process');
const path = require('path');

const testFile = path.join(__dirname, 'mobile-e2e.test.js');

console.log('');
console.log('\x1b[1m\x1b[36m╔═══════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[1m\x1b[36m║        Treeks Mobile E2E Test Runner (Headed Mode)       ║\x1b[0m');
console.log('\x1b[1m\x1b[36m╚═══════════════════════════════════════════════════════════╝\x1b[0m');
console.log('');
console.log('\x1b[33m  Instructions:\x1b[0m');
console.log('  ─────────────────────────────────────────────────────────');
console.log('  1. A Chromium browser window will open automatically.');
console.log('  2. The browser emulates an iPhone 14 (390×844 @3x).');
console.log('  3. Watch the browser navigate through each page.');
console.log('  4. Screenshots are saved to tests/screenshots/.');
console.log('  5. Test results are printed in this terminal when done.');
console.log('');
console.log('\x1b[33m  ⚠  Do NOT close the browser manually during the test.\x1b[0m');
console.log('  ⚠  Make sure the app is running at http://localhost:3000');
console.log('');
console.log('\x1b[1m  Starting test...\x1b[0m');
console.log('');

try {
  execSync(`node "${testFile}"`, {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env },
  });
} catch (err) {
  console.error('');
  console.error('\x1b[31m  ═══ Test runner exited with errors ═══\x1b[0m');
  console.error(`  Exit code: ${err.status}`);
  process.exit(err.status || 1);
}

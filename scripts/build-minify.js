// 生产环境前端资源压缩构建
// 用法：node scripts/build-minify.js
// 产物：public/dist/app.min.js 与 public/dist/style.min.css
// server.js 在 NODE_ENV=production 且产物存在时自动优先服务压缩版本（无需改 index.html）
const fs = require('fs');
const path = require('path');
const terser = require('terser');
const CleanCSS = require('clean-css');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'public', 'dist');

(async () => {
  fs.mkdirSync(DIST, { recursive: true });
  const jsPath = path.join(ROOT, 'public', 'js', 'app.js');
  const cssPath = path.join(ROOT, 'public', 'css', 'style.css');
  const js = fs.readFileSync(jsPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  const jsResult = await terser.minify(js, {
    compress: true,
    mangle: true,
    format: { comments: false }
  });
  if (jsResult.error) throw jsResult.error;
  fs.writeFileSync(path.join(DIST, 'app.min.js'), jsResult.code);

  const cssResult = new CleanCSS({ level: 2 }).minify(css);
  if (cssResult.errors && cssResult.errors.length) {
    throw new Error(cssResult.errors.join('\n'));
  }
  fs.writeFileSync(path.join(DIST, 'style.min.css'), cssResult.styles);

  const kb = n => (n / 1024).toFixed(1);
  console.log(`✓ 构建完成: app.min.js ${kb(jsResult.code.length)}KB, style.min.css ${kb(cssResult.styles.length)}KB (原 ${kb(js.length)}KB / ${kb(css.length)}KB)`);
  console.log('  以 NODE_ENV=production 启动时自动服务压缩版本');
})().catch(e => {
  console.error('构建失败:', e.message);
  process.exit(1);
});

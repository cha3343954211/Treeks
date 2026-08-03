// 生成 PWA 应用图标（纯 Node 实现，无原生依赖）
// 用法：node scripts/generate-icons.js
// 产物：public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'public', 'icons');

// ---- 最小 PNG 编码器 ----
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---- 图标绘制：品牌绿圆角底 + 白色树冠/树干 ----
function drawIcon(size, maskable) {
  const buf = Buffer.alloc(size * size * 4);
  const radius = size * 0.22;
  const safe = maskable ? 0.1 : 0;
  const bg = [16, 185, 129]; // #10b981
  const leaf = [255, 255, 255];
  const trunk = [6, 95, 70];
  const cx = size / 2;
  const canopyR = size * 0.32;
  const canopyY = size * 0.40;
  const trunkW = size * 0.10;
  const trunkTop = size * 0.52;
  const trunkBottom = size * 0.72;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      // 圆角矩形背景
      const rx = Math.max(radius - px, px - (size - radius), 0);
      const ry = Math.max(radius - py, py - (size - radius), 0);
      let r = 0, g = 0, b = 0, a = 0;
      if (Math.hypot(rx, ry) <= radius || (px > radius && px < size - radius) || (py > radius && py < size - radius)) {
        r = bg[0]; g = bg[1]; b = bg[2]; a = 255;
      }
      // 树冠（白色圆 + 顶部缺口形成树形）
      const inCanopy = Math.hypot(px - cx, py - canopyY) <= canopyR;
      const inTrunk = px >= cx - trunkW / 2 && px <= cx + trunkW / 2 && py >= trunkTop && py <= trunkBottom;
      const inGround = maskable && py > size * 0.92;
      if (a > 0 && (inCanopy || inTrunk)) {
        if (inCanopy && py < size * 0.18) {
          // 顶部缺口
        } else if (inTrunk) {
          r = trunk[0]; g = trunk[1]; b = trunk[2];
        } else if (inCanopy) {
          r = leaf[0]; g = leaf[1]; b = leaf[2];
        }
      }
      if (inGround) { r = 0; g = 0; b = 0; a = 0; }
      const i = (y * size + x) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = a;
    }
  }
  return encodePng(size, size, buf);
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'icon-192.png'), drawIcon(192, false));
fs.writeFileSync(path.join(OUT, 'icon-512.png'), drawIcon(512, false));
fs.writeFileSync(path.join(OUT, 'icon-maskable-512.png'), drawIcon(512, true));
console.log('✓ PWA 图标已生成: public/icons/icon-192.png, icon-512.png, icon-maskable-512.png');

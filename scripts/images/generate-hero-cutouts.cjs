// 从已有产品图生成首页深色舞台用的透明图，不改动产品原图。
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '../..');
const sources = [
  ['products/tektronix/Tek-MSO68B.png', 'hero/scope-cutout.png'],
  ['products/nikon/VMZ-S_Rev1_500.png', 'hero/metrology-cutout.png'],
  ['products/nikon/L300.png', 'hero/microscope-cutout.png'],
];

async function generate(source, target) {
  const sourcePath = path.join(root, 'public/images', source);
  const targetPath = path.join(root, 'public/images', target);
  const versionTime = Math.max(fs.statSync(sourcePath).mtimeMs, fs.statSync(__filename).mtimeMs);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).mtimeMs >= versionTime) return;

  const { data, info } = await sharp(sourcePath).toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let head = 0;
  let tail = 0;
  const enqueue = (pixel) => {
    if (visited[pixel]) return;
    visited[pixel] = 1;
    const offset = pixel * 4;
    // 仅去除与画布边缘相连的近白背景，保留设备内部的白色面板。
    if (Math.min(data[offset], data[offset + 1], data[offset + 2]) < 242) return;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
  if (source.includes('VMZ-S')) {
    // 原图支架内的三处背景不与画布边缘连通，显式标记背景种子。
    for (const [x, y] of [[0.4, 0.66], [0.5, 0.65], [0.6, 0.65]]) {
      enqueue(Math.floor(y * height) * width + Math.floor(x * width));
    }
  }
  while (head < tail) {
    const pixel = queue[head++];
    data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (pixel >= width) enqueue(pixel - width);
    if (pixel < width * (height - 1)) enqueue(pixel + width);
  }

  if (source.includes('VMZ-S')) {
    // 按这张 800×800 原图的支架底缘去掉地面投影，包含四个脚垫。
    const bottomEdge = [[0, 620], [270, 620], [275, 627], [289, 629],
      [297, 617], [425, 636], [430, 649], [445, 651], [453, 636],
      [504, 581], [514, 581], [522, 571], [800, 571]];
    for (let segment = 1; segment < bottomEdge.length; segment++) {
      const [x0, y0] = bottomEdge[segment - 1];
      const [x1, y1] = bottomEdge[segment];
      for (let x = Math.floor(x0 * width / 800); x < x1 * width / 800; x++) {
        const edge = (y0 + (y1 - y0) * (x * 800 / width - x0) / (x1 - x0)) * height / 800;
        for (let y = Math.ceil(edge); y < height; y++) data[(y * width + x) * 4 + 3] = 0;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ background: '#00000000', threshold: 5 })
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#00000000' })
    .png().toFile(targetPath);
  console.log(`Generated ${target}`);
}

(async () => {
  for (const [source, target] of sources) await generate(source, target);
})().catch((error) => { console.error(error); process.exitCode = 1; });

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// 配置参数
const CONFIG = {
  width: 400, // 预览图宽度
  quality: 60, // JPEG质量
  blur: 0.3, // 模糊程度
};

async function generateThumbnail(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const basename = path.basename(imagePath, ext);
    const dirname = path.dirname(imagePath);
    const thumbnailPath = path.join(dirname, `${basename}-small${ext}`);

    await sharp(imagePath)
      .resize(CONFIG.width) // 调整大小
      .blur(CONFIG.blur) // 轻微模糊
      .jpeg({ quality: CONFIG.quality }) // 压缩质量
      .toFile(thumbnailPath);

    console.log(`✅ Generated: ${thumbnailPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${imagePath}:`, error);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png|avif|webp)$/i.test(file) && !file.includes("-small")) {
      await generateThumbnail(filePath);
    }
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("❌ Images directory not found:", IMAGES_DIR);
    process.exit(1);
  }

  console.log("🔍 Scanning for images...");
  await processDirectory(IMAGES_DIR);
  console.log("✨ All done!");
}

main().catch(console.error);

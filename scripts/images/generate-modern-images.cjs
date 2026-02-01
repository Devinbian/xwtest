const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");

const CONFIG = {
  // webp: good general-purpose default
  webpQuality: 78,
  // avif: smaller but slower to encode; effort trades CPU for size
  avifQuality: 55,
  avifEffort: 5,
  // jpg: baseline fallback for legacy browsers when only modern formats exist
  jpgQuality: 82,
};

const SOURCE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const SKIP_DIR_NAMES = new Set(["node_modules"]);
const BASELINE_EXTS = [".jpg", ".jpeg", ".png"];

function splitUrlSuffix(filePath) {
  // For file paths this is a no-op, but keep it simple/explicit.
  return { base: filePath, suffix: "" };
}

function isUpToDate(srcPath, outPath) {
  if (!fs.existsSync(outPath)) return false;
  const outSize = fs.statSync(outPath).size;
  // Treat empty outputs as invalid; they can happen if a previous run was interrupted.
  if (outSize === 0) return false;
  const srcStat = fs.statSync(srcPath);
  const outStat = fs.statSync(outPath);
  return outStat.mtimeMs >= srcStat.mtimeMs;
}

async function writeAtomically(writeFn, outPath) {
  const tmpPath = `${outPath}.tmp-${process.pid}-${Date.now()}`;
  try {
    await writeFn(tmpPath);
    const stat = fs.statSync(tmpPath);
    if (!stat.size) {
      throw new Error(`Generated empty file: ${tmpPath}`);
    }
    fs.renameSync(tmpPath, outPath);
  } finally {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {
      // ignore
    }
  }
}

async function generateWebp(srcPath, outPath) {
  await writeAtomically(
    (tmpPath) => sharp(srcPath).webp({ quality: CONFIG.webpQuality }).toFile(tmpPath),
    outPath
  );
}

async function generateAvif(srcPath, outPath) {
  await writeAtomically(
    (tmpPath) =>
      sharp(srcPath).avif({ quality: CONFIG.avifQuality, effort: CONFIG.avifEffort }).toFile(tmpPath),
    outPath
  );
}

async function generateJpg(srcPath, outPath) {
  await writeAtomically(
    (tmpPath) => sharp(srcPath).jpeg({ quality: CONFIG.jpgQuality, mozjpeg: true }).toFile(tmpPath),
    outPath
  );
}

function baselineExists(basePath) {
  return BASELINE_EXTS.some((ext) => fs.existsSync(`${basePath}${ext}`));
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) return;

  const { base } = splitUrlSuffix(filePath);
  const basePath = base.slice(0, -ext.length);

  const webpPath = `${basePath}.webp`;
  const avifPath = `${basePath}.avif`;
  const jpgPath = `${basePath}.jpg`;

  try {
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      if (!isUpToDate(filePath, webpPath)) {
        await generateWebp(filePath, webpPath);
        console.log(`✅ webp: ${path.relative(PUBLIC_DIR, webpPath)}`);
      }

      if (!isUpToDate(filePath, avifPath)) {
        await generateAvif(filePath, avifPath);
        console.log(`✅ avif: ${path.relative(PUBLIC_DIR, avifPath)}`);
      }
      return;
    }

    // When a project stores only .avif or .webp assets, also ensure:
    // - the other modern format exists (for broader support)
    // - a baseline .jpg exists (for legacy browsers & safe fallbacks)
    if (ext === ".avif") {
      if (baselineExists(basePath)) return;

      if (!isUpToDate(filePath, webpPath)) {
        await generateWebp(filePath, webpPath);
        console.log(`✅ webp: ${path.relative(PUBLIC_DIR, webpPath)}`);
      }

      if (!baselineExists(basePath) && !isUpToDate(filePath, jpgPath)) {
        await generateJpg(filePath, jpgPath);
        console.log(`✅ jpg: ${path.relative(PUBLIC_DIR, jpgPath)}`);
      }
      return;
    }

    if (ext === ".webp") {
      if (baselineExists(basePath)) return;

      if (!isUpToDate(filePath, avifPath)) {
        await generateAvif(filePath, avifPath);
        console.log(`✅ avif: ${path.relative(PUBLIC_DIR, avifPath)}`);
      }

      if (!baselineExists(basePath) && !isUpToDate(filePath, jpgPath)) {
        await generateJpg(filePath, jpgPath);
        console.log(`✅ jpg: ${path.relative(PUBLIC_DIR, jpgPath)}`);
      }
      return;
    }

    // Fallback (should be unreachable, guarded by SOURCE_EXTS)
    if (!isUpToDate(filePath, avifPath)) {
      await generateAvif(filePath, avifPath);
      console.log(`✅ avif: ${path.relative(PUBLIC_DIR, avifPath)}`);
    }
  } catch (error) {
    console.error(`❌ Failed: ${filePath}`);
    console.error(error);
  }
}

async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      await processDirectory(fullPath);
      continue;
    }

    await processFile(fullPath);
  }
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error("❌ public directory not found:", PUBLIC_DIR);
    process.exit(1);
  }

  console.log("🔍 Generating modern formats (webp/avif) under public/ ...");
  await processDirectory(PUBLIC_DIR);
  console.log("✨ Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

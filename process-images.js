import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT_DIR = "images";
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const allowedExt = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const args = process.argv.slice(2);

// If no args, do nothing (safe)
if (args.length === 0) {
  console.log("No changed files provided. Nothing to process.");
  process.exit(0);
}

for (const filePath of args) {
  if (!filePath.startsWith("originals/")) continue;

  const ext = path.extname(filePath).toLowerCase();
  if (!allowedExt.has(ext)) {
    console.log("Skipping non-image:", filePath);
    continue;
  }

  if (!fs.existsSync(filePath)) {
    console.log("File not found (maybe deleted):", filePath);
    continue;
  }

  const baseName = path.basename(filePath, ext);
  const outputPath = path.join(OUT_DIR, `${baseName}.webp`);

  console.log("Processing:", filePath);

  await sharp(filePath)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  console.log("Saved:", outputPath);
}

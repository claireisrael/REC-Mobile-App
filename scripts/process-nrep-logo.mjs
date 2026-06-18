import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../assets/images');
const sourcePath = path.join(imagesDir, 'nrep-logo-source.png');
const uploadedPath = path.join(imagesDir, 'nrep-logo.png');
const outputPath = path.join(imagesDir, 'nrep-logo.png');
const splashPath = path.join(imagesDir, 'splash-logo.png');

const WHITE_THRESHOLD = 228;
const BLACK_THRESHOLD = 20;

async function downloadSource() {
  const response = await fetch('https://rec.nrep.ug/NREP.png');
  if (!response.ok) {
    throw new Error(`Failed to download NREP logo: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(sourcePath, buffer);
  return buffer;
}

async function removeBackground(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const isLight = r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
    const isDark = r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD;

    if (isLight || isDark) {
      pixels[i + 3] = 0;
    }
  }

  return sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim()
    .png()
    .toBuffer();
}

async function buildSplashLogo(logoBuffer) {
  const canvas = 256;
  const logoSize = 200;
  const resized = await sharp(logoBuffer)
    .resize({ width: logoSize, height: logoSize, fit: 'inside' })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const left = Math.round((canvas - (meta.width || logoSize)) / 2);
  const top = Math.round((canvas - (meta.height || logoSize)) / 2);

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .png()
    .toBuffer();
}

const input = (await fs.stat(sourcePath).catch(() => null))
  ? await fs.readFile(sourcePath)
  : (await fs.stat(uploadedPath).catch(() => null))
    ? await fs.readFile(uploadedPath)
    : await downloadSource();

const transparentLogo = await removeBackground(input);
const splashLogo = await buildSplashLogo(transparentLogo);

await Promise.all([
  fs.writeFile(outputPath, transparentLogo),
  fs.writeFile(splashPath, splashLogo),
]);

console.log('Saved transparent NREP logo:', outputPath);
console.log('Saved centered splash logo:', splashPath);

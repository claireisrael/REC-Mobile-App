import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../assets/images');
const sourcePath = path.join(imagesDir, 'nrep-logo-source.png');
const logoPath = path.join(imagesDir, 'nrep-logo.png');
const size = 1024;

// Trimmed transparent logo centers best; fall back to official source.
const source = (await fs.stat(logoPath).catch(() => null))
  ? logoPath
  : (await fs.stat(sourcePath).catch(() => null))
    ? sourcePath
    : logoPath;

const logoMaxSize = Math.round(size * 0.58);
const logoBuffer = await sharp(source)
  .resize({ width: logoMaxSize, height: logoMaxSize, fit: 'inside' })
  .png()
  .toBuffer();
const { width: logoWidth = 0, height: logoHeight = 0 } = await sharp(logoBuffer).metadata();

const logoLeft = Math.round((size - logoWidth) / 2);
const logoTop = Math.round((size - logoHeight) / 2);
const composite = [{ input: logoBuffer, top: logoTop, left: logoLeft }];

const icon = await sharp({
  create: {
    width: size,
    height: size,
    channels: 3,
    background: '#FFFFFF',
  },
})
  .composite(composite)
  .png()
  .toBuffer();

const foreground = await sharp({
  create: {
    width: size,
    height: size,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(composite)
  .png()
  .toBuffer();

const monochrome = await sharp(source)
  .resize({ width: logoMaxSize, height: logoMaxSize, fit: 'inside' })
  .png()
  .toBuffer();

await Promise.all([
  fs.writeFile(path.join(imagesDir, 'icon.png'), icon),
  fs.writeFile(path.join(imagesDir, 'android-icon-foreground.png'), foreground),
  fs.writeFile(path.join(imagesDir, 'favicon.png'), icon),
  fs.writeFile(path.join(imagesDir, 'android-icon-monochrome.png'), monochrome),
]);

console.log('Generated install icons: NREP logo only, centered (REC label comes from app name).');

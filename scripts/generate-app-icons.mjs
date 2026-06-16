import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../assets/images');
const sourcePath = path.join(imagesDir, 'nrep-logo-source.png');
const logoPath = path.join(imagesDir, 'nrep-logo.png');
const gold = '#FFB803';
const size = 1024;

const source = (await fs.stat(sourcePath).catch(() => null)) ? sourcePath : logoPath;

const logoMaxWidth = Math.round(size * 0.52);
const logoBuffer = await sharp(source).resize({ width: logoMaxWidth, fit: 'inside' }).png().toBuffer();
const { width: logoWidth = 0, height: logoHeight = 0 } = await sharp(logoBuffer).metadata();

const recFontSize = Math.round(size * 0.1);
const recSvgHeight = Math.round(recFontSize * 1.35);
const recSvg = Buffer.from(`
<svg width="${size}" height="${recSvgHeight}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="50%"
    y="${Math.round(recFontSize * 0.95)}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${recFontSize}"
    font-weight="700"
    fill="${gold}"
    text-anchor="middle"
  >REC</text>
</svg>
`);

const gap = Math.round(size * 0.045);
const totalHeight = logoHeight + gap + recSvgHeight;
const contentTop = Math.round((size - totalHeight) / 2);
const logoLeft = Math.round((size - logoWidth) / 2);
const logoTop = contentTop;
const recTop = logoTop + logoHeight + gap;

const composites = [
  { input: logoBuffer, top: logoTop, left: logoLeft },
  { input: recSvg, top: recTop, left: 0 },
];

const icon = await sharp({
  create: {
    width: size,
    height: size,
    channels: 3,
    background: '#FFFFFF',
  },
})
  .composite(composites)
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
  .composite(composites)
  .png()
  .toBuffer();

const monochrome = await sharp(source)
  .resize({ width: Math.round(size * 0.5), fit: 'inside' })
  .png()
  .toBuffer();

await Promise.all([
  fs.writeFile(path.join(imagesDir, 'icon.png'), icon),
  fs.writeFile(path.join(imagesDir, 'android-icon-foreground.png'), foreground),
  fs.writeFile(path.join(imagesDir, 'favicon.png'), icon),
  fs.writeFile(path.join(imagesDir, 'android-icon-monochrome.png'), monochrome),
]);

console.log('Generated install icons: NREP logo + REC, centered on white.');

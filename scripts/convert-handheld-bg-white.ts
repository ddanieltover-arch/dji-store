/**
 * Convert near-solid black studio backdrops to white via edge flood-fill.
 * Run: npx tsx scripts/convert-handheld-bg-white.ts
 */
import { readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

async function ensureSharp() {
  try {
    return require('sharp');
  } catch {
    console.log('Installing sharp…');
    const { execSync } = await import('node:child_process');
    execSync('npm install sharp --no-save', { stdio: 'inherit' });
    return require('sharp');
  }
}

const DIR = 'public/home/product-columns/handheld';
const OUT = 'public/home/product-columns/handheld-white';
mkdirSync(OUT, { recursive: true });

const files = readdirSync(DIR).filter((f) => /\.(png|jpe?g)$/i.test(f) && !f.includes('buying-guide') && !f.includes('rs-5-primary'));

const THRESH = 28; // near-black

function isBlack(r: number, g: number, b: number) {
  return r <= THRESH && g <= THRESH && b <= THRESH;
}

const sharp = await ensureSharp();

for (const file of files) {
  const input = path.join(DIR, file);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const stack: number[] = [];

  const idx = (x: number, y: number) => y * width + x;
  const pushIf = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = idx(x, y);
    if (visited[i]) return;
    const o = i * channels;
    if (!isBlack(px[o], px[o + 1], px[o + 2])) return;
    visited[i] = 1;
    stack.push(i);
  };

  // Seed from edges
  for (let x = 0; x < width; x++) {
    pushIf(x, 0);
    pushIf(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIf(0, y);
    pushIf(width - 1, y);
  }

  while (stack.length) {
    const i = stack.pop()!;
    const o = i * channels;
    px[o] = 255;
    px[o + 1] = 255;
    px[o + 2] = 255;
    px[o + 3] = 255;
    const x = i % width;
    const y = (i / width) | 0;
    pushIf(x + 1, y);
    pushIf(x - 1, y);
    pushIf(x, y + 1);
    pushIf(x, y - 1);
  }

  const outName = file.replace(/\.(jpe?g)$/i, '.png');
  const dest = path.join(OUT, outName);
  await sharp(px, { raw: { width, height, channels } }).png().toFile(dest);
  console.log('converted', dest);
}

console.log('done', files.length);

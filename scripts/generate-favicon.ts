#!/usr/bin/env node
/**
 * Builds `src/app/favicon.ico` from the logo geometry.
 *
 * The repo shipped Next's default favicon from the initial commit. It kept
 * winning over `icon.tsx` because a `favicon.ico` in the app directory takes
 * precedence, and browsers prefer the `.ico` anyway — so every tab showed the
 * starter icon regardless of what the logo work produced.
 *
 * Deleting the file would have been enough for modern browsers, which would
 * fall back to `/icon`. It is kept because `/favicon.ico` is still probed
 * directly by crawlers, RSS readers, link unfurlers and Search Console, and a
 * 404 there is a small avoidable gap.
 *
 * The mark is drawn with less padding than `icon.tsx` uses. That file renders
 * at 512px for the PWA and home screen, where generous padding looks right; a
 * favicon spends its life at 16px, where the same proportions leave each cell
 * under three pixels wide and the four blur into a smudge. Same mark, tighter
 * crop, on purpose.
 *
 *   pnpm generate:favicon
 */

import { createRequire } from "node:module";
import { readdirSync, writeFileSync } from "node:fs";
import process from "node:process";

const require = createRequire(import.meta.url);

// sharp arrives as a Next dependency rather than a direct one, so it is
// resolved out of the pnpm store instead of the project's node_modules.
const store = readdirSync("node_modules/.pnpm").find((dir) => dir.startsWith("sharp@"));
if (!store) {
  console.error("sharp not found in the pnpm store.");
  process.exit(1);
}
const sharp = require(`${process.cwd()}/node_modules/.pnpm/${store}/node_modules/sharp`);

/* ------------------------------------------------------------- the artwork */

const BACKGROUND = "#08090a";
const MARK = "#f7f8f8";

// Kept in step with src/components/layout/LogoMark.tsx by check-favicon.ts.
const SIZE = 7.5;
const GAP = 3;
const START = 3;

const CELLS = [
  { x: START, y: START, rx: 2.2, opacity: 1 },
  { x: START + SIZE + GAP, y: START, rx: 2.2, opacity: 1 },
  { x: START, y: START + SIZE + GAP, rx: 2.2, opacity: 1 },
  { x: START + SIZE + GAP, y: START + SIZE + GAP, rx: SIZE / 2, opacity: 0.55 },
];

function svg(): string {
  const cells = CELLS.map(
    (cell) =>
      `<rect x="${cell.x}" y="${cell.y}" width="${SIZE}" height="${SIZE}" rx="${cell.rx}" fill="${MARK}" opacity="${cell.opacity}"/>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
<rect width="24" height="24" rx="4.5" fill="${BACKGROUND}"/>
${cells}
</svg>`;
}

/* ------------------------------------------------------------ the container */

/**
 * Wraps PNGs in an ICO.
 *
 * An ICO is a small directory followed by the images themselves. Storing PNGs
 * rather than BMPs is supported everywhere that matters and avoids the BMP
 * quirk where the mask doubles the declared height.
 */
function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach((image, index) => {
    const at = index * 16;
    // 256 is written as 0 — the field is a single byte.
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, at);
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, at + 1);
    directory.writeUInt8(0, at + 2); // palette size, 0 for truecolour
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(image.png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += image.png.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.png)]);
}

/* ------------------------------------------------------------------- build */

// 16 and 32 are what browsers actually display; 48 covers Windows shortcuts and
// a few readers. 256 is left to icon.tsx, which already serves a 512px PNG.
const SIZES = [16, 32, 48];

const source = Buffer.from(svg());
const images = await Promise.all(
  SIZES.map(async (size) => ({
    size,
    png: (await sharp(source, { density: 384 }).resize(size, size).png().toBuffer()) as Buffer,
  })),
);

const output = ico(images);
writeFileSync("src/app/favicon.ico", output);

console.log(
  `Wrote src/app/favicon.ico — ${SIZES.join(", ")}px, ${(output.length / 1024).toFixed(1)}KB`,
);

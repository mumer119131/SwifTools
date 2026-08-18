#!/usr/bin/env node
/**
 * Checks that the committed favicon is the site's mark and not a placeholder.
 *
 * This exists because the repo shipped Next's default favicon for two weeks
 * without anyone noticing. A wrong favicon breaks nothing, renders no error and
 * is invisible in every diff — it is only ever caught by looking at a browser
 * tab, which is exactly the kind of check that does not happen.
 *
 * So the file is decoded and its pixels are sampled: four cells in the right
 * places, the fourth dimmed, dark gaps between them, and enough contrast to
 * survive 16 pixels. The geometry is also compared against LogoMark.tsx, so the
 * two cannot drift apart silently.
 *
 *   pnpm check:favicon
 */

import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import process from "node:process";

const require = createRequire(import.meta.url);
const store = readdirSync("node_modules/.pnpm").find((dir) => dir.startsWith("sharp@"));
const sharp = require(`${process.cwd()}/node_modules/.pnpm/${store}/node_modules/sharp`);

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* --------------------------------------------------------- the container */

const ico = readFileSync("src/app/favicon.ico");

assert("it is an icon file", ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1);

const count = ico.readUInt16LE(4);
assert(`it holds several sizes (${count})`, count >= 2);

// Next's default is ~26KB. Anything near that is the placeholder returning.
assert(
  `it is not the 26KB starter icon (${(ico.length / 1024).toFixed(1)}KB)`,
  ico.length < 8 * 1024,
);

interface Entry { size: number; offset: number; length: number }
const entries: Entry[] = [];
for (let i = 0; i < count; i += 1) {
  const at = 6 + i * 16;
  entries.push({
    size: ico.readUInt8(at) || 256,
    length: ico.readUInt32LE(at + 8),
    offset: ico.readUInt32LE(at + 12),
  });
}

assert("it includes a 16px image", entries.some((entry) => entry.size === 16));
assert("it includes a 32px image", entries.some((entry) => entry.size === 32));

for (const entry of entries) {
  const payload = ico.subarray(entry.offset, entry.offset + entry.length);
  assert(
    `the ${entry.size}px payload is a valid PNG`,
    payload[0] === 0x89 && payload.toString("latin1", 1, 4) === "PNG",
  );
  assert(
    `the ${entry.size}px payload lies inside the file`,
    entry.offset + entry.length <= ico.length,
  );
}

/* ------------------------------------------------------------ the artwork */

const smallest = entries.reduce((a, b) => (a.size <= b.size ? a : b));
const { data, info } = await sharp(
  ico.subarray(smallest.offset, smallest.offset + smallest.length),
)
  .raw()
  .toBuffer({ resolveWithObject: true });

function pixel(x: number, y: number) {
  const i = (y * info.width + x) * info.channels;
  return {
    brightness: (data[i] + data[i + 1] + data[i + 2]) / 3,
    alpha: info.channels === 4 ? data[i + 3] : 255,
  };
}

// Cell centres at 16px, from the 24-unit viewBox: cells span 3–10.5 and
// 13.5–21, so their centres land near 4.5 and 11.5 after scaling by 2/3.
const probes: [string, number, number, "light" | "dim" | "dark"][] = [
  ["top-left cell", 4, 4, "light"],
  ["top-right cell", 11, 4, "light"],
  ["bottom-left cell", 4, 11, "light"],
  ["bottom-right cell is dimmed", 11, 11, "dim"],
  ["the gap between cells", 8, 8, "dark"],
];

for (const [label, x, y, want] of probes) {
  const { brightness } = pixel(x, y);
  const ok =
    want === "light" ? brightness > 180 : want === "dim" ? brightness > 60 && brightness < 180 : brightness < 60;
  assert(`${label} (brightness ${brightness.toFixed(0)})`, ok);
}

assert("the corner is rounded", pixel(0, 0).alpha < 128, `alpha ${pixel(0, 0).alpha}`);

const contrast = pixel(4, 4).brightness - pixel(8, 8).brightness;
assert(`the cells stay legible at 16px (contrast ${contrast.toFixed(0)})`, contrast > 150);

/* ----------------------------------------------- geometry has not drifted */

const logo = readFileSync("src/components/layout/LogoMark.tsx", "utf8");
const generator = readFileSync("scripts/generate-favicon.ts", "utf8");

for (const constant of ["SIZE = 7.5", "GAP = 3", "START = 3"]) {
  assert(
    `${constant} matches LogoMark`,
    logo.includes(`const ${constant}`) && generator.includes(`const ${constant}`),
  );
}
assert(
  "the dimmed cell opacity matches LogoMark",
  logo.includes("opacity: 0.55") && generator.includes("opacity: 0.55"),
);

console.log(
  failures === 0
    ? "\nFavicon checks passed — it is the site's mark, legible at 16px."
    : `\n${failures} favicon checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

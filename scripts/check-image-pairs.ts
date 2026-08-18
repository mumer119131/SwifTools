#!/usr/bin/env node
/**
 * Verifies the image conversion pair pages.
 *
 * The failure this guards against is a page that promises a conversion the
 * browser cannot perform. `canvas.toBlob` does not reject an unsupported type
 * — it quietly returns a PNG — so a PNG-to-AVIF page would hand people a PNG
 * named .avif and nothing would report an error.
 *
 *   pnpm check:image-pairs
 */

import process from "node:process";

import { FORMATS, caveats, comparison, formatPairs, getFormatPair } from "@/lib/image-formats";
import { imagePairTools } from "@/tools/image-pairs/meta";
import { getToolContent } from "@/config/tool-content";

/** The only types a browser canvas can reliably encode. */
const ENCODABLE = new Set(["image/png", "image/jpeg", "image/webp"]);

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------------- encodable targets */

for (const pair of formatPairs) {
  assert(
    `${pair.slug} targets a format the browser can encode`,
    pair.to.mime !== null && ENCODABLE.has(pair.to.mime),
    `${pair.to.label} mime is ${pair.to.mime ?? "null"}`,
  );
}

/* ------------------------------------------------------------- structure */

const slugs = new Set<string>();
for (const pair of formatPairs) {
  assert(`${pair.slug} is unique`, !slugs.has(pair.slug));
  slugs.add(pair.slug);

  assert(`${pair.slug} resolves by slug`, getFormatPair(pair.slug) !== undefined);
  assert(`${pair.slug} does not convert to itself`, pair.from.id !== pair.to.id);
  assert(`${pair.slug} slug matches its formats`, pair.slug === `${pair.from.url}-to-${pair.to.url}`);
  assert(`${pair.slug} has a comparison table`, comparison(pair).length === 3);
}

assert(`${formatPairs.length} pairs generated`, formatPairs.length === 16);

/* ---------------------------------------------------------------- caveats */

// The conversions that silently destroy something must say so. These are the
// cases people are surprised by, which is exactly why they need stating.
const transparencyLoss = formatPairs.filter((p) => p.from.transparency && !p.to.transparency);
for (const pair of transparencyLoss) {
  assert(
    `${pair.slug} warns about losing transparency`,
    caveats(pair).some((note) => note.toLowerCase().includes("transparen")),
  );
}
assert("some pair loses transparency, so the warning is exercised", transparencyLoss.length > 0);

const animationLoss = formatPairs.filter((p) => p.from.animation && !p.to.animation);
for (const pair of animationLoss) {
  assert(
    `${pair.slug} warns about losing animation`,
    caveats(pair).some((note) => note.includes("first frame")),
  );
}

// Lossless to lossy must warn; lossy to lossless must say it cannot restore.
for (const pair of formatPairs.filter((p) => !p.from.lossy && p.to.lossy)) {
  assert(
    `${pair.slug} warns that detail is discarded`,
    caveats(pair).some((note) => note.includes("discards detail")),
  );
}
for (const pair of formatPairs.filter((p) => p.from.lossy && !p.to.lossy)) {
  assert(
    `${pair.slug} says quality cannot be recovered`,
    caveats(pair).some((note) => note.includes("cannot restore")),
  );
}

/* --------------------------------------------------------- registry entries */

assert("one tool per pair", imagePairTools.length === formatPairs.length);

for (const tool of imagePairTools) {
  assert(`${tool.slug} is search-only`, tool.searchOnly === true);
  assert(`${tool.slug} is in the image category`, tool.category === "image");
  assert(`${tool.slug} runs client-side`, tool.processing === "client");
  assert(`${tool.slug} has notes`, (getToolContent(tool.slug).notes?.length ?? 0) >= 3);
  assert(`${tool.slug} has FAQ entries`, (getToolContent(tool.slug).faq?.length ?? 0) >= 3);
  assert(
    `${tool.slug} description is within the meta limit`,
    tool.description.length <= 155,
    `${tool.description.length} chars`,
  );
  assert(`${tool.slug} keywords are unique`, new Set(tool.keywords).size === tool.keywords.length);
}

/* ------------------------------------------------------------- format data */

for (const format of FORMATS) {
  assert(`${format.label} has aliases`, format.aliases.length > 0);
  assert(`${format.label} explains its strength`, format.strength.length > 30);
  assert(`${format.label} admits a weakness`, format.weakness.length > 30);
}

console.log(
  failures === 0
    ? `\nAll image pair checks passed — ${formatPairs.length} pages, every target encodable.`
    : `\n${failures} image pair checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

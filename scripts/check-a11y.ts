#!/usr/bin/env node
/**
 * Audits the rendered HTML for accessibility and structured-data defects.
 *
 * Every other check in this repo tests logic. This one tests output, because
 * the defects it looks for cannot be seen in source: a heading level is only
 * wrong relative to the headings around it, an icon-only button is only
 * nameless once its label has been rendered away, and a malformed FAQPage
 * looks exactly like a working one until Google silently declines to show it.
 *
 * Requires a build. Run `pnpm build` first, then:
 *
 *   pnpm start &            # or PORT=xxxx pnpm start
 *   pnpm check:a11y
 *
 * Set BASE to point elsewhere, e.g. BASE=https://pockettoolz.com pnpm check:a11y
 */

import { readFileSync } from "node:fs";
import process from "node:process";

import { guides, guideHref } from "@/config/guides";
import { browsableTools, populatedCategories, toolHref } from "@/config/tools";

const BASE = process.env.BASE ?? "http://localhost:3000";

let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  FAIL  ${message}`);
}

/**
 * A representative sample rather than all 600 pages.
 *
 * Every page shape is covered — home, catalogue, category, a tool from each
 * category, a search-only pair page, guides, blog, legal — because the defects
 * here live in shared components, so one instance of a shape finds them all.
 */
const pages = [
  "/",
  "/tools",
  "/guides",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  ...populatedCategories.map((category) => `/${category.slug}`),
  // One tool per category, plus the two generated page types.
  ...populatedCategories.map((category) => {
    const tool = browsableTools.find((candidate) => candidate.category === category.slug);
    return tool ? toolHref(tool) : null;
  }),
  "/units/lb-to-kg",
  "/image/png-to-jpg",
  ...guides.map((guide) => guideHref(guide)),
  "/blog/whats-new-august-2026",
].filter((path): path is string => Boolean(path));

/* ------------------------------------------------------- colour contrast */

/**
 * Converts OKLCH to sRGB.
 *
 * The palette is authored in OKLCH, so contrast cannot be checked without this
 * — and contrast is the accessibility requirement that fails most quietly.
 * `subtle-foreground` sat at 3.2:1 for months, used on 73 pieces of 12px text
 * including every input placeholder, which is a WCAG AA failure that looks
 * perfectly fine to anyone who can already read it.
 */
function oklchToRgb(L: number, C: number, hue: number): [number, number, number] {
  const h = (hue * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];

  return linear.map((value) => {
    const gamma = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, gamma));
  }) as [number, number, number];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [high, low] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/**
 * Read from globals.css rather than duplicated here, so editing a token is
 * what runs the check — a copy would drift and quietly stop testing anything.
 */
function readTokens(): { theme: string; tokens: Record<string, [number, number, number]> }[] {
  const css = readFileSync("src/styles/globals.css", "utf8");
  const wanted = ["background", "surface", "foreground", "muted-foreground", "subtle-foreground"];

  // The light palette is defined on bare `:root`; the dark one overrides it later.
  const blocks = css.split("--background:");
  const themes: { theme: string; tokens: Record<string, [number, number, number]> }[] = [];

  for (const [index, name] of ["light", "dark"].entries()) {
    const section = blocks[index + 1];
    if (!section) continue;
    const tokens: Record<string, [number, number, number]> = {};

    const first = section.match(/^\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (first) tokens.background = [Number(first[1]), Number(first[2]), Number(first[3])];

    for (const token of wanted.slice(1)) {
      const match = section.match(
        new RegExp(`--${token}:\\s*oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\)`),
      );
      if (match) tokens[token] = [Number(match[1]), Number(match[2]), Number(match[3])];
    }
    themes.push({ theme: name, tokens });
  }
  return themes;
}

for (const { theme, tokens } of readTokens()) {
  for (const background of ["background", "surface"] as const) {
    for (const foreground of ["foreground", "muted-foreground", "subtle-foreground"] as const) {
      const fg = tokens[foreground];
      const bg = tokens[background];
      if (!fg || !bg) {
        fail(`${theme}: could not read --${foreground} or --${background} from globals.css`);
        continue;
      }
      const ratio = contrast(oklchToRgb(...fg), oklchToRgb(...bg));
      // 4.5:1 is the AA threshold for normal-size text, which is what all
      // three of these are used for.
      if (ratio < 4.5) {
        fail(`${theme}: --${foreground} on --${background} is ${ratio.toFixed(2)}:1, below AA (4.5)`);
      }
    }
  }
}

const REQUIRED: Record<string, string[]> = {
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  BreadcrumbList: ["itemListElement"],
  SoftwareApplication: ["name"],
  Article: ["headline"],
  BlogPosting: ["headline", "datePublished"],
  ItemList: ["itemListElement"],
  Organization: ["name"],
  Blog: ["name"],
};

let checked = 0;
let jsonLdBlocks = 0;

for (const path of pages) {
  let html: string;
  try {
    const response = await fetch(`${BASE}${path}`);
    if (!response.ok) {
      fail(`${path} returned ${response.status}`);
      continue;
    }
    html = await response.text();
  } catch (cause) {
    fail(`${path} could not be fetched — is the server running? (${String(cause).slice(0, 60)})`);
    continue;
  }
  checked += 1;

  /* ------------------------------------------------------------ JSON-LD */

  for (const match of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
  )) {
    jsonLdBlocks += 1;
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(match[1]) as Record<string, unknown>;
    } catch (cause) {
      fail(`${path}: unparseable JSON-LD — ${String(cause).slice(0, 60)}`);
      continue;
    }

    const type = String(data["@type"] ?? "");
    if (!data["@context"]) fail(`${path}: ${type} has no @context`);

    for (const field of REQUIRED[type] ?? []) {
      if (data[field] === undefined) fail(`${path}: ${type} is missing ${field}`);
    }

    // An FAQ entry without an answer is worse than no FAQ block at all.
    if (type === "FAQPage") {
      const entries = (data.mainEntity ?? []) as { name?: string; acceptedAnswer?: { text?: string } }[];
      if (entries.length === 0) fail(`${path}: FAQPage with no questions`);
      for (const entry of entries) {
        if (!entry.name || !entry.acceptedAnswer?.text) {
          fail(`${path}: FAQPage entry missing a question or answer`);
        }
      }
    }

    if (type === "BreadcrumbList") {
      const crumbs = (data.itemListElement ?? []) as { position?: number; name?: string }[];
      for (const crumb of crumbs) {
        if (crumb.position === undefined || !crumb.name) {
          fail(`${path}: breadcrumb entry missing position or name`);
        }
      }
    }
  }

  /* ------------------------------------------------------ accessibility */

  if (!/<html[^>]*\blang=/.test(html)) fail(`${path}: <html> has no lang attribute`);

  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  const undescribed = images.filter((tag) => !/\balt=/.test(tag));
  if (undescribed.length > 0) fail(`${path}: ${undescribed.length} <img> without an alt attribute`);

  // Icon-only controls: an svg and nothing else, with no label to announce.
  for (const match of html.matchAll(/<(button|a)\b([^>]*)>(.*?)<\/\1>/gs)) {
    const [, tag, attributes, inner] = match;
    const text = inner.replace(/<svg.*?<\/svg>/gs, "").replace(/<[^>]*>/g, "").trim();
    const labelled = /aria-label=|aria-labelledby=|title=/.test(attributes);
    if (!text && /<svg/.test(inner) && !labelled) {
      fail(`${path}: icon-only <${tag}> with no accessible name`);
      break;
    }
  }

  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));

  const h1s = levels.filter((level) => level === 1).length;
  if (h1s !== 1) fail(`${path}: ${h1s} <h1> elements (expected exactly 1)`);

  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] > levels[i - 1] + 1) {
      fail(`${path}: heading level jumps h${levels[i - 1]} → h${levels[i]}`);
      break;
    }
  }

  // A page with no landmark is a page a screen-reader user cannot skip into.
  if (!/<main\b/.test(html)) fail(`${path}: no <main> landmark`);
}

console.log(
  failures === 0
    ? `\nAccessibility, contrast and structured-data checks passed — ${checked} pages, ${jsonLdBlocks} JSON-LD blocks.`
    : `\n${failures} checks FAILED across ${checked} pages.`,
);

process.exit(failures === 0 ? 0 : 1);

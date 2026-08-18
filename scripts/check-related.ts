#!/usr/bin/env node
/**
 * Checks the related-tools graph.
 *
 * This is an SEO structure as much as a UI one, and both failure modes are
 * invisible on the page. The old implementation returned the first few tools in
 * the category in declaration order, so every tool in a category recommended
 * the same handful: 211 of 279 tools received no internal link from any other
 * tool page, while one collected 90. Nothing about the rendered page looked
 * wrong.
 *
 * The assertions below are therefore mostly about the shape of the whole graph
 * rather than any single list.
 *
 *   pnpm check:related
 */

import process from "node:process";

import { tools } from "@/config/tools";
import { relatedTools, scoreRelation } from "@/lib/related";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const LIMIT = 6;
const live = tools.filter((tool) => tool.status === "live");
const key = (tool: { category: string; slug: string }) => `${tool.category}/${tool.slug}`;

const lists = new Map(live.map((tool) => [key(tool), relatedTools(tool, tools, LIMIT)]));

/* ------------------------------------------------------- basic correctness */

assert("every live tool gets a list", [...lists.values()].every((list) => list.length > 0));
assert(
  `every list is full (${LIMIT})`,
  [...lists.values()].every((list) => list.length === LIMIT),
  [...lists.entries()].filter(([, l]) => l.length !== LIMIT).map(([k, l]) => `${k}:${l.length}`).join(", "),
);

let selfLinks = 0;
let dead = 0;
let duplicates = 0;
for (const [source, list] of lists) {
  if (list.some((item) => key(item) === source)) selfLinks += 1;
  if (list.some((item) => item.status !== "live")) dead += 1;
  if (new Set(list.map(key)).size !== list.length) duplicates += 1;
}
assert("no tool links to itself", selfLinks === 0, `${selfLinks} tools`);
assert("no tool links to an unreleased tool", dead === 0, `${dead} tools`);
assert("no list repeats a tool", duplicates === 0, `${duplicates} tools`);

/* -------------------------------------------------- the search-only divide */

// The ~98 unit pair pages are the best suggestions for each other and would
// swamp everything else if offered to browsable tools.
let leaked = 0;
for (const tool of live) {
  const list = lists.get(key(tool)) ?? [];
  const wantSearchOnly = tool.searchOnly === true;
  if (list.some((item) => (item.searchOnly === true) !== wantSearchOnly)) leaked += 1;
}
assert("search-only tools stay in their own pool", leaked === 0, `${leaked} tools leaked`);

/* --------------------------------------------------- the graph as a whole */

const inbound = new Map<string, number>();
for (const list of lists.values()) {
  for (const item of list) inbound.set(key(item), (inbound.get(key(item)) ?? 0) + 1);
}

const orphans = live.filter((tool) => !inbound.has(key(tool)));
assert(
  "every live tool receives at least one inbound link",
  orphans.length === 0,
  orphans.map((tool) => tool.slug).join(", "),
);

const counts = [...inbound.values()].sort((a, b) => b - a);
const total = live.length * LIMIT;

// A ceiling on concentration. The old implementation put 90 of 279 tools'
// links onto a single page; anything approaching that means the ranking has
// collapsed back to a fixed list.
assert(
  `no tool absorbs more than 15% of all links (top is ${counts[0]}/${total})`,
  counts[0] / total < 0.15,
);
assert(`the median tool has several inbound links (${counts[Math.floor(counts.length / 2)]})`,
  counts[Math.floor(counts.length / 2)] >= 3);

/* ------------------------------------------------------------ determinism */

// Called once per page during a static build, and the cache is shared, so a
// second call returning something different would mean pages disagree.
let unstable = 0;
for (const tool of live.slice(0, 40)) {
  const again = relatedTools(tool, tools, LIMIT);
  if (again.map(key).join(",") !== (lists.get(key(tool)) ?? []).map(key).join(",")) unstable += 1;
}
assert("repeated calls return the same list", unstable === 0, `${unstable} differed`);

/* ------------------------------------------------------------- relevance */

// Spot checks. Each of these was wrong at some point while tuning: a single
// rare shared token ("many", "message") used to outweigh the category, which
// put a subnet calculator beside a tile calculator.
const expectations: [string, string[]][] = [
  ["sql-formatter", ["json-formatter", "css-formatter", "html-formatter"]],
  ["hmac-generator", ["sha256-hash-generator", "jwt-decoder"]],
  ["exif-viewer", ["rotate-image", "image-to-base64", "resize-image"]],
  ["compress-image", ["resize-image", "convert-image"]],
  ["merge-pdf", ["split-pdf", "compress-pdf"]],
  ["lb-to-kg", ["kg-to-lb"]],
  ["bmi-calculator", ["calorie-calculator", "age-calculator"]],
  ["png-to-jpg", ["jpg-to-png", "png-to-webp", "webp-to-jpg"]],
];

for (const [slug, expected] of expectations) {
  const tool = live.find((candidate) => candidate.slug === slug);
  if (!tool) {
    failures += 1;
    console.error(`  FAIL  ${slug} is not in the registry`);
    continue;
  }
  const got = (lists.get(key(tool)) ?? []).map((item) => item.slug);
  const hit = expected.filter((want) => got.includes(want));
  assert(
    `${slug} suggests something sensible (${hit.join(", ") || "nothing"})`,
    hit.length > 0,
    `got ${got.join(", ")}`,
  );
}

// A tool must never be more related to something in another category than to
// an obvious sibling sharing its whole subject.
const pngToJpg = live.find((t) => t.slug === "png-to-jpg");
const jpgToPng = live.find((t) => t.slug === "jpg-to-png");
const wordCounter = live.find((t) => t.slug === "word-counter");
if (pngToJpg && jpgToPng && wordCounter) {
  assert(
    "an obvious sibling outscores an unrelated tool",
    scoreRelation(pngToJpg, jpgToPng, tools) > scoreRelation(pngToJpg, wordCounter, tools),
  );
}

console.log(
  failures === 0
    ? `\nRelated-tool graph checks passed — ${live.length} tools, ${total} links, no orphans.`
    : `\n${failures} related-tool checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

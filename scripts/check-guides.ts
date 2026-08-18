#!/usr/bin/env node
/**
 * Checks the guides.
 *
 * The risk a guide carries is not that it breaks — it is prose in a server
 * component, it will render — but that it competes with the site's own tool
 * pages. A guide targeting the same query as a tool splits the signal between
 * two URLs and can leave both ranking worse than one would have. So the keyword
 * overlap between guides and tools is asserted here, along with the plumbing.
 *
 *   pnpm check:guides
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

import { guides, getGuide, guideHref } from "@/config/guides";
import { tools } from "@/config/tools";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const loaders = readFileSync("src/guides/loaders.tsx", "utf8");
const live = tools.filter((tool) => tool.status === "live");
const bySlug = new Map(live.map((tool) => [tool.slug, tool]));

/* -------------------------------------------------------------- plumbing */

assert("there are guides", guides.length > 0);
assert(
  "guide slugs are unique",
  new Set(guides.map((guide) => guide.slug)).size === guides.length,
);

for (const guide of guides) {
  // Node's type stripping cannot parse JSX, so the wiring is checked by
  // reading the files rather than importing them.
  assert(
    `${guide.slug} has a content file`,
    existsSync(`src/guides/${guide.slug}/content.tsx`),
  );
  assert(
    `${guide.slug} is registered in the loader`,
    loaders.includes(`"${guide.slug}":`),
  );
  assert(`${guide.slug} resolves by slug`, getGuide(guide.slug)?.slug === guide.slug);
  assert(
    `${guide.slug} has a sensible description (${guide.description.length} chars)`,
    guide.description.length > 60 && guide.description.length <= 200,
  );
  assert(`${guide.slug} has keywords`, guide.keywords.length >= 4);
  assert(
    `${guide.slug} has valid dates`,
    !Number.isNaN(Date.parse(guide.published)) && !Number.isNaN(Date.parse(guide.updated)),
  );
  assert(
    `${guide.slug} was not updated before it was published`,
    Date.parse(guide.updated) >= Date.parse(guide.published),
  );
}

// A body with no registry entry is a page nothing links to.
const registered = [...loaders.matchAll(/"([a-z0-9-]+)":/g)].map((match) => match[1]);
const orphanBodies = registered.filter((slug) => !getGuide(slug));
assert("no guide body lacks a registry entry", orphanBodies.length === 0, orphanBodies.join(", "));

/* ------------------------------------------------- every guide feeds tools */

for (const guide of guides) {
  const missing = guide.tools.filter((slug) => !bySlug.has(slug));
  assert(
    `${guide.slug} references only live tools`,
    missing.length === 0,
    `unknown: ${missing.join(", ")}`,
  );
  // A guide that sends nobody to a tool is just an article.
  assert(`${guide.slug} points at several tools (${guide.tools.length})`, guide.tools.length >= 3);
}

/* ------------------------------------------ guides must not fight the tools */

// An exact keyword shared between a guide and a tool is two of our own pages
// bidding for the same query.
const toolKeywords = new Map<string, string>();
for (const tool of live) {
  for (const keyword of tool.keywords) toolKeywords.set(keyword.toLowerCase(), tool.slug);
}

const collisions: string[] = [];
for (const guide of guides) {
  for (const keyword of guide.keywords) {
    const owner = toolKeywords.get(keyword.toLowerCase());
    if (owner) collisions.push(`"${keyword}" — ${guide.slug} vs tool ${owner}`);
  }
}
assert(
  "no guide targets a keyword a tool already owns",
  collisions.length === 0,
  collisions.join("; "),
);

const guideKeywords = new Map<string, string>();
const guideDupes: string[] = [];
for (const guide of guides) {
  for (const keyword of guide.keywords) {
    const key = keyword.toLowerCase();
    const owner = guideKeywords.get(key);
    if (owner) guideDupes.push(`"${keyword}" — ${guide.slug} and ${owner}`);
    else guideKeywords.set(key, guide.slug);
  }
}
assert("no two guides target the same keyword", guideDupes.length === 0, guideDupes.join("; "));

const titles = guides.map((guide) => guide.title.toLowerCase());
assert("guide titles are distinct", new Set(titles).size === titles.length);

/* ------------------------------------------------- prose stays server-side */

// Guides are server components made of prose. If one ever becomes a client
// component the whole article ships as JavaScript, which is the mistake the
// tool registry already made once.
const clientGuides = execSync(
  `grep -rl '"use client"' src/guides src/app/guides || true`,
  { encoding: "utf8" },
).split("\n").filter(Boolean);
assert("no guide is a client component", clientGuides.length === 0, clientGuides.join(", "));

/* ------------------------------------------------------------ hrefs work */

for (const guide of guides) {
  assert(`${guide.slug} builds a sane href`, guideHref(guide) === `/guides/${guide.slug}`);
}

console.log(
  failures === 0
    ? `\nGuide checks passed — ${guides.length} guides, ${guides.reduce((n, g) => n + g.tools.length, 0)} tool links, no keyword collisions.`
    : `\n${failures} guide checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

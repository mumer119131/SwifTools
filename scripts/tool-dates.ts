#!/usr/bin/env node
/**
 * Writes src/config/tool-dates.json — the last commit date for each tool
 * folder, so the sitemap can report a real `lastModified` instead of the build
 * time.
 *
 * Every URL claiming to have changed on every deploy is a signal crawlers learn
 * to ignore, and it wastes crawl budget re-fetching 237 unchanged pages.
 *
 *   pnpm dates
 */

import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import process from "node:process";

const dates: Record<string, string> = {};

/** Last commit touching any of `paths`, or "" if none of them has history. */
function lastCommit(paths: string[]): string {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      encoding: "utf8",
    }).trim();
  } catch {
    // A path with no commits yet simply has no date; the sitemap falls back.
    return "";
  }
}

for (const slug of readdirSync("src/tools", { withFileTypes: true })) {
  if (!slug.isDirectory()) continue;

  const iso = lastCommit([`src/tools/${slug.name}`]);
  if (iso) dates[slug.name] = iso;
}

/**
 * The unit pair pages are generated, so their content changes when either the
 * shared page implementation or the ratio table does. Deriving the date from
 * the folder alone dated 28 newly added pairs to before they existed, which
 * tells a crawler the page is older than its first appearance.
 */
const unitPairs = lastCommit(["src/tools/unit-pairs", "src/lib/units.ts"]);
if (unitPairs) dates["unit-pairs"] = unitPairs;

writeFileSync("src/config/tool-dates.json", `${JSON.stringify(dates, null, 2)}\n`);
console.log(`Wrote ${Object.keys(dates).length} tool dates.`);
process.exit(0);

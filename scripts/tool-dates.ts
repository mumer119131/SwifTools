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

for (const slug of readdirSync("src/tools", { withFileTypes: true })) {
  if (!slug.isDirectory()) continue;

  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", `src/tools/${slug.name}`],
      { encoding: "utf8" },
    ).trim();

    if (iso) dates[slug.name] = iso;
  } catch {
    // A folder with no commits yet simply has no date; the sitemap falls back.
  }
}

writeFileSync("src/config/tool-dates.json", `${JSON.stringify(dates, null, 2)}\n`);
console.log(`Wrote ${Object.keys(dates).length} tool dates.`);
process.exit(0);

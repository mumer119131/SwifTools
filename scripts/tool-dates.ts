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
import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";

const dates: Record<string, string> = {};

/** Last commit touching any of `paths`, or "" if none of them has history. */
function lastCommit(paths: string[], flags: string[] = ["-1", "--format=%cI"]): string {
  try {
    return execFileSync("git", ["log", ...flags, "--", ...paths], {
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
 * The unit pair pages are generated, so a single shared date is wrong in both
 * directions: dating them from the folder alone puts new pairs before they
 * existed, and dating them all from the ratio table's last commit claims every
 * pair changed whenever any dimension was added.
 *
 * So each pair gets the commit that introduced it. `src/lib/units.ts` has no
 * imports, which makes replaying its history a matter of importing each
 * revision and asking it for its own slugs — no parsing of the table by hand,
 * so the answer cannot drift from how the slugs are really built.
 */
async function unitPairDates(): Promise<Record<string, string>> {
  const firstSeen: Record<string, string> = {};
  const signatures: Record<string, string> = {};

  const history = lastCommit(["src/lib/units.ts"], ["--format=%H %cI", "--reverse"])
    .split("\n")
    .filter(Boolean);

  for (const line of history) {
    const [sha, iso] = line.split(" ");

    let source: string;
    try {
      source = execFileSync("git", ["show", `${sha}:src/lib/units.ts`], { encoding: "utf8" });
    } catch {
      continue; // The file did not exist at this revision.
    }

    // Imported from a temp file rather than a data: URL so a relative import
    // added to units.ts later would still resolve rather than silently fail.
    const temp = join(tmpdir(), `units-${sha}.ts`);
    writeFileSync(temp, source);
    try {
      const revision = (await import(pathToFileURL(temp).href)) as {
        unitPairs?: { slug: string }[];
        convertPair?: (pair: unknown, value: number) => number;
      };

      for (const pair of revision.unitPairs ?? []) {
        // Two probes, because a scale conversion carries an offset as well as
        // a ratio and one probe cannot tell 0C→32F from a pure multiplier.
        const signature = revision.convertPair
          ? `${revision.convertPair(pair, 1)}/${revision.convertPair(pair, 0)}`
          : "";

        // The page changed when it first appeared and whenever its arithmetic
        // moved after that — a corrected ratio is a content change, so a date
        // frozen at first appearance would under-report it.
        if (signatures[pair.slug] !== signature) {
          signatures[pair.slug] = signature;
          firstSeen[pair.slug] = iso;
        }
      }
    } catch {
      // A revision that cannot be imported contributes nothing; later ones
      // still date every pair that survives to HEAD.
    } finally {
      rmSync(temp, { force: true });
    }
  }

  return firstSeen;
}

/** The shared implementation, used for any pair the replay could not date. */
const pairFallback = lastCommit(["src/tools/unit-pairs", "src/lib/units.ts"]);
if (pairFallback) dates["unit-pairs"] = pairFallback;

for (const [slug, iso] of Object.entries(await unitPairDates())) {
  dates[slug] = iso;
}

writeFileSync("src/config/tool-dates.json", `${JSON.stringify(dates, null, 2)}\n`);
console.log(`Wrote ${Object.keys(dates).length} tool dates.`);
process.exit(0);

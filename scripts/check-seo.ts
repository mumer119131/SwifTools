#!/usr/bin/env node
/**
 * Asserts that every tool page carries enough of its own content to rank.
 *
 * The failure this guards against is subtle: a page can have a perfect title,
 * description and JSON-LD and still be a thin page, because the tool body is
 * loaded with `ssr: false` and a crawler sees none of it. `notes` and `faq` are
 * the parts that actually reach the HTML, so they are checked rather than
 * trusted.
 *
 * It also catches copied-and-pasted filler, which is worse than no content —
 * duplicate answers across tools make the whole site look generated.
 *
 *   pnpm check:seo
 */

import process from "node:process";

import {
  INDEX_UNIT_PAIRS,
  browsableTools,
  isIndexable,
  isUnitPair,
  populatedCategories,
  publishedTools,
  tools,
} from "@/config/tools";
import { getCategory } from "@/config/categories";
import { getToolContent } from "@/config/tool-content";
import { buildToolMetadata } from "@/lib/seo";
import { pageTitle } from "@/config/site";
import { guides } from "@/config/guides";
import { appForTool, playApps, playStoreUrl } from "@/config/apps";
import { buildCategoryMetadata } from "@/lib/seo";

let failures = 0;
let warnings = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  FAIL  ${message}`);
}

function warn(message: string): void {
  warnings += 1;
  console.warn(`  warn  ${message}`);
}

/* ------------------------------------------------------- metadata basics */

const seenTitles = new Map<string, string>();
const seenDescriptions = new Map<string, string>();

for (const tool of tools) {
  const category = getCategory(tool.category);

  if (!category) fail(`${tool.slug}: category "${tool.category}" does not exist`);

  /*
   * Read the real title out of buildToolMetadata rather than rebuilding the
   * format string here — a check that duplicates the logic it is testing will
   * agree with itself while the site does something else. Google truncates
   * around 60 characters of title and 155 of description.
   */
  const segment = buildToolMetadata(tool).title;
  const title = pageTitle(typeof segment === "string" ? segment : tool.name);
  if (title.length > 70) warn(`${tool.slug}: title is ${title.length} chars — "${title}"`);

  if (tool.description.length > 155) {
    fail(`${tool.slug}: description is ${tool.description.length} chars, over the 155 limit`);
  }
  if (tool.description.length < 40) {
    fail(`${tool.slug}: description is only ${tool.description.length} chars`);
  }

  // Two pages competing on the same title is two pages splitting one ranking.
  const previousTitle = seenTitles.get(tool.name.toLowerCase());
  if (previousTitle && previousTitle !== tool.slug) {
    fail(`${tool.slug}: shares its name with ${previousTitle}`);
  }
  seenTitles.set(tool.name.toLowerCase(), tool.slug);

  const previousDescription = seenDescriptions.get(tool.description);
  if (previousDescription) {
    fail(`${tool.slug}: has the same description as ${previousDescription}`);
  }
  seenDescriptions.set(tool.description, tool.slug);

  if (tool.keywords.length < 3) fail(`${tool.slug}: only ${tool.keywords.length} keywords`);
  if (new Set(tool.keywords).size !== tool.keywords.length) {
    fail(`${tool.slug}: has duplicate keywords`);
  }
}

console.log(`  ok    ${tools.length} tools have unique names, titles and descriptions`);

/* --------------------------------------------------- server-rendered body */

/*
 * Pair pages share one implementation and one body; they are long-tail landing
 * pages carrying a live converter, a formula and a value table, and they are
 * deliberately not each given a hand-written essay.
 */
const needsContent = browsableTools.filter((tool) => tool.status === "live");

const missingNotes: string[] = [];
const missingFaq: string[] = [];
const thinNotes: string[] = [];

for (const tool of needsContent) {
  if (!getToolContent(tool.slug).notes?.length) missingNotes.push(tool.slug);
  else {
    const words = (getToolContent(tool.slug).notes ?? []).join(" ").split(/\s+/).length;
    // Under ~90 words is not an explanation, it is a caption.
    if (words < 90) thinNotes.push(`${tool.slug} (${words} words)`);
  }

  if (!getToolContent(tool.slug).faq?.length || (getToolContent(tool.slug).faq ?? []).length < 3) {
    missingFaq.push(`${tool.slug} (${getToolContent(tool.slug).faq?.length ?? 0})`);
  }
}

if (missingNotes.length > 0) {
  fail(`${missingNotes.length} live tools have no notes: ${missingNotes.slice(0, 8).join(", ")}${missingNotes.length > 8 ? ", …" : ""}`);
} else {
  console.log(`  ok    all ${needsContent.length} live tools have server-rendered notes`);
}

if (thinNotes.length > 0) {
  fail(`${thinNotes.length} tools have notes under 90 words: ${thinNotes.slice(0, 6).join(", ")}${thinNotes.length > 6 ? ", …" : ""}`);
} else if (needsContent.every((tool) => getToolContent(tool.slug).notes?.length)) {
  console.log("  ok    every notes block is substantial");
}

if (missingFaq.length > 0) {
  fail(`${missingFaq.length} tools have fewer than 3 FAQ entries: ${missingFaq.slice(0, 8).join(", ")}${missingFaq.length > 8 ? ", …" : ""}`);
} else {
  console.log(`  ok    all ${needsContent.length} live tools have at least 3 FAQ entries`);
}

/* ------------------------------------------------------------ FAQ quality */

const seenQuestions = new Map<string, string>();
const seenAnswers = new Map<string, string>();

/** Answers that say nothing. Schema padded with these gets the page ignored. */
const FILLER = [
  /^yes\.?$/i,
  /^no\.?$/i,
  /^yes,? it is\.?$/i,
  /^it('s| is) free\.?$/i,
  /^absolutely/i,
];

for (const tool of needsContent) {
  for (const entry of getToolContent(tool.slug).faq ?? []) {
    const question = entry.question.trim();
    const answer = entry.answer.trim();

    if (!question.endsWith("?")) {
      fail(`${tool.slug}: FAQ entry is not a question — "${question}"`);
    }

    // A one-line answer will not earn a rich result and reads as filler.
    if (answer.split(/\s+/).length < 15) {
      fail(`${tool.slug}: answer to "${question}" is only ${answer.split(/\s+/).length} words`);
    }

    if (FILLER.some((pattern) => pattern.test(answer))) {
      fail(`${tool.slug}: filler answer to "${question}"`);
    }

    const questionKey = question.toLowerCase();
    const previousQuestion = seenQuestions.get(questionKey);
    if (previousQuestion && previousQuestion !== tool.slug) {
      fail(`duplicate question across tools: "${question}" in ${previousQuestion} and ${tool.slug}`);
    }
    seenQuestions.set(questionKey, tool.slug);

    const answerKey = answer.toLowerCase();
    const previousAnswer = seenAnswers.get(answerKey);
    if (previousAnswer && previousAnswer !== tool.slug) {
      fail(`duplicate answer across tools: ${previousAnswer} and ${tool.slug}`);
    }
    seenAnswers.set(answerKey, tool.slug);
  }
}

const totalQuestions = needsContent.reduce((sum, tool) => sum + (getToolContent(tool.slug).faq?.length ?? 0), 0);
if (totalQuestions > 0) {
  console.log(`  ok    ${totalQuestions} FAQ entries, all unique and substantive`);
}

/* -------------------------------------------------------------- HowTo LD */

const noSteps = publishedTools.filter((tool) => !tool.searchOnly && !getToolContent(tool.slug).steps?.length);
if (noSteps.length > 0) {
  fail(`${noSteps.length} live tools have no steps, so emit no HowTo schema: ${noSteps.slice(0, 6).join(", ")}`);
} else {
  console.log("  ok    every live tool emits HowTo schema");
}

const totalNoteWords = needsContent.reduce(
  (sum, tool) => sum + (getToolContent(tool.slug).notes?.join(" ").split(/\s+/).length ?? 0),
  0,
);

/* --------------------------------------------- app links point somewhere real */

/*
 * The store links are hand-written package names, so a typo would produce a
 * dead Play Store page that nothing else would catch. The cross-links matter
 * more: a plug on an unrelated tool is an advert, so appForTool must stay
 * silent everywhere except the pages where the app answers a real limitation.
 */
for (const app of playApps) {
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(app.packageName)) {
    fail(`${app.name}: "${app.packageName}" is not a valid Android package name`);
  }
  if (!playStoreUrl(app).startsWith("https://play.google.com/store/apps/details?id=")) {
    fail(`${app.name}: store URL is malformed`);
  }

  for (const slug of app.relatedTools) {
    if (!publishedTools.some((tool) => tool.slug === slug)) {
      fail(`${app.name} points at "${slug}", which is not a live tool`);
    }
  }

  // A cross-link with nowhere to appear is dead copy nobody will notice.
  if (app.crossLink && app.relatedTools.length === 0) {
    fail(`${app.name} has cross-link copy but no tools to show it on`);
  }
}

const withCallout = publishedTools.filter((tool) => appForTool(tool.slug));
const expected = playApps
  .filter((app) => app.crossLink)
  .flatMap((app) => app.relatedTools).length;

if (withCallout.length !== expected) {
  fail(`${withCallout.length} tools show an app callout, expected ${expected}`);
}
if (withCallout.length > 8) {
  fail(`${withCallout.length} tools show an app callout — that is promotion, not help`);
}

console.log(
  `  ok    ${playApps.length} apps link out cleanly, callouts on ${withCallout.length} tools`,
);

/* ------------------------------------------ titles survive Google's clipping */

/*
 * Google clips a title around 60 characters. The tool builder chooses between
 * three forms to stay inside that, but the budget has to subtract what
 * pageTitle appends — an earlier threshold did not, and 82 of 232 titles were
 * being clipped, the longest at 72. Measured on the rendered title rather than
 * the segment, because the segment alone is not what appears in results.
 */
const TITLE_LIMIT = 60;

for (const tool of publishedTools) {
  const rendered = pageTitle(String(buildToolMetadata(tool).title));
  if (rendered.length > TITLE_LIMIT) {
    fail(`${tool.slug}: title is ${rendered.length} chars and will be clipped — ${rendered}`);
  }
  // The tool's own name is the part worth keeping; losing it defeats the point.
  if (!rendered.startsWith(tool.name)) {
    fail(`${tool.slug}: title no longer leads with the tool name — ${rendered}`);
  }
}

for (const guide of guides) {
  const rendered = pageTitle(guide.title);
  if (rendered.length > TITLE_LIMIT) {
    fail(`guide ${guide.slug}: title is ${rendered.length} chars — ${rendered}`);
  }
}

for (const category of populatedCategories) {
  const metadata = buildCategoryMetadata(category.slug);
  const rendered = pageTitle(String(metadata?.title ?? ""));
  if (rendered.length > TITLE_LIMIT) {
    fail(`category ${category.slug}: title is ${rendered.length} chars — ${rendered}`);
  }
}

console.log(`  ok    every title fits inside ${TITLE_LIMIT} characters`);

/* ------------------------------------------- indexing stays self-consistent */

/*
 * The sitemap and the robots meta must agree. A URL listed in the sitemap while
 * telling crawlers not to index it is a contradiction that spends crawl budget
 * to reach a page it is then told to discard, so both read isIndexable and this
 * asserts they cannot drift.
 */
for (const tool of tools) {
  const robots = buildToolMetadata(tool)?.robots;
  const noindex =
    typeof robots === "object" && robots !== null && "index" in robots
      ? robots.index === false
      : false;

  if (noindex !== !isIndexable(tool)) {
    fail(
      `${tool.slug}: robots meta and sitemap eligibility disagree ` +
        `(indexable=${isIndexable(tool)}, noindex=${noindex})`,
    );
  }
}

const unitPairs = tools.filter(isUnitPair);
if (unitPairs.length === 0) fail("the unit pair family is no longer recognised");

const strayPairs = unitPairs.filter((tool) => isIndexable(tool) !== INDEX_UNIT_PAIRS);
if (strayPairs.length > 0) {
  fail(
    `${strayPairs.length} unit pairs ignore INDEX_UNIT_PAIRS=${INDEX_UNIT_PAIRS}: ` +
      strayPairs.slice(0, 3).map((tool) => tool.slug).join(", "),
  );
}

// Whatever the flag says, a real tool page must always be indexable.
const hidden = browsableTools.filter((tool) => !isIndexable(tool));
if (hidden.length > 0) {
  fail(`browsable tools excluded from indexing: ${hidden.map((t) => t.slug).join(", ")}`);
}

console.log(
  `  ok    indexing is self-consistent — ${tools.filter(isIndexable).length} indexable, ` +
    `${unitPairs.length} unit pairs ${INDEX_UNIT_PAIRS ? "included" : "held back"}`,
);

console.log(
  failures === 0
    ? `\nSEO checks passed — ${totalNoteWords.toLocaleString("en-US")} words of server-rendered copy across ${needsContent.length} tools${warnings > 0 ? `, ${warnings} warnings` : ""}.`
    : `\n${failures} SEO checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

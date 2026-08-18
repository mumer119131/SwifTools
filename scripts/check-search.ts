#!/usr/bin/env node
/**
 * Asserts that the ⌘K palette returns the tool a person meant.
 *
 * Search relevance is the kind of thing that silently regresses — a new tool
 * with broad keywords can quietly outrank an exact match, which is exactly the
 * bug this file was written for ("bmi" used to return Merge PDF first, because
 * cmdk's fuzzy matcher found b-m-i scattered across its keywords).
 *
 *   pnpm check:search
 */

import process from "node:process";

import { tools } from "../src/config/tools.ts";
import { searchTools } from "../src/lib/search.ts";

/** [query, expected top result slug] */
const expectations: [string, string][] = [
  // The reported bug.
  ["bmi", "bmi-calculator"],
  ["BMI", "bmi-calculator"],
  ["bmi calculator", "bmi-calculator"],

  // Exact and partial names.
  ["merge", "merge-pdf"],
  ["merge pdf", "merge-pdf"],
  ["split", "split-pdf"],
  ["resize", "resize-image"],
  ["crop", "crop-image"],
  ["invoice", "invoice-generator"],
  ["regex", "regex-tester"],
  ["pomodoro", "pomodoro-timer"],
  ["lorem", "lorem-ipsum-generator"],

  // Acronyms and short identifiers.
  ["jwt", "jwt-decoder"],
  ["uuid", "uuid-generator"],
  ["qr", "qr-code-generator"],
  ["md5", "md5-hash-generator"],
  ["sha256", "sha256-hash-generator"],
  ["sha512", "sha512-hash-generator"],
  ["emi", "loan-calculator"],

  // Multi-word intent.
  ["pdf to word", "pdf-to-word"],
  ["word to pdf", "word-to-pdf"],
  ["remove background", "remove-background"],
  ["hex to rgb", "color-picker"],
  ["count words", "word-counter"],

  // Keyword-only matches — the word never appears in the tool's name.
  ["slugify", "url-slug-generator"],
  ["timezone", "timezone-converter"],
  ["whatsapp", "whatsapp-chat-generator"],
  ["youtube", "youtube-thumbnail-grabber"],
  ["terser", "js-minifier"],
  ["prettier", "js-formatter"],

  // Initials.
  ["wc", "word-counter"],

  // Unit conversions. Every one of these returned fuzzy junk before the unit
  // converter was split into per-type tools and direct pair pages.
  ["lb to kg", "lb-to-kg"],
  ["kg to lb", "kg-to-lb"],
  ["lbs to kg", "lb-to-kg"],
  ["pounds to kilograms", "lb-to-kg"],
  ["cm to inches", "cm-to-inches"],
  ["inches to cm", "inches-to-cm"],
  ["km to miles", "km-to-miles"],
  ["celsius to fahrenheit", "celsius-to-fahrenheit"],
  ["fahrenheit to celsius", "fahrenheit-to-celsius"],
  ["mb to gb", "mb-to-gb"],
  ["m to ft", "m-to-feet"],
  ["kmh to mph", "kmh-to-mph"],

  // Science and engineering.
  ["ohms law", "ohms-law-calculator"],
  ["limiting reagent", "stoichiometry-calculator"],
  ["theoretical yield", "stoichiometry-calculator"],
  ["molar mass", "molecular-weight-calculator"],
  ["carbon dating", "half-life-calculator"],
  ["sig figs", "significant-figures-calculator"],
  ["led resistor", "led-resistor-calculator"],
  ["voltage divider", "voltage-divider-calculator"],
  ["resistor color", "resistor-color-code-calculator"],

  // Whole questions, typed the way people actually type them. Each of these
  // contains at least one word no tool in the registry uses, so they only work
  // because an unmatched token is penalised rather than disqualifying.
  ["ph of a solution", "ph-calculator"],
  ["what is the molar mass of caffeine", "molecular-weight-calculator"],
  ["how many sig figs in 0.004520", "significant-figures-calculator"],
  ["4.7k resistor color", "resistor-color-code-calculator"],
  ["how to compress an image", "compress-image"],
  ["what is my bmi", "bmi-calculator"],
  // "what" is a near-perfect prefix of WhatsApp — the question word must not
  // be allowed to decide the result.
  ["what is 15 percent of 200", "percentage-calculator"],

  // Home and lifestyle.
  ["square footage", "square-footage-calculator"],
  ["how much paint do i need", "paint-calculator"],
  ["how many tiles", "tile-calculator"],
  ["cubic yards of concrete", "concrete-calculator"],
  ["cups to grams", "cooking-measurement-converter"],
  ["scale a recipe", "recipe-scaler"],
  ["moving checklist", "moving-checklist"],
  ["grocery list", "grocery-list"],
  ["price per unit", "unit-price-calculator"],
  ["cost to run a space heater", "electricity-cost-calculator"],
  ["solar payback", "solar-savings-calculator"],
  ["fence posts", "fence-calculator"],

  // Fun and utility.
  ["flip a coin", "coin-flipper"],
  ["roll dice", "dice-roller"],
  ["d20", "dice-roller"],
  ["spin the wheel", "wheel-spinner"],
  ["random number between 1 and 100", "random-number-generator"],
  ["shuffle a list", "list-randomizer"],
  ["sudoku", "sudoku-generator"],
  ["bingo", "bingo-card"],
  ["word search", "word-search"],
  ["crossword", "crossword-maker"],
  ["meme", "meme-generator"],
  ["whiteboard", "online-whiteboard"],
  ["deuteranopia", "color-blindness-simulator"],
  ["bracket", "tournament-bracket"],
  ["help me decide", "decision-maker"],
  ["pick a name", "random-name-picker"],

  // Productivity and generators.
  ["notepad", "online-notepad"],
  ["todo list", "to-do-list"],
  ["typing test", "typing-speed-test"],
  ["wpm", "typing-speed-test"],
  ["habit tracker", "habit-tracker"],
  ["budget", "budget-tracker"],
  ["ascii art", "ascii-art-generator"],
  ["team names", "team-name-generator"],
  ["icebreaker", "icebreaker-questions"],
  ["story ideas", "story-plot-generator"],
  ["trivia", "trivia-questions"],
  ["quiz maker", "quiz-builder"],
  ["screen ruler", "screen-ruler"],
  ["pixel font", "pixel-font-maker"],

  // Play Store listing images.
  ["play store screenshot", "play-store-screenshot-generator"],
  ["app store screenshots", "play-store-screenshot-generator"],
  ["feature graphic", "play-store-screenshot-generator"],

  // The eight tools added to fill evidenced gaps. Every one of these queries
  // returned nothing, or something unrelated, before they existed.
  ["favicon", "favicon-generator"],
  ["favicon generator", "favicon-generator"],
  ["unix timestamp", "unix-timestamp-converter"],
  ["epoch converter", "unix-timestamp-converter"],
  ["contrast checker", "contrast-checker"],
  ["wcag contrast", "contrast-checker"],
  ["csv to json", "csv-to-json"],
  ["json to csv", "csv-to-json"],
  ["css gradient", "css-gradient-generator"],
  ["box shadow", "box-shadow-generator"],
  ["tip calculator", "tip-calculator"],
  ["split the bill", "tip-calculator"],
  ["days between dates", "date-difference-calculator"],

  // Image format pairs. Every one of these used to land on the generic
  // convert-image tool, which can never rank for a specific format query.
  // "png to jpg" used to be asserted against convert-image, as the best answer
  // available at the time. A dedicated page is a better one.
  ["png to jpg", "png-to-jpg"],
  ["png to webp", "png-to-webp"],
  ["webp to png", "webp-to-png"],
  ["heic to jpg", "heic-to-jpg"],
  ["svg to png", "svg-to-png"],
  ["avif to jpg", "avif-to-jpg"],

  // Text tools. "find and replace" and "extract emails" returned nothing at
  // all before these existed; "sort lines" returned remove-duplicate-lines.
  ["find and replace", "find-and-replace"],
  ["sort lines", "sort-lines"],
  ["alphabetize", "sort-lines"],
  ["remove line breaks", "remove-line-breaks"],
  ["extract emails", "extract-from-text"],
  ["email extractor", "extract-from-text"],

  // SEO tools. "utm builder" returned quiz-builder and "schema generator"
  // returned meme-generator before these existed.
  ["utm builder", "utm-builder"],
  ["utm parameters", "utm-builder"],
  ["schema generator", "schema-generator"],
  ["json-ld", "schema-generator"],
  ["robots.txt tester", "robots-txt-tester"],
  ["hreflang", "hreflang-generator"],

  // Image and privacy tools. "remove exif" and "image to base64" returned
  // nothing before these existed; "instagram post size" landed on the
  // Instagram filter tool, which cannot help with dimensions.
  ["exif", "exif-viewer"],
  ["remove exif data", "exif-viewer"],
  ["strip gps from photo", "exif-viewer"],
  ["photo metadata", "exif-viewer"],
  ["image to base64", "image-to-base64"],
  ["base64 encode image", "image-to-base64"],
  ["data uri", "image-to-base64"],
  ["rotate image", "rotate-image"],
  ["flip image", "rotate-image"],
  ["mirror image", "rotate-image"],
  ["social media image resizer", "social-media-resizer"],
  ["instagram post size", "social-media-resizer"],
  ["youtube thumbnail size", "social-media-resizer"],
  ["twitter header size", "social-media-resizer"],
  ["linkedin banner size", "social-media-resizer"],

  // Developer batch. "subnet calculator", "cron expression" and "hmac"
  // returned nothing usable before these existed.
  ["subnet calculator", "subnet-calculator"],
  ["cidr", "subnet-calculator"],
  ["netmask", "subnet-calculator"],
  ["cron", "cron-expression-builder"],
  ["cron expression", "cron-expression-builder"],
  ["crontab", "cron-expression-builder"],
  ["hmac", "hmac-generator"],
  ["webhook signature", "hmac-generator"],
  ["yaml to json", "yaml-to-json"],
  ["json to yaml", "yaml-to-json"],
  ["sql formatter", "sql-formatter"],
  ["format sql", "sql-formatter"],
  ["json to typescript", "json-to-typescript"],
  ["typescript interface generator", "json-to-typescript"],

  // Timer and stopwatch. "timer" and "stopwatch" previously returned the
  // Pomodoro timer, which is a specific technique rather than a plain timer.
  ["timer", "timer"],
  ["online timer", "timer"],
  ["stopwatch", "timer"],
  ["countdown timer", "timer"],
  ["5 minute timer", "timer"],
  ["set a timer", "timer"],
  // The Pomodoro tool must still win its own name.
  ["pomodoro timer", "pomodoro-timer"],

  // Signing. "sign pdf" previously returned split-pdf on a fuzzy match.
  ["sign pdf", "sign-pdf"],
  ["sign pdf online", "sign-pdf"],
  ["add signature to pdf", "sign-pdf"],
  ["e-sign", "sign-pdf"],

  // The per-type landing pages still win their own generic queries.
  ["weight converter", "weight-converter"],
  ["temperature converter", "temperature-converter"],
  ["data size converter", "data-converter"],
  ["unit converter", "unit-converter"],
];

/**
 * Queries that must return nothing sensible rather than noise.
 *
 * "favicon" used to be here, as a record that the site had no answer for a
 * high-volume query. It now belongs in the expectations above instead, which
 * is the outcome that entry was documenting the absence of.
 */
const shouldBeEmptyOrFuzzy = ["zzzzqqqq", "xyzzyplugh"];

let failures = 0;

for (const [query, expectedSlug] of expectations) {
  const results = searchTools(query, tools);
  const top = results[0];

  if (top?.tool.slug === expectedSlug) {
    console.log(`  ok    ${JSON.stringify(query).padEnd(20)} → ${top.tool.name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${JSON.stringify(query).padEnd(20)} → ${top?.tool.name ?? "(nothing)"}`);
    console.error(`          expected ${expectedSlug}`);
    console.error(
      `          got top 3: ${results.slice(0, 3).map((r) => `${r.tool.slug}(${Math.round(r.score)})`).join(", ") || "none"}`,
    );
  }
}

for (const query of shouldBeEmptyOrFuzzy) {
  const results = searchTools(query, tools);
  // Nonsense may fuzzy-match, but must never claim a strong score.
  const strong = results.filter((result) => result.score > 100);
  if (strong.length === 0) {
    console.log(`  ok    ${JSON.stringify(query).padEnd(20)} → no strong matches`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${JSON.stringify(query)} produced strong matches: ${strong[0].tool.slug}`);
  }
}

const total = expectations.length + shouldBeEmptyOrFuzzy.length;
console.log(
  failures === 0
    ? `\n${total} search expectations met.`
    : `\n${failures} of ${total} search expectations FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

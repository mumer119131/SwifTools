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
  ["png to jpg", "convert-image"],
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

  // The per-type landing pages still win their own generic queries.
  ["weight converter", "weight-converter"],
  ["temperature converter", "temperature-converter"],
  ["data size converter", "data-converter"],
  ["unit converter", "unit-converter"],
];

/** Queries that must return nothing sensible rather than noise. */
const shouldBeEmptyOrFuzzy = ["zzzzqqqq", "xyzzyplugh", "favicon"];

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

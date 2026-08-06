#!/usr/bin/env node
/**
 * Guards the `useClientValue` contract.
 *
 * `useSyncExternalStore` compares successive snapshots with `Object.is` and
 * re-renders whenever they differ. A reader that builds a fresh value on every
 * call therefore never settles, and React aborts with "Maximum update depth
 * exceeded" — which is exactly what a `() => ({ date, time })` reader caused in
 * the timezone converter.
 *
 * Every function passed to `useClientValue` is asserted here to return an
 * `Object.is`-equal result across successive calls. Run with:
 *
 *   pnpm check:snapshots
 */

import process from "node:process";

import { detectZone, nowDate, nowTime } from "../src/tools/timezone-converter/logic.ts";
import { todayInputValue } from "../src/tools/age-calculator/logic.ts";
import { todayIso } from "../src/tools/sitemap-generator/logic.ts";
import { readDueDate, readIssueDate } from "../src/tools/invoice-generator/logic.ts";

const readers: [string, () => unknown][] = [
  ["timezone-converter: detectZone", detectZone],
  ["timezone-converter: nowDate", nowDate],
  ["timezone-converter: nowTime", nowTime],
  ["age-calculator: todayInputValue", todayInputValue],
  ["sitemap-generator: todayIso", todayIso],
  ["invoice-generator: readIssueDate", readIssueDate],
  ["invoice-generator: readDueDate", readDueDate],
];

let failures = 0;

for (const [name, read] of readers) {
  const first = read();
  const second = read();

  const stable = Object.is(first, second);
  // An object identity is unstable by construction even when it looks equal,
  // so reject non-primitives outright rather than relying on a lucky pass.
  const primitive = first === null || (typeof first !== "object" && typeof first !== "function");

  if (stable && primitive) {
    console.log(`  ok    ${name} → ${JSON.stringify(first)}`);
  } else {
    failures += 1;
    console.error(
      `  FAIL  ${name} — ${!primitive ? "returns a non-primitive" : "returns a different value each call"}`,
    );
  }
}

console.log(
  failures === 0
    ? `\n${readers.length} snapshot readers are stable.`
    : `\n${failures} of ${readers.length} readers violate the contract.`,
);

process.exit(failures === 0 ? 0 : 1);

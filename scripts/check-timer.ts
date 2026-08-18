#!/usr/bin/env node
/**
 * Checks the timer's parsing, formatting and lap arithmetic.
 *
 * The timing itself is the part that matters most and cannot be unit-tested
 * here: correctness comes from working off a wall-clock deadline rather than
 * accumulating `setInterval` ticks, which is a property of how Tool.tsx is
 * written. What can be tested is everything around it — and duration parsing in
 * particular, because "1:30" meaning ninety seconds and "90" meaning ninety
 * minutes are both right and easy to get backwards.
 *
 *   pnpm check:timer
 */

import process from "node:process";

import {
  PRESETS,
  addSplit,
  formatDuration,
  formatForTitle,
  lapExtremes,
  parseDuration,
  presetLabel,
  remainingFrom,
} from "@/tools/timer/logic";
import { pushRecent } from "@/lib/recent-tools";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ----------------------------------------------------------- parsing */

const parses: [string, number][] = [
  // A bare number is minutes. Someone typing "10" into a timer means ten
  // minutes, never ten seconds.
  ["10", 600],
  ["1", 60],
  ["0.5", 30],
  ["90", 5400],

  // Colon form is the familiar clock reading.
  ["1:30", 90],
  ["0:45", 45],
  ["10:00", 600],
  ["1:02:03", 3723],
  ["2:00:00", 7200],

  // Suffixed forms.
  ["90s", 90],
  ["5m", 300],
  ["2h", 7200],
  ["1h30m", 5400],
  ["1h 30m", 5400],
  ["2m30s", 150],
  ["1h2m3s", 3723],
];

for (const [input, expected] of parses) {
  const got = parseDuration(input);
  assert(`${JSON.stringify(input).padEnd(10)} → ${expected}s`, got === expected, `got ${got}`);
}

const rejects = ["", "  ", "abc", "5m banana", "1:2:3:4", "1:70", "1:2:70", "-5", "m", "1:xx", "5x"];
for (const input of rejects) {
  assert(`rejects ${JSON.stringify(input)}`, parseDuration(input) === null, `got ${parseDuration(input)}`);
}

/* --------------------------------------------------------- formatting */

const formats: [number, boolean, string][] = [
  [0, false, "0:00"],
  [1000, false, "0:01"],
  [59_000, false, "0:59"],
  [60_000, false, "1:00"],
  [90_000, false, "1:30"],
  [599_000, false, "9:59"],
  [3_600_000, false, "1:00:00"],
  [3_723_000, false, "1:02:03"],
  [9_400, true, "0:09.4"],
  [65_500, true, "1:05.5"],
];

for (const [ms, tenths, expected] of formats) {
  const got = formatDuration(ms, tenths);
  assert(`${ms}ms → ${expected}`, got === expected, `got ${got}`);
}

assert("a negative duration clamps to zero", formatDuration(-5000) === "0:00");

// The title counts up to the next whole second rather than down, so a timer
// showing "1:00" in the tab is not already at 59 seconds.
assert("title rounds up (500ms → 0:01)", formatForTitle(500) === "0:01", formatForTitle(500));
assert("title at exactly a second", formatForTitle(1000) === "0:01");
assert("title at zero", formatForTitle(0) === "0:00");

/* --------------------------------------------------------- deadlines */

assert("remaining is the gap", remainingFrom(10_000, 4_000) === 6_000);
assert("remaining never goes negative", remainingFrom(1_000, 9_000) === 0);
// The property that makes the timer drift-free: a late tick still gives the
// right answer, because nothing accumulates.
assert(
  "a late tick still reports correctly",
  remainingFrom(60_000, 45_123) === 14_877 && remainingFrom(60_000, 59_999) === 1,
);

/* ------------------------------------------------------------- laps */

let splits = addSplit([], 5_000);
splits = addSplit(splits, 12_000);
splits = addSplit(splits, 15_000);

assert("three splits recorded", splits.length === 3);
assert("splits are numbered from one", splits.map((s) => s.index).join(",") === "1,2,3");
assert("totals are absolute", splits.map((s) => s.total).join(",") === "5000,12000,15000");
assert("laps are differences", splits.map((s) => s.lap).join(",") === "5000,7000,3000");

const extremes = lapExtremes(splits);
assert("fastest lap found", extremes?.fastest === 3_000, String(extremes?.fastest));
assert("slowest lap found", extremes?.slowest === 7_000, String(extremes?.slowest));
assert("no extremes with a single lap", lapExtremes(addSplit([], 1_000)) === null);
assert("no extremes with none", lapExtremes([]) === null);

/* ---------------------------------------------------------- presets */

assert("presets are ascending", PRESETS.every((value, i) => i === 0 || value > PRESETS[i - 1]));
assert("preset labels read naturally", presetLabel(60) === "1 min" && presetLabel(300) === "5 min");
assert("an hour is named as one", presetLabel(3600) === "1 hour");
assert("two hours is plural", presetLabel(7200) === "2 hours");
assert("sub-minute presets say seconds", presetLabel(30) === "30 sec");

// Every preset must survive a round trip through the parser, since the presets
// fill the same field a person types into.
for (const preset of PRESETS) {
  const asText = formatDuration(preset * 1000);
  assert(
    `preset ${presetLabel(preset)} round-trips as "${asText}"`,
    parseDuration(asText) === preset,
    `got ${parseDuration(asText)}`,
  );
}

/* -------------------------------------------------- recently used tools */

// The rail on the homepage is the only continuity a site without accounts can
// offer, and its behaviour is invisible until it is wrong: a tool opened twice
// must move rather than duplicate, and the list must not grow without bound.

assert("recording onto an empty list", pushRecent([], "timer").join() === "timer");

assert(
  "the newest goes first",
  pushRecent(["a", "b"], "c").join() === "c,a,b",
  pushRecent(["a", "b"], "c").join(),
);

assert(
  "re-opening a tool moves it rather than duplicating it",
  pushRecent(["a", "b", "c"], "c").join() === "c,a,b",
  pushRecent(["a", "b", "c"], "c").join(),
);

assert(
  "the list is capped and the oldest falls off",
  pushRecent(["1", "2", "3", "4"], "5", 4).join() === "5,1,2,3",
  pushRecent(["1", "2", "3", "4"], "5", 4).join(),
);

// Identity matters: returning a new array every time would re-render the whole
// rail on every page view for no change.
{
  const list = ["timer", "merge-pdf"];
  assert("re-recording the current head returns the same array", pushRecent(list, "timer") === list);
  assert("recording something new returns a new array", pushRecent(list, "x") !== list);
}

assert("an empty slug is ignored", pushRecent(["a"], "").join() === "a");

console.log(
  failures === 0
    ? "\nTimer and recent-tools checks passed."
    : `\n${failures} timer checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

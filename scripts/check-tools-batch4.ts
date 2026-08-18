#!/usr/bin/env node
/**
 * Checks the aspect ratio, password strength and pace tools.
 *
 * The password half is the one worth reading. A strength meter that counts
 * character classes rates P@ssw0rd1 as strong, and it is one of the worst
 * passwords in existence — so the assertions here are mostly about the tool
 * refusing to be fooled by exactly the tricks that fool the usual meter.
 *
 *   pnpm check:batch4
 */

import process from "node:process";

import {
  PRESETS, decimalRatio, completeHeight, completeWidth, fitInside, formatRatio,
  nearestPreset, scale, simplify,
} from "@/tools/aspect-ratio-calculator/logic";
import { assess, formatCrackTime } from "@/tools/password-strength-checker/logic";
import {
  formatDuration, formatPace, fromPaceAndDistance, fromPaceAndTime,
  fromTimeAndDistance, parseDuration, racePredictions, splits, toKm,
} from "@/tools/pace-calculator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) < tol;

/* ========================================================= aspect ratio */

console.log("Aspect ratio");

{
  assert("1920x1080 is 16:9", formatRatio(simplify(1920, 1080)!) === "16:9");
  assert("3840x2160 is also 16:9", formatRatio(simplify(3840, 2160)!) === "16:9");
  assert("1080x1920 is 9:16", formatRatio(simplify(1080, 1920)!) === "9:16");
  assert("800x600 is 4:3", formatRatio(simplify(800, 600)!) === "4:3");
  assert("1000x1000 is 1:1", formatRatio(simplify(1000, 1000)!) === "1:1");
  assert("a prime pair does not reduce", formatRatio(simplify(1001, 667)!) === "1001:667");

  assert("zero is rejected", simplify(0, 100) === null);
  assert("negatives are rejected", simplify(-16, 9) === null);

  assert("16:9 is about 1.778", near(decimalRatio(1920, 1080), 1.7778, 0.001));

  // An untidy size close to a common ratio should be recognised.
  const nearly = nearestPreset(1000, 667);
  assert(`1000x667 is spotted as 3:2 (${nearly?.label})`, nearly?.label === "3:2");
  assert("and reported as inexact", nearly?.exact === false);

  const exact = nearestPreset(1920, 1080);
  assert("1920x1080 is reported as exactly 16:9", exact?.label === "16:9" && exact.exact);
  // Something genuinely unusual must not be forced into a preset.
  assert("an odd ratio matches nothing", nearestPreset(1000, 300) === null);

  assert("completing the width of a 16:9 at 1080 gives 1920",
    near(completeWidth(1080, { w: 16, h: 9 }), 1920, 0.5));
  assert("completing the height of a 16:9 at 1280 gives 720",
    near(completeHeight(1280, { w: 16, h: 9 }), 720, 0.5));

  // contain vs cover — the distinction the tool exists to make clear.
  const contain = fitInside(1920, 1080, 1080, 1080, "contain")!;
  assert("contain fits the full width", near(contain.width, 1080, 0.5));
  assert("contain letterboxes vertically", contain.letterbox.y > 0);
  assert("contain crops nothing", contain.cropped === 0);

  const cover = fitInside(1920, 1080, 1080, 1080, "cover")!;
  assert("cover fills the box height", near(cover.height, 1080, 0.5));
  assert("cover has no letterbox", cover.letterbox.x === 0 && cover.letterbox.y === 0);
  assert(`cover crops about 44% (${(cover.cropped * 100).toFixed(0)}%)`, near(cover.cropped, 0.4375, 0.01));

  // Same ratio in and out means neither bars nor crop.
  const same = fitInside(1920, 1080, 1280, 720, "cover")!;
  assert("matching ratios crop nothing", near(same.cropped, 0, 0.001));

  assert("scaling rounds to whole pixels", scale(1920, 1080, 0.5).width === 960);
  assert("presets all reduce to themselves",
    PRESETS.every((p) => p.ratio.w > 0 && p.ratio.h > 0));
}

/* ==================================================== password strength */

console.log("\nPassword strength");

{
  // The headline case: the meter that counts character classes gets this wrong.
  const leet = assess("P@ssw0rd1")!;
  assert(`P@ssw0rd1 scores 0 or 1 (${leet.score}, ${leet.bits.toFixed(0)} bits)`, leet.score <= 1);
  assert("and says why", leet.findings.some((f) => f.kind === "critical"));

  const plain = assess("password")!;
  assert("'password' is very weak", plain.score === 0);
  assert("'password' cracks instantly", formatCrackTime(plain.crackSeconds) === "instantly");

  const withDigits = assess("password123")!;
  assert(`'password123' stays weak (${withDigits.score})`, withDigits.score <= 1);

  assert("'123456' is very weak", assess("123456")!.score === 0);
  assert("'qwertyuiop' is caught as a keyboard run",
    assess("qwertyuiop")!.findings.some((f) => f.message.includes("keyboard")));
  assert("'abcdefgh' is caught as a sequence",
    assess("abcdefgh")!.findings.some((f) => f.message.includes("sequence")));
  assert("'aaaaaaaa' is caught as repetition",
    assess("aaaaaaaa")!.findings.some((f) => f.message.includes("repeated")));
  assert("'abcabcabcabc' is caught as repetition",
    assess("abcabcabcabc")!.findings.some((f) => f.message.includes("repeated")));

  const year = assess("Tottenham1987!")!;
  assert("a year is flagged", year.findings.some((f) => f.message.includes("year")));

  // A long passphrase of unrelated words should beat a short scrambled one,
  // which is the point the tool is making.
  const phrase = assess("correct horse battery staple")!;
  const scrambled = assess("Tr0ub4dor&3")!;
  assert(`a passphrase beats a scrambled password (${phrase.bits.toFixed(0)} vs ${scrambled.bits.toFixed(0)} bits)`,
    phrase.bits > scrambled.bits);
  assert("the passphrase rates strong", phrase.score >= 3);

  assert("short passwords are flagged whatever they contain",
    assess("aB3$x")!.findings.some((f) => f.message.includes("eight characters")));

  // Monotonicity: adding a character to a random password must not lower it.
  const shorter = assess("k7Qw!zR2vP")!;
  const longer = assess("k7Qw!zR2vPm")!;
  assert(`adding a character does not weaken it (${shorter.bits.toFixed(1)} -> ${longer.bits.toFixed(1)})`,
    longer.bits >= shorter.bits);

  assert("an empty password returns nothing", assess("") === null);
  assert("bits are never negative", assess("a")!.bits >= 0);

  assert("instant for a tiny space", formatCrackTime(0.0001) === "instantly");
  assert("years read naturally", formatCrackTime(31_536_000 * 5).includes("years"));
  assert("absurd times are described, not printed", formatCrackTime(Infinity).includes("universe"));
}

/* ================================================================ pace */

console.log("\nPace");

{
  assert("45:30 is 2730 seconds", parseDuration("45:30") === 2730);
  assert("1:45:30 is 6330 seconds", parseDuration("1:45:30") === 6330);
  assert("a bare number is minutes", parseDuration("30") === 1800);
  assert("rejects 60 seconds", parseDuration("45:60") === null);
  assert("rejects text", parseDuration("abc") === null);
  assert("rejects empty", parseDuration("") === null);

  assert("formats without hours", formatDuration(2730) === "45:30");
  assert("formats with hours", formatDuration(6330) === "1:45:30");
  assert("pace never shows hours", formatPace(330) === "5:30");

  // A 10K in 50 minutes is exactly 5:00/km.
  const tenK = fromTimeAndDistance(3000, 10, "km")!;
  assert(`10K in 50:00 is 5:00/km (${formatPace(tenK.perKm)})`, formatPace(tenK.perKm) === "5:00");
  assert(`and 12 km/h (${tenK.kph.toFixed(1)})`, near(tenK.kph, 12, 0.01));
  assert(`and about 8:03/mile (${formatPace(tenK.perMile)})`, formatPace(tenK.perMile) === "8:03");

  // Miles in, and the km figure must agree.
  const miles = fromTimeAndDistance(3600, 6.21371, "mi")!;
  assert(`6.21 miles in an hour is ~10 km (${miles.km.toFixed(2)})`, near(miles.km, 10, 0.02));

  // The three directions must agree with each other.
  const byPace = fromPaceAndDistance(300, 10, "km")!;
  assert("pace + distance gives the same time", byPace.totalSeconds === 3000);
  const byTime = fromPaceAndTime(300, 3000, "km")!;
  assert("pace + time gives the same distance", near(byTime.km, 10, 0.001));

  assert("zero distance is rejected", fromTimeAndDistance(3000, 0, "km") === null);
  assert("zero time is rejected", fromTimeAndDistance(0, 10, "km") === null);

  assert("a mile is 1.609 km", near(toKm(1, "mi"), 1.609344, 0.0001));

  // Marathon at 5:00/km is 3:30:59.
  const predictions = racePredictions(300);
  const marathon = predictions.find((p) => p.label === "Marathon")!;
  assert(`marathon at 5:00/km is 3:30:59 (${formatDuration(marathon.seconds)})`,
    formatDuration(marathon.seconds) === "3:30:59");
  assert("all five races are predicted", predictions.length === 5);

  const rows = splits(300, 42.195);
  assert("splits include every whole kilometre", rows.filter((r) => Number.isInteger(r.at)).length === 42);
  assert("and the final partial distance", near(rows[rows.length - 1].at, 42.195, 0.001));
  assert("splits are cumulative", rows[1].elapsed === 600);
  assert("splits are capped", splits(300, 500).length <= 51);
}

console.log(
  failures === 0
    ? "\nAspect ratio, password and pace checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

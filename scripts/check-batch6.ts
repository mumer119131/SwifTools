#!/usr/bin/env node
/**
 * Checks the six-tool batch: due dates, body fat, JSON diff, collage layout,
 * circle crop and character inspection.
 *
 * Two have real formulas worth verifying against published values — Naegele's
 * rule and the US Navy body fat equation — and the JSON diff has an algorithm
 * whose failure mode is reporting a change that did not happen, which no error
 * would surface.
 *
 *   pnpm check:batch6
 */

import process from "node:process";

import { GESTATION_DAYS, calculate as dueDate, daysBetween } from "@/tools/due-date-calculator/logic";
import { calculate as bodyFat, categorise } from "@/tools/body-fat-calculator/logic";
import { diff, groupByRoot, parse, preview, typeOf } from "@/tools/json-diff/logic";
import { coverCrop, emptyCells, gridLayout, rowsFor, suggestColumns } from "@/tools/photo-collage/logic";
import { cornerRadius, needsBackground, squareRegion, supportsTransparency } from "@/tools/circle-crop/logic";
import { blockOf, inspect, parseInput, searchCurated, ALL_CURATED } from "@/tools/unicode-lookup/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 0.05) => Math.abs(a - b) < tol;
/*
 * Local components, not toISOString.
 *
 * Due dates are local calendar dates. Formatting one through toISOString reads
 * it in UTC, so at UTC+5 a local midnight becomes 19:00 the previous day and
 * every assertion lands a day early — which is what happened, and the code was
 * right all along.
 */
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ========================================================== due dates */

console.log("Due dates");

{
  // Naegele's rule: last period plus 280 days.
  const lmp = new Date(2026, 0, 1);
  const result = dueDate(lmp, "lmp", 28, new Date(2026, 0, 1))!;
  assert(`1 Jan + 280 days is 8 Oct (${iso(result.dueDate)})`, iso(result.dueDate) === "2026-10-08");
  assert("gestation is 280 days", GESTATION_DAYS === 280);
  assert("day zero is week 0", result.weeks === 0 && result.days === 0);
  assert("first trimester at the start", result.trimester === 1);

  // A longer cycle means later ovulation, so a later due date.
  const long = dueDate(lmp, "lmp", 35, new Date(2026, 0, 1))!;
  assert(`a 35-day cycle pushes it 7 days later (${iso(long.dueDate)})`, iso(long.dueDate) === "2026-10-15");
  const short = dueDate(lmp, "lmp", 21, new Date(2026, 0, 1))!;
  assert("a 21-day cycle pulls it 7 days earlier", iso(short.dueDate) === "2026-10-01");

  // Conception is treated as two weeks after the period, so the same due date
  // must come from a conception date two weeks later.
  const byConception = dueDate(new Date(2026, 0, 15), "conception", 28, new Date(2026, 0, 15))!;
  assert("conception + 14 days back gives the same date", iso(byConception.dueDate) === "2026-10-08");

  const ivf5 = dueDate(new Date(2026, 0, 20), "ivf5", 28, new Date(2026, 0, 20))!;
  assert("a day-5 transfer is 19 days after the notional period", iso(ivf5.lmp) === "2026-01-01");
  const ivf3 = dueDate(new Date(2026, 0, 18), "ivf3", 28, new Date(2026, 0, 18))!;
  assert("a day-3 transfer is 17 days after", iso(ivf3.lmp) === "2026-01-01");
  // IVF dates are known exactly, so cycle length must not move them.
  assert("cycle length does not shift an IVF date",
    iso(dueDate(new Date(2026, 0, 20), "ivf5", 35, new Date(2026, 0, 20))!.dueDate) === iso(ivf5.dueDate));

  // Progress partway through.
  const midway = dueDate(lmp, "lmp", 28, new Date(2026, 4, 21))!;
  assert(`20 weeks on 21 May (${midway.weeks}w${midway.days}d)`, midway.weeks === 20 && midway.days === 0);
  assert("which is the second trimester", midway.trimester === 2);
  assert("about halfway through", near(midway.percentComplete, 50, 1));

  const late = dueDate(lmp, "lmp", 28, new Date(2026, 8, 1))!;
  assert("third trimester after 28 weeks", late.trimester === 3);

  // Term is 37-42 weeks, which is the point of showing a window.
  assert("term window opens at 37 weeks", iso(result.termWindow.earliest) === iso(new Date(2026, 8, 17)));
  assert("and closes at 42", daysBetween(result.termWindow.earliest, result.termWindow.latest) === 35);
  assert("milestones are in order",
    result.milestones.every((m, i) => i === 0 || m.week >= result.milestones[i - 1].week));

  assert("an implausible cycle length is refused", dueDate(lmp, "lmp", 60) === null);
  assert("an invalid date is refused", dueDate(new Date("nonsense"), "lmp", 28) === null);
  assert("a date far in the past is refused", dueDate(new Date(2020, 0, 1), "lmp", 28, new Date(2026, 0, 1)) === null);
}

/* =========================================================== body fat */

console.log("\nBody fat");

{
  // US Navy, male: waist 90cm, neck 40cm, height 180cm.
  const male = bodyFat({ sex: "male", units: "metric", height: 180, waist: 90, neck: 40 })!;
  assert(`male 90/40/180 is 18.4% (${male.navy})`, near(male.navy, 18.4, 0.1));
  assert("categorised", male.category.label.length > 0);

  const female = bodyFat({ sex: "female", units: "metric", height: 165, waist: 75, neck: 33, hip: 95 })!;
  assert(`female 75/33/95/165 is 26.9% (${female.navy})`, near(female.navy, 26.9, 0.1));

  // A larger waist must give a higher figure, all else equal.
  const bigger = bodyFat({ sex: "male", units: "metric", height: 180, waist: 100, neck: 40 })!;
  assert(`a 10cm larger waist raises it (${male.navy} -> ${bigger.navy})`, bigger.navy > male.navy);

  // Imperial must agree with metric for the same body.
  const imperial = bodyFat({
    sex: "male", units: "imperial", height: 180 / 2.54, waist: 90 / 2.54, neck: 40 / 2.54,
  })!;
  assert(`imperial matches metric (${imperial.navy} vs ${male.navy})`, near(imperial.navy, male.navy, 0.2));

  // Mass split needs a weight.
  const withWeight = bodyFat({ sex: "male", units: "metric", height: 180, waist: 90, neck: 40, weight: 80 })!;
  assert("fat and lean mass sum to the weight",
    near((withWeight.fatMass ?? 0) + (withWeight.leanMass ?? 0), 80, 0.2));
  assert(`BMI is calculated (${withWeight.bmi})`, near(withWeight.bmi ?? 0, 24.7, 0.2));
  assert("no BMI estimate without an age", withWeight.bmiEstimate === null);
  const withAge = bodyFat({ sex: "male", units: "metric", height: 180, waist: 90, neck: 40, weight: 80, age: 35 })!;
  assert("a BMI estimate appears with an age", withAge.bmiEstimate !== null);

  assert("female without a hip measurement is refused",
    bodyFat({ sex: "female", units: "metric", height: 165, waist: 75, neck: 33 }) === null);
  assert("a neck larger than the waist is refused",
    bodyFat({ sex: "male", units: "metric", height: 180, waist: 40, neck: 45 }) === null);
  assert("an absurd height is refused",
    bodyFat({ sex: "male", units: "metric", height: 400, waist: 90, neck: 40 }) === null);

  // The bands must be ordered and complete.
  assert("very low male reads as essential", categorise(4, "male").tone === "low");
  assert("male 10% is athletic", categorise(10, "male").label === "Athletic");
  assert("male 30% is above average", categorise(30, "male").tone === "high");
  assert("female bands sit higher than male",
    categorise(22, "female").tone === "good" && categorise(22, "male").tone === "raised");
}

/* ========================================================== JSON diff */

console.log("\nJSON diff");

{
  assert("identical documents show nothing", diff({ a: 1 }, { a: 1 }).identical);
  // The whole point: key order must not matter.
  assert("key order is irrelevant", diff({ a: 1, b: 2 }, { b: 2, a: 1 }).identical);

  const changed = diff({ a: 1 }, { a: 2 });
  assert("a changed value is reported", changed.changes[0].kind === "changed");
  assert("at the right path", changed.changes[0].path === "a");
  assert("with both values", changed.changes[0].before === 1 && changed.changes[0].after === 2);

  const added = diff({ a: 1 }, { a: 1, b: 2 });
  assert("an added key is reported", added.changes[0].kind === "added" && added.changes[0].path === "b");
  const removed = diff({ a: 1, b: 2 }, { a: 1 });
  assert("a removed key is reported", removed.changes[0].kind === "removed");

  const nested = diff({ user: { name: "a", roles: [{ id: 1 }] } }, { user: { name: "b", roles: [{ id: 2 }] } });
  assert("nested paths are dotted", nested.changes.some((c) => c.path === "user.name"));
  assert("array indices are bracketed", nested.changes.some((c) => c.path === "user.roles[0].id"),
    nested.changes.map((c) => c.path).join(", "));

  const typeChange = diff({ a: 1 }, { a: "1" });
  assert("a type change is distinguished", typeChange.changes[0].kind === "type-changed");
  assert("with both types named",
    typeChange.changes[0].beforeType === "number" && typeChange.changes[0].afterType === "string");

  // typeof lies about these two, which is why there is a helper.
  assert("null is not called an object", typeOf(null) === "null");
  assert("arrays are not called objects", typeOf([]) === "array");
  assert("null vs object is a type change", diff({ a: null }, { a: {} }).changes[0].kind === "type-changed");

  const longer = diff({ list: [1, 2] }, { list: [1, 2, 3] });
  assert("a longer array reports an addition", longer.changes[0].kind === "added");
  assert("at the new index", longer.changes[0].path === "list[2]");

  assert("awkward keys are bracketed and quoted",
    diff({ "a-b": 1 }, { "a-b": 2 }).changes[0].path === '["a-b"]');

  const counts = diff({ a: 1, b: 2, c: 3 }, { a: 9, d: 4 });
  assert("changes are counted by kind",
    counts.counts.changed === 1 && counts.counts.added === 1 && counts.counts.removed === 2,
    JSON.stringify(counts.counts));

  assert("NaN equals NaN for diffing", diff({ a: NaN }, { a: NaN }).identical);
  assert("deep equality of arrays", diff([1, [2, [3]]], [1, [2, [3]]]).identical);

  assert("grouping is by root path", groupByRoot(nested.changes)[0].root === "user");
  assert("preview truncates", preview("x".repeat(200)).endsWith("…"));
  assert("preview handles undefined", preview(undefined) === "—");

  assert("invalid JSON reports an error", "error" in parse("{nope}"));
  assert("empty input reports an error", "error" in parse("  "));
  assert("valid JSON parses", !("error" in parse('{"a":1}')));
}

/* ====================================================== collage layout */

console.log("\nCollage layout");

{
  const cells = gridLayout({ count: 4, width: 1000, height: 1000, columns: 2, gap: 10 });
  assert("four photos give four cells", cells.length === 4);
  // (1000 - 3*10) / 2 = 485
  assert(`cells are 485 wide (${cells[0].width})`, near(cells[0].width, 485, 0.01));
  assert("the first starts at the gap", cells[0].x === 10 && cells[0].y === 10);
  assert("the last ends inside the canvas",
    cells[3].x + cells[3].width <= 1000 && cells[3].y + cells[3].height <= 1000);
  assert("cells do not overlap horizontally", cells[0].x + cells[0].width <= cells[1].x);

  // Every layout must stay inside its canvas, whatever the numbers.
  let escaped = 0;
  for (const count of [1, 2, 3, 5, 7, 9, 12, 20]) {
    for (const columns of [1, 2, 3, 4, 5]) {
      for (const gap of [0, 10, 40]) {
        for (const rect of gridLayout({ count, width: 1200, height: 900, columns, gap })) {
          if (rect.x < -0.01 || rect.y < -0.01 ||
              rect.x + rect.width > 1200.01 || rect.y + rect.height > 900.01 ||
              rect.width <= 0 || rect.height <= 0) escaped += 1;
        }
      }
    }
  }
  assert("every layout stays inside the canvas (120 combinations)", escaped === 0, `${escaped} escaped`);

  assert("more columns than photos is capped",
    gridLayout({ count: 2, width: 600, height: 600, columns: 5, gap: 10 }).length === 2);
  assert("zero photos gives nothing", gridLayout({ count: 0, width: 600, height: 600, columns: 2, gap: 10 }).length === 0);
  assert("an impossible gap gives nothing",
    gridLayout({ count: 4, width: 100, height: 100, columns: 2, gap: 200 }).length === 0);

  assert("four photos suggest two columns", suggestColumns(4) === 2);
  assert("nine suggest three", suggestColumns(9) === 3);
  assert("one suggests one", suggestColumns(1) === 1);
  assert("rows are counted", rowsFor(5, 2) === 3);
  assert("empty cells are counted", emptyCells(5, 2) === 1);
  assert("a full grid has none", emptyCells(4, 2) === 0);

  // Cover crop must keep the cell's aspect ratio.
  const crop = coverCrop(1920, 1080, 500, 500);
  assert(`a landscape photo crops to square (${crop.width}x${crop.height})`, near(crop.width, crop.height, 0.01));
  assert("centred horizontally", near(crop.x, (1920 - 1080) / 2, 0.01));
  assert("full height kept", near(crop.height, 1080, 0.01));
}

/* ========================================================= circle crop */

console.log("\nCircle crop");

{
  const square = squareRegion(1920, 1080, 0.5, 0.5);
  assert("the square takes the shorter side", square.size === 1080);
  assert("centred on the long axis", near(square.x, (1920 - 1080) / 2, 0.01));
  assert("nothing to offset on the short axis", square.y === 0);

  const portrait = squareRegion(1080, 1920, 0.5, 0);
  assert("a portrait crops from the top when asked", portrait.y === 0);
  const lower = squareRegion(1080, 1920, 0.5, 1);
  assert("and from the bottom", near(lower.y, 1920 - 1080, 0.01));
  assert("offsets are clamped", squareRegion(1080, 1920, 0.5, 5).y <= 1920 - 1080 + 0.01);

  assert("PNG holds transparency", supportsTransparency("image/png"));
  assert("WebP holds transparency", supportsTransparency("image/webp"));
  assert("JPEG does not", !supportsTransparency("image/jpeg"));
  // The trap: a circle saved as JPEG has corners that must go somewhere.
  assert("a circle as JPEG needs a background", needsBackground("circle", "image/jpeg"));
  assert("a circle as PNG does not", !needsBackground("circle", "image/png"));
  assert("a square as JPEG does not", !needsBackground("square", "image/jpeg"));

  assert("a circle's radius is half the size", cornerRadius(400, "circle") === 200);
  assert("a square has no radius", cornerRadius(400, "square") === 0);
  assert("rounded is between", cornerRadius(400, "rounded") > 0 && cornerRadius(400, "rounded") < 200);
}

/* ==================================================== character lookup */

console.log("\nCharacter lookup");

{
  const a = inspect("A")!;
  assert("A is U+0041", a.notation === "U+0041" && a.codePoint === 65);
  assert("and one UTF-8 byte", a.utf8Bytes === 1 && a.utf8[0] === "41");

  const eacute = inspect("é")!;
  assert("é is U+00E9", eacute.notation === "U+00E9");
  assert("and two UTF-8 bytes", eacute.utf8Bytes === 2, String(eacute.utf8Bytes));
  assert("with a CSS escape", eacute.cssEscape === "\\00E9");

  const pound = inspect("£")!;
  assert("£ has a named entity", pound.htmlNamed === "&pound;");
  assert("and a numeric one", pound.htmlEntity === "&#163;");
  assert("and is in Latin-1", pound.block.includes("Latin-1"));

  // Emoji are above the BMP, which is where escaping and byte counts surprise
  // people.
  const emoji = inspect("😀")!;
  assert(`an emoji is four UTF-8 bytes (${emoji.utf8Bytes})`, emoji.utf8Bytes === 4);
  assert("and uses the braced JS escape", emoji.jsEscape.startsWith("\\u{"), emoji.jsEscape);
  assert("and two UTF-16 units", emoji.utf16.length === 2);
  assert("and is in the Emoticons block", emoji.block === "Emoticons");

  assert("only the first character is inspected", inspect("abc")!.character === "a");
  assert("nothing from an empty string", inspect("") === null);

  assert("U+00E9 notation parses", parseInput("U+00E9") === "é");
  assert("bare hex parses", parseInput("00E9") === "é");
  assert("a JS escape parses", parseInput("\\u00E9") === "é");
  assert("a decimal code point parses", parseInput("8364") === "€");
  // A single digit is the digit, not a control character.
  assert("a single digit stays a digit", parseInput("5") === "5");
  assert("a plain character passes through", parseInput("→") === "→");

  assert("blocks are identified", blockOf(0x2192) === "Arrows");
  assert("an unknown block says so", blockOf(0xe000).includes("Unassigned"));

  assert("searching by name works", searchCurated("em dash").length > 0);
  assert("searching by keyword works", searchCurated("tick").some((e) => e.character === "✓"));
  assert("searching by the character works", searchCurated("£").some((e) => e.character === "£"));
  assert("nonsense finds nothing", searchCurated("zzzzz").length === 0);
  assert("every curated entry inspects", ALL_CURATED.every((e) => inspect(e.character) !== null));
}

console.log(
  failures === 0
    ? "\nAll six-tool batch checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

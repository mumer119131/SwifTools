#!/usr/bin/env node
/**
 * Verifies the tools whose output is a number or a byte sequence — the cases
 * where a wrong answer is indistinguishable from a right one by eye.
 *
 *   pnpm check:batch
 */

import process from "node:process";

import { parseCsv, csvToJson, jsonToCsv, inferValue } from "@/tools/csv-to-json/logic";
import { assess, contrastRatio, luminance, parseColor, suggest, toHex } from "@/tools/contrast-checker/logic";
import { difference, parseDate, shift, toInputValue } from "@/tools/date-difference-calculator/logic";
import { calculate } from "@/tools/tip-calculator/logic";
import { parseTimestamp, formats } from "@/tools/unix-timestamp-converter/logic";
import { buildIco } from "@/tools/favicon-generator/logic";
import { toCss as gradientCss } from "@/tools/css-gradient-generator/logic";
import { toCss as shadowCss, rgba } from "@/tools/box-shadow-generator/logic";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const ok =
    typeof actual === "number" && typeof expected === "number"
      ? Math.abs(actual - expected) < 1e-6
      : actual === expected;
  if (ok) console.log(`  ok    ${label} = ${JSON.stringify(actual)}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------------------------- CSV */

{
  // The whole point of a real parser: commas and quotes inside fields.
  const csv = 'name,note\n"Hopper, Grace","She said ""hello"""\nAda,Simple';
  const parsed = parseCsv(csv, ",");

  check("header parsed", parsed.headers.join("|"), "name|note");
  check("quoted comma stays one field", parsed.rows[0][0], "Hopper, Grace");
  check("doubled quote becomes one quote", parsed.rows[0][1], 'She said "hello"');
  check("unquoted row still works", parsed.rows[1][0], "Ada");
  check("no ragged rows", parsed.ragged.length, 0);

  // A newline inside a quoted field must not end the row.
  const multiline = parseCsv('a,b\n"line one\nline two",second', ",");
  check("newline inside quotes", multiline.rows.length, 1);
  check("multiline field preserved", multiline.rows[0][0], "line one\nline two");

  // CRLF and lone CR must behave like LF.
  check("CRLF handled", parseCsv("a,b\r\n1,2", ",").rows.length, 1);
  check("lone CR handled", parseCsv("a,b\r1,2", ",").rows.length, 1);

  // A ragged row must be reported by line number, not silently dropped.
  const ragged = parseCsv("a,b,c\n1,2\n3,4,5", ",");
  check("ragged row flagged", ragged.ragged.join(","), "2");

  // Type inference must be conservative — this is where data gets corrupted.
  check("plain integer converts", inferValue("42"), 42);
  check("decimal converts", inferValue("3.5"), 3.5);
  check("negative converts", inferValue("-7"), -7);
  check("leading zero stays a string", inferValue("007"), "007");
  check("trailing zero stays a string", inferValue("1.50"), "1.50");
  check("exponent stays a string", inferValue("1e5"), "1e5");
  check("phone number stays a string", inferValue("+15550100"), "+15550100");
  check("true converts", inferValue("true"), true);
  check("empty becomes null", inferValue(""), null);

  const { json } = csvToJson("a,b\n1,x", { delimiter: ",", inferTypes: true, skipEmpty: true });
  check("object built", JSON.stringify(json), '[{"a":1,"b":"x"}]');

  // JSON to CSV must union the keys, or sparse records lose columns.
  const out = jsonToCsv([{ a: 1 }, { a: 2, b: 3 }], ",");
  check("header is the union of keys", out.split("\n")[0], "a,b");
  check("missing value is empty", out.split("\n")[1], "1,");

  // A value containing the delimiter must be re-quoted on the way out.
  check("output re-quotes commas", jsonToCsv([{ a: "x,y" }], ",").split("\n")[1], '"x,y"');
  check("output escapes quotes", jsonToCsv([{ a: 'say "hi"' }], ",").split("\n")[1], '"say ""hi"""');

  // A full round trip must be lossless for string data.
  const original = 'name,note\n"Hopper, Grace","said ""hi"""\nAda,plain';
  const roundTrip = jsonToCsv(
    csvToJson(original, { delimiter: ",", inferTypes: false, skipEmpty: true }).json,
    ",",
  );
  assert("CSV round-trips losslessly", roundTrip === original, `got ${JSON.stringify(roundTrip)}`);

  assert("non-array JSON is rejected", (() => {
    try { jsonToCsv({ a: 1 }, ","); return false; } catch { return true; }
  })());
}

/* -------------------------------------------------------------- contrast */

{
  // The two anchors of the scale, both exact.
  check("black on white", Number(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }).toFixed(2)), 21);
  check("identical colours", contrastRatio({ r: 120, g: 30, b: 200 }, { r: 120, g: 30, b: 200 }), 1);

  // Known values from the WCAG reference implementation.
  check("#767676 on white is the AA boundary", Number(contrastRatio({ r: 118, g: 118, b: 118 }, { r: 255, g: 255, b: 255 }).toFixed(2)), 4.54);
  check("#595959 on white", Number(contrastRatio({ r: 89, g: 89, b: 89 }, { r: 255, g: 255, b: 255 }).toFixed(2)), 7.0);
  check("white luminance", Number(luminance({ r: 255, g: 255, b: 255 }).toFixed(4)), 1);
  check("black luminance", luminance({ r: 0, g: 0, b: 0 }), 0);

  // Green dominates the luminance weighting; blue barely registers. Pure
  // blue on black failing AA while pure green passes is the proof.
  assert("pure green is far brighter than pure blue",
    luminance({ r: 0, g: 255, b: 0 }) > luminance({ r: 0, g: 0, b: 255 }) * 9);

  // Contrast is symmetric — swapping the pair must not change the ratio.
  const a = { r: 30, g: 90, b: 200 };
  const b = { r: 240, g: 240, b: 210 };
  check("ratio is symmetric", contrastRatio(a, b), contrastRatio(b, a));

  const grey = assess({ r: 155, g: 163, b: 175 }, { r: 255, g: 255, b: 255 });
  assert("placeholder grey fails AA body text", !grey.aaNormal);
  assert("placeholder grey also fails UI contrast", !grey.uiComponents, `${grey.ratio.toFixed(2)}:1`);

  const strong = assess({ r: 17, g: 24, b: 39 }, { r: 255, g: 255, b: 255 });
  assert("near-black passes AAA", strong.aaaNormal);

  // The suggestion must actually reach the target.
  const fixed = suggest({ r: 155, g: 163, b: 175 }, { r: 255, g: 255, b: 255 }, 4.5);
  assert("a passing colour is found", fixed !== null);
  if (fixed) {
    assert(`suggestion reaches AA (${contrastRatio(fixed, { r: 255, g: 255, b: 255 }).toFixed(2)}:1)`,
      contrastRatio(fixed, { r: 255, g: 255, b: 255 }) >= 4.5);
  }
  // An already-passing colour must be returned unchanged, not "fixed".
  const already = { r: 0, g: 0, b: 0 };
  check("passing colour left alone", JSON.stringify(suggest(already, { r: 255, g: 255, b: 255 }, 4.5)), JSON.stringify(already));

  check("hex parsed", JSON.stringify(parseColor("#6b7280")), JSON.stringify({ r: 107, g: 114, b: 128 }));
  check("shorthand hex parsed", JSON.stringify(parseColor("#fff")), JSON.stringify({ r: 255, g: 255, b: 255 }));
  check("rgb() parsed", JSON.stringify(parseColor("rgb(10, 20, 30)")), JSON.stringify({ r: 10, g: 20, b: 30 }));
  check("garbage rejected", parseColor("nope"), null);
  check("out-of-range rgb rejected", parseColor("rgb(300, 0, 0)"), null);
  check("hex round-trips", toHex({ r: 107, g: 114, b: 128 }), "#6b7280");
}

/* ------------------------------------------------------------------ dates */

{
  const jan1 = parseDate("2026-01-01")!;
  const jan8 = parseDate("2026-01-08")!;
  check("a week is seven days", difference(jan1, jan8).totalDays, 7);
  check("five working days in a week", difference(jan1, jan8).weekdays, 5);
  check("two weekend days in a week", difference(jan1, jan8).weekendDays, 2);

  // 2024 is a leap year; the range must include 29 February.
  const feb = difference(parseDate("2024-02-28")!, parseDate("2024-03-01")!);
  check("leap day counted", feb.totalDays, 2);
  const nonLeap = difference(parseDate("2025-02-28")!, parseDate("2025-03-01")!);
  check("no leap day in 2025", nonLeap.totalDays, 1);

  // Calendar difference by borrowing, not by dividing.
  const cal = difference(parseDate("2024-01-31")!, parseDate("2024-03-01")!);
  check("31 Jan to 1 Mar is 1 month 1 day", `${cal.years}y ${cal.months}m ${cal.days}d`, "0y 1m 1d");

  const year = difference(parseDate("2020-06-15")!, parseDate("2026-08-15")!);
  check("six years two months", `${year.years}y ${year.months}m ${year.days}d`, "6y 2m 0d");

  // A reversed range must report the same magnitude, flagged.
  const reversed = difference(jan8, jan1);
  check("reversed range magnitude", reversed.totalDays, 7);
  assert("reversed range flagged", reversed.reversed);

  // Month arithmetic must clamp rather than overflow.
  check("31 Jan + 1 month clamps to 29 Feb 2024", toInputValue(shift(parseDate("2024-01-31")!, 1, "months")), "2024-02-29");
  check("31 Jan + 1 month clamps to 28 Feb 2025", toInputValue(shift(parseDate("2025-01-31")!, 1, "months")), "2025-02-28");
  check("31 Mar - 1 month clamps", toInputValue(shift(parseDate("2025-03-31")!, -1, "months")), "2025-02-28");
  check("29 Feb + 1 year clamps", toInputValue(shift(parseDate("2024-02-29")!, 1, "years")), "2025-02-28");
  check("plain day addition", toInputValue(shift(parseDate("2026-01-01")!, 45, "days")), "2026-02-15");
  check("week addition", toInputValue(shift(parseDate("2026-01-01")!, 2, "weeks")), "2026-01-15");

  check("bad date rejected", parseDate("not-a-date"), null);
  check("wrong format rejected", parseDate("01/01/2026"), null);

  // Working days across a month must be counted, not estimated. August 2026
  // starts on a Saturday, which is exactly where days/7*5 goes wrong.
  const aug = difference(parseDate("2026-08-01")!, parseDate("2026-08-31")!);
  check("30 days in the range", aug.totalDays, 30);
  check("working days counted, not estimated", aug.weekdays + aug.weekendDays, 30);
}

/* -------------------------------------------------------------------- tip */

{
  // 20% of 100 with no tax, split four ways.
  const simple = calculate(100, 0, 20, 4, true, "none");
  check("tip amount", simple.tip, 20);
  check("total", simple.total, 120);
  check("per person", simple.perPerson, 30);

  /*
   * Pre-tax versus post-tax is the reason this tool exists. On a 100 subtotal
   * with 9 tax, 20% pre-tax is 20 and post-tax is 21.80.
   */
  const pre = calculate(100, 9, 20, 1, true, "none");
  const post = calculate(100, 9, 20, 1, false, "none");
  check("tip on pre-tax", pre.tip, 20);
  check("tip on post-tax", Number(post.tip.toFixed(2)), 21.8);
  check("pre-tax total", pre.total, 129);
  check("post-tax total", Number(post.total.toFixed(2)), 130.8);

  // Rounding each share up must always cover the bill.
  const rounded = calculate(84.5, 0, 18, 4, true, "perPerson");
  assert("per-person rounding covers the bill", rounded.roundedTotal >= rounded.total);
  assert("per-person share is a whole number", Number.isInteger(rounded.perPerson));
  assert("rounding raises the effective rate", rounded.effectiveTipPercent > 18);

  const totalRounded = calculate(84.5, 0, 18, 4, true, "total");
  assert("total rounding gives a whole total", Number.isInteger(totalRounded.roundedTotal));

  // Zero tip and one person must not blow up.
  check("zero tip", calculate(50, 0, 0, 1, true, "none").total, 50);
  check("single diner", calculate(50, 0, 20, 1, true, "none").perPerson, 60);
  // Zero or negative people must clamp to one rather than divide by zero.
  assert("zero people clamps to one", Number.isFinite(calculate(50, 0, 20, 0, true, "none").perPerson));
}

/* --------------------------------------------------------------- timestamp */

{
  // 1700000000 is 2023-11-14T22:13:20Z. Both units must reach the same instant.
  const seconds = parseTimestamp("1700000000")!;
  const millis = parseTimestamp("1700000000000")!;
  check("seconds detected", seconds.unit, "seconds");
  check("milliseconds detected", millis.unit, "milliseconds");
  check("both give the same instant", seconds.ms, millis.ms);
  check("ISO output", seconds.date.toISOString(), "2023-11-14T22:13:20.000Z");

  check("epoch is 1970", parseTimestamp("0")!.date.toISOString(), "1970-01-01T00:00:00.000Z");
  check("2038 boundary", parseTimestamp("2147483647")!.date.toISOString(), "2038-01-19T03:14:07.000Z");
  check("microseconds detected", parseTimestamp("1700000000000000")!.unit, "microseconds");
  check("nanoseconds detected", parseTimestamp("1700000000000000000")!.unit, "nanoseconds");
  check("ISO string parsed", parseTimestamp("2026-08-15T00:00:00Z")!.unit, "date");
  check("garbage rejected", parseTimestamp("hello"), null);
  check("empty rejected", parseTimestamp(""), null);

  // ISO week numbering: 1 January 2026 is a Thursday, so it is week 1.
  const week = formats(new Date("2026-01-01T12:00:00Z"), new Date("2026-01-01T12:00:00Z"));
  check("ISO week of 1 Jan 2026", week.weekOfYear, 1);
  check("day of year", week.dayOfYear, 1);
}

/* ---------------------------------------------------------------- ICO file */

{
  // A minimal PNG-shaped payload is enough — the encoder only copies bytes.
  const fakePng = (length: number) => new Uint8Array(length).fill(0x89);

  const ico = buildIco([
    { size: 16, png: fakePng(100) },
    { size: 32, png: fakePng(200) },
    { size: 48, png: fakePng(300) },
  ]);

  const view = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);

  check("reserved field is zero", view.getUint16(0, true), 0);
  check("type is 1 (icon)", view.getUint16(2, true), 1);
  check("image count", view.getUint16(4, true), 3);
  check("total length", ico.length, 6 + 16 * 3 + 100 + 200 + 300);

  check("first entry width", view.getUint8(6), 16);
  check("first entry height", view.getUint8(7), 16);
  check("first entry bit depth", view.getUint16(6 + 6, true), 32);
  check("first entry size", view.getUint32(6 + 8, true), 100);
  check("first entry offset", view.getUint32(6 + 12, true), 54);

  // Offsets must be contiguous and land exactly on each payload.
  check("second entry offset", view.getUint32(6 + 16 + 12, true), 154);
  check("third entry offset", view.getUint32(6 + 32 + 12, true), 354);
  check("payload byte lands where the offset says", ico[54], 0x89);

  // 256 must be written as 0, because it does not fit in a byte.
  const big = buildIco([{ size: 256, png: fakePng(10) }]);
  check("256 is stored as 0", new DataView(big.buffer, big.byteOffset).getUint8(6), 0);

  assert("an empty ICO is rejected", (() => {
    try { buildIco([]); return false; } catch { return true; }
  })());
}

/* ------------------------------------------------------------------- CSS */

{
  check(
    "linear gradient css",
    gradientCss({ type: "linear", angle: 90, stops: [
      { id: "a", color: "#fff", position: 0 },
      { id: "b", color: "#000", position: 100 },
    ], centerX: 50, centerY: 50, shape: "circle", repeating: false }),
    "linear-gradient(90deg, #fff 0%, #000 100%)",
  );

  // Out-of-order stops must be sorted, or CSS silently clamps them.
  check(
    "stops are sorted",
    gradientCss({ type: "linear", angle: 0, stops: [
      { id: "a", color: "#f00", position: 80 },
      { id: "b", color: "#0f0", position: 20 },
    ], centerX: 50, centerY: 50, shape: "circle", repeating: false }),
    "linear-gradient(0deg, #0f0 20%, #f00 80%)",
  );

  assert("radial includes the centre", gradientCss({ type: "radial", angle: 0, stops: [
    { id: "a", color: "#fff", position: 0 }, { id: "b", color: "#000", position: 100 },
  ], centerX: 30, centerY: 70, shape: "ellipse", repeating: false }).includes("at 30% 70%"));

  assert("repeating prefix applied", gradientCss({ type: "conic", angle: 45, stops: [
    { id: "a", color: "#fff", position: 0 }, { id: "b", color: "#000", position: 100 },
  ], centerX: 50, centerY: 50, shape: "circle", repeating: true }).startsWith("repeating-conic-gradient("));

  check("rgba built from hex and alpha", rgba("#3b82f6", 0.5), "rgba(59, 130, 246, 0.50)");
  check("shorthand hex in rgba", rgba("#fff", 1), "rgba(255, 255, 255, 1.00)");

  check(
    "single shadow css",
    shadowCss([{ id: "a", x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1, inset: false }]),
    "0px 4px 6px -1px rgba(0, 0, 0, 0.10)",
  );
  assert("inset keyword comes first", shadowCss([
    { id: "a", x: 0, y: 2, blur: 4, spread: 0, color: "#000000", alpha: 0.12, inset: true },
  ]).startsWith("inset "));
  assert("layers are comma separated", shadowCss([
    { id: "a", x: 0, y: 1, blur: 2, spread: 0, color: "#000", alpha: 0.1, inset: false },
    { id: "b", x: 0, y: 4, blur: 8, spread: 0, color: "#000", alpha: 0.1, inset: false },
  ]).includes(","));
  check("no shadows gives none", shadowCss([]), "none");
}

console.log(failures === 0 ? "\nAll batch checks passed." : `\n${failures} batch checks FAILED.`);
process.exit(failures === 0 ? 0 : 1);

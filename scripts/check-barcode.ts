#!/usr/bin/env node
/**
 * Checks the barcode encoders against published values.
 *
 * This is the clearest case on the site for testing against an outside source
 * rather than against itself. A barcode with a wrong check digit or a
 * transposed pattern renders as a perfectly convincing set of black bars and
 * scans as nothing at all — there is no visual feedback whatsoever, and no
 * error to catch. The check digits below come from the GS1 specification's own
 * worked examples.
 *
 *   pnpm check:barcode
 */

import process from "node:process";

import { FORMATS, eanCheckDigit, encode, toSvg, validate } from "@/tools/barcode-generator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------------- check digits */

// Published examples. 5901234123457 is GS1's own EAN-13 sample; 036000291452
// is the Coca-Cola UPC-A used in almost every reference.
const checks: [string, number][] = [
  ["590123412345", 7],
  ["03600029145", 2],
  ["400638133393", 1],
  ["978030640615", 7], // ISBN-13 for a well-known book
  ["4006381", 2],      // EAN-8
  ["9638507", 4],      // the standard EAN-8 reference example
];

for (const [body, expected] of checks) {
  const got = eanCheckDigit(body);
  assert(`check digit for ${body} is ${expected}`, got === expected, `got ${got}`);
}

/* ------------------------------------------------------------- EAN-13 */

{
  const result = encode("590123412345", "ean13");
  assert("EAN-13 text carries the check digit", result.text === "5901234123457", result.text);
  // 3 + 42 + 5 + 42 + 3 modules.
  assert(`EAN-13 is 95 modules (${result.bars.length})`, result.bars.length === 95);
  assert("EAN-13 opens with the start guard", result.bars.startsWith("101"));
  assert("EAN-13 closes with the end guard", result.bars.endsWith("101"));
  assert(
    "EAN-13 has a centre guard in the middle",
    result.bars.slice(45, 50) === "01010",
    result.bars.slice(45, 50),
  );
  assert("EAN-13 marks three guard positions", result.guards.length === 3);

  // Passing the full 13 digits must give the same symbol — the last digit is
  // recomputed rather than trusted, so a mistyped code is corrected.
  assert(
    "a full 13-digit code encodes identically",
    encode("5901234123457", "ean13").bars === result.bars,
  );
  assert(
    "a wrong check digit is corrected rather than encoded",
    encode("5901234123450", "ean13").text === "5901234123457",
    encode("5901234123450", "ean13").text,
  );
}

/* ------------------------------------------------------------- UPC-A */

{
  const result = encode("03600029145", "upca");
  assert("UPC-A text carries the check digit", result.text === "036000291452", result.text);
  assert(`UPC-A is 95 modules (${result.bars.length})`, result.bars.length === 95);
  // UPC-A is EAN-13 with a leading zero, so the bars must match exactly.
  assert(
    "UPC-A equals the EAN-13 of the same code with a leading zero",
    result.bars === encode("003600029145", "ean13").bars,
  );
}

/* ------------------------------------------------------------- EAN-8 */

{
  const result = encode("4006381", "ean8");
  assert("EAN-8 text carries the check digit", result.text === "40063812", result.text);
  assert(`EAN-8 is 67 modules (${result.bars.length})`, result.bars.length === 67);
  assert("EAN-8 opens and closes with guards", result.bars.startsWith("101") && result.bars.endsWith("101"));
}

/* ----------------------------------------------------------- Code 128 */

{
  const result = encode("HELLO", "code128");
  assert("Code 128 keeps the text as given", result.text === "HELLO");
  // Start + 5 data + checksum + stop = 8 symbols of 11 modules, plus the
  // 2-module termination bar.
  assert(`Code 128 "HELLO" is 90 modules (${result.bars.length})`, result.bars.length === 8 * 11 + 2);
  assert("Code 128 ends with the termination bar", result.bars.endsWith("11"));

  // Subset C halves a long digit run, so a numeric code must come out shorter
  // than the same length of letters.
  const digits = encode("12345678", "code128");
  const letters = encode("ABCDEFGH", "code128");
  assert(
    `subset C shortens an even digit run (${digits.bars.length} vs ${letters.bars.length} modules)`,
    digits.bars.length < letters.bars.length,
  );

  // Mixed content must still encode without throwing.
  assert("mixed text and digits encode", encode("AB-12345-Z", "code128").bars.length > 0);
  assert("a space encodes", encode("a b", "code128").bars.length > 0);
}

/* ------------------------------------------------------------ Code 39 */

{
  const result = encode("ABC123", "code39");
  assert("Code 39 uppercases its text", result.text === "ABC123");
  // Start + 6 + stop = 8 characters of 12 modules, plus 7 separator spaces.
  assert(`Code 39 is 103 modules (${result.bars.length})`, result.bars.length === 8 * 12 + 7);
  assert("Code 39 is delimited by the start/stop pattern", result.bars.startsWith("100101101101"));
  assert("lowercase is accepted and uppercased", encode("abc", "code39").text === "ABC");
}

/* -------------------------------------------------------- every symbol */

// Whatever the format, the pattern must be binary and must begin and end with
// a bar — a symbol starting on a space has no detectable leading edge.
for (const { id, label } of FORMATS) {
  const sample = id === "code39" ? "TEST123" : id === "code128" ? "Test-123" :
    id === "ean13" ? "590123412345" : id === "upca" ? "03600029145" : "4006381";
  const result = encode(sample, id);
  assert(`${label} produces only bars and spaces`, /^[01]+$/.test(result.bars));
  assert(`${label} starts and ends with a bar`, result.bars.startsWith("1") && result.bars.endsWith("1"));
}

/* -------------------------------------------------------- validation */

const rejects: [string, Parameters<typeof encode>[1], string][] = [
  ["", "code128", "empty"],
  ["12345", "ean13", "too short"],
  ["12345678901234", "ean13", "too long"],
  ["abcdefghijkl", "ean13", "not digits"],
  ["1234567", "upca", "too short"],
  ["hello!", "code39", "unsupported character"],
];

for (const [value, format, why] of rejects) {
  assert(`rejects ${JSON.stringify(value)} for ${format} (${why})`, validate(value, format) !== null);
}

assert("accepts a valid EAN-13", validate("590123412345", "ean13") === null);
assert("accepts a valid Code 39 string", validate("AB-12 $/+%", "code39") === null);

/* -------------------------------------------------------------- SVG */

{
  const svg = toSvg(encode("590123412345", "ean13"), { moduleWidth: 2, height: 80, showText: true });
  assert("SVG is well formed", svg.startsWith("<svg") && svg.endsWith("</svg>"));
  assert("SVG declares its namespace", svg.includes('xmlns="http://www.w3.org/2000/svg"'));
  assert("SVG draws bars", (svg.match(/<rect/g) ?? []).length > 10);
  assert("SVG prints the number", svg.includes("5901234123457"));
  assert(
    "SVG omits the number when asked",
    !toSvg(encode("590123412345", "ean13"), { moduleWidth: 2, height: 80, showText: false }).includes("<text"),
  );
  // Quiet zones either side are required for a scanner to find the symbol.
  assert("SVG is wider than the bars alone", svg.includes('width="230"'), svg.slice(0, 90));
}

console.log(
  failures === 0
    ? "\nBarcode checks passed — check digits and module counts match the specification."
    : `\n${failures} barcode checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

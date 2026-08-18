#!/usr/bin/env node
/**
 * Checks the PDF page organiser and the timesheet calculator.
 *
 * Both have a failure mode that produces a plausible answer rather than an
 * error. Reordering pages can silently drop or duplicate one; an overnight
 * shift subtracted naively gives a negative number that a UI will happily
 * render as zero hours. Neither throws.
 *
 *   pnpm check:batch2
 */

import process from "node:process";

import { PDFDocument, StandardFonts, degrees } from "pdf-lib";

import {
  buildPdf,
  initialPages,
  isUnchanged,
  kept,
  movePage,
  reverse,
  rotateAll,
  rotatePage,
  toggleDelete,
} from "@/tools/organize-pdf/logic";
import {
  blankEntry,
  calculateEntry,
  calculateTotals,
  formatClock,
  formatDuration,
  parseTime,
  toDecimalHours,
  type Entry,
} from "@/tools/hours-calculator/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ================================================== PDF page organising */

async function makePdf(count: number, rotateFirst = false): Promise<ArrayBuffer> {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < count; i += 1) {
    const page = document.addPage([400, 600]);
    page.drawText(`P${i + 1}`, { x: 40, y: 540, size: 40, font });
    if (rotateFirst && i === 0) page.setRotation(degrees(90));
  }
  const bytes = await document.save();
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

const five = await makePdf(5);

{
  const pages = initialPages(5);
  assert("a fresh state is unchanged", isUnchanged(pages));
  assert("every page starts kept", kept(pages).length === 5);

  const moved = movePage(pages, 0, 4);
  assert("moving to the end reorders", moved.map((p) => p.source).join() === "1,2,3,4,0", moved.map((p) => p.source).join());
  assert("moving keeps the page count", moved.length === 5);
  assert("moving marks the state changed", !isUnchanged(moved));

  assert("moving backwards works", movePage(pages, 4, 0).map((p) => p.source).join() === "4,0,1,2,3");
  assert("moving onto itself is a no-op", movePage(pages, 2, 2) === pages);
  assert("moving past the end clamps", movePage(pages, 0, 99).map((p) => p.source).join() === "1,2,3,4,0");
  assert("moving before the start clamps", movePage(pages, 3, -5).map((p) => p.source).join() === "3,0,1,2,4");

  // The property that matters: no page may vanish or appear twice.
  let scrambled = pages;
  for (let i = 0; i < 50; i += 1) {
    scrambled = movePage(scrambled, i % 5, (i * 3) % 5);
  }
  assert(
    "repeated moves never lose or duplicate a page",
    new Set(scrambled.map((p) => p.source)).size === 5 && scrambled.length === 5,
  );

  assert("reversing flips the order", reverse(pages).map((p) => p.source).join() === "4,3,2,1,0");

  const rotated = rotatePage(pages, 1, 90);
  assert("rotating touches only its page", rotated[1].rotation === 90 && rotated[0].rotation === 0);
  assert(
    "four right turns come back to zero",
    rotatePage(rotatePage(rotatePage(rotated, 1, 90), 1, 90), 1, 90)[1].rotation === 0,
  );
  assert("rotating anticlockwise normalises", rotatePage(pages, 0, -90)[0].rotation === 270);
  assert("rotate-all turns every page", rotateAll(pages, 180).every((p) => p.rotation === 180));

  const deleted = toggleDelete(pages, 2);
  assert("deleting removes one from the kept list", kept(deleted).length === 4);
  assert("deleting is reversible", kept(toggleDelete(deleted, 2)).length === 5);
}

/* ------------------------------------------------- the produced file */

{
  const pages = toggleDelete(movePage(initialPages(5), 0, 4), 1);
  const out = await buildPdf(five, pages);
  const reopened = await PDFDocument.load(out);

  assert("the output is a PDF", String.fromCharCode(...out.slice(0, 5)) === "%PDF-");
  assert(`one page removed leaves four (${reopened.getPageCount()})`, reopened.getPageCount() === 4);
  assert("page size is preserved", Math.round(reopened.getPage(0).getSize().width) === 400);
}

{
  const rotated = await buildPdf(five, rotateAll(initialPages(5), 90));
  const reopened = await PDFDocument.load(rotated);
  assert(
    "rotation is written to the page",
    reopened.getPage(0).getRotation().angle === 90,
    String(reopened.getPage(0).getRotation().angle),
  );
}

{
  // A page already rotated in the source must have the new turn added to it,
  // not replace it.
  const preRotated = await makePdf(2, true);
  const out = await buildPdf(preRotated, rotateAll(initialPages(2), 90));
  const reopened = await PDFDocument.load(out);
  assert(
    "an existing rotation is added to, not reset",
    reopened.getPage(0).getRotation().angle === 180,
    String(reopened.getPage(0).getRotation().angle),
  );
}

{
  let threw = false;
  try {
    await buildPdf(five, initialPages(5).map((p) => ({ ...p, deleted: true })));
  } catch {
    threw = true;
  }
  assert("deleting every page is refused", threw);
}

/* ===================================================== timesheet times */

const times: [string, number | null][] = [
  ["9", 540], ["09", 540], ["9:30", 570], ["9.30", 570], ["09:30", 570],
  ["17:45", 1065], ["0:00", 0], ["23:59", 1439],
  ["9am", 540], ["9 AM", 540], ["5pm", 1020], ["5:45pm", 1065],
  // The two that the "add twelve" rule gets wrong in both directions.
  ["12am", 0], ["12pm", 720], ["12:30am", 30], ["12:30pm", 750],
  ["", null], ["abc", null], ["25:00", null], ["9:75", null], ["13pm", null], ["0am", null],
];

for (const [input, expected] of times) {
  const got = parseTime(input);
  assert(`${JSON.stringify(input).padEnd(10)} → ${expected}`, got === expected, `got ${got}`);
}

assert("clock formatting pads", formatClock(540) === "09:00" && formatClock(1065) === "17:45");
assert("duration reads naturally", formatDuration(450) === "7h 30m" && formatDuration(480) === "8h");
assert("sub-hour durations show minutes", formatDuration(45) === "45m");
assert("decimal hours round to two places", toDecimalHours(450) === 7.5 && toDecimalHours(455) === 7.58);

/* --------------------------------------------------------- shifts */

function entry(start: string, end: string, breakMinutes = 0): Entry {
  return { ...blankEntry("Test"), start, end, breakMinutes };
}

{
  const normal = calculateEntry(entry("09:00", "17:30", 30));
  assert("a normal shift subtracts the break", normal.minutes === 480, String(normal.minutes));
  assert("a normal shift is not overnight", !normal.overnight);

  // The classic timesheet bug: naive subtraction gives -960 here.
  const night = calculateEntry(entry("22:00", "06:00"));
  assert(`an overnight shift is eight hours (${night.minutes})`, night.minutes === 480);
  assert("an overnight shift is flagged", night.overnight);

  const nightWithBreak = calculateEntry(entry("23:00", "07:30", 45));
  assert("overnight with a break", nightWithBreak.minutes === 465, String(nightWithBreak.minutes));

  assert("a blank row is not an error", calculateEntry(entry("", "")).error === null);
  assert("a half-filled row is an error", calculateEntry(entry("09:00", "")).error !== null);
  assert("an unreadable time is an error", calculateEntry(entry("banana", "17:00")).error !== null);
  assert(
    "a break longer than the shift is refused",
    calculateEntry(entry("09:00", "10:00", 120)).error !== null,
  );

  // Equal times mean a full 24 hours, not zero — someone clocked in and out at
  // the same time a day apart.
  assert("equal start and end is a full day", calculateEntry(entry("09:00", "09:00")).minutes === 1440);
}

/* --------------------------------------------------------- totals */

{
  const week: Entry[] = [
    entry("09:00", "17:00", 30), // 7h30
    entry("09:00", "17:00", 30),
    entry("09:00", "17:00", 30),
    entry("09:00", "17:00", 30),
    entry("09:00", "17:00", 30),
    entry("", ""),
  ];

  const plain = calculateTotals(week, { rate: null, overtimeAfterHours: null, overtimeMultiplier: 1.5 });
  assert(`five shifts total 37h30 (${formatDuration(plain.minutes)})`, plain.minutes === 2250);
  assert("blank rows are not counted", plain.counted === 5);
  assert("decimal hours for payroll", plain.decimalHours === 37.5, String(plain.decimalHours));
  assert("no pay without a rate", plain.pay === null);

  const paid = calculateTotals(week, { rate: 20, overtimeAfterHours: null, overtimeMultiplier: 1.5 });
  assert(`37.5h at £20 is £750 (${paid.pay})`, paid.pay === 750);

  const withOvertime = calculateTotals(week, { rate: 20, overtimeAfterHours: 35, overtimeMultiplier: 1.5 });
  assert("overtime is the excess over the threshold", withOvertime.overtimeMinutes === 150);
  assert("regular hours stop at the threshold", withOvertime.regularMinutes === 2100);
  // 35 × 20 + 2.5 × 30 = 700 + 75
  assert(`overtime is paid at 1.5× (${withOvertime.pay})`, withOvertime.pay === 775);

  const under = calculateTotals([entry("09:00", "12:00")], {
    rate: 10, overtimeAfterHours: 35, overtimeMultiplier: 1.5,
  });
  assert("no overtime below the threshold", under.overtimeMinutes === 0 && under.pay === 30);
}

console.log(
  failures === 0
    ? "\nPDF organiser and timesheet checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

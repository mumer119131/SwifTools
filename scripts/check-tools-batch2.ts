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
import { calculate, formatTerm, ltvBand, monthlyPayment } from "@/tools/mortgage-calculator/logic";
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

/* ======================================================== mortgages */

console.log("\nMortgage arithmetic");
{
  const t = assert;
  const near=(a:number,b:number,tol=0.02)=>Math.abs(a-b)<tol;

  // Published annuity example: £200,000 at 6% over 30 years is £1,199.10/month.
  t(`annuity 200k/6%/30y = 1199.10 (${monthlyPayment(200000,0.06/12,360).toFixed(2)})`,
    near(monthlyPayment(200000,0.06/12,360),1199.10,0.05));
  // A second: 100k at 5% over 15 years = 790.79
  t(`annuity 100k/5%/15y = 790.79 (${monthlyPayment(100000,0.05/12,180).toFixed(2)})`,
    near(monthlyPayment(100000,0.05/12,180),790.79,0.05));
  // Zero rate is plain division.
  t("zero rate divides evenly", monthlyPayment(120000,0,120) === 1000);

  const base = {price:300000,deposit:60000,annualRate:5,years:25,annualTax:0,annualInsurance:0,monthlyOther:0,monthlyOverpayment:0};
  const r = calculate(base)!;
  t("principal is price minus deposit", r.principal === 240000);
  t(`LTV is 80% (${r.ltv})`, near(r.ltv,80));
  // 1403.02, confirmed independently: amortising 300 payments of this amount
  // against the balance clears it to zero, which no wrong figure would.
  t(`payment ≈ 1403.02 (${r.monthlyPayment.toFixed(2)})`, near(r.monthlyPayment,1403.02,0.05));
  t("total paid = principal + interest", near(r.totalPaid, r.principal + r.totalInterest, 0.01));
  t(`interest is substantial (${r.totalInterest.toFixed(0)})`, r.totalInterest > 180000 && r.totalInterest < 190000);
  t("no overpayment block when zero", r.overpaid === null);

  // Running costs must not touch the loan figures, only the monthly outlay.
  const withCosts = calculate({...base, annualTax:2400, annualInsurance:600, monthlyOther:50})!;
  t("running costs leave the payment alone", near(withCosts.monthlyPayment, r.monthlyPayment, 0.001));
  t(`monthly total adds 300 (${withCosts.monthlyTotal.toFixed(2)})`,
    near(withCosts.monthlyTotal, r.monthlyPayment + 250 + 50, 0.01));

  // Overpayment: the headline feature.
  const over = calculate({...base, monthlyOverpayment:200})!;
  t("overpaying produces a block", over.overpaid !== null);
  t(`overpaying shortens the term (saved ${over.overpaid!.monthsSaved} months)`, over.overpaid!.monthsSaved > 40);
  t("overpaying saves interest", over.overpaid!.interestSaved > 30000);
  t("clears sooner than the full term", over.overpaid!.monthsToClear < 300);
  t("saved interest is consistent",
    near(over.overpaid!.interestSaved, r.totalInterest - over.overpaid!.totalInterest, 0.5));

  // A bigger overpayment must always do at least as well.
  const more = calculate({...base, monthlyOverpayment:500})!;
  t("more overpayment clears sooner", more.overpaid!.monthsToClear < over.overpaid!.monthsToClear);
  t("more overpayment saves more", more.overpaid!.interestSaved > over.overpaid!.interestSaved);

  // Zero-rate mortgage with overpayment must still terminate.
  const zero = calculate({...base, annualRate:0, monthlyOverpayment:100})!;
  t("zero-rate loan clears", Number.isFinite(zero.overpaid!.monthsToClear));
  t("zero-rate loan has no interest", zero.totalInterest === 0);

  // Rejections.
  for (const [label, patch] of [
    ["zero price", {price:0}],
    ["negative price", {price:-1}],
    ["deposit equal to price", {deposit:300000}],
    ["deposit above price", {deposit:400000}],
    ["negative deposit", {deposit:-1}],
    ["negative rate", {annualRate:-1}],
    ["absurd rate", {annualRate:150}],
    ["zero term", {years:0}],
    ["absurd term", {years:99}],
  ] as const) {
    t(`rejects ${label}`, calculate({...base, ...patch}) === null);
  }

  t("formats a whole year", formatTerm(24) === "2 years");
  t("formats a mixed term", formatTerm(295) === "24 years 7 months");
  t("formats months alone", formatTerm(7) === "7 months");
  t("formats one month", formatTerm(1) === "1 month");
  t("formats one year", formatTerm(12) === "1 year");

  t("80% sits in its own band", ltvBand(80).label === "Up to 80%");
  t("81% steps up", ltvBand(81).label === "Up to 90%");
  t("60% is the best band", ltvBand(60).label === "60% or less");
  t("above 95 is flagged", ltvBand(97).label === "Above 95%");
}

console.log(
  failures === 0
    ? "\nPDF organiser, timesheet and mortgage checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

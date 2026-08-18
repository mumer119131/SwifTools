#!/usr/bin/env node
/**
 * Checks the VAT calculator, the PDF watermarker and the image colour sampler.
 *
 * The VAT half is the one that earns its place. Removing tax from a
 * tax-inclusive price is a division, not a subtraction, and getting it wrong
 * produces an answer that is only 4% out — small enough to pass a glance and
 * large enough to matter across a year of invoices.
 *
 *   pnpm check:batch3
 */

import process from "node:process";

import { PDFDocument, StandardFonts } from "pdf-lib";

import { addVat, naiveRemoval, parseAmount, removeVat, vatFraction, RATE_PRESETS } from "@/tools/vat-calculator/logic";
import { parsePages, watermarkPdf } from "@/tools/watermark-pdf/logic";
import { extractPalette, readableOn, sampleAt, toHex, toHsl } from "@/tools/image-color-picker/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol = 0.005) => Math.abs(a - b) < tol;

/* ================================================================= VAT */

console.log("VAT");

{
  const added = addVat(100, 20);
  assert("100 + 20% VAT is 120", added.gross === 120 && added.vat === 20);

  // The whole reason this tool exists.
  const removed = removeVat(120, 20);
  assert(`120 gross at 20% is 100 net (${removed.net})`, removed.net === 100);
  assert("and 20 of VAT", removed.vat === 20);
  assert(
    `subtracting instead would wrongly give 96 (${naiveRemoval(120, 20)})`,
    naiveRemoval(120, 20) === 96,
  );

  // Round trip at every preset rate.
  for (const { rates } of RATE_PRESETS) {
    for (const { percent } of rates) {
      const gross = addVat(250, percent).gross;
      const back = removeVat(gross, percent);
      assert(
        `250 net at ${percent}% round-trips (${back.net})`,
        near(back.net, 250, 0.02),
        `got ${back.net}`,
      );
    }
  }

  assert("zero rate changes nothing", addVat(99.99, 0).gross === 99.99);
  assert("net plus vat equals gross", (() => {
    const r = removeVat(1234.56, 23);
    return near(r.net + r.vat, r.gross, 0.005);
  })());

  // Pence must be whole — an invoice cannot show a third of a penny.
  const awkward = removeVat(19.99, 20);
  assert(`19.99 at 20% gives clean pence (${awkward.net} + ${awkward.vat})`,
    Number.isInteger(Math.round(awkward.net * 100)) && Number.isInteger(Math.round(awkward.vat * 100)));

  assert("20% is a sixth of the gross", vatFraction(20) === "1/6", vatFraction(20));
  assert("a non-tidy rate reports a percentage", vatFraction(13.5).includes("%"));

  // People paste straight from invoices.
  assert("parses a plain number", parseAmount("120") === 120);
  assert("parses with a currency symbol", parseAmount("£1,234.56") === 1234.56);
  assert("parses with spaces", parseAmount(" 99.99 ") === 99.99);
  assert("rejects text", parseAmount("abc") === null);
  assert("rejects empty", parseAmount("") === null);
  assert("rejects negatives", parseAmount("-5") === null);
}

/* ====================================================== PDF watermarking */

console.log("\nPDF watermarking");

{
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < 4; i += 1) {
    document.addPage([595, 842]).drawText(`Page ${i + 1}`, { x: 40, y: 780, size: 16, font });
  }
  const saved = await document.save();
  const source = saved.buffer.slice(saved.byteOffset, saved.byteOffset + saved.byteLength) as ArrayBuffer;

  const base = {
    text: "DRAFT",
    opacity: 0.15,
    fontSize: 40,
    color: { r: 0.6, g: 0.6, b: 0.6 },
    tile: false,
    pages: null,
  } as const;

  for (const placement of ["diagonal", "horizontal", "footer"] as const) {
    const out = await watermarkPdf(source, { ...base, placement });
    const reopened = await PDFDocument.load(out);
    assert(`${placement} produces a valid PDF`, String.fromCharCode(...out.slice(0, 5)) === "%PDF-");
    assert(`${placement} keeps all four pages`, reopened.getPageCount() === 4);
    assert(`${placement} keeps the page size`, Math.round(reopened.getPage(0).getSize().width) === 595);
  }

  const tiled = await watermarkPdf(source, { ...base, placement: "diagonal", tile: true });
  const single = await watermarkPdf(source, { ...base, placement: "diagonal", tile: false });
  assert("tiling writes more content than a single stamp", tiled.length > single.length);

  let threw = false;
  try {
    await watermarkPdf(source, { ...base, placement: "diagonal", text: "   " });
  } catch {
    threw = true;
  }
  assert("empty text is refused", threw);

  // Page selection.
  assert("a blank range means every page", parsePages("", 4) === null);
  assert("a single page parses", parsePages("2", 4)?.join() === "2");
  assert("a list parses", parsePages("1,3", 4)?.join() === "1,3");
  assert("a range parses", parsePages("2-4", 4)?.join() === "2,3,4");
  assert("a mixed selection parses", parsePages("1,3-4", 4)?.join() === "1,3,4");
  assert("a reversed range still works", parsePages("4-2", 4)?.join() === "2,3,4");
  assert("out-of-range pages are dropped", parsePages("3-99", 4)?.join() === "3,4");
  assert("duplicates collapse", parsePages("2,2,2", 4)?.join() === "2");
  assert("nonsense yields every page", parsePages("abc", 4) === null);

  const selective = await watermarkPdf(source, { ...base, placement: "footer", pages: [2] });
  assert("watermarking one page still returns four", (await PDFDocument.load(selective)).getPageCount() === 4);
}

/* ==================================================== colour sampling */

console.log("\nColour sampling");

{
  assert("black is #000000", toHex({ r: 0, g: 0, b: 0 }) === "#000000");
  assert("white is #ffffff", toHex({ r: 255, g: 255, b: 255 }) === "#ffffff");
  assert("a mid colour hexes correctly", toHex({ r: 59, g: 130, b: 246 }) === "#3b82f6");

  const blue = toHsl({ r: 59, g: 130, b: 246 });
  assert(`#3b82f6 is hue ~217 (${blue.h.toFixed(0)})`, Math.abs(blue.h - 217) < 2);
  assert(`and ~60% light (${blue.l.toFixed(0)})`, Math.abs(blue.l - 60) < 2);
  assert("grey has no saturation", toHsl({ r: 128, g: 128, b: 128 }).s === 0);

  assert("dark colours take white text", readableOn({ r: 20, g: 20, b: 30 }) === "#ffffff");
  assert("light colours take black text", readableOn({ r: 240, g: 240, b: 230 }) === "#000000");

  // A 4x4 image, entirely one colour, with one stray pixel — the average must
  // barely move, which is the point of sampling a square rather than a pixel.
  const width = 4;
  const height = 4;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 200; data[i + 1] = 100; data[i + 2] = 50; data[i + 3] = 255;
  }
  const flat = sampleAt(data, width, height, 2, 2);
  assert("a flat area samples exactly", flat.r === 200 && flat.g === 100 && flat.b === 50);

  data[0] = 0; data[1] = 0; data[2] = 0; // one black pixel
  const withNoise = sampleAt(data, width, height, 2, 2);
  assert(
    `one stray pixel barely moves the average (${withNoise.r.toFixed(1)})`,
    withNoise.r > 185 && withNoise.r <= 200,
  );

  // Transparent pixels must be skipped rather than averaged in as black.
  const alpha = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < alpha.length; i += 4) {
    alpha[i] = 255; alpha[i + 1] = 255; alpha[i + 2] = 255;
    alpha[i + 3] = i < alpha.length / 2 ? 255 : 0;
  }
  const overAlpha = sampleAt(alpha, width, height, 1, 0);
  assert(`transparent pixels are skipped (${overAlpha.r})`, overAlpha.r === 255);

  // Palette extraction: an image of two strong colours plus black and white
  // must return the two colours, not the black and white.
  const big = new Uint8ClampedArray(64 * 64 * 4);
  for (let i = 0; i < big.length; i += 4) {
    const quarter = Math.floor(i / (big.length / 4));
    const colour =
      quarter === 0 ? [220, 40, 40] : quarter === 1 ? [40, 80, 200] : quarter === 2 ? [0, 0, 0] : [255, 255, 255];
    big[i] = colour[0]; big[i + 1] = colour[1]; big[i + 2] = colour[2]; big[i + 3] = 255;
  }
  const palette = extractPalette(big, 6);
  assert(`a palette is returned (${palette.length} swatches)`, palette.length >= 2);
  const hexes = palette.map((s) => toHex(s.color));
  assert(
    `black and white are excluded (${hexes.join(" ")})`,
    !hexes.includes("#000000") && !hexes.includes("#ffffff"),
  );
  assert("shares sum to about one", near(palette.reduce((n, s) => n + s.share, 0), 1, 0.01));
  assert("an empty image returns nothing", extractPalette(new Uint8ClampedArray(64), 6).length === 0);
}

console.log(
  failures === 0
    ? "\nVAT, watermark and colour checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

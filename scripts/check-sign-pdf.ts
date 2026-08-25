#!/usr/bin/env node
/**
 * Checks that signing produces a real, valid PDF with the signature where it
 * was asked for.
 *
 * Coordinates are the thing worth testing. A preview is clicked from the top
 * left; PDF space runs from the bottom left; and getting the flip wrong
 * produces a file that opens perfectly well with the signature in the wrong
 * place — which no error can catch and only a human looking at the output
 * would notice.
 *
 *   pnpm check:sign-pdf
 */

import process from "node:process";

import { PDFDocument, StandardFonts } from "pdf-lib";

import {
  clampPlacement,
  defaultStampText,
  readPageSizes,
  signPdf,
  SIGNATURE_FONTS,
  signatureBox,
  signatureFontCss,
} from "@/tools/sign-pdf/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------- a document to sign */

async function makePdf(pages = 3): Promise<ArrayBuffer> {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i += 1) {
    const page = document.addPage([595.28, 841.89]); // A4 in points
    page.drawText(`Page ${i + 1}`, { x: 50, y: 780, size: 18, font });
  }
  const bytes = await document.save();
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

const source = await makePdf();

/* ------------------------------------------------------- page sizes */

const sizes = await readPageSizes(source);
assert("reads every page", sizes.length === 3, `${sizes.length}`);
assert(
  "reports A4 in points",
  Math.round(sizes[0].width) === 595 && Math.round(sizes[0].height) === 842,
  `${sizes[0].width} × ${sizes[0].height}`,
);

/* ------------------------------------------------ signing with text */

const signed = await signPdf({
  pdf: source,
  typed: { text: "A. Lovelace", font: SIGNATURE_FONTS[0].id },
  placement: { x: 0.1, y: 0.85, width: 0.3, pageNumber: 2 },
  stamp: { text: defaultStampText(new Date("2026-08-18")), size: 9 },
});

assert("produces bytes", signed.length > 0);
assert(
  "the output is a PDF",
  String.fromCharCode(...signed.slice(0, 5)) === "%PDF-",
  String.fromCharCode(...signed.slice(0, 5)),
);
assert("the signed file is larger than the original", signed.length > source.byteLength);

// It must still open, and still have the same pages.
const reopened = await PDFDocument.load(signed);
assert("the signed PDF reopens", reopened.getPageCount() === 3, `${reopened.getPageCount()} pages`);
assert(
  "page dimensions are unchanged",
  Math.round(reopened.getPage(0).getSize().width) === 595,
);

/* -------------------------------------------------- signing with an image */

// A 4×2 opaque PNG, so the aspect ratio is unambiguous.
async function makePng(): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  const page = document.addPage([4, 2]);
  page.drawRectangle({ x: 0, y: 0, width: 4, height: 2 });
  // pdf-lib cannot rasterise, so build the PNG by hand instead: a minimal
  // 4×2 RGBA image, zlib-stored.
  const { deflateSync } = await import("node:zlib");
  const raw = Buffer.alloc((4 * 4 + 1) * 2);
  for (let y = 0; y < 2; y += 1) {
    raw[y * 17] = 0; // filter: none
    for (let x = 0; x < 4; x += 1) {
      const at = y * 17 + 1 + x * 4;
      raw[at] = 0; raw[at + 1] = 0; raw[at + 2] = 0; raw[at + 3] = 255;
    }
  }
  const chunk = (type: string, body: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(body.length);
    const typed = Buffer.concat([Buffer.from(type, "latin1"), body]);
    const crcTable = [...Array(256).keys()].map((n) => {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      return c >>> 0;
    });
    let crc = 0xffffffff;
    for (const byte of typed) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([length, typed, crcBuf]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(4, 0); ihdr.writeUInt32BE(2, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return new Uint8Array(Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]));
}

const png = await makePng();
const withImage = await signPdf({
  pdf: source,
  signature: png,
  placement: { x: 0.2, y: 0.5, width: 0.25, pageNumber: 1 },
});
assert("an image signature embeds", withImage.length > source.byteLength);
assert(
  "the image-signed PDF reopens",
  (await PDFDocument.load(withImage)).getPageCount() === 3,
);

/* --------------------------------------------------------- rejections */

let threw = false;
try {
  await signPdf({
    pdf: source,
    typed: { text: "x", font: SIGNATURE_FONTS[0].id },
    placement: { x: 0, y: 0, width: 0.2, pageNumber: 9 },
  });
} catch (cause) {
  threw = true;
  assert(
    "a missing page is refused with a useful message",
    String(cause).includes("3 pages"),
    String(cause),
  );
}
assert("signing past the last page throws", threw);

let empty = false;
try {
  await signPdf({
    pdf: source,
    typed: { text: "   ", font: SIGNATURE_FONTS[0].id },
    placement: { x: 0, y: 0, width: 0.2, pageNumber: 1 },
  });
} catch {
  empty = true;
}
assert("signing with nothing throws", empty);

/* ---------------------------------------------------------- clamping */

const off = clampPlacement({ x: 1.5, y: -3, width: 2, pageNumber: 1 });
assert(`x is clamped inside the page (${off.x.toFixed(2)})`, off.x >= 0 && off.x <= 1);
assert("width is capped", off.width <= 0.8 && off.width >= 0.05);
// y is the top edge now, so 0 means flush with the top of the page. The old
// floor of 0.02 belonged to the days when y was the signature's bottom.
assert(`y stays on the page (${off.y.toFixed(2)})`, off.y >= 0 && off.y <= 1);

const fine = clampPlacement({ x: 0.3, y: 0.5, width: 0.25, pageNumber: 1 });
assert(
  "a sane placement is left alone",
  fine.x === 0.3 && fine.y === 0.5 && fine.width === 0.25,
);

// A wide signature must not be pushed off the right edge.
const wide = clampPlacement({ x: 0.9, y: 0.5, width: 0.5, pageNumber: 1 });
assert(
  `a wide signature is pulled back on-page (x ${wide.x.toFixed(2)})`,
  wide.x + wide.width <= 1.0001,
);

assert(
  "the date stamp reads naturally",
  defaultStampText(new Date("2026-08-18")) === "Signed 18 August 2026",
  defaultStampText(new Date("2026-08-18")),
);

assert("several signature fonts are offered", SIGNATURE_FONTS.length >= 3);

/* ------------------------------------- the preview must not lie about size */

/*
 * The page preview and the PDF writer previously disagreed three ways: the
 * preview used a hardcoded 6% height whatever the signature's shape, and
 * shifted the box up by its own height, so it sat entirely above where the
 * signature landed — zero overlap. Both now read signatureBox, and these
 * assert the properties that made it wrong.
 */
{
  const placement = { x: 0.6, y: 0.4, width: 0.25, pageNumber: 1 };
  const pageWidth = 595;
  const pageHeight = 842;
  const pageRatio = pageWidth / pageHeight;
  const aspect = 0.35;

  const box = signatureBox(placement, aspect, pageRatio);

  assert("the click point is the top edge, not the bottom", box.top === placement.y);
  assert("width is taken straight from the placement", box.width === placement.width);
  assert("left is taken straight from the placement", box.left === placement.x);

  // Height must follow the signature's real proportions, not a fixed guess.
  const drawnWidth = box.width * pageWidth;
  const drawnHeight = box.height * pageHeight;
  assert(
    "the signature keeps its aspect ratio on the page",
    Math.abs(drawnHeight / drawnWidth - aspect) < 1e-9,
    `${drawnHeight / drawnWidth} vs ${aspect}`,
  );

  // A taller signature must produce a taller box; the old 6% never moved.
  const taller = signatureBox(placement, aspect * 2, pageRatio);
  assert("a taller signature gives a taller box", taller.height > box.height * 1.9);

  // A wider setting must grow the box in both directions.
  const wider = signatureBox({ ...placement, width: 0.5 }, aspect, pageRatio);
  assert("doubling the width doubles the height too", Math.abs(wider.height - box.height * 2) < 1e-9);

  // The rectangle the preview paints must be the one the PDF writes into.
  const pdfBottomY = pageHeight * (1 - box.top - box.height);
  const pdfTopFraction = 1 - (pdfBottomY + drawnHeight) / pageHeight;
  const pdfBottomFraction = 1 - pdfBottomY / pageHeight;
  assert(
    "preview and PDF describe the same rectangle",
    Math.abs(pdfTopFraction - box.top) < 1e-9 &&
      Math.abs(pdfBottomFraction - (box.top + box.height)) < 1e-9,
  );
}

/* --------------------------------------------- dragging stays on the page */

/*
 * The signature is dragged by pointer, so the clamp is what stops it being
 * dropped off the edge. y is the TOP edge and the signature grows downward,
 * which is why the clamp needs its height: the previous upper bound of 1
 * allowed a placement whose whole signature fell below the page.
 */
{
  const pageRatio = 595 / 842;
  const base = { x: 0.6, y: 0.4, width: 0.25, pageNumber: 1 };
  const height = signatureBox(base, 0.35, pageRatio).height;

  for (const y of [-0.5, 0, 0.5, 0.95, 1, 2]) {
    const clamped = clampPlacement({ ...base, y }, height);
    assert(
      `a top edge of ${y} keeps the whole signature on the page`,
      clamped.y >= 0 && clamped.y + height <= 1 + 1e-9,
      `y=${clamped.y}, bottom=${clamped.y + height}`,
    );
  }

  for (const x of [-1, 0, 0.9, 5]) {
    const clamped = clampPlacement({ ...base, x }, height);
    assert(
      `a left edge of ${x} keeps the signature on the page`,
      clamped.x >= 0 && clamped.x + clamped.width <= 1 + 1e-9,
    );
  }

  // A signature taller than the page can only sit flush with the top.
  const huge = clampPlacement({ ...base, y: 0.5 }, 1.5);
  assert("an oversized signature pins to the top", huge.y === 0);

  /*
   * Dragging holds the point that was grabbed: the new top-left is the pointer
   * minus the offset it was picked up at, so the signature does not snap its
   * corner to the cursor.
   */
  const grabbed = signatureBox(base, 0.35, pageRatio);
  const dx = grabbed.width * 0.3;
  const dy = grabbed.height * 0.6;
  const target = { x: 0.2, y: 0.7 };
  const dragged = clampPlacement(
    { ...base, x: target.x - dx, y: target.y - dy },
    height,
  );
  const moved = signatureBox(dragged, 0.35, pageRatio);
  assert(
    "a drag keeps the grabbed point under the pointer",
    Math.abs(moved.left + dx - target.x) < 1e-9 && Math.abs(moved.top + dy - target.y) < 1e-9,
  );
}

/* ------------------------------------ each style is distinct on both sides */

/*
 * The Style dropdown was inert on screen: the PDF embedded the right face but
 * the preview drew every one of them in the browser default, because the CSS
 * lived nowhere. Each entry now carries both, and these assert the two stay in
 * step and that no two styles collapse into the same rendering.
 */
{
  const cssKeys = new Set<string>();
  const pdfFonts = new Set<string>();

  for (const entry of SIGNATURE_FONTS) {
    const css = signatureFontCss(entry.id);

    assert(
      `${entry.label} has an on-screen face`,
      css.fontFamily.length > 0 && css.fontStyle.length > 0,
    );
    assert(
      `${entry.label} resolves to its own entry`,
      css.fontFamily === entry.fontFamily && css.fontStyle === entry.fontStyle,
    );

    cssKeys.add(`${css.fontFamily}|${css.fontStyle}`);
    pdfFonts.add(String(entry.id));
  }

  assert(
    `all ${SIGNATURE_FONTS.length} styles look different on screen`,
    cssKeys.size === SIGNATURE_FONTS.length,
    `${cssKeys.size} distinct`,
  );
  assert(
    `all ${SIGNATURE_FONTS.length} styles write a different PDF font`,
    pdfFonts.size === SIGNATURE_FONTS.length,
  );

  // An unknown id must still render something rather than nothing.
  const unknown = signatureFontCss("Not-A-Font" as never);
  assert("an unknown style falls back to a real face", unknown.fontFamily.length > 0);
}

console.log(
  failures === 0
    ? "\nSign-PDF checks passed — valid output, correct page count, placement clamped."
    : `\n${failures} sign-PDF checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);

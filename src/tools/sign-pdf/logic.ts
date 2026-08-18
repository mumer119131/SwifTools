import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Stamps a signature onto a PDF page.
 *
 * What this is: a picture of a signature, placed where you put it. It is what
 * almost everyone means by "sign a PDF", and it is what the overwhelming
 * majority of contracts sent by email are signed with.
 *
 * What it is not: a qualified or advanced electronic signature. There is no
 * certificate, no cryptographic binding to your identity, and no audit trail —
 * so it proves nothing about who applied it, and nothing about whether the
 * document was altered afterwards. The tool page says so plainly rather than
 * implying legal weight it does not have.
 */

/** Where a signature sits, in fractions of the page. */
export interface Placement {
  /** 0–1 from the left edge. */
  x: number;
  /** 0–1 from the top edge, matching how the preview is clicked. */
  y: number;
  /** Width as a fraction of the page width. */
  width: number;
  pageNumber: number;
}

export interface DatedStamp {
  /** Printed under the signature, e.g. "Signed 18 August 2026". */
  text: string;
  /** Points. Kept small — this is a caption, not a signature. */
  size: number;
}

/** Fonts offered for a typed signature. Names as pdf-lib knows them. */
export const SIGNATURE_FONTS = [
  { id: StandardFonts.TimesRomanItalic, label: "Times Italic" },
  { id: StandardFonts.HelveticaOblique, label: "Helvetica Oblique" },
  { id: StandardFonts.TimesRoman, label: "Times" },
  { id: StandardFonts.Courier, label: "Courier" },
] as const;

export type SignatureFont = (typeof SIGNATURE_FONTS)[number]["id"];

export interface PageSize {
  width: number;
  height: number;
}

/** Page sizes in PDF points, for mapping a click on the preview back to the page. */
export async function readPageSizes(bytes: ArrayBuffer): Promise<PageSize[]> {
  const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return document.getPages().map((page) => {
    const { width, height } = page.getSize();
    return { width, height };
  });
}

interface SignOptions {
  /** The original file. */
  pdf: ArrayBuffer;
  /** A PNG of the signature — drawn, typed or uploaded. */
  signature?: Uint8Array;
  /** Typed text, used when no image is supplied. */
  typed?: { text: string; font: SignatureFont };
  placement: Placement;
  stamp?: DatedStamp;
}

export async function signPdf({
  pdf,
  signature,
  typed,
  placement,
  stamp,
}: SignOptions): Promise<Uint8Array> {
  const document = await PDFDocument.load(pdf, { ignoreEncryption: true });
  const pages = document.getPages();

  const index = placement.pageNumber - 1;
  if (index < 0 || index >= pages.length) {
    throw new Error(`This PDF has ${pages.length} pages, so page ${placement.pageNumber} does not exist.`);
  }

  const page = pages[index];
  const { width: pageWidth, height: pageHeight } = page.getSize();

  const drawWidth = pageWidth * placement.width;

  // The preview is measured from the top; PDF coordinates run from the bottom.
  const left = pageWidth * placement.x;
  const topFromBottom = pageHeight * (1 - placement.y);

  let drawnHeight: number;

  if (signature && signature.length > 0) {
    const image = await document.embedPng(signature);
    // Preserve the signature's aspect ratio; only the width is chosen.
    drawnHeight = drawWidth * (image.height / image.width);
    page.drawImage(image, {
      x: left,
      y: topFromBottom - drawnHeight,
      width: drawWidth,
      height: drawnHeight,
    });
  } else if (typed && typed.text.trim() !== "") {
    const font = await document.embedFont(typed.font);
    // Choose the size that makes the text fill the requested width, so the
    // width control behaves the same for typed and drawn signatures.
    const atOnePoint = font.widthOfTextAtSize(typed.text, 1);
    const size = atOnePoint > 0 ? drawWidth / atOnePoint : 24;
    drawnHeight = font.heightAtSize(size);
    page.drawText(typed.text, {
      x: left,
      y: topFromBottom - drawnHeight,
      size,
      font,
      color: rgb(0.05, 0.05, 0.2),
    });
  } else {
    throw new Error("Add a signature before signing.");
  }

  if (stamp && stamp.text.trim() !== "") {
    const font = await document.embedFont(StandardFonts.Helvetica);
    page.drawText(stamp.text, {
      x: left,
      y: topFromBottom - drawnHeight - stamp.size - 4,
      size: stamp.size,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  }

  return document.save();
}

/**
 * Trims the transparent margin from a drawn signature.
 *
 * Without this, the drawing canvas's empty space is baked into the image, so a
 * signature scribbled in one corner lands nowhere near where it was placed and
 * appears far smaller than the width control suggests.
 */
export function trimTransparent(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const { width, height } = canvas;
  const { data } = context.getImageData(0, 0, width, height);

  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Alpha only: the stroke colour is irrelevant to where the ink is.
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < 0) return null; // Nothing drawn.

  const padding = 6;
  const cropX = Math.max(0, left - padding);
  const cropY = Math.max(0, top - padding);
  const cropWidth = Math.min(width, right + padding) - cropX;
  const cropHeight = Math.min(height, bottom + padding) - cropY;

  const trimmed = document.createElement("canvas");
  trimmed.width = cropWidth;
  trimmed.height = cropHeight;

  const out = trimmed.getContext("2d");
  if (!out) return null;
  out.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return trimmed;
}

/**
 * Clamps a placement so the signature cannot be dropped off the page.
 *
 * Width is clamped first, and the clamped value is what bounds x. Doing it the
 * other way round means an over-wide width produces a negative right-hand
 * bound — `1 - 2` is `-1` — and pushes the signature off the left edge while
 * appearing to constrain it.
 */
export function clampPlacement(placement: Placement): Placement {
  const width = Math.min(Math.max(placement.width, 0.05), 0.8);

  return {
    ...placement,
    width,
    x: Math.min(Math.max(placement.x, 0), 1 - width),
    y: Math.min(Math.max(placement.y, 0.02), 1),
  };
}

/** The default caption, in the format people expect on a signed document. */
export function defaultStampText(date = new Date()): string {
  return `Signed ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

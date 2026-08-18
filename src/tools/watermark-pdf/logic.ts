import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

/**
 * Stamps text across every page of a PDF.
 *
 * Text drawn into the page's content stream rather than an image laid over it,
 * so the result stays a normal PDF — selectable text, unchanged file structure,
 * no rasterising. That also means the watermark is removable by anyone with a
 * PDF editor, which the tool page says plainly: this marks a document as a
 * draft or a copy, it does not protect it.
 */

export type Placement = "diagonal" | "horizontal" | "footer";

export interface WatermarkOptions {
  text: string;
  placement: Placement;
  /** 0–1. Around 0.15 is legible without obscuring the page. */
  opacity: number;
  /** Points. Ignored for `diagonal`, which is sized to fit the page. */
  fontSize: number;
  color: { r: number; g: number; b: number };
  /** Repeat across the page in a grid rather than stamping once. */
  tile: boolean;
  /** 1-based page numbers, or null for every page. */
  pages: number[] | null;
}

export const PRESETS = ["DRAFT", "CONFIDENTIAL", "COPY", "SAMPLE", "DO NOT COPY", "INTERNAL"];

/** Parses "1,3,5-8" into page numbers, ignoring anything out of range. */
export function parsePages(input: string, pageCount: number): number[] | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;

  const wanted = new Set<number>();

  for (const part of trimmed.split(",")) {
    const piece = part.trim();
    if (piece === "") continue;

    const range = piece.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      for (let page = Math.min(from, to); page <= Math.max(from, to); page += 1) {
        if (page >= 1 && page <= pageCount) wanted.add(page);
      }
      continue;
    }

    if (/^\d+$/.test(piece)) {
      const page = Number(piece);
      if (page >= 1 && page <= pageCount) wanted.add(page);
    }
  }

  return wanted.size === 0 ? null : [...wanted].sort((a, b) => a - b);
}

export async function watermarkPdf(
  bytes: ArrayBuffer,
  options: WatermarkOptions,
): Promise<Uint8Array> {
  if (options.text.trim() === "") throw new Error("Enter some watermark text.");

  const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await document.embedFont(StandardFonts.HelveticaBold);
  const pages = document.getPages();

  const colour = rgb(options.color.r, options.color.g, options.color.b);
  const wanted = options.pages;

  pages.forEach((page, index) => {
    if (wanted && !wanted.includes(index + 1)) return;

    const { width, height } = page.getSize();

    if (options.placement === "footer") {
      const size = options.fontSize;
      const textWidth = font.widthOfTextAtSize(options.text, size);
      page.drawText(options.text, {
        x: (width - textWidth) / 2,
        y: 24,
        size,
        font,
        color: colour,
        opacity: options.opacity,
      });
      return;
    }

    const angle = options.placement === "diagonal" ? 45 : 0;

    // A diagonal stamp is sized to span the page rather than taking a fixed
    // point size, so it looks the same on A4 and on a wide slide.
    const size =
      options.placement === "diagonal"
        ? Math.min(
            (Math.sqrt(width * width + height * height) * 0.8) /
              Math.max(1, font.widthOfTextAtSize(options.text, 1)),
            height * 0.5,
          )
        : options.fontSize;

    const textWidth = font.widthOfTextAtSize(options.text, size);

    if (!options.tile) {
      // Rotating about the text's own start point means the centre has to be
      // offset by half the text along the rotated axis, not along x.
      const radians = (angle * Math.PI) / 180;
      page.drawText(options.text, {
        x: width / 2 - (textWidth / 2) * Math.cos(radians),
        y: height / 2 - (textWidth / 2) * Math.sin(radians),
        size,
        font,
        color: colour,
        opacity: options.opacity,
        rotate: degrees(angle),
      });
      return;
    }

    const tileSize = options.fontSize;
    const tileWidth = font.widthOfTextAtSize(options.text, tileSize);
    const stepX = tileWidth + tileSize * 2;
    const stepY = tileSize * 4;

    for (let y = -stepY; y < height + stepY; y += stepY) {
      for (let x = -stepX; x < width + stepX; x += stepX) {
        page.drawText(options.text, {
          x,
          y,
          size: tileSize,
          font,
          color: colour,
          opacity: options.opacity,
          rotate: degrees(angle),
        });
      }
    }
  });

  return document.save();
}

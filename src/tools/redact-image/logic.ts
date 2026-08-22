/**
 * Obscuring parts of an image.
 *
 * The important thing about a redaction tool is that it has to actually
 * destroy the pixels. Drawing a black rectangle over something in a document
 * editor famously does not — the content sits underneath, recoverable by
 * anyone who copies it — and the same mistake is easy to make with images by
 * compositing an overlay and calling it done.
 *
 * Everything here reads the pixels, replaces them, and writes them back. The
 * original values are gone from the output, not hidden behind something.
 */

export type Mode = "pixelate" | "blur" | "block";

export const MODE_LABELS: Record<Mode, string> = {
  pixelate: "Pixelate",
  blur: "Blur",
  block: "Solid block",
};

/** A region in fractions of the image, so it survives resizing the preview. */
export interface Region {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function clampRegion(region: Region): Region {
  const width = Math.min(Math.max(region.width, 0.005), 1);
  const height = Math.min(Math.max(region.height, 0.005), 1);
  return {
    ...region,
    width,
    height,
    x: Math.min(Math.max(region.x, 0), 1 - width),
    y: Math.min(Math.max(region.y, 0), 1 - height),
  };
}

/** Builds a region from two corners, in either drag direction. */
export function regionFromDrag(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  id: string,
): Region {
  return clampRegion({
    id,
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
  });
}

/** Region in image pixels, clamped to the bitmap. */
export function toPixels(
  region: Region,
  imageWidth: number,
  imageHeight: number,
): { x: number; y: number; width: number; height: number } {
  const x = Math.round(region.x * imageWidth);
  const y = Math.round(region.y * imageHeight);
  return {
    x,
    y,
    width: Math.min(Math.round(region.width * imageWidth), imageWidth - x),
    height: Math.min(Math.round(region.height * imageHeight), imageHeight - y),
  };
}

/**
 * Replaces each block with its average colour.
 *
 * Genuinely destructive: the individual pixel values within a block are gone,
 * and no amount of processing recovers them. The block size matters — a
 * pixelation coarse enough to be safe is much coarser than people expect, and
 * fine pixelation of text has been reversed before by rendering candidate
 * strings and comparing.
 */
export function pixelate(
  data: Uint8ClampedArray,
  imageWidth: number,
  area: { x: number; y: number; width: number; height: number },
  blockSize: number,
): void {
  const size = Math.max(2, Math.round(blockSize));

  for (let y = area.y; y < area.y + area.height; y += size) {
    for (let x = area.x; x < area.x + area.width; x += size) {
      const blockWidth = Math.min(size, area.x + area.width - x);
      const blockHeight = Math.min(size, area.y + area.height - y);

      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let dy = 0; dy < blockHeight; dy += 1) {
        for (let dx = 0; dx < blockWidth; dx += 1) {
          const at = ((y + dy) * imageWidth + (x + dx)) * 4;
          r += data[at];
          g += data[at + 1];
          b += data[at + 2];
          count += 1;
        }
      }

      if (count === 0) continue;
      const [ar, ag, ab] = [r / count, g / count, b / count];

      for (let dy = 0; dy < blockHeight; dy += 1) {
        for (let dx = 0; dx < blockWidth; dx += 1) {
          const at = ((y + dy) * imageWidth + (x + dx)) * 4;
          data[at] = ar;
          data[at + 1] = ag;
          data[at + 2] = ab;
        }
      }
    }
  }
}

/**
 * A box blur, applied repeatedly to approximate a Gaussian.
 *
 * Three passes of a box blur is the standard approximation and is far cheaper
 * than a true Gaussian. Note the honest caveat that belongs on the page: blur
 * is the weakest of the three options, because a mild blur is in principle
 * invertible and has been reversed on real images.
 */
export function blur(
  data: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  area: { x: number; y: number; width: number; height: number },
  radius: number,
  passes = 3,
): void {
  const r = Math.max(1, Math.round(radius));

  for (let pass = 0; pass < passes; pass += 1) {
    const copy = new Uint8ClampedArray(data);

    for (let y = area.y; y < area.y + area.height; y += 1) {
      for (let x = area.x; x < area.x + area.width; x += 1) {
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let count = 0;

        for (let dy = -r; dy <= r; dy += 1) {
          for (let dx = -r; dx <= r; dx += 1) {
            // Sample within the whole image rather than the region, so the
            // edges of a redaction blend instead of showing a hard seam.
            const sx = Math.min(Math.max(x + dx, 0), imageWidth - 1);
            const sy = Math.min(Math.max(y + dy, 0), imageHeight - 1);
            const at = (sy * imageWidth + sx) * 4;
            sr += copy[at];
            sg += copy[at + 1];
            sb += copy[at + 2];
            count += 1;
          }
        }

        const at = (y * imageWidth + x) * 4;
        data[at] = sr / count;
        data[at + 1] = sg / count;
        data[at + 2] = sb / count;
      }
    }
  }
}

/** Fills the region with a flat colour. The only genuinely irreversible option. */
export function block(
  data: Uint8ClampedArray,
  imageWidth: number,
  area: { x: number; y: number; width: number; height: number },
  colour: { r: number; g: number; b: number },
): void {
  for (let y = area.y; y < area.y + area.height; y += 1) {
    for (let x = area.x; x < area.x + area.width; x += 1) {
      const at = (y * imageWidth + x) * 4;
      data[at] = colour.r;
      data[at + 1] = colour.g;
      data[at + 2] = colour.b;
      data[at + 3] = 255;
    }
  }
}

/** How safe each option actually is, stated rather than implied. */
export const STRENGTH: Record<Mode, { label: string; note: string; safe: boolean }> = {
  block: {
    label: "Irreversible",
    note: "The pixels are replaced with a flat colour. Nothing survives to recover.",
    safe: true,
  },
  pixelate: {
    label: "Strong if coarse",
    note: "Each block becomes its average colour, which destroys the detail inside it. Fine pixelation of text has been reversed by rendering candidates and comparing — use large blocks.",
    safe: true,
  },
  blur: {
    label: "Weakest",
    note: "A mild blur is in principle invertible and has been reversed on real images. Use it for aesthetics, not for anything that matters.",
    safe: false,
  },
};

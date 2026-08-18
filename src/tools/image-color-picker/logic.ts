/**
 * Sampling colours out of an image.
 *
 * Two jobs: read the colour under a click, and summarise the image's palette.
 * The second is where the care goes — a naive "most common colour" returns
 * near-black or near-white for almost every photograph, because shadows and
 * highlights dominate the count and tell you nothing.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

export function toRgbString({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

export function toHslString(rgb: Rgb): string {
  const { h, s, l } = toHsl(rgb);
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

export function toHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l: l * 100 };

  const s = delta / (1 - Math.abs(2 * l - 1));

  let h: number;
  if (max === rn) h = ((gn - bn) / delta) % 6;
  else if (max === gn) h = (bn - rn) / delta + 2;
  else h = (rn - gn) / delta + 4;

  h *= 60;
  if (h < 0) h += 360;

  return { h, s: s * 100, l: l * 100 };
}

/** Relative luminance, for deciding whether to draw a label in black or white. */
export function luminance({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const v = channel / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function readableOn(rgb: Rgb): "#000000" | "#ffffff" {
  return luminance(rgb) > 0.45 ? "#000000" : "#ffffff";
}

/**
 * Averages a small square rather than reading a single pixel.
 *
 * A photograph is noisy at pixel level, and JPEG compression adds more. Reading
 * one pixel from a wall that is plainly beige can return something visibly off,
 * which makes the tool look broken. A 5×5 average is what an eyedropper in a
 * design application does for the same reason.
 */
export function sampleAt(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  radius = 2,
): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const px = Math.min(width - 1, Math.max(0, x + dx));
      const py = Math.min(height - 1, Math.max(0, y + dy));
      const at = (py * width + px) * 4;

      // Skip transparent pixels rather than averaging in whatever RGB values
      // happen to sit behind an alpha of zero, which are often black.
      if (data[at + 3] < 16) continue;

      r += data[at];
      g += data[at + 1];
      b += data[at + 2];
      count += 1;
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };
  return { r: r / count, g: g / count, b: b / count };
}

export interface Swatch {
  color: Rgb;
  /** Share of sampled pixels, 0–1. */
  share: number;
}

/**
 * Extracts a palette by quantising into colour buckets.
 *
 * Colours are grouped into a coarse 3D grid so near-identical shades count
 * together, and near-black, near-white and near-grey buckets are set aside
 * before ranking. Without that last step almost every photograph returns
 * "black, dark grey, white" — technically the commonest colours and useless as
 * a palette.
 */
export function extractPalette(
  data: Uint8ClampedArray,
  count = 6,
  step = 24,
): Swatch[] {
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  let sampled = 0;

  // Every 4th pixel: plenty for a palette, and four times faster on a photo.
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 16) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const { s, l } = toHsl({ r, g, b });
    // Set aside the near-black, near-white and washed-out pixels that would
    // otherwise dominate every result.
    if (l < 8 || l > 94) continue;
    if (s < 8 && (l < 20 || l > 85)) continue;

    const key = `${Math.floor(r / step)}-${Math.floor(g / step)}-${Math.floor(b / step)}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.n += 1;
    buckets.set(key, bucket);
    sampled += 1;
  }

  if (sampled === 0) return [];

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((bucket) => ({
      // The bucket's average, not its centre — closer to a colour actually
      // present in the image.
      color: { r: bucket.r / bucket.n, g: bucket.g / bucket.n, b: bucket.b / bucket.n },
      share: bucket.n / sampled,
    }));
}

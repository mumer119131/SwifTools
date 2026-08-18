/**
 * Aspect ratio arithmetic.
 *
 * Three related questions: what ratio is this size, what is the missing
 * dimension at a given ratio, and how does one rectangle fit inside another.
 * The last is the one people get wrong, because "fit" and "fill" are different
 * operations and the wrong one either bars the image or crops it.
 */

export interface Ratio {
  w: number;
  h: number;
}

/** Common ratios, with what they are actually for. */
export const PRESETS: { label: string; ratio: Ratio; note: string }[] = [
  { label: "16:9", ratio: { w: 16, h: 9 }, note: "Widescreen video, most displays" },
  { label: "9:16", ratio: { w: 9, h: 16 }, note: "Stories, Reels, TikTok" },
  { label: "4:3", ratio: { w: 4, h: 3 }, note: "Older displays, many cameras" },
  { label: "1:1", ratio: { w: 1, h: 1 }, note: "Square posts, avatars" },
  { label: "3:2", ratio: { w: 3, h: 2 }, note: "35mm film, most DSLRs" },
  { label: "4:5", ratio: { w: 4, h: 5 }, note: "Instagram portrait" },
  { label: "21:9", ratio: { w: 21, h: 9 }, note: "Ultrawide, cinematic" },
  { label: "2.39:1", ratio: { w: 239, h: 100 }, note: "Anamorphic widescreen" },
];

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

/**
 * Reduces a size to its simplest ratio.
 *
 * 1920×1080 becomes 16:9. Sizes that do not reduce tidily — 1000×667, which is
 * very nearly 3:2 — would give 1000:667, which is true and useless, so a
 * near-match to a common ratio is reported alongside.
 */
export function simplify(width: number, height: number): Ratio | null {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  if (width <= 0 || height <= 0) return null;

  const divisor = gcd(width, height);
  return { w: Math.round(width) / divisor, h: Math.round(height) / divisor };
}

export function formatRatio(ratio: Ratio): string {
  return `${ratio.w}:${ratio.h}`;
}

/** The decimal form, which is how cinema ratios are usually quoted. */
export function decimalRatio(width: number, height: number): number {
  return height === 0 ? 0 : width / height;
}

/**
 * The closest common ratio, when the exact one is unwieldy.
 *
 * Returns null when the reduction is already tidy, so the UI does not suggest
 * "close to 16:9" for something that is exactly 16:9.
 */
export function nearestPreset(
  width: number,
  height: number,
  tolerance = 0.02,
): { label: string; ratio: Ratio; exact: boolean } | null {
  const target = decimalRatio(width, height);
  if (target === 0) return null;

  let best: { label: string; ratio: Ratio; diff: number } | null = null;

  for (const preset of PRESETS) {
    const diff = Math.abs(preset.ratio.w / preset.ratio.h - target);
    if (!best || diff < best.diff) best = { label: preset.label, ratio: preset.ratio, diff };
  }

  if (!best) return null;

  const relative = best.diff / target;
  if (relative > tolerance) return null;

  return { label: best.label, ratio: best.ratio, exact: best.diff < 0.0001 };
}

/** The missing dimension, given the other and a ratio. */
export function completeWidth(height: number, ratio: Ratio): number {
  return (height * ratio.w) / ratio.h;
}

export function completeHeight(width: number, ratio: Ratio): number {
  return (width * ratio.h) / ratio.w;
}

export interface FitResult {
  width: number;
  height: number;
  /** Empty space either side, for `contain`. Zero for `cover`. */
  letterbox: { x: number; y: number };
  /** How much of the source is cut away, 0–1. Zero for `contain`. */
  cropped: number;
}

/**
 * Fits a source rectangle into a target box.
 *
 * `contain` shows everything and may leave bars. `cover` fills the box and may
 * crop. Confusing the two is the commonest video and thumbnail mistake, so both
 * are reported together with what each costs.
 */
export function fitInside(
  sourceWidth: number,
  sourceHeight: number,
  boxWidth: number,
  boxHeight: number,
  mode: "contain" | "cover",
): FitResult | null {
  if (sourceWidth <= 0 || sourceHeight <= 0 || boxWidth <= 0 || boxHeight <= 0) return null;

  const sourceRatio = sourceWidth / sourceHeight;
  const boxRatio = boxWidth / boxHeight;

  const scaleToWidth = mode === "contain" ? sourceRatio > boxRatio : sourceRatio < boxRatio;

  const width = scaleToWidth ? boxWidth : boxHeight * sourceRatio;
  const height = scaleToWidth ? boxWidth / sourceRatio : boxHeight;

  if (mode === "contain") {
    return {
      width,
      height,
      letterbox: { x: (boxWidth - width) / 2, y: (boxHeight - height) / 2 },
      cropped: 0,
    };
  }

  // With cover the drawn image is at least as large as the box, so the excess
  // is what gets cut.
  const visible = (boxWidth * boxHeight) / (width * height);
  return {
    width,
    height,
    letterbox: { x: 0, y: 0 },
    cropped: Math.max(0, 1 - visible),
  };
}

/** Scales a size by a factor, rounded to whole pixels. */
export function scale(width: number, height: number, factor: number): { width: number; height: number } {
  return { width: Math.round(width * factor), height: Math.round(height * factor) };
}

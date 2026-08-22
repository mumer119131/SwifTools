/**
 * Pixels, physical size and DPI.
 *
 * One relationship, three ways round: pixels = inches × DPI. The confusion is
 * almost always about what DPI actually is — it is not a property an image
 * carries in any meaningful sense, it is the ratio you choose when you decide
 * how large to print it. A "300 DPI image" is only 300 DPI at one particular
 * printed size.
 */

export type Unit = "mm" | "cm" | "in";

export const UNIT_LABELS: Record<Unit, string> = { mm: "mm", cm: "cm", in: "inches" };

const MM_PER_INCH = 25.4;

export function toInches(value: number, unit: Unit): number {
  if (unit === "in") return value;
  return unit === "cm" ? value / 2.54 : value / MM_PER_INCH;
}

export function fromInches(inches: number, unit: Unit): number {
  if (unit === "in") return inches;
  return unit === "cm" ? inches * 2.54 : inches * MM_PER_INCH;
}

/** What each DPI is actually for. */
export const DPI_PRESETS = [
  { value: 72, label: "72", note: "Screen convention. Never appropriate for print." },
  { value: 150, label: "150", note: "Draft printing, large posters viewed from a distance." },
  { value: 300, label: "300", note: "The standard for anything held in the hand." },
  { value: 600, label: "600", note: "Fine art and line work. Rarely needed for photographs." },
];

export interface PrintSize {
  widthInches: number;
  heightInches: number;
  /** In the unit the caller asked for. */
  width: number;
  height: number;
  unit: Unit;
}

/** How large a pixel image prints at a given DPI. */
export function printSize(
  pixelWidth: number,
  pixelHeight: number,
  dpi: number,
  unit: Unit,
): PrintSize | null {
  if (!(pixelWidth > 0 && pixelHeight > 0 && dpi > 0)) return null;

  const widthInches = pixelWidth / dpi;
  const heightInches = pixelHeight / dpi;

  return {
    widthInches,
    heightInches,
    width: fromInches(widthInches, unit),
    height: fromInches(heightInches, unit),
    unit,
  };
}

/** How many pixels a given physical size needs at a DPI. */
export function pixelsNeeded(
  width: number,
  height: number,
  unit: Unit,
  dpi: number,
): { width: number; height: number; megapixels: number } | null {
  if (!(width > 0 && height > 0 && dpi > 0)) return null;

  const pixelWidth = Math.round(toInches(width, unit) * dpi);
  const pixelHeight = Math.round(toInches(height, unit) * dpi);

  return {
    width: pixelWidth,
    height: pixelHeight,
    megapixels: Math.round(((pixelWidth * pixelHeight) / 1_000_000) * 10) / 10,
  };
}

/** The DPI an image would print at, given a target size. */
export function effectiveDpi(
  pixelWidth: number,
  pixelHeight: number,
  width: number,
  height: number,
  unit: Unit,
): { horizontal: number; vertical: number; lowest: number } | null {
  if (!(pixelWidth > 0 && pixelHeight > 0 && width > 0 && height > 0)) return null;

  const horizontal = pixelWidth / toInches(width, unit);
  const vertical = pixelHeight / toInches(height, unit);

  return {
    horizontal: Math.round(horizontal),
    vertical: Math.round(vertical),
    // The worse of the two is what limits quality.
    lowest: Math.round(Math.min(horizontal, vertical)),
  };
}

export interface Verdict {
  tone: "good" | "acceptable" | "poor";
  label: string;
  detail: string;
}

/**
 * Whether a resolution is enough for the intended print.
 *
 * The thresholds are conventions rather than physics — 300 DPI is where the eye
 * stops resolving individual dots at normal reading distance, and viewing
 * distance is what actually decides it. A billboard is fine at 15.
 */
export function assess(dpi: number): Verdict {
  if (dpi >= 300) {
    return { tone: "good", label: "Print quality", detail: "Sharp at reading distance. This is the standard for anything held in the hand." };
  }
  if (dpi >= 200) {
    return { tone: "acceptable", label: "Acceptable", detail: "Fine for most purposes and slightly soft on close inspection. Perfectly good for a poster." };
  }
  if (dpi >= 150) {
    return { tone: "acceptable", label: "Draft", detail: "Visibly soft close up. Reasonable for something viewed from a metre or more." };
  }
  return {
    tone: "poor",
    label: "Too low",
    detail: "Noticeably pixelated in print. Either print it smaller or start from a larger original — enlarging cannot add detail that was never captured.",
  };
}

/** Standard paper, for the common case of printing to a known size. */
export const PAPER_SIZES = [
  { label: "A6", width: 105, height: 148 },
  { label: "A5", width: 148, height: 210 },
  { label: "A4", width: 210, height: 297 },
  { label: "A3", width: 297, height: 420 },
  { label: "A2", width: 420, height: 594 },
  { label: "6×4 photo", width: 152, height: 102 },
  { label: "7×5 photo", width: 178, height: 127 },
  { label: "10×8 photo", width: 254, height: 203 },
];

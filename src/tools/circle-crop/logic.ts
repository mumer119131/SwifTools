/**
 * Cropping an image to a circle or a rounded square.
 *
 * Small enough that the interesting decisions are all about output rather than
 * geometry: whether the corners end up transparent or filled, and what happens
 * when the source is not square.
 */

export type Shape = "circle" | "rounded" | "square";

export const SHAPE_LABELS: Record<Shape, string> = {
  circle: "Circle",
  rounded: "Rounded square",
  square: "Square",
};

export const SIZE_PRESETS = [
  { label: "128", value: 128 },
  { label: "256", value: 256 },
  { label: "400", value: 400, note: "Common avatar size" },
  { label: "512", value: 512 },
  { label: "1024", value: 1024 },
];

/**
 * The square region of a source image to take.
 *
 * A circular crop of a non-square photo has to start from a square, and the
 * offset is what decides whether it lands on the subject. Centring is right far
 * more often than not for portraits, but a face is usually above centre — so
 * the vertical position is adjustable and defaults slightly high.
 */
export function squareRegion(
  sourceWidth: number,
  sourceHeight: number,
  offsetX = 0.5,
  offsetY = 0.4,
): { x: number; y: number; size: number } {
  const size = Math.min(sourceWidth, sourceHeight);
  const spareX = sourceWidth - size;
  const spareY = sourceHeight - size;

  return {
    x: spareX * Math.min(Math.max(offsetX, 0), 1),
    y: spareY * Math.min(Math.max(offsetY, 0), 1),
    size,
  };
}

/**
 * Whether the chosen format can hold the transparent corners a circle needs.
 *
 * JPEG cannot, and flattens them — silently, and usually onto black rather than
 * the white people expect. So the format choice is constrained rather than
 * left to produce a surprise.
 */
export function supportsTransparency(mime: string): boolean {
  return mime === "image/png" || mime === "image/webp";
}

export function needsBackground(shape: Shape, mime: string): boolean {
  return shape !== "square" && !supportsTransparency(mime);
}

/** Corner radius in pixels for the rounded shape, as a share of the size. */
export function cornerRadius(size: number, shape: Shape): number {
  if (shape === "circle") return size / 2;
  if (shape === "rounded") return size * 0.22;
  return 0;
}

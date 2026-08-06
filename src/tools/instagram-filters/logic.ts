export interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  hueRotate: number;
  blur: number;
  grayscale: number;
}

export const neutral: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
};

export interface Filter {
  id: string;
  label: string;
  adjustments: Adjustments;
  /** Optional colour wash composited over the image. */
  overlay?: { color: string; alpha: number; mode: GlobalCompositeOperation };
}

/**
 * Recreations of the well-known filter looks, built from canvas filter
 * primitives plus an optional colour wash.
 *
 * These are approximations by eye, not the original LUTs — those are
 * proprietary. Named after the look rather than borrowing the trademarks.
 */
export const filters: readonly Filter[] = [
  { id: "none", label: "Original", adjustments: neutral },
  {
    id: "warm",
    label: "Warm",
    adjustments: { ...neutral, brightness: 105, contrast: 105, saturate: 130, sepia: 12 },
    overlay: { color: "#ff9a3c", alpha: 0.1, mode: "overlay" },
  },
  {
    id: "cool",
    label: "Cool",
    adjustments: { ...neutral, brightness: 102, contrast: 108, saturate: 95, hueRotate: -8 },
    overlay: { color: "#3c8bff", alpha: 0.1, mode: "overlay" },
  },
  {
    id: "faded",
    label: "Faded",
    adjustments: { ...neutral, brightness: 108, contrast: 88, saturate: 78, sepia: 10 },
    overlay: { color: "#e8dcc8", alpha: 0.16, mode: "screen" },
  },
  {
    id: "vintage",
    label: "Vintage",
    adjustments: { ...neutral, brightness: 98, contrast: 112, saturate: 85, sepia: 32 },
    overlay: { color: "#8b5a2b", alpha: 0.14, mode: "multiply" },
  },
  {
    id: "mono",
    label: "Mono",
    adjustments: { ...neutral, grayscale: 100, contrast: 118, brightness: 102 },
  },
  {
    id: "punch",
    label: "Punch",
    adjustments: { ...neutral, contrast: 128, saturate: 148, brightness: 101 },
  },
  {
    id: "moody",
    label: "Moody",
    adjustments: { ...neutral, brightness: 92, contrast: 122, saturate: 88 },
    overlay: { color: "#101827", alpha: 0.18, mode: "multiply" },
  },
];

export function toCssFilter(adjustments: Adjustments): string {
  return [
    `brightness(${adjustments.brightness}%)`,
    `contrast(${adjustments.contrast}%)`,
    `saturate(${adjustments.saturate}%)`,
    `sepia(${adjustments.sepia}%)`,
    `grayscale(${adjustments.grayscale}%)`,
    `hue-rotate(${adjustments.hueRotate}deg)`,
    adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Renders at whatever size the canvas is set to, so the same function drives
 * both the on-screen preview and the full-resolution export.
 */
export function applyFilter(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource,
  width: number,
  height: number,
  filter: Filter,
  adjustments: Adjustments,
): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);
  context.filter = toCssFilter(adjustments);
  context.drawImage(image, 0, 0, width, height);
  context.filter = "none";

  if (filter.overlay) {
    context.save();
    context.globalCompositeOperation = filter.overlay.mode;
    context.globalAlpha = filter.overlay.alpha;
    context.fillStyle = filter.overlay.color;
    context.fillRect(0, 0, width, height);
    context.restore();
  }
}

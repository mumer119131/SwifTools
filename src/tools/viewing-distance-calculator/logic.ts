/**
 * Screen size, resolution and how far away to sit.
 *
 * Two figures are worth knowing and they answer different questions. The
 * viewing angle recommendations — SMPTE's 30 degrees and THX's 40 — are about
 * immersion: how much of your field of view the picture fills. The pixel-pitch
 * limit is about detail: the distance beyond which you stop being able to
 * resolve individual pixels, so a higher resolution stops earning its keep.
 *
 * People conflate them and conclude 4K is pointless, which is only true if you
 * sit where a 1080p set would have been fine anyway.
 */

export type Resolution = "1080p" | "1440p" | "4k" | "8k";

export const RESOLUTIONS: Record<Resolution, { label: string; width: number; height: number }> = {
  "1080p": { label: "1080p (Full HD)", width: 1920, height: 1080 },
  "1440p": { label: "1440p (QHD)", width: 2560, height: 1440 },
  "4k": { label: "4K (UHD)", width: 3840, height: 2160 },
  "8k": { label: "8K", width: 7680, height: 4320 },
};

export interface ScreenDimensions {
  diagonalInches: number;
  widthInches: number;
  heightInches: number;
  widthCm: number;
  heightCm: number;
  areaSqIn: number;
}

/**
 * Width and height from a diagonal.
 *
 * Screens are sold by diagonal, which is why a 55-inch 16:9 set is only about
 * 48 inches wide — and why comparing a 16:9 television with a 21:9 monitor by
 * diagonal alone is misleading.
 */
export function dimensions(diagonal: number, ratioWidth = 16, ratioHeight = 9): ScreenDimensions | null {
  if (!(diagonal > 0) || !(ratioWidth > 0) || !(ratioHeight > 0)) return null;

  const ratio = ratioWidth / ratioHeight;
  // diagonal² = w² + h², with h = w / ratio
  const width = diagonal / Math.sqrt(1 + 1 / (ratio * ratio));
  const height = width / ratio;

  return {
    diagonalInches: diagonal,
    widthInches: width,
    heightInches: height,
    widthCm: width * 2.54,
    heightCm: height * 2.54,
    areaSqIn: width * height,
  };
}

export interface DistanceAdvice {
  /** Feet, at the given viewing angle. */
  smpteFeet: number;
  thxFeet: number;
  /** Where individual pixels stop being resolvable, in feet. */
  pixelLimitFeet: number;
  smpteMetres: number;
  thxMetres: number;
  pixelLimitMetres: number;
}

/**
 * Recommended distances.
 *
 * Angle-based figures come from the screen width and simple trigonometry. The
 * pixel limit uses the common approximation that a person with 20/20 vision
 * resolves about one arcminute, which works out at roughly 3438 times the pixel
 * pitch.
 */
export function distances(screen: ScreenDimensions, resolution: Resolution): DistanceAdvice {
  const widthInches = screen.widthInches;

  const forAngle = (degrees: number) =>
    widthInches / 2 / Math.tan((degrees / 2) * (Math.PI / 180)) / 12;

  const pixelPitch = widthInches / RESOLUTIONS[resolution].width;
  const pixelLimitInches = pixelPitch * 3438;

  const smpteFeet = forAngle(30);
  const thxFeet = forAngle(40);
  const pixelLimitFeet = pixelLimitInches / 12;

  return {
    smpteFeet,
    thxFeet,
    pixelLimitFeet,
    smpteMetres: smpteFeet * 0.3048,
    thxMetres: thxFeet * 0.3048,
    pixelLimitMetres: pixelLimitFeet * 0.3048,
  };
}

/** The diagonal that fills a given angle from a given distance. */
export function sizeForDistance(
  distanceFeet: number,
  degrees: number,
  ratioWidth = 16,
  ratioHeight = 9,
): number | null {
  if (!(distanceFeet > 0)) return null;

  const widthInches = 2 * distanceFeet * 12 * Math.tan((degrees / 2) * (Math.PI / 180));
  const ratio = ratioWidth / ratioHeight;
  // Invert the diagonal relationship.
  return widthInches * Math.sqrt(1 + 1 / (ratio * ratio));
}

/**
 * Whether the resolution earns its keep at this distance.
 *
 * The honest answer people rarely get: if you sit beyond the pixel limit, a
 * higher resolution genuinely makes no visible difference to sharpness.
 */
export function resolutionVerdict(
  distanceFeet: number,
  advice: DistanceAdvice,
): { worthwhile: boolean; detail: string } {
  if (distanceFeet <= advice.pixelLimitFeet) {
    return {
      worthwhile: true,
      detail: "Close enough to resolve individual pixels, so the resolution is doing visible work.",
    };
  }
  return {
    worthwhile: false,
    detail: "Beyond the distance at which individual pixels are resolvable, so a higher resolution adds nothing you can see. Screen size and picture quality matter more from here.",
  };
}

export const COMMON_SIZES = [32, 43, 50, 55, 65, 75, 85, 98];

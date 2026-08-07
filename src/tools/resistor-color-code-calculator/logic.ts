import { BAND_COLORS, colorByName, nearestE24, type BandColor } from "@/lib/science";

export type BandCount = 3 | 4 | 5 | 6;

export interface ResistorReading {
  resistance: number;
  tolerance: number | null;
  tempCoefficient: number | null;
  min: number;
  max: number;
}

/** Colours valid for each band position, which differ by role. */
export function optionsForBand(bandCount: BandCount, index: number): BandColor[] {
  const digitBands = bandCount >= 5 ? 3 : 2;

  if (index < digitBands) {
    // A digit band cannot be gold or silver — they only encode multipliers.
    return BAND_COLORS.filter((color) => color.digit !== null);
  }
  if (index === digitBands) return BAND_COLORS;
  if (index === digitBands + 1) return BAND_COLORS.filter((color) => color.tolerance !== null);
  return BAND_COLORS.filter((color) => color.tempCoefficient !== null);
}

export function decode(bandCount: BandCount, names: string[]): ResistorReading | null {
  const digitBands = bandCount >= 5 ? 3 : 2;
  const colors = names.map(colorByName);

  let digits = 0;
  for (let index = 0; index < digitBands; index += 1) {
    const digit = colors[index]?.digit;
    if (digit === null || digit === undefined) return null;
    digits = digits * 10 + digit;
  }

  const multiplier = colors[digitBands]?.multiplier;
  if (multiplier === undefined) return null;

  const resistance = digits * multiplier;
  const tolerance = bandCount >= 4 ? (colors[digitBands + 1]?.tolerance ?? null) : null;
  const tempCoefficient = bandCount === 6 ? (colors[digitBands + 2]?.tempCoefficient ?? null) : null;

  // A 3-band resistor has no tolerance band, which by convention means ±20%.
  const spread = (tolerance ?? 20) / 100;

  return {
    resistance,
    tolerance,
    tempCoefficient,
    min: resistance * (1 - spread),
    max: resistance * (1 + spread),
  };
}

/** The reverse direction: a resistance to the bands that encode it. */
export function encode(resistance: number, bandCount: BandCount): string[] | null {
  if (!(resistance > 0)) return null;

  const digitBands = bandCount >= 5 ? 3 : 2;
  const exponent = Math.floor(Math.log10(resistance)) - (digitBands - 1);
  const multiplier = 10 ** exponent;

  const digitValue = Math.round(resistance / multiplier);
  const digits = String(digitValue).padStart(digitBands, "0").split("").map(Number);
  if (digits.length !== digitBands) return null;

  const names = digits.map(
    (digit) => BAND_COLORS.find((color) => color.digit === digit)?.name ?? "Black",
  );

  const multiplierColor = BAND_COLORS.find(
    (color) => Math.abs(color.multiplier - multiplier) < multiplier * 1e-9,
  );
  if (!multiplierColor) return null;

  names.push(multiplierColor.name);
  if (bandCount >= 4) names.push("Gold");
  if (bandCount === 6) names.push("Brown");

  return names;
}

export { nearestE24 };

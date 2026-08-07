import { nearestE24 } from "@/lib/science";

export interface LedResult {
  exactResistance: number;
  standardResistance: number;
  /** Current actually delivered by the standard value, not the ideal one. */
  actualCurrent: number;
  resistorPower: number;
  ledPower: number;
  /** Minimum resistor power rating, with the usual 2× safety margin. */
  recommendedRating: number;
  warning: string | null;
}

/** Typical forward voltages — they vary by part, so the datasheet wins. */
export const LED_PRESETS: { label: string; forward: number }[] = [
  { label: "Red", forward: 2.0 },
  { label: "Orange / Amber", forward: 2.1 },
  { label: "Yellow", forward: 2.1 },
  { label: "Green", forward: 2.2 },
  { label: "Blue", forward: 3.2 },
  { label: "White", forward: 3.2 },
  { label: "UV", forward: 3.4 },
  { label: "Infrared", forward: 1.4 },
];

/** Common resistor power ratings, in watts. */
const RATINGS = [0.125, 0.25, 0.5, 1, 2, 5];

export function calculateLedResistor(
  supply: number,
  forward: number,
  currentMa: number,
  count = 1,
): LedResult | null {
  const current = currentMa / 1000;
  if (!(current > 0) || !Number.isFinite(supply) || !Number.isFinite(forward)) return null;

  const totalForward = forward * count;
  const headroom = supply - totalForward;

  // Without voltage left over there is nothing for the resistor to drop, and
  // the LED cannot be driven at all from this supply.
  if (headroom <= 0) {
    return {
      exactResistance: 0,
      standardResistance: 0,
      actualCurrent: 0,
      resistorPower: 0,
      ledPower: 0,
      recommendedRating: 0,
      warning:
        count > 1
          ? `${count} LEDs in series need more than ${totalForward.toFixed(1)} V. Raise the supply, or wire them in parallel with a resistor each.`
          : "The supply voltage must exceed the LED's forward voltage — there is nothing left for the resistor to drop.",
    };
  }

  const exact = headroom / current;
  // Rounded up, never down: a smaller resistor passes more current than asked.
  const standard = nearestE24(exact);
  const actualCurrent = headroom / standard;
  const resistorPower = actualCurrent * actualCurrent * standard;
  const recommendedRating =
    RATINGS.find((rating) => rating >= resistorPower * 2) ?? RATINGS.at(-1)!;

  return {
    exactResistance: exact,
    standardResistance: standard,
    actualCurrent,
    resistorPower,
    ledPower: totalForward * actualCurrent,
    recommendedRating,
    warning:
      actualCurrent * 1000 > currentMa * 1.1
        ? "The nearest standard value passes noticeably more current than requested — check the LED's maximum rating."
        : null,
  };
}

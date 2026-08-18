/**
 * Training heart rate zones.
 *
 * Two things worth being clear about, both of which most calculators skip.
 *
 * First, `220 − age` is not a measurement. It came from a rough fit to a small
 * dataset in the 1970s, was never intended as a clinical formula, and has a
 * standard deviation of about 10–12 beats per minute — so for any individual it
 * can easily be 20 beats out. Tanaka's `208 − 0.7 × age` fits the population
 * data better, particularly over 40, and both are offered here.
 *
 * Second, zones from maximum heart rate alone ignore fitness entirely. The
 * Karvonen method works from heart rate *reserve* — the gap between resting and
 * maximum — which accounts for it. If you know your resting rate, use it.
 */

export type Formula = "tanaka" | "haskell" | "measured";

export const FORMULA_LABELS: Record<Formula, string> = {
  tanaka: "Tanaka (208 − 0.7 × age)",
  haskell: "Haskell (220 − age)",
  measured: "I know my maximum",
};

export function maxHeartRate(age: number, formula: Formula, measured?: number): number | null {
  if (formula === "measured") {
    return measured !== undefined && measured > 0 ? measured : null;
  }
  if (!Number.isFinite(age) || age < 5 || age > 120) return null;
  return formula === "tanaka" ? 208 - 0.7 * age : 220 - age;
}

export interface Zone {
  number: number;
  name: string;
  /** Percentage bounds of max HR, or of reserve when Karvonen is used. */
  lowPercent: number;
  highPercent: number;
  low: number;
  high: number;
  purpose: string;
  feel: string;
}

const ZONE_DEFINITIONS = [
  { number: 1, name: "Recovery", lowPercent: 50, highPercent: 60,
    purpose: "Warm-ups, cool-downs and easy days between hard sessions.",
    feel: "Conversational throughout. You could keep going all day." },
  { number: 2, name: "Endurance", lowPercent: 60, highPercent: 70,
    purpose: "Builds aerobic base. Most of your training should live here.",
    feel: "Comfortable, full sentences. Slower than feels productive — that is the point." },
  { number: 3, name: "Tempo", lowPercent: 70, highPercent: 80,
    purpose: "Improves efficiency at moderate effort.",
    feel: "Short sentences only. Working, but sustainable for a while." },
  { number: 4, name: "Threshold", lowPercent: 80, highPercent: 90,
    purpose: "Raises the pace you can hold before lactate accumulates.",
    feel: "A few words at a time. Uncomfortable, and deliberately so." },
  { number: 5, name: "Maximum", lowPercent: 90, highPercent: 100,
    purpose: "Short intervals for top-end speed and power.",
    feel: "No talking. Sustainable for a few minutes at most." },
] as const;

export interface ZoneResult {
  max: number;
  /** Null when no resting rate was given, in which case zones use max alone. */
  reserve: number | null;
  method: "karvonen" | "percentage";
  zones: Zone[];
}

export function calculateZones(
  age: number,
  formula: Formula,
  restingHeartRate: number | null,
  measuredMax?: number,
): ZoneResult | null {
  const max = maxHeartRate(age, formula, measuredMax);
  if (max === null) return null;

  const resting =
    restingHeartRate !== null && restingHeartRate > 25 && restingHeartRate < max
      ? restingHeartRate
      : null;

  const reserve = resting === null ? null : max - resting;

  const zones = ZONE_DEFINITIONS.map((definition) => {
    // Karvonen: resting + percentage of the reserve. Percentage-of-max ignores
    // resting rate entirely and gives lower, less useful numbers for a fit
    // person.
    const low =
      reserve === null
        ? (max * definition.lowPercent) / 100
        : resting! + (reserve * definition.lowPercent) / 100;
    const high =
      reserve === null
        ? (max * definition.highPercent) / 100
        : resting! + (reserve * definition.highPercent) / 100;

    return {
      ...definition,
      low: Math.round(low),
      high: Math.round(high),
    };
  });

  return {
    max: Math.round(max),
    reserve,
    method: reserve === null ? "percentage" : "karvonen",
    zones,
  };
}

/** The gap between the two population formulas, which grows with age. */
export function formulaDifference(age: number): number {
  const tanaka = maxHeartRate(age, "tanaka");
  const haskell = maxHeartRate(age, "haskell");
  if (tanaka === null || haskell === null) return 0;
  return Math.round(tanaka - haskell);
}

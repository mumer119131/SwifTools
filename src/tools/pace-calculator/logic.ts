/**
 * Pace, distance and time.
 *
 * Any two give the third, which is the whole tool. The care goes into parsing
 * and formatting, because runners write times as "45:30" and paces as "5:20"
 * and both are minutes-and-seconds rather than hours-and-minutes — the same
 * string means different things in the two fields.
 */

export type Unit = "km" | "mi";

export const RACES: { label: string; km: number }[] = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "10 miles", km: 16.0934 },
  { label: "Half marathon", km: 21.0975 },
  { label: "Marathon", km: 42.195 },
];

const KM_PER_MILE = 1.609344;

export function toKm(distance: number, unit: Unit): number {
  return unit === "km" ? distance : distance * KM_PER_MILE;
}

export function fromKm(km: number, unit: Unit): number {
  return unit === "km" ? km : km / KM_PER_MILE;
}

/**
 * Parses a duration into seconds.
 *
 * `45:30` is 45 minutes 30 seconds. `1:45:30` is an hour, 45 minutes, 30
 * seconds. A bare number is minutes — someone typing "30" for a 5K means half
 * an hour, not thirty seconds.
 */
export function parseDuration(input: string): number | null {
  const text = input.trim();
  if (text === "") return null;

  if (text.includes(":")) {
    const parts = text.split(":");
    if (parts.length > 3 || parts.some((part) => !/^\d*$/.test(part))) return null;

    const numbers = parts.map((part) => (part === "" ? 0 : Number(part)));
    const [hours, minutes, seconds] =
      numbers.length === 3 ? numbers : [0, numbers[0], numbers[1] ?? 0];

    if (seconds >= 60) return null;
    if (numbers.length === 3 && minutes >= 60) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  return Number(text) * 60;
}

/** `1:45:30`, dropping the hours when there are none. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";

  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
}

/** Pace is always minutes and seconds, never hours. */
export function formatPace(secondsPerUnit: number): string {
  if (!Number.isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "—";
  const total = Math.round(secondsPerUnit);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export interface PaceResult {
  /** Seconds per kilometre and per mile. */
  perKm: number;
  perMile: number;
  /** Kilometres and miles per hour. */
  kph: number;
  mph: number;
  totalSeconds: number;
  km: number;
}

export function fromTimeAndDistance(
  totalSeconds: number,
  distance: number,
  unit: Unit,
): PaceResult | null {
  if (!(totalSeconds > 0) || !(distance > 0)) return null;

  const km = toKm(distance, unit);
  const perKm = totalSeconds / km;

  return {
    perKm,
    perMile: perKm * KM_PER_MILE,
    kph: 3600 / perKm,
    mph: 3600 / (perKm * KM_PER_MILE),
    totalSeconds,
    km,
  };
}

export function fromPaceAndDistance(
  secondsPerUnit: number,
  distance: number,
  unit: Unit,
): PaceResult | null {
  if (!(secondsPerUnit > 0) || !(distance > 0)) return null;
  return fromTimeAndDistance(secondsPerUnit * distance, distance, unit);
}

export function fromPaceAndTime(
  secondsPerUnit: number,
  totalSeconds: number,
  unit: Unit,
): PaceResult | null {
  if (!(secondsPerUnit > 0) || !(totalSeconds > 0)) return null;
  const distance = totalSeconds / secondsPerUnit;
  return fromTimeAndDistance(totalSeconds, distance, unit);
}

/** Finish times for the standard races at this pace. */
export function racePredictions(perKm: number): { label: string; seconds: number }[] {
  return RACES.map((race) => ({ label: race.label, seconds: perKm * race.km }));
}

/** Kilometre or mile splits, capped so a marathon does not render 42 rows badly. */
export function splits(
  perUnitSeconds: number,
  distance: number,
  limit = 50,
): { at: number; elapsed: number }[] {
  const whole = Math.floor(distance);
  const rows: { at: number; elapsed: number }[] = [];

  for (let at = 1; at <= Math.min(whole, limit); at += 1) {
    rows.push({ at, elapsed: perUnitSeconds * at });
  }

  // The final partial distance matters — a marathon is 42.195km, and the last
  // 195 metres is where people are watching the clock.
  if (distance > whole && whole < limit) {
    rows.push({ at: distance, elapsed: perUnitSeconds * distance });
  }

  return rows;
}

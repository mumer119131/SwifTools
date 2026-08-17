/**
 * Unix time is the number of seconds since 1970-01-01T00:00:00Z, and it
 * deliberately ignores leap seconds — which is why it is a count of seconds
 * that does not quite match the number of seconds that have actually elapsed.
 */

export interface Parsed {
  /** Milliseconds since the epoch. */
  ms: number;
  /** What the input was read as, so the guess can be shown and corrected. */
  unit: "seconds" | "milliseconds" | "microseconds" | "nanoseconds" | "date";
  date: Date;
}

/**
 * Reads a timestamp, guessing its unit from magnitude.
 *
 * The guess is necessary and it is why so many bugs land in 1970: a
 * millisecond timestamp fed to a seconds-based API gives a date fifty thousand
 * years out, and a seconds timestamp fed to JavaScript's Date — which wants
 * milliseconds — gives January 1970. Digit count separates them cleanly for
 * any date in the modern era.
 */
export function parseTimestamp(input: string): Parsed | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^-?\d+$/.test(trimmed)) {
    const value = Number(trimmed);
    if (!Number.isFinite(value)) return null;

    const digits = trimmed.replace("-", "").length;

    // 10 digits is seconds until the year 2286; 13 is milliseconds until 2286.
    const unit: Parsed["unit"] =
      digits >= 17 ? "nanoseconds" : digits >= 14 ? "microseconds" : digits >= 12 ? "milliseconds" : "seconds";

    const ms =
      unit === "nanoseconds" ? value / 1e6
      : unit === "microseconds" ? value / 1e3
      : unit === "milliseconds" ? value
      : value * 1000;

    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : { ms, unit, date };
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return { ms: date.getTime(), unit: "date", date };
}

export interface Formats {
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  localDate: string;
  localTime: string;
  relative: string;
  dayOfWeek: string;
  dayOfYear: number;
  weekOfYear: number;
  timezone: string;
  offsetMinutes: number;
}

export function formats(date: Date, now: Date): Formats {
  const ms = date.getTime();

  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000) + 1;

  // ISO 8601 week number: weeks start Monday and week 1 holds the first
  // Thursday, which is why this is not simply dayOfYear / 7.
  const thursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const weekOfYear = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);

  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    localDate: date.toLocaleDateString(undefined, { dateStyle: "full" }),
    localTime: date.toLocaleTimeString(undefined, { timeStyle: "long" }),
    relative: relativeTime(ms - now.getTime()),
    dayOfWeek: date.toLocaleDateString(undefined, { weekday: "long" }),
    dayOfYear,
    weekOfYear,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offsetMinutes: -date.getTimezoneOffset(),
  };
}

/** "3 days ago", "in 2 hours" — the largest unit that is not zero. */
export function relativeTime(deltaMs: number): string {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_556_952_000],
    ["month", 2_629_746_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
    ["second", 1000],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(deltaMs) >= size) {
      return formatter.format(Math.round(deltaMs / size), unit);
    }
  }

  return "just now";
}

/** Milestones worth knowing about, mostly because they break things. */
export const NOTABLE: { label: string; seconds: number; note: string }[] = [
  { label: "The Unix epoch", seconds: 0, note: "1 January 1970, 00:00:00 UTC. Where every off-by-1000 bug lands." },
  { label: "One billion seconds", seconds: 1_000_000_000, note: "9 September 2001. Celebrated as Unix billennium." },
  { label: "Year 2038 problem", seconds: 2_147_483_647, note: "19 January 2038. A signed 32-bit time_t overflows here and wraps to 1901." },
  { label: "Two billion seconds", seconds: 2_000_000_000, note: "18 May 2033." },
];

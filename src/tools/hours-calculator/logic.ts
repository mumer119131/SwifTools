/**
 * Timesheet arithmetic.
 *
 * The whole difficulty is that people write times in every conceivable way and
 * expect all of them to work: "9", "9am", "09:00", "9.30", "17:45", "5:45pm".
 * A timesheet tool that only accepts one format is a timesheet tool nobody uses
 * twice.
 *
 * The other trap is the overnight shift. 22:00 to 06:00 is eight hours, not
 * minus sixteen, and subtracting naively gives the wrong answer silently.
 */

export interface Entry {
  id: string;
  label: string;
  start: string;
  end: string;
  /** Unpaid break in minutes. */
  breakMinutes: number;
}

export interface EntryResult {
  /** Worked minutes after the break, or null when the row cannot be read. */
  minutes: number | null;
  error: string | null;
  /** True when the shift runs past midnight. */
  overnight: boolean;
}

/**
 * Parses a clock time into minutes past midnight.
 *
 * Accepts 9, 9am, 9:30, 9.30, 09:30, 5pm, 5:45 pm, 17:45. Returns null for
 * anything it cannot read, rather than guessing.
 */
export function parseTime(input: string): number | null {
  const text = input.trim().toLowerCase().replace(/\s+/g, "");
  if (text === "") return null;

  const match = text.match(/^(\d{1,2})(?:[:.](\d{2}))?(am|pm)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3];

  if (minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    // 12am is midnight and 12pm is noon — the one case where the usual
    // "add twelve" rule is wrong in both directions.
    if (meridiem === "am") hours = hours === 12 ? 0 : hours;
    else hours = hours === 12 ? 12 : hours + 12;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatClock(minutes: number): string {
  const normalised = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalised / 60);
  return `${String(hours).padStart(2, "0")}:${String(normalised % 60).padStart(2, "0")}`;
}

/** "7h 30m" — the form a timesheet is read in. */
export function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** Decimal hours, which is what payroll systems take. */
export function toDecimalHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export function calculateEntry(entry: Entry): EntryResult {
  if (entry.start.trim() === "" && entry.end.trim() === "") {
    return { minutes: null, error: null, overnight: false };
  }

  const start = parseTime(entry.start);
  const end = parseTime(entry.end);

  if (start === null) return { minutes: null, error: "Start time not understood", overnight: false };
  if (end === null) return { minutes: null, error: "End time not understood", overnight: false };

  // An end before the start means the shift crossed midnight. Treating it as
  // negative is the classic timesheet bug.
  const overnight = end <= start;
  const worked = overnight ? 1440 - start + end : end - start;

  const net = worked - Math.max(0, entry.breakMinutes);
  if (net < 0) {
    return { minutes: null, error: "The break is longer than the shift", overnight };
  }

  return { minutes: net, error: null, overnight };
}

export interface Totals {
  minutes: number;
  decimalHours: number;
  /** Rows that produced a number. */
  counted: number;
  overtimeMinutes: number;
  regularMinutes: number;
  pay: number | null;
}

export function calculateTotals(
  entries: Entry[],
  options: { rate: number | null; overtimeAfterHours: number | null; overtimeMultiplier: number },
): Totals {
  let minutes = 0;
  let counted = 0;

  for (const entry of entries) {
    const result = calculateEntry(entry);
    if (result.minutes !== null) {
      minutes += result.minutes;
      counted += 1;
    }
  }

  const threshold = options.overtimeAfterHours !== null ? options.overtimeAfterHours * 60 : null;
  const overtimeMinutes = threshold !== null ? Math.max(0, minutes - threshold) : 0;
  const regularMinutes = minutes - overtimeMinutes;

  const pay =
    options.rate !== null
      ? Math.round(
          ((regularMinutes / 60) * options.rate +
            (overtimeMinutes / 60) * options.rate * options.overtimeMultiplier) *
            100,
        ) / 100
      : null;

  return {
    minutes,
    decimalHours: toDecimalHours(minutes),
    counted,
    overtimeMinutes,
    regularMinutes,
    pay,
  };
}

export function blankEntry(label: string): Entry {
  return {
    id: `${label}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    start: "",
    end: "",
    breakMinutes: 0,
  };
}

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Estimating a due date.
 *
 * Naegele's rule — last period plus 280 days — is what clinics use, and it
 * carries an assumption worth stating: that ovulation happened on day 14 of a
 * 28-day cycle. Plenty of people do not have 28-day cycles, so the tool adjusts
 * for cycle length rather than pretending everyone is average.
 *
 * The word "estimated" is doing real work. Only about 4% of babies arrive on
 * their due date, and a normal term spans five weeks. A date presented without
 * that context sets an expectation that is wrong far more often than it is
 * right.
 */

export type Method = "lmp" | "conception" | "ivf3" | "ivf5";

export const METHOD_LABELS: Record<Method, string> = {
  lmp: "First day of last period",
  conception: "Date of conception",
  ivf3: "IVF — day-3 transfer",
  ivf5: "IVF — day-5 transfer",
};

/** A full term is 280 days from the last period. */
export const GESTATION_DAYS = 280;

const DAY = 86_400_000;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY);
}

export function daysBetween(from: Date, to: Date): number {
  // Compare at midnight so a time-of-day difference cannot shift the count.
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / DAY);
}

export interface Milestone {
  label: string;
  date: Date;
  week: number;
  note?: string;
}

export interface DueDateResult {
  dueDate: Date;
  /** The notional last-period date, which every other figure derives from. */
  lmp: Date;
  conception: Date;
  /** Completed weeks and days at the reference date. */
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
  /** Days until the due date. Negative once it has passed. */
  daysRemaining: number;
  percentComplete: number;
  milestones: Milestone[];
  /** The five-week window in which most births actually happen. */
  termWindow: { earliest: Date; latest: Date };
}

/**
 * Works everything back to a notional last-period date.
 *
 * Every method reduces to the same thing: conception is treated as two weeks
 * after the last period, an IVF day-3 transfer as 17 days after, and a day-5
 * transfer as 19. Normalising first means the rest of the calculation has one
 * path rather than four.
 */
function toLmp(date: Date, method: Method, cycleLength: number): Date {
  // A longer cycle means later ovulation, so the equivalent period date is
  // earlier than the 28-day assumption would put it.
  const cycleAdjustment = cycleLength - 28;

  switch (method) {
    case "conception":
      return addDays(date, -14 - cycleAdjustment);
    case "ivf3":
      return addDays(date, -17);
    case "ivf5":
      return addDays(date, -19);
    default:
      return date;
  }
}

export function calculate(
  input: Date,
  method: Method,
  cycleLength = 28,
  today = new Date(),
): DueDateResult | null {
  if (Number.isNaN(input.getTime())) return null;
  if (!Number.isFinite(cycleLength) || cycleLength < 20 || cycleLength > 45) return null;

  const lmp = toLmp(input, method, cycleLength);

  // IVF dates are known precisely, so the cycle-length adjustment does not
  // apply to them — the transfer date already fixes the timeline.
  const adjustment = method === "lmp" ? cycleLength - 28 : 0;
  const dueDate = addDays(lmp, GESTATION_DAYS + adjustment);

  const elapsed = daysBetween(lmp, today);
  if (elapsed < -30 || elapsed > 400) return null;

  const weeks = Math.max(0, Math.floor(elapsed / 7));
  const days = Math.max(0, elapsed % 7);

  const trimester: 1 | 2 | 3 = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;

  const milestone = (label: string, week: number, note?: string): Milestone => ({
    label,
    week,
    date: addDays(lmp, week * 7),
    note,
  });

  return {
    dueDate,
    lmp,
    conception: addDays(lmp, 14 + adjustment),
    weeks,
    days,
    trimester,
    daysRemaining: daysBetween(today, dueDate),
    percentComplete: Math.min(100, Math.max(0, (elapsed / (GESTATION_DAYS + adjustment)) * 100)),
    milestones: [
      milestone("End of first trimester", 13),
      milestone("Anomaly scan window opens", 18, "Usually offered between 18 and 21 weeks"),
      milestone("End of second trimester", 27),
      milestone("Viability generally considered established", 24),
      milestone("Full term begins", 37, "Anything from here is not premature"),
      milestone("Due date", 40),
      milestone("Post-term", 42, "Induction is usually discussed around now"),
    ].sort((a, b) => a.week - b.week),
    // Term is 37–42 weeks, which is where the "only 4% arrive on the date"
    // figure comes from.
    termWindow: { earliest: addDays(lmp, 37 * 7), latest: addDays(lmp, 42 * 7) },
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShort(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

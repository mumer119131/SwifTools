export interface Difference {
  /** Calendar difference, the way a person would say it. */
  years: number;
  months: number;
  days: number;
  /** Absolute totals in each unit. */
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  weekdays: number;
  weekendDays: number;
  /** True when the end date is before the start. */
  reversed: boolean;
}

/** Parses a yyyy-mm-dd input as local midday, avoiding timezone edge cases. */
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The difference between two dates.
 *
 * Calendar arithmetic is done in whole months plus leftover days, not by
 * dividing, because months are not a fixed length. "1 month" from 31 January
 * is not 30 days, and dividing the total days by 30.44 gives an average that
 * matches no actual pair of dates.
 *
 * Both dates are parsed at local midday, which sidesteps the classic bug where
 * a daylight-saving transition makes a whole-day difference come out as 23 or
 * 25 hours and the day count lands one short.
 */
export function difference(start: Date, end: Date): Difference {
  const reversed = end < start;
  const from = reversed ? end : start;
  const to = reversed ? start : end;

  /*
   * Whole months first, then the leftover days measured from that anchor.
   *
   * The obvious approach — subtract the day numbers and borrow a month when
   * the result goes negative — is wrong whenever the borrowed month is shorter
   * than the shortfall. 31 January to 1 March borrows 29 days against a
   * difference of 30 and still lands negative. Advancing the start by the whole
   * months, with the same end-of-month clamping used everywhere else, and
   * measuring what remains cannot produce a negative day count.
   */
  let totalMonths =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) totalMonths -= 1;

  const anchor = shift(from, totalMonths, "months");
  const days = Math.round((to.getTime() - anchor.getTime()) / 86_400_000);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const totalMs = to.getTime() - from.getTime();
  const totalDays = Math.round(totalMs / 86_400_000);

  let weekdays = 0;
  let weekendDays = 0;
  const cursor = new Date(from);
  // Counted day by day rather than estimated from totalDays / 7, which is
  // wrong whenever the range does not start on a Monday.
  for (let index = 0; index < totalDays; index += 1) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day === 0 || day === 6) weekendDays += 1;
    else weekdays += 1;
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: totalDays / 7,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    weekdays,
    weekendDays,
    reversed,
  };
}

export type Unit = "days" | "weeks" | "months" | "years";

/** Adds or subtracts a period, clamping to the end of a short month. */
export function shift(date: Date, amount: number, unit: Unit): Date {
  const result = new Date(date);

  if (unit === "days") result.setDate(result.getDate() + amount);
  else if (unit === "weeks") result.setDate(result.getDate() + amount * 7);
  else {
    // Years are months × 12 so a leap day gets the same clamping. Left to
    // setFullYear, 29 February plus a year rolls forward to 1 March.
    const monthsToAdd = unit === "years" ? amount * 12 : amount;
    /*
     * Month arithmetic overflows: 31 January plus one month would become
     * 3 March, because JavaScript rolls the extra days forward. Clamping to
     * the last day of the target month is what people mean by "a month later".
     */
    const targetDay = result.getDate();
    result.setDate(1);
    result.setMonth(result.getMonth() + monthsToAdd);
    const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    result.setDate(Math.min(targetDay, lastDay));
  }

  return result;
}

export function toInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  nextBirthday: Date;
  daysToNextBirthday: number;
  nextBirthdayWeekday: string;
  birthWeekday: string;
  /** Turning this age on the next birthday. */
  turningAge: number;
}

/**
 * Calendar arithmetic is done on date parts, not on millisecond differences.
 *
 * Subtracting timestamps and dividing by 365.25 gives a number that drifts —
 * it disagrees with how people actually count birthdays across leap years and
 * months of unequal length. Borrowing days from the previous month, the way you
 * would on paper, gives the answer everyone expects.
 */
export function calculateAge(birthText: string, asOfText: string): AgeResult | null {
  const birth = parseDate(birthText);
  const asOf = parseDate(asOfText);
  if (!birth || !asOf) return null;
  if (birth.getTime() > asOf.getTime()) return null;

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Day 0 of the current month is the last day of the previous one.
    days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const millisecondsApart = asOf.getTime() - birth.getTime();
  const totalDays = Math.floor(millisecondsApart / 86_400_000);

  // Next birthday: this year's if it is still ahead, otherwise next year's.
  let nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday.getTime() <= asOf.getTime()) {
    nextBirthday = new Date(asOf.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }

  const weekdayOf = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);

  return {
    years,
    months,
    days,
    totalMonths: years * 12 + months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    totalHours: Math.floor(millisecondsApart / 3_600_000),
    nextBirthday,
    daysToNextBirthday: Math.ceil((nextBirthday.getTime() - asOf.getTime()) / 86_400_000),
    nextBirthdayWeekday: weekdayOf(nextBirthday),
    birthWeekday: weekdayOf(birth),
    turningAge: years + 1,
  };
}

function parseDate(text: string): Date | null {
  if (!text) return null;
  const [year, month, day] = text.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

  // Constructed in local time so "today" means the user's today.
  const date = new Date(year, month - 1, day);
  // Rejects impossible dates like 2025-02-30, which JS would silently roll over.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function todayInputValue(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

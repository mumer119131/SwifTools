export interface Habit {
  id: string;
  name: string;
  /** ISO dates, "2026-08-13", on which the habit was done. */
  done: string[];
}

/** Local-date key — UTC would roll the day over at the wrong time. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The last `count` days, oldest first, ending today. */
export function recentDays(count: number, today: Date): Date[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (count - 1 - index));
    return date;
  });
}

export interface Streaks {
  current: number;
  best: number;
  total: number;
  rate: number;
}

/**
 * Current and best run of consecutive days.
 *
 * The current streak counts back from today, but a habit not yet ticked today
 * still has a live streak — it is only broken once yesterday is missed. Counting
 * from today alone would reset every streak to zero each morning.
 */
export function streaks(done: string[], today: Date, window: number): Streaks {
  const marked = new Set(done);

  let current = 0;
  const start = marked.has(dayKey(today)) ? 0 : 1;

  for (let offset = start; ; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    if (!marked.has(dayKey(date))) break;
    current += 1;
  }

  // Best streak over the dates actually recorded, not an unbounded search.
  const sorted = [...marked].sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;

  for (const key of sorted) {
    if (previous !== null && isNextDay(previous, key)) run += 1;
    else run = 1;

    best = Math.max(best, run);
    previous = key;
  }

  const recent = recentDays(window, today).filter((date) => marked.has(dayKey(date))).length;

  return { current, best, total: marked.size, rate: (recent / window) * 100 };
}

function isNextDay(previous: string, next: string): boolean {
  const before = new Date(`${previous}T12:00:00`);
  before.setDate(before.getDate() + 1);
  return dayKey(before) === next;
}

/**
 * Bedtimes and wake times, by sleep cycle.
 *
 * The premise is simple and worth stating honestly: sleep runs in cycles of
 * roughly 90 minutes, and waking at the end of one — in light sleep — feels
 * considerably better than being pulled out of deep sleep partway through.
 * That is why six hours can leave you sharper than seven and a half.
 *
 * Ninety minutes is an average, not a constant. Real cycles run 70–120 minutes
 * and vary between people and across a night. This gives you the arithmetic;
 * it does not claim to know your physiology.
 */

/** Minutes per cycle. The commonly used average. */
export const CYCLE_MINUTES = 90;

/** How long it typically takes to actually fall asleep. */
export const DEFAULT_LATENCY = 15;

export interface Suggestion {
  /** Minutes since midnight. */
  minutes: number;
  cycles: number;
  /** Time actually asleep, excluding the time taken to drop off. */
  sleepMinutes: number;
  /** Cycles that land in the range most adults need. */
  recommended: boolean;
}

function normalise(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440;
}

export function formatTime(minutes: number, clock: "24" | "12" = "24"): string {
  const total = normalise(Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;

  if (clock === "24") {
    return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  const suffix = hours < 12 ? "am" : "pm";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${String(rest).padStart(2, "0")}${suffix}`;
}

/** Accepts 7, 7:30, 7.30, 7am, 10:45pm. */
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
    if (meridiem === "am") hours = hours === 12 ? 0 : hours;
    else hours = hours === 12 ? 12 : hours + 12;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Bedtimes for a chosen wake time.
 *
 * Counted backwards from waking, and the time taken to fall asleep is added on
 * — going to bed at the moment a cycle starts means missing the start of it.
 * Returned latest-first, because the useful answer is usually "the latest I can
 * go to bed and still get five cycles".
 */
export function bedtimesFor(wakeMinutes: number, latency = DEFAULT_LATENCY, cycles = [6, 5, 4, 3]): Suggestion[] {
  return cycles.map((count) => {
    const sleepMinutes = count * CYCLE_MINUTES;
    return {
      minutes: normalise(wakeMinutes - sleepMinutes - latency),
      cycles: count,
      sleepMinutes,
      recommended: count === 5 || count === 6,
    };
  });
}

/** Wake times for a chosen bedtime. Earliest first, which is how they arrive. */
export function wakeTimesFor(bedMinutes: number, latency = DEFAULT_LATENCY, cycles = [3, 4, 5, 6]): Suggestion[] {
  return cycles.map((count) => {
    const sleepMinutes = count * CYCLE_MINUTES;
    return {
      minutes: normalise(bedMinutes + latency + sleepMinutes),
      cycles: count,
      sleepMinutes,
      recommended: count === 5 || count === 6,
    };
  });
}

/** "7h 30m", for the amount of sleep a suggestion gives. */
export function formatSleep(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

import { secureInt, secureRange } from "@/lib/random";

export type DrawResult =
  | { ok: true; numbers: number[] }
  | { ok: false; error: string };

/**
 * Draws numbers from a range.
 *
 * Without repeats this is a partial Fisher–Yates over the range rather than
 * "keep rolling until you get a new one" — the naive version degrades badly
 * when the count approaches the range size, and never terminates when it
 * exceeds it.
 */
export function draw(
  min: number,
  max: number,
  count: number,
  allowRepeats: boolean,
  sorted: boolean,
): DrawResult {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  const size = high - low + 1;

  const wanted = Math.floor(count);
  if (!Number.isFinite(low) || !Number.isFinite(high)) {
    return { ok: false, error: "Enter a numeric range." };
  }
  if (wanted < 1) return { ok: false, error: "Ask for at least one number." };
  if (wanted > 10000) return { ok: false, error: "Ten thousand at a time is the limit." };

  if (!allowRepeats && wanted > size) {
    return {
      ok: false,
      error: `There are only ${size.toLocaleString("en-US")} numbers between ${low} and ${high} — either widen the range or allow repeats.`,
    };
  }

  let numbers: number[];

  if (allowRepeats) {
    numbers = Array.from({ length: wanted }, () => secureRange(low, high));
  } else {
    // Partial shuffle: swap the first `wanted` positions of the virtual range.
    const pool = Array.from({ length: size }, (_, index) => low + index);
    for (let index = 0; index < wanted; index += 1) {
      const swap = index + secureInt(size - index);
      [pool[index], pool[swap]] = [pool[swap], pool[index]];
    }
    numbers = pool.slice(0, wanted);
  }

  return { ok: true, numbers: sorted ? [...numbers].sort((a, b) => a - b) : numbers };
}

export const PRESETS = [
  { label: "1–10", min: 1, max: 10, count: 1 },
  { label: "1–100", min: 1, max: 100, count: 1 },
  { label: "Lottery 6 of 49", min: 1, max: 49, count: 6 },
  { label: "Powerball 5 of 69", min: 1, max: 69, count: 5 },
  { label: "Dice 1–6", min: 1, max: 6, count: 1 },
  { label: "PIN 0–9", min: 0, max: 9, count: 4 },
];

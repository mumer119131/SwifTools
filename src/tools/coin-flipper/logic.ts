import { secureInt } from "@/lib/random";

export type Side = "heads" | "tails";

export interface FlipStats {
  heads: number;
  tails: number;
  total: number;
  headsPercent: number;
  longestStreak: number;
  streakSide: Side | null;
  currentStreak: number;
}

export function flip(): Side {
  return secureInt(2) === 0 ? "heads" : "tails";
}

export function flipMany(count: number): Side[] {
  const capped = Math.max(0, Math.min(10000, Math.floor(count)));
  return Array.from({ length: capped }, flip);
}

/**
 * Tallies a run of flips.
 *
 * The streak is worth showing because it is where intuition fails: in 100 fair
 * flips a run of six or seven the same way is entirely ordinary, and people
 * routinely read that as the coin being rigged.
 */
export function summarise(history: Side[]): FlipStats {
  const heads = history.filter((side) => side === "heads").length;
  const tails = history.length - heads;

  let longestStreak = 0;
  let streakSide: Side | null = null;
  let currentStreak = 0;
  let runSide: Side | null = null;

  for (const side of history) {
    if (side === runSide) {
      currentStreak += 1;
    } else {
      runSide = side;
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      streakSide = side;
    }
  }

  return {
    heads,
    tails,
    total: history.length,
    headsPercent: history.length > 0 ? (heads / history.length) * 100 : 0,
    longestStreak,
    streakSide,
    currentStreak,
  };
}

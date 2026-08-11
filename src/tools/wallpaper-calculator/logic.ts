import { OPENINGS } from "@/lib/home";

export type MatchType = "free" | "straight" | "offset";

export interface WallpaperEstimate {
  perimeterFt: number;
  wallHeightFt: number;
  dropsNeeded: number;
  dropLengthFt: number;
  dropsPerRoll: number;
  rolls: number;
  wastePerRollFt: number;
  cost: number | null;
}

/**
 * Rolls of wallpaper for a room.
 *
 * This is not an area calculation. Wallpaper hangs in full-height strips, so
 * what matters is how many whole drops you can cut from a roll — and a pattern
 * repeat forces every drop to start at the same point in the pattern, so each
 * one is rounded up to the next whole repeat. A 64 cm repeat can cost you a
 * third of every roll, which is why "area ÷ roll coverage" comes up short.
 */
export function estimate(
  perimeterFt: number,
  wallHeightFt: number,
  doors: number,
  windows: number,
  rollWidthIn: number,
  rollLengthFt: number,
  repeatIn: number,
  match: MatchType,
  pricePerRoll: number,
): WallpaperEstimate {
  const widthFt = Math.max(0, rollWidthIn) / 12;

  // Openings converted back into the width of wall they remove.
  const openingWidthFt =
    wallHeightFt > 0
      ? (Math.max(0, doors) * OPENINGS.door + Math.max(0, windows) * OPENINGS.window) / wallHeightFt
      : 0;

  const usablePerimeter = Math.max(0, perimeterFt - openingWidthFt);
  const dropsNeeded = widthFt > 0 ? Math.ceil(usablePerimeter / widthFt) : 0;

  // Each drop is cut to the next whole pattern repeat above the wall height.
  const repeatFt = Math.max(0, repeatIn) / 12;
  let dropLengthFt = wallHeightFt + 0.25; // 3" trim allowance top and bottom
  if (repeatFt > 0) dropLengthFt = Math.ceil(dropLengthFt / repeatFt) * repeatFt;

  // An offset (drop) match staggers alternate strips by half a repeat, so half
  // the drops need an extra half-repeat of length.
  if (match === "offset" && repeatFt > 0) dropLengthFt += repeatFt / 2;

  const dropsPerRoll = dropLengthFt > 0 ? Math.floor(rollLengthFt / dropLengthFt) : 0;
  const rolls = dropsPerRoll > 0 ? Math.ceil(dropsNeeded / dropsPerRoll) : 0;

  return {
    perimeterFt: usablePerimeter,
    wallHeightFt,
    dropsNeeded,
    dropLengthFt,
    dropsPerRoll,
    rolls,
    wastePerRollFt: Math.max(0, rollLengthFt - dropsPerRoll * dropLengthFt),
    cost: pricePerRoll > 0 ? rolls * pricePerRoll : null,
  };
}

export const MATCH_TYPES: { id: MatchType; label: string; note: string }[] = [
  { id: "free", label: "Free match / plain", note: "No pattern to line up — least waste." },
  { id: "straight", label: "Straight match", note: "Pattern lines up level across every drop." },
  { id: "offset", label: "Offset / drop match", note: "Alternate drops shift by half a repeat — most waste." },
];

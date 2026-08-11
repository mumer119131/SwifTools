import { OPENINGS } from "@/lib/home";

export interface PaintEstimate {
  paintableArea: number;
  deducted: number;
  coats: number;
  totalCoverage: number;
  gallons: number;
  gallonsToBuy: number;
  litres: number;
  cost: number | null;
}

/** US gallon in litres, exact. */
const LITRES_PER_GALLON = 3.785411784;

/**
 * How much paint a room needs.
 *
 * Doors and windows come off the wall area — a room with three windows can
 * easily be 10% smaller than its raw wall area suggests, which is a whole
 * gallon on a large room.
 */
export function estimate(
  wallAreaSqft: number,
  doors: number,
  windows: number,
  coats: number,
  coveragePerGallon: number,
  ceiling: number,
  pricePerGallon: number,
): PaintEstimate {
  const deducted = Math.max(0, doors) * OPENINGS.door + Math.max(0, windows) * OPENINGS.window;
  const paintableArea = Math.max(0, wallAreaSqft - deducted) + Math.max(0, ceiling);

  const totalCoverage = paintableArea * Math.max(1, coats);
  const gallons = coveragePerGallon > 0 ? totalCoverage / coveragePerGallon : 0;

  // Paint is sold in whole cans; a quarter-gallon short means a second trip.
  const gallonsToBuy = Math.ceil(gallons * 4) / 4;

  return {
    paintableArea,
    deducted,
    coats,
    totalCoverage,
    gallons,
    gallonsToBuy,
    litres: gallons * LITRES_PER_GALLON,
    cost: pricePerGallon > 0 ? Math.ceil(gallons) * pricePerGallon : null,
  };
}

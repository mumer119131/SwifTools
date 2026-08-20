/**
 * Shoe sizes across regions.
 *
 * The honest framing matters more than the table. There is no international
 * standard that manufacturers follow: UK and US sizes are both based on the
 * barleycorn — a third of an inch — but count from different starting points,
 * and EU sizes use the Paris point, two thirds of a centimetre, applied to the
 * *last* rather than the foot. Brands then deviate from all of it.
 *
 * So the foot length in centimetres is the only figure that means anything.
 * Everything else is a conversion between approximations, and this says so.
 */

export type Region = "uk" | "us" | "eu" | "cm";
export type Fit = "men" | "women" | "kids";

export const REGION_LABELS: Record<Region, string> = {
  uk: "UK",
  us: "US",
  eu: "EU",
  cm: "Foot length (cm)",
};

export const FIT_LABELS: Record<Fit, string> = {
  men: "Men's",
  women: "Women's",
  kids: "Kids'",
};

export interface Row {
  uk: number;
  us: number;
  eu: number;
  cm: number;
}

/**
 * The standard published tables.
 *
 * Foot length is the anchor; the rest are the sizes usually printed against it.
 * EU values are given as a single number where the tables agree and rounded to
 * the nearer where they straddle two.
 */
export const TABLES: Record<Fit, Row[]> = {
  men: [
    { uk: 5, us: 6, eu: 38, cm: 23.5 },
    { uk: 5.5, us: 6.5, eu: 39, cm: 24 },
    { uk: 6, us: 7, eu: 39.5, cm: 24.5 },
    { uk: 6.5, us: 7.5, eu: 40, cm: 25 },
    { uk: 7, us: 8, eu: 41, cm: 25.5 },
    { uk: 7.5, us: 8.5, eu: 41.5, cm: 26 },
    { uk: 8, us: 9, eu: 42, cm: 26.5 },
    { uk: 8.5, us: 9.5, eu: 43, cm: 27 },
    { uk: 9, us: 10, eu: 43.5, cm: 27.5 },
    { uk: 9.5, us: 10.5, eu: 44, cm: 28 },
    { uk: 10, us: 11, eu: 45, cm: 28.5 },
    { uk: 10.5, us: 11.5, eu: 45.5, cm: 29 },
    { uk: 11, us: 12, eu: 46, cm: 29.5 },
    { uk: 12, us: 13, eu: 47, cm: 30.5 },
    { uk: 13, us: 14, eu: 48, cm: 31.5 },
  ],
  women: [
    { uk: 2, us: 4, eu: 34.5, cm: 21.5 },
    { uk: 2.5, us: 4.5, eu: 35, cm: 22 },
    { uk: 3, us: 5, eu: 35.5, cm: 22.5 },
    { uk: 3.5, us: 5.5, eu: 36, cm: 23 },
    { uk: 4, us: 6, eu: 37, cm: 23.5 },
    { uk: 4.5, us: 6.5, eu: 37.5, cm: 24 },
    { uk: 5, us: 7, eu: 38, cm: 24.5 },
    { uk: 5.5, us: 7.5, eu: 38.5, cm: 25 },
    { uk: 6, us: 8, eu: 39, cm: 25.5 },
    { uk: 6.5, us: 8.5, eu: 40, cm: 26 },
    { uk: 7, us: 9, eu: 40.5, cm: 26.5 },
    { uk: 7.5, us: 9.5, eu: 41, cm: 27 },
    { uk: 8, us: 10, eu: 42, cm: 27.5 },
    { uk: 9, us: 11, eu: 43, cm: 28.5 },
  ],
  kids: [
    { uk: 6, us: 7, eu: 23, cm: 14 },
    { uk: 7, us: 8, eu: 24, cm: 14.7 },
    { uk: 8, us: 9, eu: 25, cm: 15.4 },
    { uk: 9, us: 10, eu: 27, cm: 16.1 },
    { uk: 10, us: 11, eu: 28, cm: 16.8 },
    { uk: 11, us: 12, eu: 29, cm: 17.5 },
    { uk: 12, us: 13, eu: 30, cm: 18.2 },
    { uk: 13, us: 1, eu: 31, cm: 19 },
    { uk: 1, us: 2, eu: 33, cm: 19.7 },
    { uk: 2, us: 3, eu: 34, cm: 20.4 },
    { uk: 3, us: 4, eu: 35, cm: 21.1 },
    { uk: 4, us: 5, eu: 36, cm: 21.8 },
    { uk: 5, us: 6, eu: 37, cm: 22.5 },
  ],
};

export interface Match {
  row: Row;
  /** True when the input landed exactly on a published size. */
  exact: boolean;
}

/** The closest row, and whether it was a direct hit. */
export function convert(value: number, from: Region, fit: Fit): Match | null {
  if (!Number.isFinite(value) || value <= 0) return null;

  const table = TABLES[fit];

  const exact = table.find((row) => Math.abs(row[from] - value) < 0.001);
  if (exact) return { row: exact, exact: true };

  // Outside the table entirely — better to say so than to extrapolate a size
  // that no manufacturer makes.
  const lowest = Math.min(...table.map((row) => row[from]));
  const highest = Math.max(...table.map((row) => row[from]));
  if (value < lowest - 1 || value > highest + 1) return null;

  const nearest = table.reduce((best, row) =>
    Math.abs(row[from] - value) < Math.abs(best[from] - value) ? row : best,
  );

  return { row: nearest, exact: false };
}

/**
 * Foot length from a size, which is the measurement worth trusting.
 *
 * Add roughly a centimetre of wiggle room to a measured foot before comparing:
 * the number in the table is the foot, not the inside of the shoe.
 */
export const TOE_ROOM_CM = 1;

export const MEASURING_STEPS = [
  "Measure in the evening. Feet swell over a day, and a shoe fitted in the morning can be tight by six.",
  "Stand on a sheet of paper with your heel against a wall, weight on the foot.",
  "Mark the end of your longest toe — which is not always the big one.",
  "Measure heel to mark in centimetres, and do both feet. They differ, and you fit the larger.",
];

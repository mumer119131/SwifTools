/**
 * Shared data for the home and lifestyle calculators.
 *
 * The material calculators — paint, tile, flooring, wallpaper — are the same
 * calculation with different coverage rates and waste factors, so the rates
 * live here rather than being retyped per tool. Figures are typical
 * manufacturer values; every tool says so on its page, because a real product
 * label always wins over a default.
 */

export type LengthUnit = "ft" | "m";

/** Square feet per square metre, exact: (1 / 0.3048)². */
export const SQFT_PER_SQM = 10.763910416709722;

export function toSquareFeet(value: number, unit: LengthUnit): number {
  return unit === "ft" ? value : value * SQFT_PER_SQM;
}

export function toSquareMetres(squareFeet: number): number {
  return squareFeet / SQFT_PER_SQM;
}

/** Adds a waste allowance and rounds up — you cannot buy 3.2 boxes of tile. */
export function withWaste(quantity: number, wastePercent: number): number {
  return quantity * (1 + wastePercent / 100);
}

export function formatMoney(value: number, currency = "USD"): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export function formatArea(squareFeet: number, unit: LengthUnit): string {
  const value = unit === "ft" ? squareFeet : toSquareMetres(squareFeet);
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${unit === "ft" ? "sq ft" : "m²"}`;
}

/* --------------------------------------------------------------- coverage */

export interface Coverage {
  id: string;
  label: string;
  /** Square feet covered per unit, at one coat. */
  sqftPerUnit: number;
  unitLabel: string;
  /** Typical waste allowance in percent. */
  waste: number;
  note?: string;
}

/** A gallon of interior paint covers ~350 sq ft on a primed, smooth wall. */
export const PAINT_COVERAGE: Coverage[] = [
  { id: "smooth", label: "Smooth drywall", sqftPerUnit: 400, unitLabel: "gallon", waste: 0 },
  { id: "primed", label: "Primed / previously painted", sqftPerUnit: 350, unitLabel: "gallon", waste: 0 },
  { id: "textured", label: "Textured or lightly porous", sqftPerUnit: 300, unitLabel: "gallon", waste: 0 },
  { id: "rough", label: "Rough — stucco, brick, masonry", sqftPerUnit: 200, unitLabel: "gallon", waste: 0, note: "Rough surfaces drink paint; buy the higher estimate." },
];

/** Standard opening sizes, subtracted from wall area. */
export const OPENINGS = {
  door: 21, // 3 ft × 7 ft
  window: 15, // typical 3 ft × 5 ft
} as const;

/* ------------------------------------------------------------ electricity */

/** Rough US average retail rate, cents per kWh — a starting point, not a bill. */
export const DEFAULT_KWH_RATE = 0.17;

export interface Appliance {
  name: string;
  watts: number;
  /** Typical hours run per day. */
  hours: number;
}

export const APPLIANCES: Appliance[] = [
  { name: "Refrigerator", watts: 150, hours: 24 },
  { name: "Air conditioner (window)", watts: 1000, hours: 8 },
  { name: "Central AC", watts: 3500, hours: 8 },
  { name: "Space heater", watts: 1500, hours: 6 },
  { name: "Electric water heater", watts: 4000, hours: 3 },
  { name: "Clothes dryer", watts: 3000, hours: 1 },
  { name: "Washing machine", watts: 500, hours: 1 },
  { name: "Dishwasher", watts: 1800, hours: 1 },
  { name: "Oven", watts: 2400, hours: 1 },
  { name: "Microwave", watts: 1000, hours: 0.5 },
  { name: "Desktop PC", watts: 200, hours: 8 },
  { name: "Laptop", watts: 50, hours: 8 },
  { name: "TV (55\" LED)", watts: 90, hours: 5 },
  { name: "LED bulb", watts: 9, hours: 6 },
  { name: "Incandescent bulb", watts: 60, hours: 6 },
  { name: "Ceiling fan", watts: 70, hours: 8 },
  { name: "Electric vehicle charger (L2)", watts: 7200, hours: 3 },
];

/* ---------------------------------------------------------------- cooking */

/**
 * Ingredient densities in grams per US cup.
 *
 * This is why a volume converter cannot answer "how many grams in a cup" — a
 * cup of flour is 120 g and a cup of honey is 340 g. The number depends
 * entirely on what is in the cup.
 */
export interface Ingredient {
  id: string;
  name: string;
  gramsPerCup: number;
}

export const INGREDIENTS: Ingredient[] = [
  { id: "water", name: "Water", gramsPerCup: 236.6 },
  { id: "milk", name: "Milk", gramsPerCup: 244 },
  { id: "flour-ap", name: "Flour, all-purpose (spooned)", gramsPerCup: 120 },
  { id: "flour-bread", name: "Flour, bread", gramsPerCup: 127 },
  { id: "flour-cake", name: "Flour, cake", gramsPerCup: 114 },
  { id: "flour-whole", name: "Flour, whole wheat", gramsPerCup: 120 },
  { id: "sugar-white", name: "Sugar, granulated", gramsPerCup: 200 },
  { id: "sugar-brown", name: "Sugar, brown (packed)", gramsPerCup: 213 },
  { id: "sugar-powdered", name: "Sugar, powdered", gramsPerCup: 120 },
  { id: "butter", name: "Butter", gramsPerCup: 227 },
  { id: "oil", name: "Oil, vegetable", gramsPerCup: 218 },
  { id: "honey", name: "Honey", gramsPerCup: 340 },
  { id: "maple", name: "Maple syrup", gramsPerCup: 322 },
  { id: "cocoa", name: "Cocoa powder", gramsPerCup: 85 },
  { id: "rice", name: "Rice, uncooked white", gramsPerCup: 185 },
  { id: "oats", name: "Oats, rolled", gramsPerCup: 90 },
  { id: "salt", name: "Salt, table", gramsPerCup: 292 },
  { id: "cornstarch", name: "Cornstarch", gramsPerCup: 128 },
  { id: "yogurt", name: "Yogurt", gramsPerCup: 245 },
  { id: "cream", name: "Heavy cream", gramsPerCup: 238 },
  { id: "peanut-butter", name: "Peanut butter", gramsPerCup: 258 },
  { id: "choc-chips", name: "Chocolate chips", gramsPerCup: 170 },
  { id: "nuts", name: "Nuts, chopped", gramsPerCup: 120 },
  { id: "breadcrumbs", name: "Breadcrumbs, dry", gramsPerCup: 108 },
];

/** Volume measures in millilitres, US customary. */
export const VOLUME_MEASURES: { id: string; name: string; ml: number }[] = [
  { id: "tsp", name: "teaspoon", ml: 4.928921593750 },
  { id: "tbsp", name: "tablespoon", ml: 14.78676478125 },
  { id: "floz", name: "fluid ounce", ml: 29.5735295625 },
  { id: "cup", name: "cup", ml: 236.5882365 },
  { id: "pint", name: "pint", ml: 473.176473 },
  { id: "quart", name: "quart", ml: 946.352946 },
  { id: "gallon", name: "gallon", ml: 3785.411784 },
  { id: "ml", name: "millilitre", ml: 1 },
  { id: "l", name: "litre", ml: 1000 },
];

/**
 * Fractions cooks actually use, for turning 0.6667 cups into "⅔ cup".
 *
 * A recipe scaled by 1.5 gives numbers no measuring cup has. Rounding to the
 * nearest usable fraction is the whole point — nobody owns a 0.417 cup.
 */
const FRACTIONS: [number, string][] = [
  [0, ""], [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [3 / 8, "⅜"],
  [1 / 2, "½"], [5 / 8, "⅝"], [2 / 3, "⅔"], [3 / 4, "¾"], [7 / 8, "⅞"], [1, ""],
];

/** Formats a quantity the way a recipe would write it: "1 ½", "⅔", "2". */
export function formatKitchen(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  // Above a few units the fraction stops helping — 12.3 cups is just 12⅓.
  if (value >= 100) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const whole = Math.floor(value);
  const remainder = value - whole;

  let closest = FRACTIONS[0];
  for (const entry of FRACTIONS) {
    if (Math.abs(entry[0] - remainder) < Math.abs(closest[0] - remainder)) closest = entry;
  }

  // Rounding up to a full unit has to carry into the whole number.
  const carried = closest[0] === 1 ? whole + 1 : whole;
  const fraction = closest[0] === 1 ? "" : closest[1];

  if (carried === 0 && !fraction) return "0";
  if (!fraction) return String(carried);
  if (carried === 0) return fraction;
  return `${carried} ${fraction}`;
}

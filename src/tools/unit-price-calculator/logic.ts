export interface Item {
  id: string;
  label: string;
  price: string;
  size: string;
  unit: string;
}

export interface Comparison {
  id: string;
  label: string;
  /** Price per base unit — per gram, per millilitre or per item. */
  perBase: number;
  /** The same figure in a unit people can read: per kg, per litre, per item. */
  display: string;
  valid: boolean;
  best: boolean;
  /** How much more than the best option, as a percentage. */
  premium: number;
}

/**
 * Units grouped by what they measure, with their size in a common base.
 *
 * Comparing across systems is the whole point: a 750 g box and a 24 oz box are
 * not comparable by eye, and the shelf label rarely uses the same unit for
 * both.
 */
export const UNITS: { id: string; label: string; kind: "mass" | "volume" | "count"; base: number }[] = [
  { id: "g", label: "grams", kind: "mass", base: 1 },
  { id: "kg", label: "kilograms", kind: "mass", base: 1000 },
  { id: "oz", label: "ounces", kind: "mass", base: 28.349523125 },
  { id: "lb", label: "pounds", kind: "mass", base: 453.59237 },
  { id: "ml", label: "millilitres", kind: "volume", base: 1 },
  { id: "l", label: "litres", kind: "volume", base: 1000 },
  { id: "floz", label: "fluid ounces", kind: "volume", base: 29.5735295625 },
  { id: "gal", label: "gallons (US)", kind: "volume", base: 3785.411784 },
  { id: "ea", label: "items", kind: "count", base: 1 },
];

export function compare(items: Item[]): Comparison[] {
  const rows = items.map((item) => {
    const price = Number(item.price);
    const size = Number(item.size);
    const unit = UNITS.find((entry) => entry.id === item.unit) ?? UNITS[0];

    const valid = price > 0 && size > 0;
    const perBase = valid ? price / (size * unit.base) : Infinity;

    // Shown per kilogram, per litre or per item — a price per gram is all zeros.
    const multiplier = unit.kind === "count" ? 1 : 1000;
    const suffix = unit.kind === "mass" ? "kg" : unit.kind === "volume" ? "L" : "item";

    return {
      id: item.id,
      label: item.label,
      perBase,
      display: valid
        ? `${(perBase * multiplier).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })} / ${suffix}`
        : "—",
      valid,
      best: false,
      premium: 0,
    };
  });

  const cheapest = Math.min(...rows.filter((row) => row.valid).map((row) => row.perBase));
  if (!Number.isFinite(cheapest)) return rows;

  for (const row of rows) {
    if (!row.valid) continue;
    row.best = row.perBase === cheapest;
    row.premium = ((row.perBase - cheapest) / cheapest) * 100;
  }

  return rows;
}

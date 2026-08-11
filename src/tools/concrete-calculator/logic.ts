export type Shape = "slab" | "footing" | "column" | "round";

export interface ConcreteEstimate {
  cubicFeet: number;
  cubicYards: number;
  cubicMetres: number;
  yardsToOrder: number;
  bags60: number;
  bags80: number;
  cost: number | null;
}

/**
 * Yield per bag, in cubic feet — from the bag, not from the dry weight.
 *
 * A 60 lb bag makes about 0.45 ft³ and an 80 lb bag about 0.60 ft³ of set
 * concrete. Dividing weight by density gives a different, wrong answer, because
 * the mix takes up water.
 */
const YIELD_60LB = 0.45;
const YIELD_80LB = 0.6;

/**
 * Volume of a concrete pour.
 *
 * Everything is computed in cubic feet then converted, because that is the unit
 * the dimensions come in — 27 cubic feet to the cubic yard.
 */
export function estimate(
  shape: Shape,
  lengthFt: number,
  widthFt: number,
  thicknessIn: number,
  diameterFt: number,
  heightFt: number,
  quantity: number,
  wastePercent: number,
  pricePerYard: number,
): ConcreteEstimate {
  const count = Math.max(1, quantity);
  let cubicFeet = 0;

  if (shape === "slab" || shape === "footing") {
    cubicFeet = Math.max(0, lengthFt) * Math.max(0, widthFt) * (Math.max(0, thicknessIn) / 12);
  } else if (shape === "column") {
    const radius = Math.max(0, diameterFt) / 2;
    cubicFeet = Math.PI * radius * radius * Math.max(0, heightFt);
  } else {
    const radius = Math.max(0, diameterFt) / 2;
    cubicFeet = Math.PI * radius * radius * (Math.max(0, thicknessIn) / 12);
  }

  cubicFeet *= count;
  const withWaste = cubicFeet * (1 + Math.max(0, wastePercent) / 100);

  const cubicYards = withWaste / 27;

  return {
    cubicFeet: withWaste,
    cubicYards,
    cubicMetres: withWaste * 0.028316846592,
    // Ready-mix is sold in quarter-yard steps and you cannot order a shortfall.
    yardsToOrder: Math.ceil(cubicYards * 4) / 4,
    bags60: Math.ceil(withWaste / YIELD_60LB),
    bags80: Math.ceil(withWaste / YIELD_80LB),
    cost: pricePerYard > 0 ? Math.ceil(cubicYards * 4) / 4 * pricePerYard : null,
  };
}

export const SHAPES: { id: Shape; label: string; note: string }[] = [
  { id: "slab", label: "Slab or patio", note: "Length × width × thickness." },
  { id: "footing", label: "Footing or strip", note: "A long, narrow slab — width is the trench width." },
  { id: "column", label: "Round column", note: "Diameter and height, for a post or pier." },
  { id: "round", label: "Round pad", note: "A circular slab — diameter and thickness." },
];

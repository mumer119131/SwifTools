import { INGREDIENTS, VOLUME_MEASURES } from "@/lib/home";

export interface ConversionRow {
  id: string;
  label: string;
  value: number;
  /** Formatted for a recipe, with fractions where they help. */
  display: string;
}

export const WEIGHT_MEASURES = [
  { id: "g", name: "grams", grams: 1 },
  { id: "kg", name: "kilograms", grams: 1000 },
  { id: "oz", name: "ounces", grams: 28.349523125 },
  { id: "lb", name: "pounds", grams: 453.59237 },
];

/** Every unit that can be typed into the amount field. */
export const ALL_MEASURES = [
  ...VOLUME_MEASURES.map((measure) => ({ id: measure.id, name: measure.name, kind: "volume" as const })),
  ...WEIGHT_MEASURES.map((measure) => ({ id: measure.id, name: measure.name, kind: "weight" as const })),
];

/**
 * Converts a cooking measurement into every other measurement.
 *
 * Volume and weight are only interchangeable once you know what is being
 * measured: a cup of flour is 120 g and a cup of honey is 340 g. That density
 * is the bridge, and it is why this cannot be done by a generic unit converter.
 */
export function convert(
  amount: number,
  fromId: string,
  ingredientId: string,
): { volumeMl: number; grams: number } | null {
  const ingredient = INGREDIENTS.find((entry) => entry.id === ingredientId);
  if (!ingredient || !(amount > 0)) return null;

  const gramsPerMl = ingredient.gramsPerCup / 236.5882365;

  const volumeMeasure = VOLUME_MEASURES.find((measure) => measure.id === fromId);
  if (volumeMeasure) {
    const volumeMl = amount * volumeMeasure.ml;
    return { volumeMl, grams: volumeMl * gramsPerMl };
  }

  const weightMeasure = WEIGHT_MEASURES.find((measure) => measure.id === fromId);
  if (weightMeasure) {
    const grams = amount * weightMeasure.grams;
    return { grams, volumeMl: gramsPerMl > 0 ? grams / gramsPerMl : 0 };
  }

  return null;
}

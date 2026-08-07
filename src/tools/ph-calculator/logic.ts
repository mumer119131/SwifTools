export type PhField = "ph" | "poh" | "h" | "oh";

export interface PhValues {
  ph: number;
  poh: number;
  h: number;
  oh: number;
}

/**
 * The water dissociation constant at 25 °C. pH + pOH = 14 only holds at this
 * temperature — pKw falls to about 13.0 at 100 °C, which is why neutral water
 * is not always pH 7.
 */
const PKW = 14;

export function solvePh(field: PhField, value: number): PhValues | null {
  if (!Number.isFinite(value)) return null;

  let ph: number;

  if (field === "ph") ph = value;
  else if (field === "poh") ph = PKW - value;
  else if (field === "h") {
    if (!(value > 0)) return null;
    ph = -Math.log10(value);
  } else {
    if (!(value > 0)) return null;
    ph = PKW + Math.log10(value);
  }

  if (!Number.isFinite(ph)) return null;

  return {
    ph,
    poh: PKW - ph,
    h: 10 ** -ph,
    oh: 10 ** -(PKW - ph),
  };
}

export function classify(ph: number): { label: string; tone: "acid" | "neutral" | "base" } {
  if (ph < 6.5) return { label: "Acidic", tone: "acid" };
  if (ph > 7.5) return { label: "Basic (alkaline)", tone: "base" };
  return { label: "Near neutral", tone: "neutral" };
}

/** Everyday reference points, for a sense of scale. */
export const REFERENCES: { ph: number; name: string }[] = [
  { ph: 0, name: "Battery acid" },
  { ph: 1.5, name: "Stomach acid" },
  { ph: 2.4, name: "Lemon juice" },
  { ph: 3.0, name: "Vinegar" },
  { ph: 4.5, name: "Tomato juice" },
  { ph: 5.5, name: "Black coffee" },
  { ph: 6.5, name: "Milk" },
  { ph: 7.0, name: "Pure water" },
  { ph: 7.4, name: "Human blood" },
  { ph: 8.3, name: "Seawater" },
  { ph: 9.5, name: "Baking soda" },
  { ph: 11.0, name: "Ammonia" },
  { ph: 12.5, name: "Bleach" },
  { ph: 14, name: "Drain cleaner" },
];

export function nearestReference(ph: number): string {
  return REFERENCES.reduce((closest, entry) =>
    Math.abs(entry.ph - ph) < Math.abs(closest.ph - ph) ? entry : closest,
  ).name;
}

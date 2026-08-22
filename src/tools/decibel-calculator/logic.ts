/**
 * Decibels.
 *
 * The confusion that dominates: a decibel is a ratio, not a quantity, and the
 * formula depends on whether you are comparing power or amplitude. Power uses
 * 10·log₁₀, amplitude uses 20·log₁₀ — so the same ratio gives two different
 * decibel figures, and using the wrong one is out by a factor of two.
 *
 * The reason they agree physically is that power goes as amplitude squared, and
 * the square becomes a factor of two once inside a logarithm.
 */

export type Quantity = "power" | "amplitude";

export const QUANTITY_LABELS: Record<Quantity, string> = {
  power: "Power (watts, intensity)",
  amplitude: "Amplitude (volts, pressure)",
};

/** The multiplier in front of the logarithm. */
export function factor(quantity: Quantity): 10 | 20 {
  return quantity === "power" ? 10 : 20;
}

export function ratioToDecibels(ratio: number, quantity: Quantity): number | null {
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  return factor(quantity) * Math.log10(ratio);
}

export function decibelsToRatio(decibels: number, quantity: Quantity): number | null {
  if (!Number.isFinite(decibels)) return null;
  return 10 ** (decibels / factor(quantity));
}

/**
 * Adding two sound sources.
 *
 * Not addition of decibels — two 60 dB sources give 63 dB, not 120. The powers
 * add and the logarithm is taken afterwards, so doubling the power adds about
 * 3 dB regardless of where you started.
 */
export function combine(levels: number[]): number | null {
  const usable = levels.filter((value) => Number.isFinite(value));
  if (usable.length === 0) return null;

  const totalPower = usable.reduce((sum, level) => sum + 10 ** (level / 10), 0);
  return 10 * Math.log10(totalPower);
}

/**
 * How sound level falls with distance.
 *
 * A point source spreads over a sphere whose area grows with the square of the
 * radius, so intensity falls as 1/r² — which is 6 dB lost per doubling of
 * distance.
 */
export function atDistance(levelAtReference: number, referenceMetres: number, metres: number): number | null {
  if (!(referenceMetres > 0) || !(metres > 0)) return null;
  return levelAtReference - 20 * Math.log10(metres / referenceMetres);
}

export interface Landmark {
  db: number;
  label: string;
  note?: string;
}

/** Everyday sound pressure levels, which make the scale mean something. */
export const LANDMARKS: Landmark[] = [
  { db: 0, label: "Threshold of hearing", note: "The reference point the scale is built on" },
  { db: 20, label: "Rustling leaves" },
  { db: 30, label: "Whisper" },
  { db: 40, label: "Quiet library" },
  { db: 60, label: "Normal conversation" },
  { db: 70, label: "Vacuum cleaner" },
  { db: 85, label: "Heavy traffic", note: "Prolonged exposure above here risks hearing damage" },
  { db: 100, label: "Nightclub, chainsaw", note: "Damage in about 15 minutes" },
  { db: 110, label: "Rock concert front row" },
  { db: 120, label: "Threshold of pain" },
  { db: 140, label: "Jet engine at 30 m", note: "Immediate damage" },
];

/** The rules of thumb worth knowing, rather than deriving each time. */
export const RULES = [
  { change: "+3 dB", meaning: "Twice the power. Two identical sources together." },
  { change: "+6 dB", meaning: "Twice the amplitude, or half the distance from a point source." },
  { change: "+10 dB", meaning: "Ten times the power — and roughly twice as loud to the ear." },
  { change: "+20 dB", meaning: "Ten times the amplitude, a hundred times the power." },
];

export function nearestLandmark(db: number): Landmark {
  return LANDMARKS.reduce((best, entry) =>
    Math.abs(entry.db - db) < Math.abs(best.db - db) ? entry : best,
  );
}

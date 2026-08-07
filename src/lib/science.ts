/**
 * Shared constants and reference data for the science and engineering tools.
 *
 * Values follow CODATA 2018 and the IUPAC 2021 standard atomic weights. Where a
 * quantity is exact by definition — the speed of light, the metre-derived SI
 * units — it is written exactly rather than rounded.
 */

/** Metric prefixes, used by the electronics tools for input and display. */
export const PREFIXES: { symbol: string; label: string; factor: number }[] = [
  { symbol: "p", label: "pico", factor: 1e-12 },
  { symbol: "n", label: "nano", factor: 1e-9 },
  { symbol: "µ", label: "micro", factor: 1e-6 },
  { symbol: "m", label: "milli", factor: 1e-3 },
  { symbol: "", label: "", factor: 1 },
  { symbol: "k", label: "kilo", factor: 1e3 },
  { symbol: "M", label: "mega", factor: 1e6 },
  { symbol: "G", label: "giga", factor: 1e9 },
];

/**
 * Formats with an engineering prefix — 4700 Ω becomes 4.7 kΩ.
 *
 * Engineering notation steps in thousands rather than the arbitrary exponents
 * scientific notation produces, which is how component values are actually
 * written and read.
 */
export function formatEngineering(value: number, unit: string, decimals = 3): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return `0 ${unit}`;

  const magnitude = Math.abs(value);
  const prefix =
    [...PREFIXES].reverse().find((entry) => magnitude >= entry.factor) ?? PREFIXES[0];

  const scaled = value / prefix.factor;
  const rounded = Number(scaled.toPrecision(decimals + 1));

  return `${rounded.toLocaleString("en-US", { maximumFractionDigits: decimals })} ${prefix.symbol}${unit}`;
}

/** A plain number, trimmed to a sensible precision without exponent soup. */
export function formatNumeric(value: number, significant = 6): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e12 || magnitude < 1e-6) return value.toExponential(4);

  return Number(value.toPrecision(significant)).toLocaleString("en-US", {
    maximumFractionDigits: 10,
  });
}

/* ------------------------------------------------------------- resistors */

export interface BandColor {
  name: string;
  hex: string;
  /** Digit value, or null for colours that only encode a multiplier. */
  digit: number | null;
  multiplier: number;
  /** Tolerance in percent, or null when the colour cannot be a tolerance band. */
  tolerance: number | null;
  /** Parts per million per °C, for the sixth band. */
  tempCoefficient: number | null;
}

export const BAND_COLORS: BandColor[] = [
  { name: "Black", hex: "#0f0f10", digit: 0, multiplier: 1, tolerance: null, tempCoefficient: 250 },
  { name: "Brown", hex: "#8b4513", digit: 1, multiplier: 10, tolerance: 1, tempCoefficient: 100 },
  { name: "Red", hex: "#d92b2b", digit: 2, multiplier: 100, tolerance: 2, tempCoefficient: 50 },
  { name: "Orange", hex: "#f07f13", digit: 3, multiplier: 1e3, tolerance: null, tempCoefficient: 15 },
  { name: "Yellow", hex: "#f2c313", digit: 4, multiplier: 1e4, tolerance: null, tempCoefficient: 25 },
  { name: "Green", hex: "#1f9e55", digit: 5, multiplier: 1e5, tolerance: 0.5, tempCoefficient: 20 },
  { name: "Blue", hex: "#2f6fd0", digit: 6, multiplier: 1e6, tolerance: 0.25, tempCoefficient: 10 },
  { name: "Violet", hex: "#7d4fc9", digit: 7, multiplier: 1e7, tolerance: 0.1, tempCoefficient: 5 },
  { name: "Grey", hex: "#8a8f98", digit: 8, multiplier: 1e8, tolerance: 0.05, tempCoefficient: 1 },
  { name: "White", hex: "#f2f2f3", digit: 9, multiplier: 1e9, tolerance: null, tempCoefficient: null },
  { name: "Gold", hex: "#c9a227", digit: null, multiplier: 0.1, tolerance: 5, tempCoefficient: null },
  { name: "Silver", hex: "#b4b8bd", digit: null, multiplier: 0.01, tolerance: 10, tempCoefficient: null },
];

export function colorByName(name: string): BandColor {
  return BAND_COLORS.find((entry) => entry.name === name) ?? BAND_COLORS[0];
}

/** The E24 series — the standard preferred values at 5% tolerance. */
export const E24_SERIES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

/** Nearest standard resistor value at or above the calculated minimum. */
export function nearestE24(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;

  const decade = Math.floor(Math.log10(value));
  for (let step = decade; step <= decade + 1; step += 1) {
    for (const base of E24_SERIES) {
      const candidate = base * 10 ** step;
      if (candidate >= value - 1e-9) return Number(candidate.toPrecision(3));
    }
  }
  return value;
}

/* ------------------------------------------------------------- chemistry */

/**
 * Standard atomic weights, IUPAC 2021. Elements with no stable isotope carry
 * the mass number of their most stable one, which is the convention.
 */
export const ATOMIC_WEIGHTS: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.085,
  P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956,
  Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933,
  Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.63, As: 74.922,
  Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906,
  Zr: 91.224, Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42,
  Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.6,
  I: 126.9, Xe: 131.29, Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12,
  Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25,
  Tb: 158.93, Dy: 162.5, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05,
  Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23,
  Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2,
  Bi: 208.98, Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04,
  Pa: 231.04, U: 238.03, Np: 237, Pu: 244, Am: 243, Cm: 247,
};

export const ELEMENT_NAMES: Record<string, string> = {
  H: "Hydrogen", He: "Helium", Li: "Lithium", Be: "Beryllium", B: "Boron",
  C: "Carbon", N: "Nitrogen", O: "Oxygen", F: "Fluorine", Ne: "Neon",
  Na: "Sodium", Mg: "Magnesium", Al: "Aluminium", Si: "Silicon", P: "Phosphorus",
  S: "Sulfur", Cl: "Chlorine", Ar: "Argon", K: "Potassium", Ca: "Calcium",
  Fe: "Iron", Cu: "Copper", Zn: "Zinc", Ag: "Silver", Sn: "Tin", I: "Iodine",
  Au: "Gold", Hg: "Mercury", Pb: "Lead", U: "Uranium",
};

/** Avogadro's number — exact by the 2019 SI redefinition. */
export const AVOGADRO = 6.02214076e23;

/* -------------------------------------------------------------- constants */

export const CONSTANTS = {
  /** Exact by definition of the metre. */
  speedOfLight: 299_792_458,
  /** Standard gravity, exact by definition. */
  gravity: 9.80665,
  /** Exact since the 2019 SI redefinition. */
  planck: 6.62607015e-34,
  gasConstant: 8.314462618,
} as const;

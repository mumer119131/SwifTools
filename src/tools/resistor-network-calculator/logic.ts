/**
 * Resistors in series and in parallel.
 *
 * Two rules, and the parallel one is where the intuition fails: the total is
 * always *smaller than the smallest* resistor in the set. Adding another path
 * for current can only make it easier to flow, never harder — which is obvious
 * once said and consistently surprising the first time.
 */

export type Arrangement = "series" | "parallel";

export interface NetworkResult {
  total: number;
  /** The nearest value actually manufactured, from the E24 series. */
  nearestStandard: number;
  count: number;
  /** Current through the whole network at a given voltage. */
  current: number | null;
  /** Power dissipated by the network. */
  power: number | null;
  /** Per-resistor share, which is what decides the power rating you need. */
  shares: { value: number; voltage: number | null; current: number | null; power: number | null }[];
}

/**
 * Series: the resistances add.
 *
 * The same current flows through every resistor, and the voltage divides
 * between them in proportion to resistance.
 */
export function series(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

/**
 * Parallel: the reciprocals add.
 *
 * 1/R = 1/R₁ + 1/R₂ + … A zero-ohm resistor short-circuits the network, which
 * is a real answer rather than an error — the total genuinely is zero.
 */
export function parallel(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.some((value) => value === 0)) return 0;

  const reciprocal = values.reduce((sum, value) => sum + 1 / value, 0);
  return reciprocal === 0 ? 0 : 1 / reciprocal;
}

/** The E24 series — the values resistors are actually made in. */
const E24 = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

/**
 * The closest manufactured value.
 *
 * Compared in log space rather than linearly, because resistor series are
 * logarithmic — 2.2k is closer to 2.0k than to 2.4k on the scale that matters,
 * even though the arithmetic differences are equal.
 */
export function nearestStandard(value: number): number {
  if (!(value > 0)) return 0;

  const decade = Math.floor(Math.log10(value));
  let best = 0;
  let bestDistance = Infinity;

  for (const offset of [-1, 0, 1]) {
    const scale = 10 ** (decade + offset);
    for (const base of E24) {
      const candidate = base * scale;
      const distance = Math.abs(Math.log10(candidate) - Math.log10(value));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    }
  }

  // Round away the floating-point dust that 10^n introduces.
  return Number(best.toPrecision(3));
}

export function calculate(
  values: number[],
  arrangement: Arrangement,
  voltage: number | null,
): NetworkResult | null {
  const usable = values.filter((value) => Number.isFinite(value) && value >= 0);
  if (usable.length === 0) return null;
  if (arrangement === "series" && usable.some((value) => value < 0)) return null;

  const total = arrangement === "series" ? series(usable) : parallel(usable);

  const current = voltage !== null && total > 0 ? voltage / total : null;
  const power = voltage !== null && total > 0 ? (voltage * voltage) / total : null;

  const shares = usable.map((value) => {
    if (voltage === null || total <= 0) {
      return { value, voltage: null, current: null, power: null };
    }

    if (arrangement === "series") {
      // Same current everywhere; voltage splits in proportion to resistance.
      const i = voltage / total;
      const v = i * value;
      return { value, voltage: v, current: i, power: v * i };
    }

    // Same voltage across everything; current splits inversely.
    const i = value > 0 ? voltage / value : 0;
    return { value, voltage, current: i, power: voltage * i };
  });

  return {
    total,
    nearestStandard: nearestStandard(total),
    count: usable.length,
    current,
    power,
    shares,
  };
}

/** Formats an ohm value the way component markings do. */
export function formatOhms(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toPrecision(4))} MΩ`;
  if (value >= 1_000) return `${Number((value / 1_000).toPrecision(4))} kΩ`;
  return `${Number(value.toPrecision(4))} Ω`;
}

/** Parses "4k7", "2.2k", "1M", "470" — the forms people write on schematics. */
export function parseOhms(input: string): number | null {
  const text = input.trim().toLowerCase().replace(/ohms?|Ω/g, "").trim();
  if (text === "") return null;

  // The "4k7" convention, where the multiplier stands in for the decimal point.
  const infix = text.match(/^(\d+)(k|m|r)(\d+)$/);
  if (infix) {
    const scale = infix[2] === "k" ? 1_000 : infix[2] === "m" ? 1_000_000 : 1;
    return Number(`${infix[1]}.${infix[3]}`) * scale;
  }

  const suffixed = text.match(/^(\d*\.?\d+)\s*(k|m|r)?$/);
  if (!suffixed) return null;

  const value = Number(suffixed[1]);
  if (!Number.isFinite(value) || value < 0) return null;

  const scale = suffixed[2] === "k" ? 1_000 : suffixed[2] === "m" ? 1_000_000 : 1;
  return value * scale;
}

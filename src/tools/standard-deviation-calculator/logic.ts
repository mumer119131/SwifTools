/**
 * Descriptive statistics for a list of numbers.
 *
 * The distinction that matters is population against sample. A population
 * standard deviation divides by n; a sample divides by n − 1, because a sample
 * mean sits closer to its own data than the true mean does, which biases the
 * spread downward. Dividing by the smaller number corrects for it — Bessel's
 * correction — and choosing the wrong one is the commonest mistake in an
 * introductory statistics course.
 */

export type Kind = "sample" | "population";

export interface Stats {
  values: number[];
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  /** Standard deviation as a percentage of the mean. */
  coefficientOfVariation: number | null;
  /** Quartiles and the interquartile range. */
  q1: number;
  q3: number;
  iqr: number;
  /** Points more than 1.5 IQR outside the quartiles. */
  outliers: number[];
  standardError: number;
}

/** Accepts commas, spaces, tabs and newlines — people paste from anywhere. */
export function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token !== "")
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

/** Linear interpolation between order statistics, matching most textbooks. */
function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];

  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (position - lower) * (sorted[upper] - sorted[lower]);
}

export function calculate(values: number[], kind: Kind): Stats | null {
  const count = values.length;
  if (count === 0) return null;
  // A sample standard deviation of one value would divide by zero — and is
  // meaningless in any case, since a single point has no spread.
  if (kind === "sample" && count < 2) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / count;

  const squaredDeviations = values.reduce((total, value) => total + (value - mean) ** 2, 0);
  const divisor = kind === "sample" ? count - 1 : count;
  const variance = squaredDeviations / divisor;
  const standardDeviation = Math.sqrt(variance);

  const median = quantile(sorted, 0.5);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  // Frequency, for the mode. Several values can tie.
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const highest = Math.max(...counts.values());
  const mode = highest > 1
    ? [...counts.entries()].filter(([, n]) => n === highest).map(([value]) => value).sort((a, b) => a - b)
    : [];

  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;

  return {
    values,
    count,
    sum,
    mean,
    median,
    mode,
    min: sorted[0],
    max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0],
    variance,
    standardDeviation,
    coefficientOfVariation: mean !== 0 ? (standardDeviation / Math.abs(mean)) * 100 : null,
    q1,
    q3,
    iqr,
    outliers: sorted.filter((value) => value < lowFence || value > highFence),
    standardError: standardDeviation / Math.sqrt(count),
  };
}

/** How many values fall within one, two and three standard deviations. */
export function distribution(stats: Stats): { sigma: number; count: number; share: number; expected: number }[] {
  return [1, 2, 3].map((sigma) => {
    const within = stats.values.filter(
      (value) => Math.abs(value - stats.mean) <= sigma * stats.standardDeviation,
    ).length;
    return {
      sigma,
      count: within,
      share: (within / stats.count) * 100,
      // What a normal distribution would give, for comparison.
      expected: [68.27, 95.45, 99.73][sigma - 1],
    };
  });
}

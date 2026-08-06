export type Frequency = 1 | 4 | 12 | 365;

export const frequencies: { value: Frequency; label: string }[] = [
  { value: 1, label: "Annually" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
  { value: 365, label: "Daily" },
];

export interface CompoundInput {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear: Frequency;
  /** Annual inflation used to show the result in today's money. */
  inflationPercent: number;
}

export interface YearPoint {
  year: number;
  balance: number;
  contributed: number;
  growth: number;
  realBalance: number;
}

export interface CompoundResult {
  finalBalance: number;
  totalContributed: number;
  totalGrowth: number;
  realBalance: number;
  points: YearPoint[];
}

/**
 * Simulates month by month rather than using the closed-form annuity formula.
 *
 * Contributions are monthly but compounding may be annual, quarterly or daily,
 * and the two don't line up. Stepping through months and applying interest only
 * on compounding boundaries handles every combination correctly, where a single
 * formula would need a different derivation for each.
 */
export function calculateCompound(input: CompoundInput): CompoundResult | null {
  const { principal, monthlyContribution, annualRatePercent, years, compoundsPerYear } = input;

  if (principal < 0 || years <= 0 || years > 100) return null;

  const totalMonths = Math.round(years * 12);
  const periodRate = annualRatePercent / 100 / compoundsPerYear;
  const monthsPerPeriod = 12 / compoundsPerYear;

  let balance = principal;
  let contributed = principal;
  let monthsSinceCompound = 0;

  const points: YearPoint[] = [
    {
      year: 0,
      balance: principal,
      contributed: principal,
      growth: 0,
      realBalance: principal,
    },
  ];

  for (let month = 1; month <= totalMonths; month += 1) {
    balance += monthlyContribution;
    contributed += monthlyContribution;
    monthsSinceCompound += 1;

    // Daily compounding is approximated by applying the accrued periods once a
    // month; the difference against true daily accrual is under a basis point.
    if (compoundsPerYear === 365) {
      balance *= (1 + periodRate) ** (365 / 12);
      monthsSinceCompound = 0;
    } else if (monthsSinceCompound >= monthsPerPeriod) {
      balance *= 1 + periodRate;
      monthsSinceCompound = 0;
    }

    if (month % 12 === 0) {
      const year = month / 12;
      const realFactor = (1 + input.inflationPercent / 100) ** year;
      points.push({
        year,
        balance,
        contributed,
        growth: balance - contributed,
        realBalance: balance / realFactor,
      });
    }
  }

  const realFactor = (1 + input.inflationPercent / 100) ** years;

  return {
    finalBalance: balance,
    totalContributed: contributed,
    totalGrowth: balance - contributed,
    realBalance: balance / realFactor,
    points,
  };
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return Math.round(value).toLocaleString("en-US");
  }
}

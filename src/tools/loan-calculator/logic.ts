export interface LoanInput {
  principal: number;
  annualRatePercent: number;
  years: number;
  /** Optional extra paid against the principal each month. */
  extraMonthly: number;
}

export interface AmortisationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: AmortisationRow[];
  /** Months saved versus the scheduled term when overpaying. */
  monthsSaved: number;
  interestSaved: number;
}

/**
 * Standard amortising-loan payment:
 *
 *   P = L · r / (1 − (1 + r)^−n)
 *
 * where r is the monthly rate and n the number of payments. A zero rate would
 * divide by zero, so it degrades to a straight division.
 */
export function monthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

export function calculateLoan(input: LoanInput): LoanResult | null {
  const { principal, annualRatePercent, years, extraMonthly } = input;

  if (!(principal > 0) || !(years > 0) || annualRatePercent < 0) return null;

  const months = Math.round(years * 12);
  const monthlyRate = annualRatePercent / 100 / 12;
  const scheduled = monthlyPayment(principal, monthlyRate, months);

  const schedule: AmortisationRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  // Cap the loop so a rate/payment combination that never amortises cannot spin.
  const maxMonths = months + 1200;

  for (let month = 1; month <= maxMonths && balance > 0.005; month += 1) {
    const interest = balance * monthlyRate;
    // The final payment is only ever what is left owing.
    const payment = Math.min(scheduled + extraMonthly, balance + interest);
    const principalPart = payment - interest;

    if (principalPart <= 0) break; // Payment does not cover interest — never repays.

    balance -= principalPart;
    totalInterest += interest;

    schedule.push({
      month,
      payment,
      interest,
      principal: principalPart,
      balance: Math.max(0, balance),
    });
  }

  const baselineInterest = scheduled * months - principal;

  return {
    monthlyPayment: scheduled,
    totalInterest,
    totalPaid: principal + totalInterest,
    schedule,
    monthsSaved: extraMonthly > 0 ? Math.max(0, months - schedule.length) : 0,
    interestSaved: extraMonthly > 0 ? Math.max(0, baselineInterest - totalInterest) : 0,
  };
}

/** Groups the schedule by year for a readable summary. */
export interface YearSummary {
  year: number;
  interest: number;
  principal: number;
  balance: number;
}

export function summariseByYear(schedule: AmortisationRow[]): YearSummary[] {
  const years: YearSummary[] = [];

  for (const row of schedule) {
    const yearIndex = Math.floor((row.month - 1) / 12);
    years[yearIndex] ??= { year: yearIndex + 1, interest: 0, principal: 0, balance: 0 };
    years[yearIndex].interest += row.interest;
    years[yearIndex].principal += row.principal;
    years[yearIndex].balance = row.balance;
  }

  return years;
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

export const currencies = ["USD", "EUR", "GBP", "INR", "PKR", "AUD", "CAD", "JPY"] as const;

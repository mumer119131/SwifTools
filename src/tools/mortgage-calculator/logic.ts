/**
 * Mortgage arithmetic.
 *
 * Deliberately different from the loan calculator, which answers "what is the
 * payment on this amount". A mortgage question is usually three others: how
 * much am I actually borrowing after the deposit, what does the house cost me
 * per month once tax and insurance are counted, and what happens if I overpay.
 * The last is the one people search for and the one a plain amortisation table
 * cannot answer.
 */

export interface MortgageInput {
  price: number;
  deposit: number;
  /** Annual nominal rate as a percentage, e.g. 4.5. */
  annualRate: number;
  years: number;
  /** Recurring costs, annual, that are not part of the loan. */
  annualTax: number;
  annualInsurance: number;
  monthlyOther: number;
  /** Extra paid against the principal each month. */
  monthlyOverpayment: number;
}

export interface MortgageResult {
  principal: number;
  /** Loan as a percentage of the price. */
  ltv: number;
  monthlyPayment: number;
  /** Payment plus tax, insurance and anything else. */
  monthlyTotal: number;
  totalInterest: number;
  totalPaid: number;
  /** With the overpayment applied. Equal to the base figures when it is zero. */
  overpaid: {
    monthsToClear: number;
    monthsSaved: number;
    interestSaved: number;
    totalInterest: number;
  } | null;
}

/** The standard annuity payment. Handles a zero rate, where it is just division. */
export function monthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;

  const growth = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * growth) / (growth - 1);
}

/**
 * Runs the schedule month by month with an optional overpayment.
 *
 * Iterative rather than closed-form: the payoff date with overpayments has no
 * clean formula, and a loop over at most a few hundred months is instant.
 */
function amortise(
  principal: number,
  monthlyRate: number,
  payment: number,
  extra: number,
  maxMonths: number,
): { months: number; interest: number } {
  let balance = principal;
  let interest = 0;
  let months = 0;

  // A guard rather than a real limit: if the payment does not cover the
  // interest the balance grows forever, and this stops the loop rather than
  // hanging the tab.
  const ceiling = maxMonths + 1;

  while (balance > 0.005 && months < ceiling) {
    const monthInterest = balance * monthlyRate;
    let principalPart = payment + extra - monthInterest;

    // The payment does not even cover interest — the loan never clears.
    if (principalPart <= 0) return { months: Infinity, interest: Infinity };

    if (principalPart > balance) principalPart = balance;

    balance -= principalPart;
    interest += monthInterest;
    months += 1;
  }

  return { months, interest };
}

export function calculate(input: MortgageInput): MortgageResult | null {
  const { price, deposit, annualRate, years } = input;

  if (!Number.isFinite(price) || price <= 0) return null;
  if (!Number.isFinite(deposit) || deposit < 0 || deposit >= price) return null;
  if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) return null;
  if (!Number.isFinite(years) || years <= 0 || years > 50) return null;

  const principal = price - deposit;
  const monthlyRate = annualRate / 100 / 12;
  const months = Math.round(years * 12);

  const payment = monthlyPayment(principal, monthlyRate, months);

  const base = amortise(principal, monthlyRate, payment, 0, months);
  const totalInterest = Number.isFinite(base.interest) ? base.interest : 0;

  const extras =
    (Math.max(0, input.annualTax) + Math.max(0, input.annualInsurance)) / 12 +
    Math.max(0, input.monthlyOther);

  let overpaid: MortgageResult["overpaid"] = null;
  const extra = Math.max(0, input.monthlyOverpayment);

  if (extra > 0) {
    // Allow a longer ceiling than the term so a tiny overpayment on a long
    // mortgage still resolves rather than being reported as never clearing.
    const withExtra = amortise(principal, monthlyRate, payment, extra, months * 2);
    if (Number.isFinite(withExtra.months)) {
      overpaid = {
        monthsToClear: withExtra.months,
        monthsSaved: Math.max(0, base.months - withExtra.months),
        interestSaved: Math.max(0, totalInterest - withExtra.interest),
        totalInterest: withExtra.interest,
      };
    }
  }

  return {
    principal,
    ltv: (principal / price) * 100,
    monthlyPayment: payment,
    monthlyTotal: payment + extras,
    totalInterest,
    totalPaid: principal + totalInterest,
    overpaid,
  };
}

/** "24 years 7 months", which is how a mortgage term is spoken. */
export function formatTerm(months: number): string {
  if (!Number.isFinite(months)) return "never";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} month${rest === 1 ? "" : "s"}`;
  if (rest === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} year${years === 1 ? "" : "s"} ${rest} month${rest === 1 ? "" : "s"}`;
}

/**
 * The band an LTV falls into.
 *
 * Lenders price in steps rather than continuously, so being just over a
 * boundary costs meaningfully more than being just under — which is worth
 * surfacing, because a slightly larger deposit can move you a whole band.
 */
export function ltvBand(ltv: number): { label: string; note: string } {
  if (ltv <= 60) return { label: "60% or less", note: "The best rates are usually here." };
  if (ltv <= 75) return { label: "Up to 75%", note: "Still comfortably into good rates." };
  if (ltv <= 80) return { label: "Up to 80%", note: "A common boundary — 5% more deposit often moves you a band." };
  if (ltv <= 90) return { label: "Up to 90%", note: "Rates step up noticeably above 80%." };
  if (ltv <= 95) return { label: "Up to 95%", note: "Fewer products, higher rates." };
  return { label: "Above 95%", note: "Very few lenders will go here." };
}

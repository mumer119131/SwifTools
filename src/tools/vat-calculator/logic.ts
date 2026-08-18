/**
 * VAT and sales tax.
 *
 * The arithmetic is trivial and the mistake is universal: to remove 20% VAT
 * from a gross price you divide by 1.2, you do not subtract 20%. £120 gross is
 * £100 net, not £96 — subtracting takes 20% of the larger number. That single
 * error is the reason this tool exists as something separate from a percentage
 * calculator.
 */

export interface Rate {
  label: string;
  percent: number;
  note?: string;
}

/** Rates people actually need, grouped by where they apply. */
export const RATE_PRESETS: { region: string; rates: Rate[] }[] = [
  {
    region: "United Kingdom",
    rates: [
      { label: "Standard", percent: 20 },
      { label: "Reduced", percent: 5, note: "Home energy, child car seats" },
      { label: "Zero", percent: 0, note: "Most food, books, children's clothes" },
    ],
  },
  {
    region: "Ireland",
    rates: [
      { label: "Standard", percent: 23 },
      { label: "Reduced", percent: 13.5 },
      { label: "Second reduced", percent: 9 },
    ],
  },
  {
    region: "European Union (common)",
    rates: [
      { label: "Germany", percent: 19 },
      { label: "France", percent: 20 },
      { label: "Spain", percent: 21 },
      { label: "Italy", percent: 22 },
      { label: "Netherlands", percent: 21 },
    ],
  },
  {
    region: "Elsewhere",
    rates: [
      { label: "Australia GST", percent: 10 },
      { label: "New Zealand GST", percent: 15 },
      { label: "Canada GST", percent: 5 },
      { label: "India GST", percent: 18 },
      { label: "Pakistan GST", percent: 17 },
    ],
  },
];

export interface VatResult {
  net: number;
  vat: number;
  gross: number;
}

/** Rounds to whole pence, which is what an invoice must show. */
function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Adds VAT to a net (pre-tax) amount.
 *
 * The straightforward direction, and the one people get right.
 */
export function addVat(net: number, percent: number): VatResult {
  const vat = round(net * (percent / 100));
  return { net: round(net), vat, gross: round(net + vat) };
}

/**
 * Removes VAT from a gross (tax-inclusive) amount.
 *
 * Divide by 1 + rate. Subtracting the percentage instead takes it from the
 * wrong base and under-reports the net every time — at 20% the answer comes out
 * 4% low, which is small enough to survive a sanity check and large enough to
 * matter across a year of invoices.
 */
export function removeVat(gross: number, percent: number): VatResult {
  const net = round(gross / (1 + percent / 100));
  return { net, vat: round(gross - net), gross: round(gross) };
}

/** What subtracting the percentage would wrongly give, for the comparison. */
export function naiveRemoval(gross: number, percent: number): number {
  return round(gross * (1 - percent / 100));
}

/** The fraction of a gross price that is tax — 1/6 at 20%, and useful mentally. */
export function vatFraction(percent: number): string {
  if (percent === 0) return "0";
  const denominator = (100 + percent) / percent;
  // Only report a tidy fraction when it genuinely is one.
  const rounded = Math.round(denominator);
  return Math.abs(denominator - rounded) < 0.001 ? `1/${rounded}` : `${(percent / (100 + percent) * 100).toFixed(2)}%`;
}

export function parseAmount(input: string): number | null {
  // Strip currency symbols, spaces and thousands separators — people paste
  // straight from an invoice.
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  if (cleaned === "" || cleaned === "-") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

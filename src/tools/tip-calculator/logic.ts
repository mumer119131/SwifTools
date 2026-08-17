export interface TipResult {
  /** What the tip is calculated on — before tax, or the whole bill. */
  tipBase: number;
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
  /** Total after rounding, and what the rounding changed. */
  roundedTotal: number;
  roundingAdjustment: number;
  effectiveTipPercent: number;
}

export type Rounding = "none" | "total" | "perPerson";

/**
 * Works out a tip and a split.
 *
 * Whether the tip goes on the pre-tax or post-tax figure is a real choice, not
 * a rounding detail. In a US state with 9% sales tax, tipping 20% on the total
 * rather than the subtotal is an extra 1.8% of the bill — small on a coffee and
 * meaningful on a table of eight.
 */
export function calculate(
  subtotal: number,
  taxAmount: number,
  tipPercent: number,
  people: number,
  tipOnPreTax: boolean,
  rounding: Rounding,
): TipResult {
  const bill = Math.max(0, subtotal) + Math.max(0, taxAmount);
  const tipBase = tipOnPreTax ? Math.max(0, subtotal) : bill;

  const tip = tipBase * (Math.max(0, tipPercent) / 100);
  const total = bill + tip;
  const heads = Math.max(1, Math.floor(people));

  let roundedTotal = total;

  if (rounding === "total") {
    roundedTotal = Math.ceil(total);
  } else if (rounding === "perPerson") {
    // Round each share up, so the collected amount always covers the bill
    // rather than leaving the organiser short.
    roundedTotal = Math.ceil(total / heads) * heads;
  }

  const finalTip = roundedTotal - bill;

  return {
    tipBase,
    tip,
    total,
    perPerson: roundedTotal / heads,
    tipPerPerson: finalTip / heads,
    roundedTotal,
    roundingAdjustment: roundedTotal - total,
    effectiveTipPercent: tipBase > 0 ? (finalTip / tipBase) * 100 : 0,
  };
}

export const QUICK_TIPS = [0, 10, 12.5, 15, 18, 20, 25];

/** What a tip actually means in different places, since it varies wildly. */
export const CUSTOMS: { region: string; typical: string; note: string }[] = [
  { region: "United States", typical: "18–22%", note: "Expected. Servers are often paid a reduced wage on the assumption of tips." },
  { region: "Canada", typical: "15–20%", note: "Expected, similar to the US." },
  { region: "United Kingdom", typical: "10–12.5%", note: "Often already added as an optional service charge — check before adding more." },
  { region: "Most of Europe", typical: "5–10%", note: "Service is usually included. Rounding up is common and sufficient." },
  { region: "Japan", typical: "None", note: "Tipping is not customary and can cause confusion or offence." },
  { region: "Australia & NZ", typical: "0–10%", note: "Not expected. Staff are paid a full wage." },
];

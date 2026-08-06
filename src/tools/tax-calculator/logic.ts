export interface Band {
  /** Income above this threshold is taxed at `rate`. */
  from: number;
  /** Undefined means the top band, with no upper limit. */
  to?: number;
  ratePercent: number;
}

export interface TaxSystem {
  id: string;
  label: string;
  currency: string;
  /** Income below this is untaxed. */
  personalAllowance: number;
  bands: Band[];
  note: string;
}

/**
 * Preset systems, simplified to the headline income-tax bands.
 *
 * Real tax codes contain allowances, credits, social contributions and tapers
 * that vary by circumstance — these presets are a starting point, and the UI
 * says so plainly rather than implying a filing-grade calculation.
 */
export const systems: readonly TaxSystem[] = [
  {
    id: "uk",
    label: "UK (England & Wales)",
    currency: "GBP",
    personalAllowance: 12570,
    bands: [
      { from: 0, to: 37700, ratePercent: 20 },
      { from: 37700, to: 125140, ratePercent: 40 },
      { from: 125140, ratePercent: 45 },
    ],
    note: "The personal allowance tapers away above £100,000, which this doesn't model. National Insurance is not included.",
  },
  {
    id: "us-single",
    label: "US federal (single filer)",
    currency: "USD",
    personalAllowance: 14600,
    bands: [
      { from: 0, to: 11600, ratePercent: 10 },
      { from: 11600, to: 47150, ratePercent: 12 },
      { from: 47150, to: 100525, ratePercent: 22 },
      { from: 100525, to: 191950, ratePercent: 24 },
      { from: 191950, to: 243725, ratePercent: 32 },
      { from: 243725, to: 609350, ratePercent: 35 },
      { from: 609350, ratePercent: 37 },
    ],
    note: "Federal income tax only, using the standard deduction. State tax, FICA and credits are not included.",
  },
  {
    id: "india-new",
    label: "India (new regime)",
    currency: "INR",
    personalAllowance: 300000,
    bands: [
      { from: 0, to: 400000, ratePercent: 5 },
      { from: 400000, to: 700000, ratePercent: 10 },
      { from: 700000, to: 1000000, ratePercent: 15 },
      { from: 1000000, to: 1300000, ratePercent: 20 },
      { from: 1300000, ratePercent: 30 },
    ],
    note: "New regime slabs. Rebates, surcharge and the 4% health and education cess are not applied.",
  },
  {
    id: "flat",
    label: "Flat rate",
    currency: "USD",
    personalAllowance: 0,
    bands: [{ from: 0, ratePercent: 20 }],
    note: "A single rate on every unit of income, for modelling or comparison.",
  },
];

export interface BandResult {
  label: string;
  ratePercent: number;
  taxableInBand: number;
  tax: number;
}

export interface TaxResult {
  gross: number;
  allowance: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  /** Tax as a share of gross income — the number that actually matters. */
  effectiveRatePercent: number;
  /** The rate the next unit of income would be taxed at. */
  marginalRatePercent: number;
  bands: BandResult[];
}

export function calculateTax(gross: number, system: TaxSystem): TaxResult | null {
  if (!(gross >= 0)) return null;

  const allowance = Math.min(system.personalAllowance, gross);
  const taxableIncome = Math.max(0, gross - allowance);

  const bands: BandResult[] = [];
  let totalTax = 0;
  let marginalRatePercent = 0;

  for (const band of system.bands) {
    const upper = band.to ?? Infinity;
    // Bands are expressed relative to taxable income, not gross.
    const taxableInBand = Math.max(0, Math.min(taxableIncome, upper) - band.from);
    if (taxableInBand <= 0) continue;

    const tax = (taxableInBand * band.ratePercent) / 100;
    totalTax += tax;
    marginalRatePercent = band.ratePercent;

    bands.push({
      label: band.to
        ? `${formatBound(band.from)} – ${formatBound(band.to)}`
        : `Above ${formatBound(band.from)}`,
      ratePercent: band.ratePercent,
      taxableInBand,
      tax,
    });
  }

  return {
    gross,
    allowance,
    taxableIncome,
    totalTax,
    netIncome: gross - totalTax,
    effectiveRatePercent: gross > 0 ? (totalTax / gross) * 100 : 0,
    marginalRatePercent,
    bands,
  };
}

function formatBound(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
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

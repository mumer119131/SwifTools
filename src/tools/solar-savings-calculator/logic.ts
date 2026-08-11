export interface SolarEstimate {
  annualKwh: number;
  systemKw: number;
  panels: number;
  grossCost: number;
  netCost: number;
  firstYearSavings: number;
  paybackYears: number | null;
  lifetimeSavings: number;
  lifetimeProduction: number;
  yearly: { year: number; savings: number; cumulative: number; net: number }[];
}

/**
 * Losses between the panel rating and the meter — inverter efficiency, wiring,
 * dust, heat, shading. 20% is the standard derate factor used in the industry.
 */
const DERATE = 0.8;

/** Panels lose about half a percent of output a year. */
const DEGRADATION = 0.005;

/** Typical peak sun hours per day, by region. */
export const SUN_HOURS = [
  { label: "Pacific Northwest / UK / N. Europe", hours: 3.2 },
  { label: "Northeast US / Central Europe", hours: 4.0 },
  { label: "Midwest / temperate", hours: 4.5 },
  { label: "Southeast / Mediterranean", hours: 5.0 },
  { label: "Southwest / desert", hours: 6.0 },
];

export interface SolarInputs {
  annualKwh: number;
  ratePerKwh: number;
  sunHours: number;
  costPerWatt: number;
  incentivePercent: number;
  offsetPercent: number;
  panelWatts: number;
  rateInflation: number;
  years: number;
}

/**
 * Sizing and payback for a rooftop solar system.
 *
 * Payback is not cost ÷ first-year savings: electricity prices rise while panel
 * output falls, and the two do not cancel. The year-by-year table below is what
 * the break-even point is actually read from.
 */
export function estimate(inputs: SolarInputs): SolarEstimate {
  const annualKwh = Math.max(0, inputs.annualKwh);
  const target = annualKwh * (Math.max(0, inputs.offsetPercent) / 100);

  const sunHours = Math.max(0.1, inputs.sunHours);
  // kW needed = annual kWh ÷ (sun hours × 365 × derate)
  const systemKw = target / (sunHours * 365 * DERATE);

  const panelWatts = Math.max(1, inputs.panelWatts);
  const panels = Math.ceil((systemKw * 1000) / panelWatts);

  const grossCost = systemKw * 1000 * Math.max(0, inputs.costPerWatt);
  const netCost = grossCost * (1 - Math.max(0, inputs.incentivePercent) / 100);

  const years = Math.max(1, Math.round(inputs.years));
  const yearly: SolarEstimate["yearly"] = [];

  let cumulative = 0;
  let lifetimeProduction = 0;
  let paybackYears: number | null = null;

  for (let year = 1; year <= years; year += 1) {
    const production = target * (1 - DEGRADATION) ** (year - 1);
    const rate = inputs.ratePerKwh * (1 + Math.max(0, inputs.rateInflation) / 100) ** (year - 1);
    const savings = production * rate;

    const previous = cumulative;
    cumulative += savings;
    lifetimeProduction += production;

    // Interpolate within the year the cumulative saving crosses the cost.
    if (paybackYears === null && cumulative >= netCost && savings > 0) {
      paybackYears = year - 1 + (netCost - previous) / savings;
    }

    yearly.push({ year, savings, cumulative, net: cumulative - netCost });
  }

  return {
    annualKwh,
    systemKw,
    panels,
    grossCost,
    netCost,
    firstYearSavings: yearly[0]?.savings ?? 0,
    paybackYears,
    lifetimeSavings: cumulative - netCost,
    lifetimeProduction,
    yearly,
  };
}

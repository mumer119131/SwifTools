export interface RunningCost {
  kwhPerDay: number;
  kwhPerMonth: number;
  kwhPerYear: number;
  perHour: number;
  perDay: number;
  perMonth: number;
  perYear: number;
  /** kg of CO₂ per year, at the US grid average. */
  co2PerYear: number;
}

/**
 * US grid average, kg CO₂ per kWh (EPA eGRID). A rough figure — a grid running
 * on hydro or nuclear is a fraction of this, one on coal is well above it.
 */
const CO2_PER_KWH = 0.385;

/**
 * What an appliance costs to run.
 *
 * Watts × hours ÷ 1000 gives kilowatt-hours, which is the only unit an
 * electricity bill is actually charged in. The month is 30.44 days — the
 * average calendar month, not 30 — so twelve months and one year agree.
 */
export function runningCost(
  watts: number,
  hoursPerDay: number,
  ratePerKwh: number,
  quantity: number,
): RunningCost {
  const count = Math.max(1, quantity);
  const kwhPerDay = (Math.max(0, watts) * Math.max(0, hoursPerDay) * count) / 1000;
  const kwhPerMonth = kwhPerDay * 30.436875;
  const kwhPerYear = kwhPerDay * 365.2425;

  const rate = Math.max(0, ratePerKwh);

  return {
    kwhPerDay,
    kwhPerMonth,
    kwhPerYear,
    perHour: ((Math.max(0, watts) * count) / 1000) * rate,
    perDay: kwhPerDay * rate,
    perMonth: kwhPerMonth * rate,
    perYear: kwhPerYear * rate,
    co2PerYear: kwhPerYear * CO2_PER_KWH,
  };
}

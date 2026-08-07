/** Charge curve milestones — the numbers people actually look up. */
export const CHARGE_STEPS = [
  { taus: 1, percent: 63.2 },
  { taus: 2, percent: 86.5 },
  { taus: 3, percent: 95.0 },
  { taus: 4, percent: 98.2 },
  { taus: 5, percent: 99.3 },
];

export const CAP_UNITS = [
  { id: "pf", label: "pF", factor: 1e-12 },
  { id: "nf", label: "nF", factor: 1e-9 },
  { id: "uf", label: "µF", factor: 1e-6 },
  { id: "mf", label: "mF", factor: 1e-3 },
  { id: "f", label: "F", factor: 1 },
];

export interface CapacitorResult {
  timeConstant: number;
  reactance: number | null;
  energy: number | null;
  charge: number | null;
}

export function calculate(
  farads: number,
  ohms: number,
  hertz: number,
  volts: number,
): CapacitorResult | null {
  if (!(farads > 0)) return null;

  return {
    // τ = RC — the time to reach 63.2% of the final voltage.
    timeConstant: ohms > 0 ? ohms * farads : 0,
    // Xc = 1/(2πfC). At DC (f = 0) a capacitor is an open circuit, so the
    // reactance is infinite rather than a number worth printing.
    reactance: hertz > 0 ? 1 / (2 * Math.PI * hertz * farads) : null,
    energy: volts > 0 ? 0.5 * farads * volts * volts : null,
    charge: volts > 0 ? farads * volts : null,
  };
}

/** Capacitors add in parallel and combine reciprocally in series — the
 *  opposite of resistors, which catches people out constantly. */
export function combineSeries(values: number[]): number {
  const usable = values.filter((value) => value > 0);
  if (usable.length === 0) return 0;
  return 1 / usable.reduce((sum, value) => sum + 1 / value, 0);
}

export function combineParallel(values: number[]): number {
  return values.filter((value) => value > 0).reduce((sum, value) => sum + value, 0);
}

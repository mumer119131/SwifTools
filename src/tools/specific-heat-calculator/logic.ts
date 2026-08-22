import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "Q", label: "Heat energy", unit: "J", placeholder: "41800" },
  { id: "m", label: "Mass", unit: "kg", placeholder: "1" },
  { id: "c", label: "Specific heat capacity", unit: "J/kg·K", hint: "Water is 4181", placeholder: "4181" },
  { id: "dT", label: "Temperature change", unit: "K", hint: "A change of 1 K is a change of 1 °C", placeholder: "10" },
];

export const formulas: Record<string, string> = {
  Q: "Q = m × c × ΔT",
  m: "m = Q / (c × ΔT)",
  c: "c = Q / (m × ΔT)",
  dT: "ΔT = Q / (m × c)",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { Q, m, c, dT } = values;
  const has = (...keys: number[]) => keys.every((value) => value !== undefined && Number.isFinite(value));

  if (target === "Q") return has(m, c, dT) ? m * c * dT : null;
  if (target === "m") return has(Q, c, dT) && c * dT !== 0 ? Q / (c * dT) : null;
  if (target === "c") return has(Q, m, dT) && m * dT !== 0 ? Q / (m * dT) : null;
  return has(Q, m, c) && m * c !== 0 ? Q / (m * c) : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { Q } = values;
  if (Q === undefined || !Number.isFinite(Q)) return [];

  return [
    { label: "In kilojoules", value: Q / 1000, unit: "kJ" },
    { label: "In calories", value: Q / 4.184, unit: "cal" },
    { label: "In watt-hours", value: Q / 3600, unit: "Wh" },
    // How long a domestic kettle would take, which makes the number concrete.
    { label: "Seconds at 3 kW", value: Q / 3000, unit: "s" },
  ];
}

/** Common materials, so the capacity does not have to be looked up elsewhere. */
export const MATERIALS: { name: string; c: number }[] = [
  { name: "Water", c: 4181 },
  { name: "Ice", c: 2093 },
  { name: "Steam", c: 2080 },
  { name: "Air", c: 1005 },
  { name: "Aluminium", c: 897 },
  { name: "Glass", c: 840 },
  { name: "Concrete", c: 880 },
  { name: "Iron", c: 449 },
  { name: "Copper", c: 385 },
  { name: "Lead", c: 129 },
];

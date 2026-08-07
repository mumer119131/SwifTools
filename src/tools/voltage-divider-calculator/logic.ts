import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "vout", label: "Output voltage", unit: "V", placeholder: "3.3" },
  { id: "vin", label: "Input voltage", unit: "V", placeholder: "5" },
  { id: "r1", label: "R1 (top)", unit: "Ω", placeholder: "1700" },
  { id: "r2", label: "R2 (bottom)", unit: "Ω", placeholder: "3300" },
];

export const formulas: Record<string, string> = {
  vout: "Vout = Vin × R2 / (R1 + R2)",
  vin: "Vin = Vout × (R1 + R2) / R2",
  r1: "R1 = R2 × (Vin − Vout) / Vout",
  r2: "R2 = R1 × Vout / (Vin − Vout)",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { vin, vout, r1, r2 } = values;

  if (target === "vout") {
    if (vin === undefined || r1 === undefined || r2 === undefined) return null;
    const total = r1 + r2;
    return total === 0 ? null : (vin * r2) / total;
  }

  if (target === "vin") {
    if (vout === undefined || r1 === undefined || r2 === undefined || r2 === 0) return null;
    return (vout * (r1 + r2)) / r2;
  }

  if (target === "r1") {
    if (vin === undefined || vout === undefined || r2 === undefined || vout === 0) return null;
    return (r2 * (vin - vout)) / vout;
  }

  if (vin === undefined || vout === undefined || r1 === undefined) return null;
  const drop = vin - vout;
  // An output equal to the input needs an infinite R2 — there is no answer.
  return drop === 0 ? null : (r1 * vout) / drop;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { vin, r1, r2 } = values;
  if (vin === undefined || r1 === undefined || r2 === undefined) return [];

  const total = r1 + r2;
  if (total <= 0) return [];

  const current = vin / total;
  return [
    { label: "Current through divider", value: current, unit: "A" },
    { label: "Total power", value: vin * current, unit: "W" },
    { label: "Power in R1", value: current * current * r1, unit: "W" },
    { label: "Power in R2", value: current * current * r2, unit: "W" },
  ];
}

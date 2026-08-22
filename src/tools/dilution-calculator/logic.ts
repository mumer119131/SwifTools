import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "C1", label: "Stock concentration", unit: "M", hint: "The solution you are diluting from", placeholder: "2" },
  { id: "V1", label: "Stock volume", unit: "mL", hint: "How much of it to take", placeholder: "25" },
  { id: "C2", label: "Final concentration", unit: "M", placeholder: "0.5" },
  { id: "V2", label: "Final volume", unit: "mL", placeholder: "100" },
];

export const formulas: Record<string, string> = {
  C1: "C₁ = C₂V₂ / V₁",
  V1: "V₁ = C₂V₂ / C₁",
  C2: "C₂ = C₁V₁ / V₂",
  V2: "V₂ = C₁V₁ / C₂",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { C1, V1, C2, V2 } = values;
  const has = (...keys: number[]) => keys.every((v) => v !== undefined && Number.isFinite(v));

  if (target === "C1") return has(C2, V2, V1) && V1 !== 0 ? (C2 * V2) / V1 : null;
  if (target === "V1") return has(C2, V2, C1) && C1 !== 0 ? (C2 * V2) / C1 : null;
  if (target === "C2") return has(C1, V1, V2) && V2 !== 0 ? (C1 * V1) / V2 : null;
  return has(C1, V1, C2) && C2 !== 0 ? (C1 * V1) / C2 : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { C1, V1, C2, V2 } = values;
  const rows: DerivedValue[] = [];

  // The number people actually need at the bench: how much solvent to add.
  if ([V1, V2].every((v) => v !== undefined && Number.isFinite(v)) && V2 > V1) {
    rows.push({ label: "Solvent to add", value: V2 - V1, unit: "mL" });
  }
  if ([C1, C2].every((v) => v !== undefined && Number.isFinite(v)) && C2 !== 0) {
    rows.push({ label: "Dilution factor", value: C1 / C2, unit: "×" });
  }
  if (V1 !== undefined && Number.isFinite(V1)) {
    rows.push({ label: "Stock volume in litres", value: V1 / 1000, unit: "L" });
  }
  return rows;
}

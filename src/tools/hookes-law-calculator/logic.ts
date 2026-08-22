import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "F", label: "Force", unit: "N", placeholder: "20" },
  { id: "k", label: "Spring constant", unit: "N/m", placeholder: "100" },
  { id: "x", label: "Extension", unit: "m", hint: "From the spring's natural length", placeholder: "0.2" },
];

export const formulas: Record<string, string> = {
  F: "F = k × x",
  k: "k = F / x",
  x: "x = F / k",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { F, k, x } = values;

  if (target === "F") return k !== undefined && x !== undefined ? k * x : null;
  if (target === "k") return F !== undefined && x !== undefined && x !== 0 ? F / x : null;
  return F !== undefined && k !== undefined && k !== 0 ? F / k : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { F, k, x } = values;
  const rows: DerivedValue[] = [];

  if (k !== undefined && x !== undefined && Number.isFinite(k) && Number.isFinite(x)) {
    // Elastic potential energy is ½kx², not Fx — the force rises linearly as
    // the spring stretches, so the average force is half the final one.
    rows.push({ label: "Energy stored", value: 0.5 * k * x * x, unit: "J" });
  }
  if (F !== undefined && Number.isFinite(F)) {
    rows.push({ label: "Equivalent hanging mass", value: F / 9.80665, unit: "kg" });
    rows.push({ label: "Force in kgf", value: F / 9.80665, unit: "kgf" });
    rows.push({ label: "Force in pounds-force", value: F * 0.224809, unit: "lbf" });
  }
  return rows;
}

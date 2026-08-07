import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";
import { CONSTANTS } from "@/lib/science";

export const variables: SolveVariable[] = [
  { id: "f", label: "Force", unit: "N", placeholder: "98.1" },
  { id: "m", label: "Mass", unit: "kg", placeholder: "10" },
  { id: "a", label: "Acceleration", unit: "m/s²", placeholder: "9.81" },
];

export const formulas: Record<string, string> = {
  f: "F = m × a",
  m: "m = F / a",
  a: "a = F / m",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { f, m, a } = values;

  if (target === "f") return m !== undefined && a !== undefined ? m * a : null;
  if (target === "m") return f !== undefined && a !== undefined && a !== 0 ? f / a : null;
  return f !== undefined && m !== undefined && m !== 0 ? f / m : null;
}

/** Context that makes the number mean something physically. */
export function derive(values: Record<string, number>): DerivedValue[] {
  const mass = values.m;
  if (mass === undefined || !Number.isFinite(mass)) return [];

  return [
    { label: "Weight on Earth", value: mass * CONSTANTS.gravity, unit: "N" },
    { label: "Weight in kgf", value: mass, unit: "kgf" },
    { label: "Weight in lbf", value: mass * CONSTANTS.gravity * 0.224808943, unit: "lbf" },
  ];
}

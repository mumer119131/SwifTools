import type { SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "v", label: "Voltage", unit: "V", placeholder: "5" },
  { id: "i", label: "Current", unit: "A", placeholder: "0.02" },
  { id: "r", label: "Resistance", unit: "Ω", placeholder: "250" },
  { id: "p", label: "Power", unit: "W", placeholder: "0.1" },
];

export const formulas: Record<string, string> = {
  v: "V = I × R    ·    V = P / I    ·    V = √(P × R)",
  i: "I = V / R    ·    I = P / V    ·    I = √(P / R)",
  r: "R = V / I    ·    R = V² / P   ·    R = P / I²",
  p: "P = V × I    ·    P = V² / R   ·    P = I² × R",
};

/**
 * Ohm's law plus the power relations.
 *
 * Any two of the four quantities determine the other two, but which formula
 * applies depends on which two you have — so each target tries its variants in
 * turn rather than assuming a fixed pair.
 */
export function solve(values: Record<string, number>, target: string): number | null {
  const { v, i, r, p } = values;
  const has = (x: number | undefined): x is number => x !== undefined && Number.isFinite(x);

  if (target === "v") {
    if (has(i) && has(r)) return i * r;
    if (has(p) && has(i) && i !== 0) return p / i;
    if (has(p) && has(r) && p * r >= 0) return Math.sqrt(p * r);
    return null;
  }

  if (target === "i") {
    if (has(v) && has(r) && r !== 0) return v / r;
    if (has(p) && has(v) && v !== 0) return p / v;
    if (has(p) && has(r) && r !== 0 && p / r >= 0) return Math.sqrt(p / r);
    return null;
  }

  if (target === "r") {
    if (has(v) && has(i) && i !== 0) return v / i;
    if (has(v) && has(p) && p !== 0) return (v * v) / p;
    if (has(p) && has(i) && i !== 0) return p / (i * i);
    return null;
  }

  if (has(v) && has(i)) return v * i;
  if (has(v) && has(r) && r !== 0) return (v * v) / r;
  if (has(i) && has(r)) return i * i * r;
  return null;
}

import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

/** The gravitational constant, in N·m²/kg². */
export const G = 6.6743e-11;

export const variables: SolveVariable[] = [
  { id: "F", label: "Force", unit: "N", placeholder: "3.5e22" },
  { id: "m1", label: "First mass", unit: "kg", hint: "Earth is 5.972e24", placeholder: "5.972e24" },
  { id: "m2", label: "Second mass", unit: "kg", hint: "The Moon is 7.348e22", placeholder: "7.348e22" },
  { id: "r", label: "Distance between centres", unit: "m", hint: "Not surface to surface", placeholder: "3.844e8" },
];

export const formulas: Record<string, string> = {
  F: "F = G·m₁·m₂ / r²",
  m1: "m₁ = F·r² / (G·m₂)",
  m2: "m₂ = F·r² / (G·m₁)",
  r: "r = √(G·m₁·m₂ / F)",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { F, m1, m2, r } = values;
  const has = (...keys: number[]) => keys.every((v) => v !== undefined && Number.isFinite(v));

  if (target === "F") return has(m1, m2, r) && r !== 0 ? (G * m1 * m2) / (r * r) : null;
  if (target === "m1") return has(F, m2, r) && m2 !== 0 ? (F * r * r) / (G * m2) : null;
  if (target === "m2") return has(F, m1, r) && m1 !== 0 ? (F * r * r) / (G * m1) : null;

  // Distance is a square root, so a negative or zero force has no real answer.
  if (!has(F, m1, m2) || F <= 0) return null;
  const squared = (G * m1 * m2) / F;
  return squared >= 0 ? Math.sqrt(squared) : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { F, r } = values;
  const rows: DerivedValue[] = [];

  if (F !== undefined && Number.isFinite(F)) {
    rows.push({ label: "In kilonewtons", value: F / 1000, unit: "kN" });
    rows.push({ label: "Equivalent weight on Earth", value: F / 9.80665, unit: "kg" });
  }
  if (r !== undefined && Number.isFinite(r)) {
    rows.push({ label: "Distance in kilometres", value: r / 1000, unit: "km" });
    // Doubling the distance quarters the force, which the inverse square makes
    // easy to state and hard to feel.
    rows.push({ label: "Force at twice the distance", value: 0.25, unit: "× this" });
  }
  return rows;
}

/** Masses worth having to hand, since nobody remembers them. */
export const BODIES: { name: string; mass: number; radius: number }[] = [
  { name: "Earth", mass: 5.972e24, radius: 6.371e6 },
  { name: "Moon", mass: 7.348e22, radius: 1.737e6 },
  { name: "Sun", mass: 1.989e30, radius: 6.957e8 },
  { name: "Mars", mass: 6.417e23, radius: 3.39e6 },
  { name: "Jupiter", mass: 1.898e27, radius: 6.9911e7 },
];

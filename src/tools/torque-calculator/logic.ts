import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "T", label: "Torque", unit: "N·m", placeholder: "50" },
  { id: "F", label: "Force", unit: "N", placeholder: "200" },
  { id: "r", label: "Lever arm", unit: "m", hint: "Distance from the pivot", placeholder: "0.25" },
];

export const formulas: Record<string, string> = {
  T: "τ = F × r",
  F: "F = τ / r",
  r: "r = τ / F",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { T, F, r } = values;

  if (target === "T") return F !== undefined && r !== undefined ? F * r : null;
  if (target === "F") return T !== undefined && r !== undefined && r !== 0 ? T / r : null;
  return T !== undefined && F !== undefined && F !== 0 ? T / F : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { T } = values;
  if (T === undefined || !Number.isFinite(T)) return [];

  return [
    // The units mechanics and cyclists actually use.
    { label: "In pound-feet", value: T * 0.737562149, unit: "lb·ft" },
    { label: "In pound-inches", value: T * 8.85074579, unit: "lb·in" },
    { label: "In kilogram-metres", value: T / 9.80665, unit: "kgf·m" },
    { label: "In newton-centimetres", value: T * 100, unit: "N·cm" },
  ];
}

/** The angle correction, for when the force is not perpendicular. */
export function withAngle(force: number, radius: number, degrees: number): number {
  return force * radius * Math.sin((degrees * Math.PI) / 180);
}

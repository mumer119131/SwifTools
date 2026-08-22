import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "W", label: "Work done", unit: "J", placeholder: "500" },
  { id: "F", label: "Force", unit: "N", placeholder: "100" },
  { id: "d", label: "Distance moved", unit: "m", hint: "In the direction of the force", placeholder: "5" },
];

export const formulas: Record<string, string> = {
  W: "W = F × d",
  F: "F = W / d",
  d: "d = W / F",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { W, F, d } = values;

  if (target === "W") return F !== undefined && d !== undefined ? F * d : null;
  if (target === "F") return W !== undefined && d !== undefined && d !== 0 ? W / d : null;
  return W !== undefined && F !== undefined && F !== 0 ? W / F : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { W } = values;
  if (W === undefined || !Number.isFinite(W)) return [];

  return [
    { label: "In kilojoules", value: W / 1000, unit: "kJ" },
    { label: "In calories", value: W / 4.184, unit: "cal" },
    // Work over time is power, which makes the number tangible.
    { label: "Power if done in 1 second", value: W, unit: "W" },
    { label: "Power if done in 10 seconds", value: W / 10, unit: "W" },
  ];
}

/** Work at an angle: only the component along the motion counts. */
export function withAngle(force: number, distance: number, degrees: number): number {
  return force * distance * Math.cos((degrees * Math.PI) / 180);
}

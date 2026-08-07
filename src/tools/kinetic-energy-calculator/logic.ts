import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "ke", label: "Kinetic energy", unit: "J", placeholder: "500" },
  { id: "m", label: "Mass", unit: "kg", placeholder: "1000" },
  { id: "v", label: "Velocity", unit: "m/s", placeholder: "1" },
];

export const formulas: Record<string, string> = {
  ke: "KE = ½ × m × v²",
  m: "m = 2 × KE / v²",
  v: "v = √(2 × KE / m)",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { ke, m, v } = values;

  if (target === "ke") return m !== undefined && v !== undefined ? 0.5 * m * v * v : null;
  if (target === "m") return ke !== undefined && v !== undefined && v !== 0 ? (2 * ke) / (v * v) : null;

  // Velocity is the square root, so a negative energy or mass has no real answer.
  if (ke === undefined || m === undefined || m === 0) return null;
  const squared = (2 * ke) / m;
  return squared >= 0 ? Math.sqrt(squared) : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const energy = values.ke;
  if (energy === undefined || !Number.isFinite(energy)) return [];

  return [
    { label: "In kilojoules", value: energy / 1000, unit: "kJ" },
    { label: "In calories", value: energy / 4.184, unit: "cal" },
    { label: "In watt-hours", value: energy / 3600, unit: "Wh" },
    { label: "In foot-pounds", value: energy * 0.737562149, unit: "ft·lb" },
  ];
}

import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "p", label: "Momentum", unit: "kg·m/s", placeholder: "1500" },
  { id: "m", label: "Mass", unit: "kg", placeholder: "1000" },
  { id: "v", label: "Velocity", unit: "m/s", placeholder: "1.5" },
];

export const formulas: Record<string, string> = {
  p: "p = m × v",
  m: "m = p / v",
  v: "v = p / m",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { p, m, v } = values;

  if (target === "p") return m !== undefined && v !== undefined ? m * v : null;
  if (target === "m") return p !== undefined && v !== undefined && v !== 0 ? p / v : null;
  return p !== undefined && m !== undefined && m !== 0 ? p / m : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { p, m, v } = values;
  if (p === undefined || !Number.isFinite(p)) return [];

  const rows: DerivedValue[] = [
    // The impulse–momentum theorem: the same number, read as a change rather
    // than a state, which is what makes momentum useful in collisions.
    { label: "Impulse to stop it", value: Math.abs(p), unit: "N·s" },
  ];

  if (m !== undefined && v !== undefined && Number.isFinite(m) && Number.isFinite(v)) {
    // Kinetic energy scales with v², momentum with v — the reason a light fast
    // object and a heavy slow one can share momentum and differ hugely in energy.
    rows.push({ label: "Kinetic energy", value: 0.5 * m * v * v, unit: "J" });
    rows.push({ label: "Force to stop in 1s", value: Math.abs(p), unit: "N" });
    rows.push({ label: "Force to stop in 0.1s", value: Math.abs(p) / 0.1, unit: "N" });
  }

  return rows;
}

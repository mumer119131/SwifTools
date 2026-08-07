import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

export const variables: SolveVariable[] = [
  { id: "d", label: "Density", unit: "kg/m³", placeholder: "1000" },
  { id: "m", label: "Mass", unit: "kg", placeholder: "2" },
  { id: "v", label: "Volume", unit: "m³", placeholder: "0.002" },
];

export const formulas: Record<string, string> = {
  d: "ρ = m / V",
  m: "m = ρ × V",
  v: "V = m / ρ",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { d, m, v } = values;

  if (target === "d") return m !== undefined && v !== undefined && v !== 0 ? m / v : null;
  if (target === "m") return d !== undefined && v !== undefined ? d * v : null;
  return m !== undefined && d !== undefined && d !== 0 ? m / d : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const density = values.d;
  if (density === undefined || !Number.isFinite(density)) return [];

  return [
    { label: "In g/cm³", value: density / 1000, unit: "g/cm³" },
    { label: "In lb/ft³", value: density * 0.062427961, unit: "lb/ft³" },
    // Relative to water at 4 °C, which is what "specific gravity" means.
    { label: "Specific gravity", value: density / 1000, unit: "" },
  ];
}

/** For the comparison table — densities at room temperature, kg/m³. */
export const MATERIALS: { name: string; density: number }[] = [
  { name: "Air (sea level)", density: 1.225 },
  { name: "Cork", density: 240 },
  { name: "Pine wood", density: 500 },
  { name: "Ice", density: 917 },
  { name: "Water", density: 1000 },
  { name: "Seawater", density: 1025 },
  { name: "Concrete", density: 2400 },
  { name: "Aluminium", density: 2700 },
  { name: "Steel", density: 7850 },
  { name: "Copper", density: 8960 },
  { name: "Lead", density: 11340 },
  { name: "Gold", density: 19300 },
];

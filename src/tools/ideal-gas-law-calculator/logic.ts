import type { DerivedValue, SolveVariable } from "@/components/shared/SolveForCalculator";

/** The gas constant in SI units: joules per mole per kelvin. */
export const R = 8.314462618;

export const variables: SolveVariable[] = [
  { id: "P", label: "Pressure", unit: "Pa", hint: "1 atm is 101,325 Pa", placeholder: "101325" },
  { id: "V", label: "Volume", unit: "m³", hint: "1 litre is 0.001 m³", placeholder: "0.0224" },
  { id: "n", label: "Amount", unit: "mol", placeholder: "1" },
  { id: "T", label: "Temperature", unit: "K", hint: "0°C is 273.15 K", placeholder: "273.15" },
];

export const formulas: Record<string, string> = {
  P: "P = nRT / V",
  V: "V = nRT / P",
  n: "n = PV / RT",
  T: "T = PV / nR",
};

export function solve(values: Record<string, number>, target: string): number | null {
  const { P, V, n, T } = values;
  const has = (...keys: number[]) => keys.every((value) => value !== undefined && Number.isFinite(value));

  if (target === "P") return has(n, T, V) && V !== 0 ? (n * R * T) / V : null;
  if (target === "V") return has(n, T, P) && P !== 0 ? (n * R * T) / P : null;
  if (target === "n") return has(P, V, T) && T !== 0 ? (P * V) / (R * T) : null;
  return has(P, V, n) && n !== 0 ? (P * V) / (n * R) : null;
}

export function derive(values: Record<string, number>): DerivedValue[] {
  const { P, V, T } = values;
  const rows: DerivedValue[] = [];

  // Pressure and volume in the units people actually quote them in.
  if (P !== undefined && Number.isFinite(P)) {
    rows.push({ label: "Pressure in atmospheres", value: P / 101_325, unit: "atm" });
    rows.push({ label: "Pressure in bar", value: P / 100_000, unit: "bar" });
    rows.push({ label: "Pressure in psi", value: P / 6894.757, unit: "psi" });
  }
  if (V !== undefined && Number.isFinite(V)) {
    rows.push({ label: "Volume in litres", value: V * 1000, unit: "L" });
  }
  if (T !== undefined && Number.isFinite(T)) {
    rows.push({ label: "Temperature in Celsius", value: T - 273.15, unit: "°C" });
  }
  return rows;
}

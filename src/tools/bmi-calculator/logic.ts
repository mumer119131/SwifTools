export interface BmiCategory {
  id: string;
  label: string;
  /** Inclusive lower bound. */
  from: number;
  to: number;
}

/** WHO adult categories. */
export const categories: readonly BmiCategory[] = [
  { id: "underweight", label: "Underweight", from: 0, to: 18.5 },
  { id: "healthy", label: "Healthy weight", from: 18.5, to: 25 },
  { id: "overweight", label: "Overweight", from: 25, to: 30 },
  { id: "obese", label: "Obese", from: 30, to: 100 },
];

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  /** Healthy weight range for this height, in kilograms. */
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult | null {
  if (!(heightCm > 0) || !(weightKg > 0)) return null;

  const metres = heightCm / 100;
  const bmi = weightKg / (metres * metres);
  if (!Number.isFinite(bmi) || bmi > 300) return null;

  const category =
    categories.find((entry) => bmi >= entry.from && bmi < entry.to) ?? categories.at(-1)!;

  return {
    bmi,
    category,
    healthyMinKg: 18.5 * metres * metres,
    healthyMaxKg: 24.9 * metres * metres,
  };
}

export const KG_PER_LB = 0.45359237;
export const CM_PER_INCH = 2.54;

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * CM_PER_INCH;
}

export function kgToStoneLb(kg: number): { stone: number; pounds: number } {
  const totalPounds = kg / KG_PER_LB;
  return { stone: Math.floor(totalPounds / 14), pounds: totalPounds % 14 };
}

/** Position of a BMI value on a 15–40 scale, as a 0–100 percentage. */
export function scalePosition(bmi: number): number {
  return Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
}

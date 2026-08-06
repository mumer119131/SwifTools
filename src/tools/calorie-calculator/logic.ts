export type Sex = "male" | "female";

export const activityLevels = [
  { id: "sedentary", label: "Sedentary — desk job, little exercise", factor: 1.2 },
  { id: "light", label: "Lightly active — 1–3 sessions a week", factor: 1.375 },
  { id: "moderate", label: "Moderately active — 3–5 sessions a week", factor: 1.55 },
  { id: "very", label: "Very active — 6–7 sessions a week", factor: 1.725 },
  { id: "athlete", label: "Athlete — twice daily or physical job", factor: 1.9 },
] as const;

export type ActivityId = (typeof activityLevels)[number]["id"];

export const goals = [
  { id: "lose-fast", label: "Lose 0.75 kg per week", delta: -750 },
  { id: "lose", label: "Lose 0.5 kg per week", delta: -500 },
  { id: "lose-slow", label: "Lose 0.25 kg per week", delta: -250 },
  { id: "maintain", label: "Maintain weight", delta: 0 },
  { id: "gain-slow", label: "Gain 0.25 kg per week", delta: 250 },
  { id: "gain", label: "Gain 0.5 kg per week", delta: 500 },
] as const;

export type GoalId = (typeof goals)[number]["id"];

export interface CalorieInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: ActivityId;
  goal: GoalId;
}

export interface MacroSplit {
  label: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  target: number;
  /** Flagged when the target drops below a safe floor. */
  belowSafeFloor: boolean;
  macros: MacroSplit[];
}

/**
 * Mifflin–St Jeor, which predicts resting metabolic rate more accurately than
 * the older Harris–Benedict equation for modern populations.
 *
 *   BMR = 10·kg + 6.25·cm − 5·age + s   (s = +5 male, −161 female)
 */
export function calculateBmr(input: Pick<CalorieInput, "sex" | "age" | "heightCm" | "weightKg">): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return base + (input.sex === "male" ? 5 : -161);
}

/**
 * Widely-cited minimum intakes below which a diet risks nutrient deficiency
 * without supervision. Used to warn rather than to clamp — it is the user's
 * decision, but they should know.
 */
const SAFE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

export function calculateCalories(input: CalorieInput): CalorieResult | null {
  if (!(input.age > 0) || input.age > 120) return null;
  if (!(input.heightCm > 0) || !(input.weightKg > 0)) return null;

  const bmr = calculateBmr(input);
  if (!Number.isFinite(bmr) || bmr <= 0) return null;

  const factor = activityLevels.find((level) => level.id === input.activity)?.factor ?? 1.2;
  const tdee = bmr * factor;
  const delta = goals.find((goal) => goal.id === input.goal)?.delta ?? 0;
  const target = tdee + delta;

  return {
    bmr,
    tdee,
    target,
    belowSafeFloor: target < SAFE_FLOOR[input.sex],
    macros: buildMacros(target, input.weightKg),
  };
}

/**
 * Three common splits. Protein is anchored to bodyweight rather than to a
 * percentage of calories, which is how it is actually prescribed.
 */
function buildMacros(calories: number, weightKg: number): MacroSplit[] {
  const build = (label: string, proteinPerKg: number, fatPercent: number): MacroSplit => {
    const proteinG = proteinPerKg * weightKg;
    const fatG = (calories * fatPercent) / 9;
    // Carbs take whatever calories are left over.
    const carbsG = Math.max(0, (calories - proteinG * 4 - fatG * 9) / 4);
    return {
      label,
      proteinG: Math.round(proteinG),
      carbsG: Math.round(carbsG),
      fatG: Math.round(fatG),
    };
  };

  return [
    build("Balanced", 1.6, 0.3),
    build("Higher protein", 2.2, 0.25),
    build("Lower carb", 2.0, 0.4),
  ];
}

export function formatCalories(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

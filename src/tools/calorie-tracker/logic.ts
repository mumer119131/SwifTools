export interface FoodEntry {
  id: string;
  name: string;
  meal: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export function sum(entries: FoodEntry[]): Totals {
  return entries.reduce<Totals>(
    (totals, entry) => ({
      calories: totals.calories + (Number(entry.calories) || 0),
      protein: totals.protein + (Number(entry.protein) || 0),
      carbs: totals.carbs + (Number(entry.carbs) || 0),
      fat: totals.fat + (Number(entry.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/**
 * Calories implied by the macros logged.
 *
 * Protein and carbohydrate are 4 kcal per gram, fat is 9. Comparing this
 * against the calorie figure typed in catches a mistyped label — if the two
 * disagree by much, one of the numbers is wrong.
 */
export function caloriesFromMacros(totals: Totals): number {
  return totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
}

/** Grams of each macro for a target and a percentage split. */
export function macroTargets(
  calories: number,
  proteinPercent: number,
  carbPercent: number,
  fatPercent: number,
): Totals {
  return {
    calories,
    protein: (calories * proteinPercent) / 100 / 4,
    carbs: (calories * carbPercent) / 100 / 4,
    fat: (calories * fatPercent) / 100 / 9,
  };
}

/** Today in the browser's own timezone — not UTC, which rolls over early. */
export function todayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

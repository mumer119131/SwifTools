import { Flame } from "lucide-react";

import type { Tool } from "@/config/tools";

export const calorieCalculator: Tool = {
  slug: "calorie-calculator",
  name: "Calorie Calculator",
  category: "calculator",
  description: "Estimate daily calorie needs from BMR and activity level, with macro splits.",
  keywords: ["calorie calculator", "tdee calculator", "bmr calculator", "daily calories"],
  icon: Flame,
  processing: "client",
  status: "live",
  steps: [
    "Enter your age, height, weight and how active you are.",
    "Your BMR and total daily energy expenditure are calculated with the Mifflin–St Jeor equation.",
    "Pick a goal to see the adjusted target, along with a suggested protein, carb and fat split.",
  ],
};

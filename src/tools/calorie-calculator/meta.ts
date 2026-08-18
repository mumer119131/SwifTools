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
};

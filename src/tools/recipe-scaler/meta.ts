import { ChefHat } from "lucide-react";

import type { Tool } from "@/config/tools";

export const recipeScaler: Tool = {
  slug: "recipe-scaler",
  name: "Recipe Scaler",
  category: "home",
  description: "Scale a recipe up or down and get quantities in measures you can actually use.",
  keywords: [
    "recipe scaler",
    "recipe converter",
    "halve a recipe",
    "double a recipe",
    "recipe multiplier",
    "adjust recipe servings",
  ],
  icon: ChefHat,
  processing: "client",
  status: "live",
  steps: [
    "Paste the ingredient list — one per line, straight from the recipe.",
    "Set the servings it makes and the servings you want.",
    "Every quantity is rescaled and rounded to a measure that exists.",
  ],
};

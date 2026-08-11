import { CookingPot } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cookingMeasurementConverter: Tool = {
  slug: "cooking-measurement-converter",
  name: "Cooking Measurement Converter",
  category: "home",
  description: "Cups to grams for real ingredients — flour, sugar, butter and two dozen more.",
  keywords: [
    "cooking measurement converter",
    "cups to grams converter",
    "how many grams in a cup",
    "baking conversion chart",
    "tablespoons to cups",
    "cups to ml",
    "ounces to cups",
  ],
  icon: CookingPot,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick the ingredient — this is what a plain volume converter cannot do.",
    "Enter an amount in cups, spoons, millilitres, grams or ounces.",
    "Every other measure appears at once, with a full conversion table.",
  ],
};

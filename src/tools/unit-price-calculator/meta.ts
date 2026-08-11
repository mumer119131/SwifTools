import { Tags } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unitPriceCalculator: Tool = {
  slug: "unit-price-calculator",
  name: "Unit Price Calculator",
  category: "home",
  description: "Compare package sizes on price per unit and see which one is actually cheaper.",
  keywords: [
    "unit price calculator",
    "price per unit calculator",
    "cost per ounce calculator",
    "which is cheaper calculator",
    "grocery price comparison",
    "price per 100g",
  ],
  icon: Tags,
  processing: "client",
  status: "live",
  steps: [
    "Enter the price and size of each package you are comparing.",
    "Sizes can be in different units — grams against ounces works.",
    "The cheapest per unit is marked, with how much more the others cost.",
  ],
};

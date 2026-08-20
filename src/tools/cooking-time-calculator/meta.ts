import { CookingPot } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cookingTimeCalculator: Tool = {
  slug: "cooking-time-calculator",
  name: "Roasting Time Calculator",
  category: "home",
  description: "Cooking time and internal temperature by weight, and when to put it in.",
  keywords: [
    "roasting time calculator",
    "how long to cook a chicken",
    "turkey cooking time",
    "roast beef cooking time per kg",
    "meat internal temperature",
    "cooking time by weight",
  ],
  icon: CookingPot,
  processing: "client",
  status: "live",
  popular: true,
};

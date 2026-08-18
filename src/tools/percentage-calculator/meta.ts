import { Percent } from "lucide-react";

import type { Tool } from "@/config/tools";

export const percentageCalculator: Tool = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "calculator",
  description: "Percentage of a number, increase, decrease, difference, discounts and tips.",
  keywords: [
    "percentage calculator",
    "percent increase",
    "percent difference",
    "discount calculator",
    "tip calculator",
  ],
  icon: Percent,
  processing: "client",
  status: "live",
};

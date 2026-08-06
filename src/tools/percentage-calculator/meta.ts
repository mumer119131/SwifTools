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
  steps: [
    "Pick the kind of percentage question you have.",
    "Fill in the two numbers you know.",
    "The answer appears immediately, with the working shown so you can check it.",
  ],
};

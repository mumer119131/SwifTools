import { TrendingUp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const compoundInterestCalculator: Tool = {
  slug: "compound-interest-calculator",
  name: "Compound Interest Calculator",
  category: "calculator",
  description: "Project savings growth with regular contributions and compounding.",
  keywords: ["compound interest calculator", "investment growth", "savings calculator"],
  icon: TrendingUp,
  processing: "client",
  status: "live",
  steps: [
    "Enter your starting balance, what you add each month, the expected annual return and the term.",
    "Choose how often interest compounds — monthly is typical for savings, annually for bonds.",
    "See the final balance split into contributions and growth, year by year.",
  ],
};

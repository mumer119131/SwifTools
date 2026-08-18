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
};

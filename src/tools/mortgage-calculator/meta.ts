import { Home } from "lucide-react";

import type { Tool } from "@/config/tools";

export const mortgageCalculator: Tool = {
  slug: "mortgage-calculator",
  name: "Mortgage Calculator",
  category: "calculator",
  description: "Monthly payment, loan to value, true monthly cost, and what overpaying would save you.",
  keywords: [
    "mortgage calculator",
    "mortgage overpayment calculator",
    "how much will my mortgage cost",
    "loan to value calculator",
    "mortgage repayment calculator",
    "deposit and ltv",
  ],
  icon: Home,
  processing: "client",
  status: "live",
  popular: true,
};

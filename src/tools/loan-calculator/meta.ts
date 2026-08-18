import { Landmark } from "lucide-react";

import type { Tool } from "@/config/tools";

export const loanCalculator: Tool = {
  slug: "loan-calculator",
  name: "Loan & EMI Calculator",
  category: "calculator",
  description: "Work out monthly payments, total interest and a full amortisation schedule.",
  keywords: ["loan calculator", "emi calculator", "mortgage calculator", "amortisation schedule"],
  icon: Landmark,
  processing: "client",
  status: "live",
  popular: true,
};

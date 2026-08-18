import { Landmark } from "lucide-react";

import type { Tool } from "@/config/tools";

export const loanCalculator: Tool = {
  slug: "loan-calculator",
  name: "Loan & EMI Calculator",
  category: "calculator",
  description: "Work out monthly payments, total interest and a full amortisation schedule.",
  // "mortgage calculator" moved to the mortgage tool, which answers the
  // question that query is actually asking — deposit, LTV and overpayments.
  keywords: ["loan calculator", "emi calculator", "car loan calculator", "amortisation schedule"],
  icon: Landmark,
  processing: "client",
  status: "live",
  popular: true,
};

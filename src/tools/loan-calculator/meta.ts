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
  steps: [
    "Enter the amount borrowed, the annual interest rate and the term in years.",
    "The monthly payment, total interest and total repaid are calculated instantly.",
    "Expand the schedule to see how each payment splits between interest and principal.",
  ],
};

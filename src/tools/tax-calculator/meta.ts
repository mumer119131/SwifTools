import { Receipt } from "lucide-react";

import type { Tool } from "@/config/tools";

export const taxCalculator: Tool = {
  slug: "tax-calculator",
  name: "Tax Calculator",
  category: "calculator",
  description: "Estimate income tax and take-home pay from a gross salary, band by band.",
  keywords: ["tax calculator", "income tax", "salary calculator", "take home pay"],
  icon: Receipt,
  processing: "client",
  status: "live",
};

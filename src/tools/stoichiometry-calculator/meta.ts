import { FlaskConical } from "lucide-react";

import type { Tool } from "@/config/tools";

export const stoichiometryCalculator: Tool = {
  slug: "stoichiometry-calculator",
  name: "Stoichiometry Calculator",
  category: "science",
  description: "Balance the books on a reaction — limiting reagent, theoretical yield and leftovers.",
  keywords: [
    "stoichiometry calculator",
    "limiting reagent calculator",
    "theoretical yield calculator",
    "mole ratio calculator",
    "percent yield calculator",
  ],
  icon: FlaskConical,
  processing: "client",
  status: "live",
};

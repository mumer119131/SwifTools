import { Hash } from "lucide-react";

import type { Tool } from "@/config/tools";

export const significantFiguresCalculator: Tool = {
  slug: "significant-figures-calculator",
  name: "Significant Figures Calculator",
  category: "science",
  description: "Count significant figures and round to any precision, with the rules explained.",
  keywords: ["significant figures calculator","sig figs counter","round to significant figures","how many sig figs"],
  icon: Hash,
  processing: "client",
  status: "live",
};

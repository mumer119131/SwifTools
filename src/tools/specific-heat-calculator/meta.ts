import { Flame } from "lucide-react";

import type { Tool } from "@/config/tools";

export const specificHeatCalculator: Tool = {
  slug: "specific-heat-calculator",
  name: "Specific Heat Calculator",
  category: "science",
  description: "Heat energy, mass, capacity or temperature change — with common materials listed.",
  keywords: [
    "specific heat calculator",
    "q = mcat",
    "heat energy calculator",
    "specific heat capacity of water",
    "thermal energy calculator",
  ],
  icon: Flame,
  processing: "client",
  status: "live",
};

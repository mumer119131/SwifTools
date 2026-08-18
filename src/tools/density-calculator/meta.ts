import { Layers } from "lucide-react";

import type { Tool } from "@/config/tools";

export const densityCalculator: Tool = {
  slug: "density-calculator",
  name: "Density Calculator",
  category: "science",
  description: "Solve ρ = m/V for density, mass or volume, with common materials for comparison.",
  keywords: ["density calculator","mass volume density","calculate density formula","g/cm3 calculator","specific gravity"],
  icon: Layers,
  processing: "client",
  status: "live",
};

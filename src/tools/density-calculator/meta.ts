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
  steps: [
    "Choose density, mass or volume as the unknown.",
    "Enter the other two — kilograms and cubic metres, or grams and cubic centimetres, since the ratio is the same.",
    "Compare the result against common materials listed below.",
  ],
};

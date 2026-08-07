import { Activity } from "lucide-react";

import type { Tool } from "@/config/tools";

export const kineticEnergyCalculator: Tool = {
  slug: "kinetic-energy-calculator",
  name: "Kinetic Energy Calculator",
  category: "science",
  description: "Solve KE = ½mv² for energy, mass or velocity, with everyday comparisons.",
  keywords: ["kinetic energy calculator","ke = 1/2mv2","calculate kinetic energy joules","energy of moving object"],
  icon: Activity,
  processing: "client",
  status: "live",
  steps: [
    "Choose energy, mass or velocity as the unknown.",
    "Enter the other two in kilograms and metres per second.",
    "See the result in joules, plus calories and watt-hours for a sense of scale.",
  ],
};

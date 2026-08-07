import { Zap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ohmsLawCalculator: Tool = {
  slug: "ohms-law-calculator",
  name: "Ohm's Law Calculator",
  category: "science",
  description: "Solve for voltage, current, resistance or power — any one from the others.",
  keywords: ["ohms law calculator","voltage current resistance","v=ir calculator","electrical power calculator","ohm law formula"],
  icon: Zap,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Choose which quantity you want — voltage, current, resistance or power.",
    "Enter any two of the others; the fourth is derived automatically.",
    "The formula used is shown beneath the answer so you can check the working.",
  ],
};

import { Radiation } from "lucide-react";

import type { Tool } from "@/config/tools";

export const halfLifeCalculator: Tool = {
  slug: "half-life-calculator",
  name: "Half Life Calculator",
  category: "science",
  description: "Work out remaining quantity, elapsed time or half-life for exponential decay.",
  keywords: ["half life calculator","radioactive decay calculator","exponential decay","carbon dating calculator","decay constant"],
  icon: Radiation,
  processing: "client",
  status: "live",
  steps: [
    "Enter the starting amount, the half-life and how much time has passed.",
    "Or solve for the elapsed time or half-life instead — any one from the others.",
    "A decay table shows the amount after each successive half-life.",
  ],
};

import { Sun } from "lucide-react";

import type { Tool } from "@/config/tools";

export const solarSavingsCalculator: Tool = {
  slug: "solar-savings-calculator",
  name: "Solar Savings Calculator",
  category: "home",
  description: "System size, payback period and lifetime savings from your bill and sun hours.",
  keywords: [
    "solar savings calculator",
    "solar panel payback calculator",
    "solar roi calculator",
    "how many solar panels do i need",
    "solar break even calculator",
  ],
  icon: Sun,
  processing: "client",
  status: "live",
  steps: [
    "Enter your monthly bill or kWh usage and your electricity rate.",
    "Set the peak sun hours where you live and the system cost per watt.",
    "You get system size, panel count, payback period and 25-year savings.",
  ],
};

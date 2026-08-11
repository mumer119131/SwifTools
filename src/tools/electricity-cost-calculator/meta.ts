import { Zap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const electricityCostCalculator: Tool = {
  slug: "electricity-cost-calculator",
  name: "Electricity Cost Calculator",
  category: "home",
  description: "What an appliance costs to run per day, month and year at your electricity rate.",
  keywords: [
    "electricity cost calculator",
    "appliance running cost",
    "kwh cost calculator",
    "watts to cost",
    "how much does it cost to run",
    "energy cost calculator",
  ],
  icon: Zap,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick an appliance or type in its wattage.",
    "Set how many hours a day it runs and your rate per kWh.",
    "You get the cost per day, month and year, and the energy used.",
  ],
};

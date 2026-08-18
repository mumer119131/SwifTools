import { Fuel } from "lucide-react";

import type { Tool } from "@/config/tools";

export const fuelCostCalculator: Tool = {
  slug: "fuel-cost-calculator",
  name: "Fuel Cost Calculator",
  category: "calculator",
  description: "What a journey costs in fuel, in MPG or L/100km, split between passengers.",
  keywords: [
    "fuel cost calculator",
    "petrol cost calculator",
    "trip cost calculator",
    "mpg to l/100km",
    "cost of a journey",
    "fuel calculator",
  ],
  icon: Fuel,
  processing: "client",
  status: "live",
  popular: true,
};

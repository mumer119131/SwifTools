import { Footprints } from "lucide-react";

import type { Tool } from "@/config/tools";

export const paceCalculator: Tool = {
  slug: "pace-calculator",
  name: "Running Pace Calculator",
  category: "calculator",
  description: "Pace, time or distance from the other two — with splits and race predictions.",
  keywords: [
    "pace calculator",
    "running pace calculator",
    "marathon pace calculator",
    "min per km calculator",
    "race time predictor",
    "split times calculator",
    "5k pace",
  ],
  icon: Footprints,
  processing: "client",
  status: "live",
};

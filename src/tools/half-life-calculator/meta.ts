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
};

import { Move } from "lucide-react";

import type { Tool } from "@/config/tools";

export const momentumCalculator: Tool = {
  slug: "momentum-calculator",
  name: "Momentum Calculator",
  category: "science",
  description: "Momentum, mass or velocity from the other two, with impulse and stopping force.",
  keywords: [
    "momentum calculator",
    "p = mv",
    "how to calculate momentum",
    "impulse calculator",
    "conservation of momentum",
  ],
  icon: Move,
  processing: "client",
  status: "live",
};

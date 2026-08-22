import { Orbit } from "lucide-react";

import type { Tool } from "@/config/tools";

export const gravitationalForceCalculator: Tool = {
  slug: "gravitational-force-calculator",
  name: "Gravitational Force Calculator",
  category: "science",
  description: "Newton's law of gravitation, solving for force, either mass or the distance.",
  keywords: [
    "gravitational force calculator",
    "newtons law of gravitation",
    "gravity between two objects",
    "f = gm1m2/r2",
    "gravitational constant",
  ],
  icon: Orbit,
  processing: "client",
  status: "live",
};

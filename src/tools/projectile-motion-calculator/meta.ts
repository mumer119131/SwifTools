import { Rocket } from "lucide-react";

import type { Tool } from "@/config/tools";

export const projectileMotionCalculator: Tool = {
  slug: "projectile-motion-calculator",
  name: "Projectile Motion Calculator",
  category: "science",
  description: "Range, height, flight time and impact speed, with the trajectory drawn.",
  keywords: [
    "projectile motion calculator",
    "range of a projectile",
    "trajectory calculator",
    "launch angle calculator",
    "time of flight physics",
  ],
  icon: Rocket,
  processing: "client",
  status: "live",
};

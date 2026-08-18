import { Fence } from "lucide-react";

import type { Tool } from "@/config/tools";

export const fenceCalculator: Tool = {
  slug: "fence-calculator",
  name: "Fence Calculator",
  category: "home",
  description: "Posts, rails, pickets and concrete for a fence run, from length and post spacing.",
  keywords: [
    "fence calculator",
    "fence post calculator",
    "how many fence pickets",
    "fence materials estimator",
    "picket fence calculator",
  ],
  icon: Fence,
  processing: "client",
  status: "live",
};

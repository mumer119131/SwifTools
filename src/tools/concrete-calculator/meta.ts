import { Blocks } from "lucide-react";

import type { Tool } from "@/config/tools";

export const concreteCalculator: Tool = {
  slug: "concrete-calculator",
  name: "Concrete Calculator",
  category: "home",
  description: "Cubic yards of concrete for a slab, footing or column, plus bags if mixing it yourself.",
  keywords: [
    "concrete calculator",
    "cubic yards of concrete",
    "concrete slab calculator",
    "how many bags of concrete",
    "footing calculator",
    "concrete volume calculator",
  ],
  icon: Blocks,
  processing: "client",
  status: "live",
};

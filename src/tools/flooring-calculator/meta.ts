import { Grid2x2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const flooringCalculator: Tool = {
  slug: "flooring-calculator",
  name: "Flooring Calculator",
  category: "home",
  description: "Boxes of laminate, hardwood or vinyl to buy for a room, waste included.",
  keywords: [
    "flooring calculator",
    "how much flooring do i need",
    "laminate flooring calculator",
    "hardwood flooring calculator",
    "vinyl plank calculator",
    "flooring boxes calculator",
  ],
  icon: Grid2x2,
  processing: "client",
  status: "live",
};

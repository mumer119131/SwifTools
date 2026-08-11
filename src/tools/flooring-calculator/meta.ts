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
  steps: [
    "Enter the room size and how many square feet a box covers.",
    "Set the waste allowance — 10% for straight runs, more for diagonals.",
    "You get boxes to buy, total cost and how much spare you end up with.",
  ],
};

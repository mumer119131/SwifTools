import { LayoutGrid } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tileCalculator: Tool = {
  slug: "tile-calculator",
  name: "Tile Calculator",
  category: "home",
  description: "Tiles, boxes and grout for a floor or wall, from the tile size and area.",
  keywords: [
    "tile calculator",
    "how many tiles do i need",
    "tile area calculator",
    "bathroom tile calculator",
    "grout calculator",
  ],
  icon: LayoutGrid,
  processing: "client",
  status: "live",
  steps: [
    "Enter the area to tile and the size of a single tile.",
    "Add the grout gap and the waste allowance for cuts.",
    "You get tiles, boxes, grout and a total cost.",
  ],
};

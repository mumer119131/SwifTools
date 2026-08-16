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
  notes: [
    "The tile count is not simply area divided by tile size, because the grout joint adds to the space each tile occupies. A 3 mm joint on a 12-inch tile adds about 2 percent to its footprint, which across a large floor is a full box.",
    "Waste allowance covers cuts at the edges and the tiles that break in handling. Ten percent is right for a straight grid in a simple room; 15 to 20 for a diagonal layout, which cuts every perimeter tile at an angle and leaves unusable offcuts.",
    "Keep a few whole tiles back after the job. A cracked tile is straightforward to replace if you have a match and effectively impossible once the line is discontinued — which happens faster than most people expect.",
  ],
  faq: [
    {
      question: "How many tiles do I need?",
      answer: "Divide the area by the coverage of one tile including its grout joint, then add a waste allowance and round up. The joint matters — a 3 mm gap on a 12-inch tile adds about 2 percent to its footprint.",
    },
    {
      question: "How much extra should I allow for tile cuts?",
      answer: "Ten percent for a straight grid in a simple room, and 15 to 20 for a diagonal layout, which cuts every perimeter tile at an angle and leaves offcuts that cannot be used elsewhere.",
    },
    {
      question: "What grout gap should I use?",
      answer: "Two to three millimetres for rectified tiles, which are cut precisely, and about five for rustic or handmade tiles whose edges vary. A wider joint hides size variation; a narrow one demands consistency.",
    },
    {
      question: "How much grout will I need?",
      answer: "It depends on joint width, tile size and depth — wider joints and smaller tiles use much more. The estimate here scales with all three, but the coverage figure on the bag for your specific tile size is more reliable.",
    },
    {
      question: "Should I keep spare tiles?",
      answer: "Yes, a few whole ones. Replacing a cracked tile is easy with a match and effectively impossible without, and tile lines are discontinued faster than most people expect.",
    },
  ],
};

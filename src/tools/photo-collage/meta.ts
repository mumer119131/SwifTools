import { Grid2x2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const photoCollage: Tool = {
  slug: "photo-collage",
  name: "Photo Collage Maker",
  category: "image",
  description: "Lay several photos out in a grid and download the result.",
  keywords: [
    "photo collage maker",
    "picture grid maker",
    "combine photos into one",
    "photo grid",
    "make a collage online",
  ],
  icon: Grid2x2,
  processing: "client",
  status: "live",
  popular: true,
};

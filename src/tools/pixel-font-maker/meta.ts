import { Grid2x2Check } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pixelFontMaker: Tool = {
  slug: "pixel-font-maker",
  name: "Pixel Font Maker",
  category: "fun",
  description: "Draw a bitmap font glyph by glyph and export it as a sprite sheet or JSON.",
  keywords: [
    "pixel font maker",
    "bitmap font editor",
    "pixel font generator",
    "8 bit font maker",
    "game font creator",
    "sprite font editor",
  ],
  icon: Grid2x2Check,
  processing: "client",
  status: "live",
  steps: [
    "Pick a glyph and draw it on the grid — click or drag to fill pixels.",
    "Preview any text in your font as you go.",
    "Export the whole set as a PNG sprite sheet or as JSON.",
  ],
};

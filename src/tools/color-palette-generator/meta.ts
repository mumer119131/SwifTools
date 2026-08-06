import { Palette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorPaletteGenerator: Tool = {
  slug: "color-palette-generator",
  name: "Color Palette Generator",
  category: "color",
  description: "Build harmonious palettes from one seed colour, with a full tint and shade ramp.",
  keywords: [
    "color palette generator",
    "colour scheme generator",
    "complementary colors",
    "triadic color scheme",
    "tailwind color palette generator",
  ],
  icon: Palette,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick a seed colour, or paste one in any format.",
    "Choose a harmony — complementary, triadic, analogous and the rest are generated from colour-wheel relationships.",
    "Copy a single swatch, or export the whole palette as CSS variables, Tailwind tokens or JSON.",
  ],
};

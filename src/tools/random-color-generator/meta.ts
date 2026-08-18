import { Palette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomColorGenerator: Tool = {
  slug: "random-color-generator",
  name: "Random Color Generator",
  category: "fun",
  description: "Generate random colours with hex, RGB and HSL — filtered to ones worth using.",
  keywords: [
    "random color generator",
    "random hex color",
    "random colour picker",
    "random rgb generator",
    "pastel color generator",
  ],
  icon: Palette,
  processing: "client",
  status: "live",
};

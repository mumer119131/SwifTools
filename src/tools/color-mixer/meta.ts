import { Blend } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorMixer: Tool = {
  slug: "color-mixer",
  name: "Color Mixer",
  category: "color",
  description: "Blend two colours and see every step between them, in sRGB or OKLab.",
  keywords: [
    "color mixer",
    "blend two colors",
    "color gradient generator",
    "mix hex colors",
    "color interpolation",
  ],
  icon: Blend,
  processing: "client",
  status: "live",
};

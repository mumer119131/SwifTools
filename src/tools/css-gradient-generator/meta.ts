import { Blend } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cssGradientGenerator: Tool = {
  slug: "css-gradient-generator",
  name: "CSS Gradient Generator",
  category: "developer",
  description: "Build linear, radial and conic CSS gradients visually and copy the code.",
  keywords: [
    "css gradient generator",
    "linear gradient generator",
    "radial gradient css",
    "conic gradient generator",
    "background gradient css",
    "gradient maker",
  ],
  icon: Blend,
  processing: "client",
  status: "live",
  popular: true,
};

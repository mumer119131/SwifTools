import { Square } from "lucide-react";

import type { Tool } from "@/config/tools";

export const boxShadowGenerator: Tool = {
  slug: "box-shadow-generator",
  name: "CSS Box Shadow Generator",
  category: "developer",
  description: "Build layered CSS box shadows visually, including inset and glow, and copy the code.",
  keywords: [
    "box shadow generator",
    "css box shadow",
    "box shadow css generator",
    "layered shadow css",
    "inset shadow generator",
    "drop shadow css",
    "neumorphism generator",
  ],
  icon: Square,
  processing: "client",
  status: "live",
};

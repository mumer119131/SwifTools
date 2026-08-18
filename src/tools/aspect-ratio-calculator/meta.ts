import { Proportions } from "lucide-react";

import type { Tool } from "@/config/tools";

export const aspectRatioCalculator: Tool = {
  slug: "aspect-ratio-calculator",
  name: "Aspect Ratio Calculator",
  category: "developer",
  description: "Find a ratio, resize while keeping it, and see what fits or crops inside a box.",
  keywords: [
    "aspect ratio calculator",
    "16:9 calculator",
    "ratio calculator pixels",
    "resize keeping aspect ratio",
    "what aspect ratio is my image",
    "contain vs cover",
  ],
  icon: Proportions,
  processing: "client",
  status: "live",
};

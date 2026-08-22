import { AudioLines } from "lucide-react";

import type { Tool } from "@/config/tools";

export const decibelCalculator: Tool = {
  slug: "decibel-calculator",
  name: "Decibel Calculator",
  category: "science",
  description: "Convert ratios to decibels, add sound sources, and see how level falls with distance.",
  keywords: [
    "decibel calculator",
    "db to ratio",
    "how to add decibels",
    "sound level over distance",
    "10log vs 20log",
  ],
  icon: AudioLines,
  processing: "client",
  status: "live",
};

import { EyeOff } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorBlindnessSimulator: Tool = {
  slug: "color-blindness-simulator",
  name: "Color Blindness Simulator",
  category: "fun",
  description: "See an image or a palette the way eight forms of colour vision deficiency do.",
  keywords: [
    "color blindness simulator",
    "colour blind simulator",
    "deuteranopia simulator",
    "protanopia simulator",
    "accessibility color checker",
    "daltonize",
  ],
  icon: EyeOff,
  processing: "client",
  status: "live",
  steps: [
    "Drop in a screenshot, or type hex codes to check a palette.",
    "Every simulation is shown side by side with the original.",
    "Everything happens in your browser — the image is never uploaded.",
  ],
};

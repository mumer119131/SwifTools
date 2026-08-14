import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const screenRuler: Tool = {
  slug: "screen-ruler",
  name: "Screen Ruler",
  category: "fun",
  description: "Measure anything on screen in pixels, and in real inches once calibrated.",
  keywords: [
    "screen ruler",
    "online ruler",
    "pixel ruler",
    "measure on screen",
    "virtual ruler",
    "ruler in inches online",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
  steps: [
    "Drag on the canvas to measure — width, height and diagonal are shown.",
    "Calibrate against a bank card to get real-world inches and centimetres.",
    "Your calibration is remembered for next time.",
  ],
};

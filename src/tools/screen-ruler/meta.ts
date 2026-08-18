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
};

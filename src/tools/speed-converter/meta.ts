import { Gauge } from "lucide-react";

import type { Tool } from "@/config/tools";

export const speedConverter: Tool = {
  slug: "speed-converter",
  name: "Speed Converter",
  category: "units",
  description: "Convert km/h, mph, knots, feet per second and metres per second.",
  keywords: [
    "speed converter",
    "kmh to mph",
    "mph to kmh",
    "knots to mph",
    "velocity converter",
  ],
  icon: Gauge,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

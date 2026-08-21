import { Circle } from "lucide-react";

import type { Tool } from "@/config/tools";

export const circleCrop: Tool = {
  slug: "circle-crop",
  name: "Circle Crop",
  category: "image",
  description: "Crop an image to a circle or rounded square, with genuinely transparent corners.",
  keywords: [
    "circle crop",
    "crop image to circle",
    "round profile picture",
    "circular crop online",
    "make image round",
  ],
  icon: Circle,
  processing: "client",
  status: "live",
  popular: true,
};

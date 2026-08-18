import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const roomSizeCalculator: Tool = {
  slug: "room-size-calculator",
  name: "Room Size Calculator",
  category: "home",
  description: "Floor, wall, ceiling and volume for a room, plus the heating and cooling it needs.",
  keywords: [
    "room size calculator",
    "room volume calculator",
    "wall area calculator",
    "room dimensions calculator",
    "btu calculator for room",
    "air changes per hour",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
};

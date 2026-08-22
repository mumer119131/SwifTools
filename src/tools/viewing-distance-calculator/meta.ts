import { Tv } from "lucide-react";

import type { Tool } from "@/config/tools";

export const viewingDistanceCalculator: Tool = {
  slug: "viewing-distance-calculator",
  name: "TV Size and Viewing Distance",
  category: "home",
  description: "What size screen suits your room, and whether the resolution is doing anything.",
  keywords: [
    "tv viewing distance",
    "what size tv should i buy",
    "tv size calculator",
    "4k viewing distance",
    "screen size for room",
    "optimal tv distance",
  ],
  icon: Tv,
  processing: "client",
  status: "live",
  popular: true,
};

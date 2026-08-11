import { Wallpaper } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wallpaperCalculator: Tool = {
  slug: "wallpaper-calculator",
  name: "Wallpaper Calculator",
  category: "home",
  description: "Rolls of wallpaper for a room, with pattern repeat and drop matching accounted for.",
  keywords: [
    "wallpaper calculator",
    "how many rolls of wallpaper",
    "wallpaper rolls calculator",
    "pattern repeat wallpaper",
    "wallpaper estimator",
  ],
  icon: Wallpaper,
  processing: "client",
  status: "live",
  steps: [
    "Enter the room size and the roll's width and length.",
    "Add the pattern repeat — it is the number that decides how many rolls you waste.",
    "You get rolls to buy, drops per roll and the offcut you will be left with.",
  ],
};

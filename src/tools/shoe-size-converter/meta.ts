import { Footprints } from "lucide-react";

import type { Tool } from "@/config/tools";

export const shoeSizeConverter: Tool = {
  slug: "shoe-size-converter",
  name: "Shoe Size Converter",
  category: "converter",
  description: "UK, US, EU and foot length — for men, women and children.",
  keywords: [
    "shoe size converter",
    "uk to us shoe size",
    "eu shoe size conversion",
    "shoe size chart",
    "what size shoe am i",
    "foot length to shoe size",
  ],
  icon: Footprints,
  processing: "client",
  status: "live",
  popular: true,
};

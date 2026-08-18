import { Scale } from "lucide-react";

import type { Tool } from "@/config/tools";

export const weightConverter: Tool = {
  slug: "weight-converter",
  name: "Weight Converter",
  category: "units",
  description: "Convert kilograms, pounds, ounces, stones and tonnes with one tap.",
  keywords: [
    "weight converter",
    "kg to lbs",
    "pounds to kg",
    "mass converter",
    "grams to ounces",
    "stone to kg",
  ],
  icon: Scale,
  processing: "client",
  status: "live",
};

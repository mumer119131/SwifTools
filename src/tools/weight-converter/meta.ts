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
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

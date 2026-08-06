import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unitConverter: Tool = {
  slug: "unit-converter",
  name: "Unit Converter",
  category: "converter",
  description: "Convert length, weight, volume, temperature, area, speed and data.",
  keywords: ["unit converter", "metric to imperial", "length converter", "weight converter"],
  icon: Ruler,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick a category — length, weight, temperature, and so on.",
    "Type a value and choose the units to convert from and to.",
    "The result updates instantly, with the same value shown in every other unit below.",
  ],
};

import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unitConverter: Tool = {
  slug: "unit-converter",
  name: "Unit Converter",
  category: "units",
  description:
    "Every measurement in one place — length, weight, temperature, volume, area, speed, data and time.",
  keywords: [
    "unit converter",
    "metric to imperial",
    "measurement converter",
    "convert units online",
    "unit conversion calculator",
  ],
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

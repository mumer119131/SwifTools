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
};

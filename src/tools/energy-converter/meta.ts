import { BatteryCharging } from "lucide-react";

import type { Tool } from "@/config/tools";

export const energyConverter: Tool = {
  slug: "energy-converter",
  name: "Energy Converter",
  category: "units",
  description: "Convert joules, kilojoules, calories, kilowatt-hours and BTU.",
  keywords: [
    "energy converter",
    "kwh to joules",
    "calories to joules",
    "kcal to kj",
    "btu to kwh",
    "joules to calories",
  ],
  icon: BatteryCharging,
  processing: "client",
  status: "live",
};

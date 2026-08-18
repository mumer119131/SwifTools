import { Thermometer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ovenTemperatureConverter: Tool = {
  slug: "oven-temperature-converter",
  name: "Oven Temperature Converter",
  category: "home",
  description: "Celsius, Fahrenheit and gas mark — including what to set a fan oven to.",
  keywords: [
    "oven temperature conversion",
    "gas mark to celsius",
    "fan oven temperature",
    "celsius to gas mark",
    "oven temperature chart",
    "convection oven conversion",
  ],
  icon: Thermometer,
  processing: "client",
  status: "live",
  popular: true,
};

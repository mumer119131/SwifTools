import { Zap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const powerConverter: Tool = {
  slug: "power-converter",
  name: "Power Converter",
  category: "units",
  description: "Convert watts, kilowatts, horsepower, metric horsepower and BTU per hour.",
  keywords: [
    "power converter",
    "hp to kw",
    "kw to hp",
    "watts to horsepower",
    "bhp to kw",
    "kilowatts to horsepower",
  ],
  icon: Zap,
  processing: "client",
  status: "live",
};

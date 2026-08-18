import { Beaker } from "lucide-react";

import type { Tool } from "@/config/tools";

export const volumeConverter: Tool = {
  slug: "volume-converter",
  name: "Volume Converter",
  category: "units",
  description: "Convert litres, gallons, cups, pints, spoons and fluid ounces.",
  keywords: [
    "volume converter",
    "litres to gallons",
    "ml to oz",
    "cups to ml",
    "liquid measurement converter",
  ],
  icon: Beaker,
  processing: "client",
  status: "live",
};

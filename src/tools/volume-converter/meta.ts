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
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

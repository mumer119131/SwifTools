import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const lengthConverter: Tool = {
  slug: "length-converter",
  name: "Length Converter",
  category: "units",
  description: "Convert metres, feet, inches, miles, yards and more — instantly, in your browser.",
  keywords: [
    "length converter",
    "cm to inches",
    "meters to feet",
    "km to miles",
    "distance converter",
    "metric to imperial length",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

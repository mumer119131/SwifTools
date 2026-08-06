import { Thermometer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const temperatureConverter: Tool = {
  slug: "temperature-converter",
  name: "Temperature Converter",
  category: "units",
  description: "Convert Celsius, Fahrenheit and Kelvin, with the formula shown.",
  keywords: [
    "temperature converter",
    "celsius to fahrenheit",
    "fahrenheit to celsius",
    "c to f",
    "kelvin converter",
  ],
  icon: Thermometer,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

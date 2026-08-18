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
};

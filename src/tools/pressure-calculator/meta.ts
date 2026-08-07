import { Gauge } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pressureCalculator: Tool = {
  slug: "pressure-calculator",
  name: "Pressure Converter",
  category: "science",
  description: "Convert pascals, bar, psi, atmospheres, torr and mmHg — with everyday references.",
  keywords: ["pressure converter","psi to bar","bar to psi","kpa to psi","atm to pascal","pressure unit conversion"],
  icon: Gauge,
  processing: "client",
  status: "live",
  steps: [
    "Enter a pressure and choose the units to convert between.",
    "Every other unit is listed underneath, so you rarely need a second conversion.",
    "Common reference pressures are shown for a sense of scale.",
  ],
};

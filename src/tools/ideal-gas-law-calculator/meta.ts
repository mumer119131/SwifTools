import { Wind } from "lucide-react";

import type { Tool } from "@/config/tools";

export const idealGasLawCalculator: Tool = {
  slug: "ideal-gas-law-calculator",
  name: "Ideal Gas Law Calculator",
  category: "science",
  description: "Solve PV = nRT for pressure, volume, moles or temperature.",
  keywords: [
    "ideal gas law calculator",
    "pv=nrt calculator",
    "gas law calculator",
    "boyles law",
    "charles law calculator",
  ],
  icon: Wind,
  processing: "client",
  status: "live",
};

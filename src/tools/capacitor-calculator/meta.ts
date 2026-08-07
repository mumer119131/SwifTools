import { Battery } from "lucide-react";

import type { Tool } from "@/config/tools";

export const capacitorCalculator: Tool = {
  slug: "capacitor-calculator",
  name: "Capacitor Calculator",
  category: "science",
  description: "RC time constant, capacitive reactance, stored energy and series/parallel totals.",
  keywords: ["capacitor calculator","rc time constant","capacitive reactance","capacitor energy","series parallel capacitors"],
  icon: Battery,
  processing: "client",
  status: "live",
  steps: [
    "Enter capacitance with its prefix — pF, nF and µF are all accepted.",
    "Add a resistance for the RC time constant, or a frequency for reactance.",
    "Series and parallel totals are shown for combining capacitors.",
  ],
};

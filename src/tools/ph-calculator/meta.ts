import { Droplet } from "lucide-react";

import type { Tool } from "@/config/tools";

export const phCalculator: Tool = {
  slug: "ph-calculator",
  name: "pH Calculator",
  category: "science",
  description: "Convert between pH, pOH and ion concentration, with a visual scale.",
  keywords: ["ph calculator","poh calculator","hydrogen ion concentration","acid base ph scale","calculate ph from molarity"],
  icon: Droplet,
  processing: "client",
  status: "live",
};

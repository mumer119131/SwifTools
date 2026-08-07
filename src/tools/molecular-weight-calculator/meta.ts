import { FlaskConical } from "lucide-react";

import type { Tool } from "@/config/tools";

export const molecularWeightCalculator: Tool = {
  slug: "molecular-weight-calculator",
  name: "Molecular Weight Calculator",
  category: "science",
  description: "Parse a chemical formula and get its molar mass, with each element's contribution.",
  keywords: ["molecular weight calculator","molar mass calculator","formula mass","chemical formula weight","percent composition"],
  icon: FlaskConical,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Type a formula — brackets, subscripts and hydrates like CuSO4·5H2O all parse.",
    "The molar mass appears with each element's mass and percentage contribution.",
    "Enter a sample mass to convert straight to moles and molecules.",
  ],
};

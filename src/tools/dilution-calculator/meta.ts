import { FlaskConical } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dilutionCalculator: Tool = {
  slug: "dilution-calculator",
  name: "Dilution Calculator",
  category: "science",
  description: "Solve C1V1 = C2V2 for any of the four, with the solvent to add worked out.",
  keywords: [
    "dilution calculator",
    "c1v1 = c2v2",
    "how to dilute a solution",
    "stock solution calculator",
    "serial dilution",
  ],
  icon: FlaskConical,
  processing: "client",
  status: "live",
};

import { Spline } from "lucide-react";

import type { Tool } from "@/config/tools";

export const hookesLawCalculator: Tool = {
  slug: "hookes-law-calculator",
  name: "Hooke's Law Calculator",
  category: "science",
  description: "Force, spring constant or extension, plus the energy actually stored.",
  keywords: [
    "hookes law calculator",
    "spring constant calculator",
    "f = kx",
    "spring force calculator",
    "elastic potential energy",
  ],
  icon: Spline,
  processing: "client",
  status: "live",
};

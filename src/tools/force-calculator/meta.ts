import { Move } from "lucide-react";

import type { Tool } from "@/config/tools";

export const forceCalculator: Tool = {
  slug: "force-calculator",
  name: "Force Calculator",
  category: "science",
  description: "Solve F = ma for force, mass or acceleration, with weight on Earth shown.",
  keywords: ["force calculator","f=ma calculator","newtons second law","mass acceleration force","calculate newtons"],
  icon: Move,
  processing: "client",
  status: "live",
};

import { RotateCw } from "lucide-react";

import type { Tool } from "@/config/tools";

export const torqueCalculator: Tool = {
  slug: "torque-calculator",
  name: "Torque Calculator",
  category: "science",
  description: "Torque, force or lever arm, converted into pound-feet and the rest.",
  keywords: [
    "torque calculator",
    "newton metres to pound feet",
    "how to calculate torque",
    "lever arm calculator",
    "nm to lb-ft",
  ],
  icon: RotateCw,
  processing: "client",
  status: "live",
};

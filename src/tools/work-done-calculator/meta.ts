import { Hammer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const workDoneCalculator: Tool = {
  slug: "work-done-calculator",
  name: "Work Done Calculator",
  category: "science",
  description: "Work, force or distance, with the power it represents over time.",
  keywords: [
    "work done calculator",
    "w = fd",
    "work energy calculator",
    "how to calculate work in physics",
    "joules from force and distance",
  ],
  icon: Hammer,
  processing: "client",
  status: "live",
};

import { GraduationCap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const gpaCalculator: Tool = {
  slug: "gpa-calculator",
  name: "GPA Calculator",
  category: "calculator",
  description: "Weighted by credit hours, with honours courses and what you need next term.",
  keywords: [
    "gpa calculator",
    "weighted gpa",
    "how to calculate gpa",
    "grade point average",
    "uk degree classification calculator",
  ],
  icon: GraduationCap,
  processing: "client",
  status: "live",
};

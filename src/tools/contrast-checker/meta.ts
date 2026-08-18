import { Contrast } from "lucide-react";

import type { Tool } from "@/config/tools";

export const contrastChecker: Tool = {
  slug: "contrast-checker",
  name: "Contrast Checker",
  category: "color",
  description: "Check colour contrast against WCAG AA and AAA, and get a passing colour if it fails.",
  keywords: [
    "contrast checker",
    "wcag contrast checker",
    "color contrast ratio",
    "accessibility contrast",
    "aa contrast checker",
    "text contrast checker",
    "4.5 to 1 contrast",
  ],
  icon: Contrast,
  processing: "client",
  status: "live",
  popular: true,
};

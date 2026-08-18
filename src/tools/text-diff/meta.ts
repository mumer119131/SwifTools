import { GitCompare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const textDiff: Tool = {
  slug: "text-diff",
  name: "Text Diff Checker",
  category: "text",
  description: "Compare two texts side by side and see exactly what was added, removed or changed.",
  keywords: [
    "text diff checker",
    "compare two texts online",
    "text comparison tool",
    "find difference between texts",
    "diff tool free",
  ],
  icon: GitCompare,
  processing: "client",
  status: "live",
  popular: true,
};

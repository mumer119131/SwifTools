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
  steps: [
    "Paste the original text on the left and the changed version on the right.",
    "Differences are highlighted line by line: green for additions, red for removals.",
    "Switch to unified view for a patch-style diff you can copy into a review.",
  ],
};

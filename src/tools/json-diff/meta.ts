import { GitCompare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsonDiff: Tool = {
  slug: "json-diff",
  name: "JSON Diff",
  category: "developer",
  description: "Compare two JSON documents structurally, so key order and formatting do not matter.",
  keywords: [
    "json diff",
    "compare json",
    "json compare tool",
    "json difference checker",
    "diff two json files",
  ],
  icon: GitCompare,
  processing: "client",
  status: "live",
  popular: true,
};

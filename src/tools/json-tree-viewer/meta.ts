import { ListTree } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsonTreeViewer: Tool = {
  slug: "json-tree-viewer",
  name: "JSON Tree Viewer",
  category: "developer",
  description: "Explore large JSON as a collapsible tree, with search and copyable key paths.",
  keywords: [
    "json viewer",
    "json tree viewer",
    "json explorer online",
    "visualize json",
    "json path finder",
  ],
  icon: ListTree,
  processing: "client",
  status: "live",
};

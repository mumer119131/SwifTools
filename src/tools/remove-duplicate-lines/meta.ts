import { ListX } from "lucide-react";

import type { Tool } from "@/config/tools";

export const removeDuplicateLines: Tool = {
  slug: "remove-duplicate-lines",
  name: "Remove Duplicate Lines",
  category: "text",
  description: "Strip repeated lines from a list, with optional sorting and whitespace cleanup.",
  keywords: [
    "remove duplicate lines",
    "deduplicate list online",
    "delete repeated lines",
    "unique lines tool",
    "sort and dedupe text",
  ],
  icon: ListX,
  processing: "client",
  status: "live",
};

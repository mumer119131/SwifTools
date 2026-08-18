import { Replace } from "lucide-react";

import type { Tool } from "@/config/tools";

export const findAndReplace: Tool = {
  slug: "find-and-replace",
  name: "Find and Replace",
  category: "text",
  description: "Replace text across a whole document, with regex, whole-word and case options.",
  keywords: [
    "find and replace",
    "search and replace text",
    "replace text online",
    "regex replace",
    "bulk find replace",
    "text replacer",
  ],
  icon: Replace,
  processing: "client",
  status: "live",
  popular: true,
};

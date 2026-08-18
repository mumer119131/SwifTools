import { CaseSensitive } from "lucide-react";

import type { Tool } from "@/config/tools";

export const caseConverter: Tool = {
  slug: "case-converter",
  name: "Case Converter",
  category: "text",
  description: "Switch text between sentence, title, camel, snake, kebab and eight more cases.",
  keywords: [
    "case converter",
    "uppercase to lowercase",
    "title case converter",
    "camelcase converter",
    "snake case converter",
  ],
  icon: CaseSensitive,
  processing: "client",
  status: "live",
};

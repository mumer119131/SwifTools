import { ArrowDownUp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sortLines: Tool = {
  slug: "sort-lines",
  name: "Sort Lines",
  category: "text",
  description: "Sort a list alphabetically, numerically or by length — with natural order that gets 2 before 10.",
  keywords: [
    "sort lines",
    "alphabetize list",
    "sort text online",
    "sort list alphabetically",
    "natural sort",
    "sort numbers",
    "reverse list",
  ],
  icon: ArrowDownUp,
  processing: "client",
  status: "live",
};

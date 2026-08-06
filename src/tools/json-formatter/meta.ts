import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsonFormatter: Tool = {
  slug: "json-formatter",
  name: "JSON Formatter",
  category: "developer",
  description: "Format, validate and minify JSON with clear error positions.",
  keywords: ["json formatter", "json validator", "json beautifier", "prettify json", "minify json"],
  icon: Braces,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Paste your JSON — valid or not.",
    "It is parsed as you type. Errors report the exact line and column, with the offending text highlighted.",
    "Switch between beautified and minified output, then copy or download the result.",
  ],
};

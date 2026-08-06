import { FileCode2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const htmlFormatter: Tool = {
  slug: "html-formatter",
  name: "HTML Formatter",
  category: "developer",
  description: "Beautify or minify HTML with consistent indentation.",
  keywords: ["html formatter", "html beautifier", "html minifier", "prettify html"],
  icon: FileCode2,
  processing: "client",
  status: "live",
  steps: [
    "Paste your HTML, however messy.",
    "Beautify to re-indent it, or minify to strip whitespace and comments for production.",
    "Copy or download the result. Content inside pre, textarea and script is left untouched.",
  ],
};

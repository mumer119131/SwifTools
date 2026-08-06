import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsFormatter: Tool = {
  slug: "js-formatter",
  name: "JavaScript Formatter",
  category: "developer",
  description: "Beautify JavaScript or TypeScript with Prettier, including JSX.",
  keywords: [
    "javascript formatter",
    "js beautifier",
    "prettify javascript",
    "format typescript online",
    "prettier online",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
  steps: [
    "Paste JavaScript, TypeScript or JSX and pick the matching parser.",
    "Prettier reprints it from the AST, so the output is genuinely reformatted rather than nudged.",
    "Set quote style, semicolons and line width to match your project.",
  ],
};

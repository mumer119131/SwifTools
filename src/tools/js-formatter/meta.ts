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
};

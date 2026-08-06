import { Minimize2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cssMinifier: Tool = {
  slug: "css-minifier",
  name: "CSS Minifier",
  category: "developer",
  description: "Strip comments and whitespace from CSS, and shorten hex colours and zero units.",
  keywords: ["css minifier", "minify css", "compress css online", "css compressor"],
  icon: Minimize2,
  processing: "client",
  status: "live",
  steps: [
    "Paste your stylesheet.",
    "Comments and whitespace go, hex colours shorten to three digits where possible, and zero values lose their units.",
    "Copy or download the result, with the byte saving shown against the original.",
  ],
};

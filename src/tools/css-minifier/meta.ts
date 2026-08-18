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
};

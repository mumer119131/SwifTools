import { Zap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsMinifier: Tool = {
  slug: "js-minifier",
  name: "JavaScript Minifier",
  category: "developer",
  description: "Real minification via Terser — dead-code elimination and identifier mangling.",
  keywords: [
    "javascript minifier",
    "minify js",
    "js compressor online",
    "uglify javascript",
    "terser online",
  ],
  icon: Zap,
  processing: "client",
  status: "live",
  steps: [
    "Paste your JavaScript, as a module or a plain script.",
    "Terser parses it to an AST, removes unreachable code and renames local variables.",
    "Compare the byte saving, then copy or download the result.",
  ],
};

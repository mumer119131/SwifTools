import { AlignLeft } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cssFormatter: Tool = {
  slug: "css-formatter",
  name: "CSS Formatter",
  category: "developer",
  description: "Beautify CSS, SCSS or Less with consistent indentation, using Prettier.",
  keywords: ["css formatter", "css beautifier", "prettify css", "format scss", "css indent"],
  icon: AlignLeft,
  processing: "client",
  status: "live",
  steps: [
    "Paste CSS, SCSS or Less and pick the matching syntax.",
    "It is parsed and reprinted by Prettier — the same engine your editor runs — so the result matches your project's own tooling.",
    "Adjust indentation and line width, then copy or download.",
  ],
};

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
};

import { SearchCode } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wordSearch: Tool = {
  slug: "word-search",
  name: "Word Search Maker",
  category: "fun",
  description: "Turn any word list into a printable word search puzzle, with an answer key.",
  keywords: [
    "word search maker",
    "word search generator",
    "printable word search",
    "custom word search",
    "word find puzzle maker",
  ],
  icon: SearchCode,
  processing: "client",
  status: "live",
  steps: [
    "Paste your words, one per line.",
    "Choose the grid size and which directions words may run.",
    "Print the puzzle, and the answer key separately.",
  ],
};

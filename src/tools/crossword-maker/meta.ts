import { TableProperties } from "lucide-react";

import type { Tool } from "@/config/tools";

export const crosswordMaker: Tool = {
  slug: "crossword-maker",
  name: "Crossword Maker",
  category: "fun",
  description: "Turn a list of words and clues into a printable criss-cross crossword.",
  keywords: [
    "crossword maker",
    "crossword puzzle generator",
    "custom crossword",
    "printable crossword",
    "criss cross puzzle maker",
    "vocabulary crossword",
  ],
  icon: TableProperties,
  processing: "client",
  status: "live",
  steps: [
    "Enter each word with its clue, one per line: WORD = clue.",
    "The grid is built by crossing words at shared letters.",
    "Print the puzzle with the clue list, or reveal the answers.",
  ],
};

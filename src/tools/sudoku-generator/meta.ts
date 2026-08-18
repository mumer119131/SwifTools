import { Grid3x3 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sudokuGenerator: Tool = {
  slug: "sudoku-generator",
  name: "Sudoku Generator",
  category: "fun",
  description: "Generate a sudoku with exactly one solution, at four difficulties, ready to print.",
  keywords: [
    "sudoku generator",
    "printable sudoku",
    "free sudoku puzzles",
    "sudoku maker",
    "easy sudoku",
    "hard sudoku",
  ],
  icon: Grid3x3,
  processing: "client",
  status: "live",
};

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
  steps: [
    "Pick a difficulty and generate. Every puzzle has exactly one solution.",
    "Play it here, or print it — the print layout drops everything but the grid.",
    "Each puzzle has a seed, so the same code always gives the same puzzle.",
  ],
  notes: [
    "Every puzzle is verified to have exactly one solution. Cells are removed from a complete grid one at a time, and any removal that would leave two possible answers is put back. That guarantee is the whole point: a sudoku with two solutions cannot be reasoned to an answer, only guessed at, and plenty of generators skip the check.",
    "Difficulty here is set by how many clues remain — 45 for easy down to about 24 for expert. Clue count correlates with difficulty but does not determine it: a 30-clue puzzle needing only simple techniques is easier than a 35-clue one requiring an X-wing.",
    "Each puzzle has a seed, so the same code always regenerates the same grid. That makes a puzzle shareable as five characters rather than as a wall of numbers.",
  ],
  faq: [
    {
      question: "Does every sudoku have only one solution?",
      answer: "A properly constructed one does, and every puzzle here is verified. Cells are removed only if the grid still has a unique answer — a sudoku with two solutions cannot be solved by logic, only guessed.",
    },
    {
      question: "What is the minimum number of clues in a sudoku?",
      answer: "Seventeen, proven by exhaustive computer search in 2012. No 16-clue puzzle can have a unique solution. The expert setting here stops well above that, around 24.",
    },
    {
      question: "How is sudoku difficulty determined?",
      answer: "Partly by clue count and partly by which solving techniques are needed. Fewer clues generally means harder, but a 30-clue puzzle needing only scanning is easier than a 35-clue one requiring advanced patterns.",
    },
    {
      question: "Can I get the same puzzle again?",
      answer: "Yes — each puzzle has a seed, and entering it regenerates the identical grid. That makes a puzzle shareable as a short code rather than a picture.",
    },
    {
      question: "Can I print the puzzle?",
      answer: "Yes. The print layout drops the interface and leaves the grid, so it prints as a clean puzzle sheet.",
    },
  ],
};

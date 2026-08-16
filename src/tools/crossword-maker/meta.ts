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
  notes: [
    "This builds a criss-cross puzzle: words cross at shared letters and the grid is trimmed to whatever shape they make, rather than being forced into the symmetrical block of a newspaper crossword.",
    "Placements are scored on how many crossings they make and how compact they keep the grid. A puzzle where every word touches in exactly one place and sprawls over forty columns is technically a crossword and useless as one, which is why compactness is part of the score rather than an afterthought.",
    "A dozen arrangements are tried and the densest kept, because the outcome depends heavily on which word lands first. That is also why rebuilding can produce a noticeably better grid from the same word list.",
  ],
  faq: [
    {
      question: "How do I make a crossword puzzle?",
      answer: "Enter each word with its clue, one per line as WORD = clue. The grid is built by crossing words at shared letters and numbered in reading order, with across and down clue lists generated automatically.",
    },
    {
      question: "Why won't some words fit in the crossword?",
      answer: "Because they share no letters with anything already placed. Every word after the first has to cross an existing one, so a word with unusual letters may have nowhere to go — rebuilding often finds a different arrangement that works.",
    },
    {
      question: "Is this the same as a newspaper crossword?",
      answer: "No. This is a criss-cross puzzle: the grid is whatever shape the words make. Newspaper crosswords use a fixed symmetrical grid with black squares and every letter checked, which constrains the word list very differently.",
    },
    {
      question: "Why does rebuilding change the puzzle so much?",
      answer: "Because the shape depends heavily on which word is placed first. A dozen arrangements are tried each time and the densest kept, so a rebuild genuinely can produce a better grid from the same words.",
    },
    {
      question: "How many words should I use?",
      answer: "Ten to twenty makes a satisfying puzzle. Words that share common letters — vowels, R, S, T — cross more easily, so a mixed list produces a denser grid than one full of unusual letters.",
    },
  ],
};

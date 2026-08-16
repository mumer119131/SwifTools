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
  notes: [
    "Long words are placed first into an empty grid, because the hard ones need the space before it is used up. Words are allowed to cross where they share a letter, which is what stops the result looking like a list with noise sprinkled around it.",
    "Difficulty is set by which directions words may run. Easy is across and down only; medium adds diagonals; hard adds every direction backwards, which is what makes a puzzle genuinely take time.",
    "Anything that will not fit is named rather than quietly dropped — usually a word longer than the grid, or one that shares no letters with anything already placed. Making the grid bigger or allowing more directions almost always resolves it.",
  ],
  faq: [
    {
      question: "How do I make a word search puzzle?",
      answer: "Paste your words one per line, choose a grid size and a difficulty, and the puzzle is generated with an answer key. Words are placed longest first so the difficult ones get the empty grid.",
    },
    {
      question: "What grid size should I use?",
      answer: "About 15×15 for a dozen words of ordinary length. The grid needs to be at least as wide as your longest word, and too large a grid for too few words makes the puzzle tedious rather than hard.",
    },
    {
      question: "Why won't some of my words fit?",
      answer: "Either the word is longer than the grid, or there was no legal position left after the others were placed. Increasing the grid size or allowing more directions almost always resolves it.",
    },
    {
      question: "How do I make a word search harder?",
      answer: "Allow more directions. Easy runs across and down only; hard allows all eight including backwards, which is what makes players scan rather than skim.",
    },
    {
      question: "Can I print the puzzle and answer key?",
      answer: "Yes. The answer key highlights the placed words and can be toggled separately, so you can print the puzzle for players and the key for yourself.",
    },
  ],
};

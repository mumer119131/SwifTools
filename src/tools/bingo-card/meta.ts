import { LayoutGrid } from "lucide-react";

import type { Tool } from "@/config/tools";

export const bingoCard: Tool = {
  slug: "bingo-card",
  name: "Bingo Card Generator",
  category: "fun",
  description: "Make printable bingo cards from numbers or your own words — every card different.",
  keywords: [
    "bingo card generator",
    "printable bingo cards",
    "custom bingo cards",
    "bingo maker",
    "free bingo cards",
    "buzzword bingo",
  ],
  icon: LayoutGrid,
  processing: "client",
  status: "live",
  steps: [
    "Use classic numbers, or paste your own words for a themed card.",
    "Choose how many cards you need — each one gets a different arrangement.",
    "Print them. The print layout drops everything but the cards.",
  ],
  notes: [
    "Classic cards draw each column from its own range — B from 1 to 15, I from 16 to 30, and so on — which is what makes them bingo cards rather than grids of random numbers. The centre square is free on an odd-sized grid, as tradition requires.",
    "Word mode replaces the numbers with your own entries, which is how buzzword bingo and themed party cards are made. If you supply fewer words than there are squares, some will repeat within a card; more words means more variety between cards.",
    "Every card is generated from a shared seed with its own index, so printing forty gives forty different cards and regenerating from the same seed gives the same forty back. That matters if you print a batch, lose one and need to reprint it.",
  ],
  faq: [
    {
      question: "How do I make custom bingo cards?",
      answer: "Switch to word mode and paste your own entries, one per line. Each card gets its own arrangement, so printing a batch gives everyone a different card.",
    },
    {
      question: "What are the number ranges on a bingo card?",
      answer: "B is 1 to 15, I is 16 to 30, N is 31 to 45, G is 46 to 60 and O is 61 to 75. Each column draws only from its own range, which is what makes it a bingo card.",
    },
    {
      question: "How many words do I need for a bingo card?",
      answer: "At least as many as there are squares — 24 for a 5×5 with a free centre. More gives greater variety between cards; fewer means some words repeat within a single card.",
    },
    {
      question: "Are all the cards different?",
      answer: "Yes. Each is generated from the shared seed plus its own index, so a batch of forty gives forty different arrangements — and regenerating from the same seed reproduces the same batch.",
    },
    {
      question: "Is there a free space in the middle?",
      answer: "On odd-sized grids, yes — 3×3 and 5×5 have a free centre square by convention. Even grids such as 4×4 have no centre square, so every cell is filled.",
    },
  ],
};

import { Brain } from "lucide-react";

import type { Tool } from "@/config/tools";

export const memoryGame: Tool = {
  slug: "memory-game",
  name: "Memory Game",
  category: "fun",
  description: "The classic pairs game — flip cards, find matches, beat your best time.",
  keywords: [
    "memory game",
    "matching pairs game",
    "concentration game",
    "memory card game online",
    "free memory game",
  ],
  icon: Brain,
  processing: "client",
  status: "live",
  steps: [
    "Pick a grid size and start.",
    "Flip two cards. If they match they stay face up.",
    "Clear the board in as few moves as you can — your best is saved.",
  ],
  notes: [
    "The classic pairs game: flip two cards, and matching ones stay face up. The deck is shuffled with Fisher–Yates from the browser's cryptographic random source, so no two games start the same way.",
    "A perfect game is one move per pair, which requires remembering every card you have turned over. That is harder than it sounds past about twelve pairs, and the gap between your score and the perfect score is a reasonable proxy for working memory on the day.",
    "Best scores are kept per board size in this browser. Larger boards are not simply longer — the number of cards to hold in mind grows with the board, so the difficulty rises faster than the card count does.",
  ],
  faq: [
    {
      question: "What is a perfect score in a memory game?",
      answer: "One move per pair — eight moves on a 4×4 board. It requires remembering the position of every card you have turned over, which is considerably harder past about twelve pairs.",
    },
    {
      question: "Does the memory game improve memory?",
      answer: "It exercises short-term spatial memory while you play. Evidence that such games transfer to general memory improvement is weak, so treat it as a game rather than as training.",
    },
    {
      question: "Is the card layout different every game?",
      answer: "Yes. The deck is shuffled with Fisher–Yates from cryptographic randomness on every new game, so no arrangement repeats in any predictable way.",
    },
    {
      question: "Are my scores saved?",
      answer: "Yes, per board size, in this browser's local storage. They do not sync anywhere and clearing site data removes them.",
    },
    {
      question: "Which board size should I start with?",
      answer: "4×4, eight pairs, which most people can clear in around 12 to 20 moves. The larger boards grow in difficulty faster than the card count suggests, because the number of positions to hold in mind grows with them.",
    },
  ],
};

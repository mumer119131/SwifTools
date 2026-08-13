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
};

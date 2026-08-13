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
};

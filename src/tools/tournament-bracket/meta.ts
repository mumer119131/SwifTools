import { Trophy } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tournamentBracket: Tool = {
  slug: "tournament-bracket",
  name: "Tournament Bracket Generator",
  category: "fun",
  description: "Build a single-elimination bracket from a list of players, seeded or drawn at random.",
  keywords: [
    "tournament bracket generator",
    "bracket maker",
    "single elimination bracket",
    "playoff bracket generator",
    "knockout bracket",
    "tournament draw",
  ],
  icon: Trophy,
  processing: "client",
  status: "live",
};

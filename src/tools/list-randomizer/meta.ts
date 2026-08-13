import { Shuffle } from "lucide-react";

import type { Tool } from "@/config/tools";

export const listRandomizer: Tool = {
  slug: "list-randomizer",
  name: "List Randomizer",
  category: "fun",
  description: "Shuffle a list into a fair random order, or split it into random groups.",
  keywords: [
    "list randomizer",
    "shuffle a list",
    "random order generator",
    "randomize list",
    "team generator",
    "random group generator",
  ],
  icon: Shuffle,
  processing: "client",
  status: "live",
  steps: [
    "Paste your list, one item per line.",
    "Shuffle it into a random order, or split it into groups or teams.",
    "Fisher–Yates is used, so every ordering is equally likely.",
  ],
};

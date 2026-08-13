import { Dices } from "lucide-react";

import type { Tool } from "@/config/tools";

export const diceRoller: Tool = {
  slug: "dice-roller",
  name: "Dice Roller",
  category: "fun",
  description: "Roll any dice — 3d6, 1d20+5, 4d6 drop lowest — with the full breakdown.",
  keywords: ["dice roller","roll dice online","d20 roller","dnd dice roller","3d6","virtual dice"],
  icon: Dices,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Type standard dice notation like 2d6+3, or tap a preset.",
    "Every individual die is shown, not just the total.",
    "Advantage, disadvantage and drop-lowest are built in.",
  ],
};

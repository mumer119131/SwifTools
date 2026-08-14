import { GitCompareArrows } from "lucide-react";

import type { Tool } from "@/config/tools";

export const thisOrThat: Tool = {
  slug: "this-or-that",
  name: "This or That",
  category: "fun",
  description: "Would-you-rather style pairs where both sides are genuinely defensible.",
  keywords: ["this or that questions","would you rather","this or that generator","party game questions"],
  icon: GitCompareArrows,
  processing: "client",
  status: "live",
  steps: [
    "Generate a round of pairs.",
    "Go round the group — everyone picks a side and says why.",
    "Copy the round to read from.",
  ],
};

import { Scale } from "lucide-react";

import type { Tool } from "@/config/tools";

export const decisionMaker: Tool = {
  slug: "decision-maker",
  name: "Decision Maker",
  category: "fun",
  description: "Can't choose? Pick at random, or run your options head-to-head until one wins.",
  keywords: [
    "decision maker",
    "decision wheel",
    "help me decide",
    "yes or no generator",
    "random decision maker",
    "what should i do",
  ],
  icon: Scale,
  processing: "client",
  status: "live",
};

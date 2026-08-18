import { HandCoins } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tipCalculator: Tool = {
  slug: "tip-calculator",
  name: "Tip Calculator",
  category: "calculator",
  description: "Work out a tip and split the bill, with tax handled properly and rounding options.",
  keywords: [
    "tip calculator",
    "split the bill calculator",
    "gratuity calculator",
    "how much to tip",
    "bill splitter",
    "20 percent tip calculator",
  ],
  icon: HandCoins,
  processing: "client",
  status: "live",
  popular: true,
};

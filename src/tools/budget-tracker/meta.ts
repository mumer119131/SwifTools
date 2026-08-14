import { PiggyBank } from "lucide-react";

import type { Tool } from "@/config/tools";

export const budgetTracker: Tool = {
  slug: "budget-tracker",
  name: "Budget Tracker",
  category: "fun",
  description: "A monthly budget: income against categorised spending, with what's left over.",
  keywords: [
    "budget tracker",
    "monthly budget planner",
    "expense tracker",
    "budget calculator",
    "50 30 20 budget",
    "personal budget spreadsheet",
  ],
  icon: PiggyBank,
  processing: "client",
  status: "live",
  steps: [
    "Enter your monthly income and list what you spend.",
    "Each line is categorised, and the split is shown against the 50/30/20 rule.",
    "Everything is saved in this browser — nothing is uploaded.",
  ],
};

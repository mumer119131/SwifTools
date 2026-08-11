import { NotebookPen } from "lucide-react";

import type { Tool } from "@/config/tools";

export const calorieTracker: Tool = {
  slug: "calorie-tracker",
  name: "Calorie Tracker",
  category: "home",
  description: "Log what you eat against a daily target, with protein, carbs and fat totalled.",
  keywords: [
    "calorie tracker",
    "food diary",
    "calorie counter",
    "macro tracker",
    "daily calorie log",
    "food log",
  ],
  icon: NotebookPen,
  processing: "client",
  status: "live",
  steps: [
    "Set a daily calorie target and macro split.",
    "Log foods as you eat them, by meal.",
    "Totals update as you go and each day is kept separately in this browser.",
  ],
};

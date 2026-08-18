import { CalendarDays } from "lucide-react";

import type { Tool } from "@/config/tools";

export const mealPlanner: Tool = {
  slug: "meal-planner",
  name: "Meal Planner",
  category: "home",
  description: "Plan a week of meals in a grid and turn it straight into a shopping list.",
  keywords: [
    "meal planner",
    "weekly meal planner",
    "meal plan template",
    "dinner planner",
    "meal prep planner",
    "food planner",
  ],
  icon: CalendarDays,
  processing: "client",
  status: "live",
};

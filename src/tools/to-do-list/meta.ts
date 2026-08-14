import { ListChecks } from "lucide-react";

import type { Tool } from "@/config/tools";

export const toDoList: Tool = {
  slug: "to-do-list",
  name: "To-Do List",
  category: "fun",
  description: "A simple to-do list with priorities that stays in your browser — no account.",
  keywords: [
    "to do list",
    "todo list online",
    "task list maker",
    "simple todo app",
    "checklist online",
    "free to do list",
  ],
  icon: ListChecks,
  processing: "client",
  status: "live",
  steps: [
    "Add tasks and set a priority on the ones that need it.",
    "Tick them off as you go — everything is saved as you type.",
    "Filter to what is left, or clear the done ones out.",
  ],
};

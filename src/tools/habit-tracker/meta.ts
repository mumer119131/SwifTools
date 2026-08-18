import { CalendarCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const habitTracker: Tool = {
  slug: "habit-tracker",
  name: "Habit Tracker",
  category: "fun",
  description: "Track daily habits on a grid, with streaks — saved in your browser, no account.",
  keywords: [
    "habit tracker",
    "daily habit tracker",
    "streak tracker",
    "habit tracker online",
    "printable habit tracker",
  ],
  icon: CalendarCheck,
  processing: "client",
  status: "live",
};

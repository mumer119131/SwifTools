import { CalendarClock } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cronExpressionBuilder: Tool = {
  slug: "cron-expression-builder",
  name: "Cron Expression Builder",
  category: "developer",
  description: "Write a cron schedule, read it back in plain English, and see exactly when it will next run.",
  keywords: [
    "cron expression",
    "crontab generator",
    "cron builder",
    "explain cron",
    "cron schedule",
    "crontab guru",
    "cron syntax",
    "when will my cron run",
  ],
  icon: CalendarClock,
  processing: "client",
  status: "live",
  popular: true,
};

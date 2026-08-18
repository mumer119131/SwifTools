import { CalendarRange } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dateDifferenceCalculator: Tool = {
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  category: "calculator",
  description: "Count the days between two dates, in weeks, months and working days — or add to a date.",
  keywords: [
    "date difference calculator",
    "days between dates",
    "date duration calculator",
    "how many days until",
    "working days calculator",
    "add days to a date",
    "business days between dates",
  ],
  icon: CalendarRange,
  processing: "client",
  status: "live",
  popular: true,
};

import { CalendarDays } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ageCalculator: Tool = {
  slug: "age-calculator",
  name: "Age Calculator",
  category: "calculator",
  description: "Find an exact age in years, months and days — and when the next birthday lands.",
  keywords: ["age calculator", "date of birth calculator", "how old am i"],
  icon: CalendarDays,
  processing: "client",
  status: "live",
  steps: [
    "Enter a date of birth, and optionally a date to measure to instead of today.",
    "The exact age is shown in years, months and days, plus the same span in weeks, days and hours.",
    "The next birthday and the weekday it falls on are worked out too.",
  ],
};

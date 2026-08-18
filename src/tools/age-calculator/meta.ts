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
};

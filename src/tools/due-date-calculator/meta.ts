import { Baby } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dueDateCalculator: Tool = {
  slug: "due-date-calculator",
  name: "Due Date Calculator",
  category: "calculator",
  description: "Estimated due date from your last period, conception date or IVF transfer.",
  keywords: [
    "due date calculator",
    "pregnancy due date",
    "how many weeks pregnant am i",
    "estimated due date",
    "ivf due date",
    "conception date calculator",
  ],
  icon: Baby,
  processing: "client",
  status: "live",
  popular: true,
};

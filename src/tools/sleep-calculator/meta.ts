import { Moon } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sleepCalculator: Tool = {
  slug: "sleep-calculator",
  name: "Sleep Calculator",
  category: "calculator",
  description: "Work out when to go to bed — or set an alarm — to wake at the end of a sleep cycle.",
  keywords: [
    "sleep calculator",
    "bedtime calculator",
    "when should i go to sleep",
    "sleep cycle calculator",
    "what time should i wake up",
    "90 minute sleep cycle",
  ],
  icon: Moon,
  processing: "client",
  status: "live",
  popular: true,
};

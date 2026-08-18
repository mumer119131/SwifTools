import { Timer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const timer: Tool = {
  slug: "timer",
  name: "Timer and Stopwatch",
  category: "generator",
  description: "A countdown timer with an alarm, and a stopwatch with laps. Accurate in a background tab.",
  keywords: [
    "online timer",
    "countdown timer",
    "stopwatch online",
    "5 minute timer",
    "10 minute timer",
    "1 minute timer",
    "kitchen timer",
    "lap timer",
    "set a timer",
  ],
  icon: Timer,
  processing: "client",
  status: "live",
  popular: true,
};

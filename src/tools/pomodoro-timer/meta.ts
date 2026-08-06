import { Timer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pomodoroTimer: Tool = {
  slug: "pomodoro-timer",
  name: "Pomodoro Timer",
  category: "generator",
  description: "A focus timer with work and break intervals, a gentle chime and a session count.",
  keywords: ["pomodoro timer", "focus timer", "25 minute timer", "productivity timer"],
  icon: Timer,
  processing: "client",
  status: "live",
  steps: [
    "Press start. The default is 25 minutes of focus followed by a 5-minute break.",
    "After four rounds you get a longer break. Durations are adjustable in settings.",
    "The tab title counts down too, so you can leave it in the background and still see the time.",
  ],
};

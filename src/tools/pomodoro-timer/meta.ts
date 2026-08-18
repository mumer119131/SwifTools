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
};

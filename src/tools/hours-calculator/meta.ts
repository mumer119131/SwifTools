import { Clock4 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const hoursCalculator: Tool = {
  slug: "hours-calculator",
  name: "Work Hours Calculator",
  category: "calculator",
  description: "Add up a week of shifts, with breaks, overnight hours and overtime.",
  keywords: [
    "hours calculator",
    "work hours calculator",
    "timesheet calculator",
    "time card calculator",
    "hours worked between two times",
    "overtime calculator",
    "weekly hours calculator",
  ],
  icon: Clock4,
  processing: "client",
  status: "live",
};

import { Clock } from "lucide-react";

import type { Tool } from "@/config/tools";

export const timezoneConverter: Tool = {
  slug: "timezone-converter",
  name: "Timezone Converter",
  category: "converter",
  description: "Compare a time across cities and find a slot that works for everyone.",
  keywords: ["timezone converter", "time zone calculator", "utc converter", "meeting planner"],
  icon: Clock,
  processing: "client",
  status: "live",
  steps: [
    "Set a date and time, and the zone it is in — your own is detected automatically.",
    "Add the zones you care about. Each shows the local time, the UTC offset and the day difference.",
    "Use the day strip to spot the hours that fall inside working time everywhere at once.",
  ],
};

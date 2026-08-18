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
};

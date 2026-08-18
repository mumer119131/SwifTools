import { Timer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const timeConverter: Tool = {
  slug: "time-converter",
  name: "Time Converter",
  category: "units",
  description: "Convert milliseconds, seconds, minutes, hours, days, weeks and years.",
  keywords: [
    "time converter",
    "hours to minutes",
    "seconds to minutes",
    "days to hours",
    "duration converter",
  ],
  icon: Timer,
  processing: "client",
  status: "live",
};

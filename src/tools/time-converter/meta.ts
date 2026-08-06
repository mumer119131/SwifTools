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
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};

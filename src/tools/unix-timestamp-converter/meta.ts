import { Clock } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unixTimestampConverter: Tool = {
  slug: "unix-timestamp-converter",
  name: "Unix Timestamp Converter",
  category: "converter",
  description: "Convert epoch time to a readable date and back, in seconds, milliseconds or ISO.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "epoch time converter",
    "unix time",
    "milliseconds to date",
  ],
  icon: Clock,
  processing: "client",
  status: "live",
  popular: true,
};

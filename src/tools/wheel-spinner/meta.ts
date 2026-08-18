import { Disc3 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wheelSpinner: Tool = {
  slug: "wheel-spinner",
  name: "Wheel Spinner",
  category: "fun",
  description: "A spinning wheel of your own entries — for prize draws, picking and deciding.",
  keywords: [
    "wheel spinner",
    "spin the wheel",
    "random wheel picker",
    "wheel of names",
    "prize wheel",
    "random picker wheel",
  ],
  icon: Disc3,
  processing: "client",
  status: "live",
  popular: true,
};

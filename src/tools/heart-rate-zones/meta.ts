import { HeartPulse } from "lucide-react";

import type { Tool } from "@/config/tools";

export const heartRateZones: Tool = {
  slug: "heart-rate-zones",
  name: "Heart Rate Zone Calculator",
  category: "science",
  description: "Training zones from your age and resting heart rate, using the Karvonen method.",
  keywords: [
    "heart rate zones",
    "training zones calculator",
    "max heart rate calculator",
    "karvonen formula",
    "zone 2 heart rate",
    "target heart rate",
  ],
  icon: HeartPulse,
  processing: "client",
  status: "live",
};

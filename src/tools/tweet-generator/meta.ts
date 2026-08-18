import { Feather } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tweetGenerator: Tool = {
  slug: "tweet-generator",
  name: "Tweet Generator",
  category: "social",
  description: "Design a realistic tweet mockup with avatar, badge and engagement counts.",
  keywords: [
    "tweet generator",
    "fake tweet generator",
    "twitter post mockup",
    "x post generator",
  ],
  icon: Feather,
  processing: "client",
  status: "live",
  popular: true,
};

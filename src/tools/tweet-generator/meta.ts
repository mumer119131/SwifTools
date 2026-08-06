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
  steps: [
    "Enter a name, handle and the post text, and upload an avatar if you have one.",
    "Set engagement counts, add an image, and switch between light and dark.",
    "Download a PNG at up to 3× for slides, mockups or memes.",
  ],
};

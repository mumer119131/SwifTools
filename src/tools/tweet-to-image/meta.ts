import { Images } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tweetToImage: Tool = {
  slug: "tweet-to-image",
  name: "Tweet to Image",
  category: "social",
  description: "Turn tweet text into a polished image on a gradient backdrop, ready to share.",
  keywords: [
    "tweet to image",
    "tweet screenshot generator",
    "twitter post to picture",
    "quote tweet image",
  ],
  icon: Images,
  processing: "client",
  status: "live",
  steps: [
    "Paste the post text and the author's name and handle.",
    "Pick a gradient backdrop and padding — the card sits on it like a screenshot.",
    "Export a square or 16:9 image for Instagram, LinkedIn or a slide.",
  ],
};

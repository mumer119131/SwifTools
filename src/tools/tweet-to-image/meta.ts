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
};

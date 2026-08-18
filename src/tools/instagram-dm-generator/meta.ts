import { Send } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramDmGenerator: Tool = {
  slug: "instagram-dm-generator",
  name: "Instagram DM Generator",
  category: "social",
  description: "Create an Instagram direct-message mockup with gradient bubbles.",
  keywords: [
    "instagram dm generator",
    "fake instagram dm",
    "instagram direct message mockup",
    "instagram chat generator",
  ],
  icon: Send,
  processing: "client",
  status: "live",
};

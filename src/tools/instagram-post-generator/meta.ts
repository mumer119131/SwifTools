import { Camera } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramPostGenerator: Tool = {
  slug: "instagram-post-generator",
  name: "Instagram Post Generator",
  category: "social",
  description: "Build an Instagram feed post mockup with your own photo, caption and counts.",
  keywords: [
    "instagram post generator",
    "fake instagram post",
    "instagram mockup generator",
    "instagram feed mockup",
  ],
  icon: Camera,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Upload a photo and pick one of Instagram's three aspect ratios.",
    "Set the username, location, caption and engagement counts.",
    "Export a PNG for a pitch deck, a portfolio piece or a social preview.",
  ],
};

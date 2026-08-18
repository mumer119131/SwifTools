import { Aperture } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramStoryGenerator: Tool = {
  slug: "instagram-story-generator",
  name: "Instagram Story Generator",
  category: "social",
  description: "Design a 9:16 story frame with your photo or a gradient, and export it full size.",
  keywords: [
    "instagram story generator",
    "instagram story mockup",
    "story template maker",
    "9:16 story image",
  ],
  icon: Aperture,
  processing: "client",
  status: "live",
};

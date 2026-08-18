import { ImagePlus } from "lucide-react";

import type { Tool } from "@/config/tools";

export const memeGenerator: Tool = {
  slug: "meme-generator",
  name: "Meme Generator",
  category: "fun",
  description: "Add top and bottom text to any image and download it — nothing gets uploaded.",
  keywords: [
    "meme generator",
    "meme maker",
    "add text to image",
    "impact font meme",
    "caption an image",
    "free meme creator",
  ],
  icon: ImagePlus,
  processing: "client",
  status: "live",
  popular: true,
};

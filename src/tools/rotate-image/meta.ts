import { RotateCw } from "lucide-react";

import type { Tool } from "@/config/tools";

export const rotateImage: Tool = {
  slug: "rotate-image",
  name: "Rotate and Flip Image",
  category: "image",
  description: "Turn a photo the right way up, or mirror it, and save the result.",
  keywords: [
    "rotate image",
    "flip image",
    "mirror image",
    "rotate photo online",
    "turn picture sideways",
    "image upside down fix",
    "rotate jpg",
  ],
  icon: RotateCw,
  processing: "client",
  status: "live",
};

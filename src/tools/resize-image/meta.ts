import { Scaling } from "lucide-react";

import type { Tool } from "@/config/tools";

export const resizeImage: Tool = {
  slug: "resize-image",
  name: "Resize Image",
  category: "image",
  description: "Change an image's dimensions by pixels or percentage, with the ratio locked.",
  keywords: [
    "resize image",
    "image resizer online free",
    "change image dimensions",
    "scale image",
    "resize photo without losing quality",
  ],
  icon: Scaling,
  processing: "client",
  status: "live",
};

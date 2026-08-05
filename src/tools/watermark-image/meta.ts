import { Stamp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const watermarkImage: Tool = {
  slug: "watermark-image",
  name: "Add Watermark",
  category: "image",
  description: "Stamp text across your images — position, size and opacity all yours.",
  keywords: [
    "add watermark to image",
    "watermark photos online free",
    "text watermark",
    "copyright image",
    "batch watermark images",
  ],
  icon: Stamp,
  processing: "client",
  status: "live",
  steps: [
    "Drop in the images you want to protect — the same watermark is applied to all of them.",
    "Type your text, then set position, size, opacity, colour and rotation. The preview updates live.",
    "Apply and download individually or as a ZIP.",
  ],
};

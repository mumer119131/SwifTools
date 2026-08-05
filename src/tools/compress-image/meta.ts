import { ImageDown } from "lucide-react";

import type { Tool } from "@/config/tools";

export const compressImage: Tool = {
  slug: "compress-image",
  name: "Compress Image",
  category: "image",
  description: "Cut image file size dramatically with barely any visible quality loss.",
  keywords: [
    "compress image",
    "reduce image size",
    "image compressor online free",
    "compress jpg",
    "compress png without losing quality",
  ],
  icon: ImageDown,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in one or more images — JPG, PNG, WEBP or AVIF.",
    "Pick a quality level, or set a target file size and let the tool find the quality that hits it.",
    "Compare before and after, then download individually or as a ZIP.",
  ],
};

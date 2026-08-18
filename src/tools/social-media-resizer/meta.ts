import { LayoutGrid } from "lucide-react";

import type { Tool } from "@/config/tools";

export const socialMediaResizer: Tool = {
  slug: "social-media-resizer",
  name: "Social Media Image Resizer",
  category: "image",
  description: "Crop one image to every platform size at once — Instagram, X, LinkedIn, YouTube and the rest.",
  keywords: [
    "social media image resizer",
    "instagram post size",
    "youtube thumbnail size",
    "twitter header size",
    "linkedin banner size",
    "facebook cover photo size",
    "resize image for social media",
    "open graph image size",
  ],
  icon: LayoutGrid,
  processing: "client",
  status: "live",
  popular: true,
};

import { Star } from "lucide-react";

import type { Tool } from "@/config/tools";

export const faviconGenerator: Tool = {
  slug: "favicon-generator",
  name: "Favicon Generator",
  category: "image",
  description: "Turn a logo or a letter into every favicon size, plus the ICO, manifest and HTML.",
  keywords: [
    "favicon generator",
    "favicon.ico generator",
    "make a favicon",
    "convert png to ico",
    "apple touch icon generator",
    "site icon generator",
    "favicon from image",
  ],
  icon: Star,
  processing: "client",
  status: "live",
  popular: true,
};

import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const imageToBase64: Tool = {
  slug: "image-to-base64",
  name: "Image to Base64",
  category: "image",
  description: "Turn an image into a data URI, ready to paste into CSS, HTML or Markdown.",
  keywords: [
    "image to base64",
    "base64 encode image",
    "data uri generator",
    "png to base64",
    "svg to base64",
    "inline image css",
    "base64 image converter",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
};

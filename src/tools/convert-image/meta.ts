import { Replace } from "lucide-react";

import type { Tool } from "@/config/tools";

export const convertImage: Tool = {
  slug: "convert-image",
  name: "Convert Image",
  category: "image",
  description: "Convert between PNG, JPG, WEBP and SVG — in batches, without uploading.",
  keywords: [
    "convert image",
    "png to jpg",
    "jpg to png",
    "webp converter",
    "svg to png",
    "image format converter free",
  ],
  icon: Replace,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in the images you want to convert — mix formats freely.",
    "Choose the output format. Converting to JPG flattens transparency onto a white background.",
    "Convert and download individually, or grab everything as a ZIP.",
  ],
};

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
};

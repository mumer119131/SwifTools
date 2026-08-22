import { EyeOff } from "lucide-react";

import type { Tool } from "@/config/tools";

export const redactImage: Tool = {
  slug: "redact-image",
  name: "Blur or Pixelate an Image",
  category: "image",
  description: "Obscure faces, plates or details — the pixels are destroyed, not covered over.",
  keywords: [
    "blur face in photo",
    "pixelate image",
    "redact image",
    "hide part of a picture",
    "blur out license plate",
    "censor photo online",
  ],
  icon: EyeOff,
  processing: "client",
  status: "live",
  popular: true,
};

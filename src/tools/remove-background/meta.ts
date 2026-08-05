import { Eraser } from "lucide-react";

import type { Tool } from "@/config/tools";

export const removeBackground: Tool = {
  slug: "remove-background",
  name: "Remove Background",
  category: "image",
  description: "Cut a solid or near-solid background out of an image and export a transparent PNG.",
  keywords: [
    "remove background from image",
    "transparent background maker",
    "delete white background",
    "png transparent background free",
    "remove background online",
  ],
  icon: Eraser,
  processing: "client",
  status: "live",
  steps: [
    "Drop in an image with a plain background — a product shot, logo, scan or screenshot.",
    "The background colour is detected from the edges. Click the image to pick a different one, and adjust tolerance until the edges look clean.",
    "Download a transparent PNG. Everything runs in a background thread, so the page stays responsive.",
  ],
};

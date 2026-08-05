import { Crop } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cropImage: Tool = {
  slug: "crop-image",
  name: "Crop Image",
  category: "image",
  description: "Trim an image to any region, freehand or locked to a common aspect ratio.",
  keywords: [
    "crop image",
    "image cropper online free",
    "crop photo",
    "square crop for instagram",
    "trim image",
  ],
  icon: Crop,
  processing: "client",
  status: "live",
  steps: [
    "Drop in the image you want to crop.",
    "Drag the corners of the selection box, or pick a fixed ratio like 1:1 or 16:9.",
    "Crop and download. The output is cut at full resolution, not at preview size.",
  ],
};

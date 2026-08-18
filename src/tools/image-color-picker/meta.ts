import { Pipette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const imageColorPicker: Tool = {
  slug: "image-color-picker",
  name: "Image Colour Picker",
  category: "color",
  description: "Pick any colour out of an image, and pull its palette — HEX, RGB and HSL.",
  keywords: [
    "image color picker",
    "get color from image",
    "color picker from photo",
    "extract colors from image",
    "hex code from image",
    "eyedropper online",
    "color palette from image",
  ],
  icon: Pipette,
  processing: "client",
  status: "live",
  popular: true,
};

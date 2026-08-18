import { Pipette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorPicker: Tool = {
  slug: "color-picker",
  name: "Color Picker",
  category: "color",
  description: "Pick colors and convert between HEX, RGB, HSL and OKLCH.",
  keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "color converter"],
  icon: Pipette,
  processing: "client",
  status: "live",
};

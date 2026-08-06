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
  steps: [
    "Pick a colour, or paste one in any format — #1e293b, rgb(30 41 59), hsl(215 25% 17%).",
    "Every other format is shown at once, along with tints and shades and a contrast check.",
    "Copy the value you need in the syntax you need it.",
  ],
};

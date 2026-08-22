import { Triangle } from "lucide-react";

import type { Tool } from "@/config/tools";

export const angleConverter: Tool = {
  slug: "angle-converter",
  name: "Angle Converter",
  category: "units",
  description: "Convert degrees, radians, gradians, turns and arcminutes.",
  keywords: [
    "angle converter",
    "degrees to radians",
    "radians to degrees",
    "degrees to gradians",
    "convert angles",
  ],
  icon: Triangle,
  processing: "client",
  status: "live",
};

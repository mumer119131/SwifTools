import { Square } from "lucide-react";

import type { Tool } from "@/config/tools";

export const areaConverter: Tool = {
  slug: "area-converter",
  name: "Area Converter",
  category: "units",
  description: "Convert square metres, square feet, acres, hectares and square miles.",
  keywords: [
    "area converter",
    "square meters to square feet",
    "acres to hectares",
    "land area converter",
  ],
  icon: Square,
  processing: "client",
  status: "live",
};

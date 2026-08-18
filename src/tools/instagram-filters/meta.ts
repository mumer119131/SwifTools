import { Contrast } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramFilters: Tool = {
  slug: "instagram-filters",
  name: "Instagram Filters",
  category: "social",
  description: "Apply classic photo filters in your browser and export the full-resolution result.",
  keywords: [
    "instagram filters online",
    "photo filter tool",
    "apply filter to image",
    "vintage photo filter",
  ],
  icon: Contrast,
  processing: "client",
  status: "live",
};

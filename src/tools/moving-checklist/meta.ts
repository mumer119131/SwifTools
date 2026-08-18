import { Truck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const movingChecklist: Tool = {
  slug: "moving-checklist",
  name: "Moving Checklist",
  category: "home",
  description: "A week-by-week moving house checklist that remembers what you have ticked off.",
  keywords: [
    "moving checklist",
    "moving house checklist",
    "relocation checklist",
    "packing checklist",
    "change of address checklist",
    "moving day timeline",
  ],
  icon: Truck,
  processing: "client",
  status: "live",
};

import { Link2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const utmBuilder: Tool = {
  slug: "utm-builder",
  name: "UTM Builder",
  category: "seo",
  description: "Build tagged campaign URLs that report correctly, with the mistakes flagged as you type.",
  keywords: [
    "utm builder",
    "utm link generator",
    "campaign url builder",
    "utm parameters",
    "google analytics campaign tagging",
    "utm tag generator",
  ],
  icon: Link2,
  processing: "client",
  status: "live",
  popular: true,
};

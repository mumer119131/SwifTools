import { Languages } from "lucide-react";

import type { Tool } from "@/config/tools";

export const hreflangGenerator: Tool = {
  slug: "hreflang-generator",
  name: "Hreflang Generator",
  category: "seo",
  description: "Build hreflang tags for a multi-language site, with the invalid codes caught first.",
  keywords: [
    "hreflang generator",
    "hreflang tags",
    "multilingual seo",
    "hreflang x-default",
    "international seo tags",
    "hreflang sitemap",
  ],
  icon: Languages,
  processing: "client",
  status: "live",
};

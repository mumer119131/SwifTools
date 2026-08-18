import { Tags } from "lucide-react";

import type { Tool } from "@/config/tools";

export const metaTagGenerator: Tool = {
  slug: "meta-tag-generator",
  name: "Meta Tag Generator",
  category: "seo",
  description: "Generate title, description, Open Graph and Twitter card tags, with live previews.",
  keywords: ["meta tag generator", "open graph generator", "twitter card generator", "seo tags"],
  icon: Tags,
  processing: "client",
  status: "live",
  popular: true,
};

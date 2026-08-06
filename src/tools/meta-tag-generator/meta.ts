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
  steps: [
    "Fill in your page title, description, URL and social image.",
    "Watch the Google and social previews update, with length warnings before anything gets truncated.",
    "Copy the generated tags straight into your page's head.",
  ],
};

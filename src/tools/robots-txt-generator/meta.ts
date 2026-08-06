import { Bot } from "lucide-react";

import type { Tool } from "@/config/tools";

export const robotsTxtGenerator: Tool = {
  slug: "robots-txt-generator",
  name: "Robots.txt Generator",
  category: "seo",
  description: "Build a valid robots.txt with per-crawler allow and disallow rules.",
  keywords: ["robots txt generator", "robots file", "crawler rules", "disallow generator"],
  icon: Bot,
  processing: "client",
  status: "live",
  steps: [
    "Start from a preset — allow everything, block everything, or a common CMS layout.",
    "Add rule groups per crawler, with the paths to allow or disallow, and your sitemap URL.",
    "Copy the file or download it, then put it at the root of your domain.",
  ],
};

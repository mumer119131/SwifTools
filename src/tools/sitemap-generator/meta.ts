import { Network } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sitemapGenerator: Tool = {
  slug: "sitemap-generator",
  name: "Sitemap Generator",
  category: "seo",
  description: "Turn a list of URLs into a valid XML sitemap with priorities and change frequency.",
  keywords: ["sitemap generator", "xml sitemap", "sitemap xml creator", "seo sitemap"],
  icon: Network,
  processing: "client",
  status: "live",
  steps: [
    "Paste your URLs, one per line — relative paths are resolved against the base URL.",
    "Set the last-modified date, change frequency and priority defaults.",
    "Download sitemap.xml, upload it to your site root, and reference it from robots.txt.",
  ],
};

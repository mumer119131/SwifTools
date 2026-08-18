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
};

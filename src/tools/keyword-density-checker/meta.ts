import { Gauge } from "lucide-react";

import type { Tool } from "@/config/tools";

export const keywordDensityChecker: Tool = {
  slug: "keyword-density-checker",
  name: "Word Density Checker",
  category: "seo",
  description: "Analyse keyword frequency and density, including two- and three-word phrases.",
  keywords: ["keyword density checker", "word density", "keyword frequency", "content analysis"],
  icon: Gauge,
  processing: "client",
  status: "live",
};

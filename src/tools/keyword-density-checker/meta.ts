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
  steps: [
    "Paste your page copy or article.",
    "Single words, pairs and three-word phrases are counted separately, with density for each.",
    "Watch for anything over about 3% — that's the range where repetition starts reading as stuffing.",
  ],
};

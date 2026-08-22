import { Shirt } from "lucide-react";

import type { Tool } from "@/config/tools";

export const clothingSizeConverter: Tool = {
  slug: "clothing-size-converter",
  name: "Clothing Size Converter",
  category: "converter",
  description: "UK, US, EU and Italian sizes for tops and bottoms, with the measurements that matter.",
  keywords: [
    "clothing size converter",
    "uk to us clothing size",
    "eu clothing size chart",
    "dress size conversion",
    "international size chart",
  ],
  icon: Shirt,
  processing: "client",
  status: "live",
  popular: true,
};

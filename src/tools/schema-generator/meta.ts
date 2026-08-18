import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const schemaGenerator: Tool = {
  slug: "schema-generator",
  name: "Schema Markup Generator",
  category: "seo",
  description: "Build valid JSON-LD structured data for articles, products, FAQs, events and more.",
  keywords: [
    "schema generator",
    "json-ld",
    "json-ld generator",
    "structured data generator",
    "schema markup",
    "rich results markup",
    "faq schema generator",
    "product schema",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
  popular: true,
};

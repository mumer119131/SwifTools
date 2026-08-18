import { ListFilter } from "lucide-react";

import type { Tool } from "@/config/tools";

export const extractFromText: Tool = {
  slug: "extract-from-text",
  name: "Extract From Text",
  category: "text",
  description: "Pull every email, URL, phone number or date out of a block of text at once.",
  keywords: [
    "extract emails from text",
    "extract urls",
    "email extractor",
    "extract phone numbers",
    "find all links in text",
    "extract numbers from text",
    "text scraper",
  ],
  icon: ListFilter,
  processing: "client",
  status: "live",
};

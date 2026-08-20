import { RemoveFormatting } from "lucide-react";

import type { Tool } from "@/config/tools";

export const stripHtml: Tool = {
  slug: "strip-html",
  name: "Strip HTML Tags",
  category: "text",
  description: "Pull the plain text out of HTML, keeping the structure and dropping the markup.",
  keywords: [
    "strip html tags",
    "html to text",
    "remove html tags",
    "extract text from html",
    "html tag remover",
  ],
  icon: RemoveFormatting,
  processing: "client",
  status: "live",
};

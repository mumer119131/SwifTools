import { Type } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unicodeLookup: Tool = {
  slug: "unicode-lookup",
  name: "Unicode Character Lookup",
  category: "text",
  description: "Inspect any character — code point, UTF-8 bytes, HTML entity and escape forms.",
  keywords: [
    "unicode lookup",
    "character code point",
    "html entity finder",
    "utf-8 bytes of a character",
    "special characters copy paste",
    "em dash character",
  ],
  icon: Type,
  processing: "client",
  status: "live",
};

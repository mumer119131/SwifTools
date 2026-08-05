import { ALargeSmall } from "lucide-react";

import type { Tool } from "@/config/tools";

export const characterCounter: Tool = {
  slug: "character-counter",
  name: "Character Counter",
  category: "text",
  description: "Count characters with live limits for X, meta descriptions, SMS and more.",
  keywords: [
    "character counter",
    "count characters online",
    "twitter character limit",
    "meta description length checker",
    "sms character count",
  ],
  icon: ALargeSmall,
  processing: "client",
  status: "live",
  steps: [
    "Paste or type your text.",
    "Watch the counter against the limits that matter — X posts, meta titles and descriptions, SMS segments.",
    "Trim until every limit you care about shows green, then copy the text out.",
  ],
};

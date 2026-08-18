import { WrapText } from "lucide-react";

import type { Tool } from "@/config/tools";

export const removeLineBreaks: Tool = {
  slug: "remove-line-breaks",
  name: "Remove Line Breaks",
  category: "text",
  description: "Join broken lines back into paragraphs — the fix for text copied out of a PDF or email.",
  keywords: [
    "remove line breaks",
    "join lines",
    "remove hard returns",
    "unwrap text",
    "fix pdf text formatting",
    "remove carriage returns",
    "text to one line",
  ],
  icon: WrapText,
  processing: "client",
  status: "live",
};

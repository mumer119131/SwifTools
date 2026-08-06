import { Code } from "lucide-react";

import type { Tool } from "@/config/tools";

export const htmlEncodeDecode: Tool = {
  slug: "html-encode-decode",
  name: "HTML Encode / Decode",
  category: "developer",
  description: "Convert characters to HTML entities and back, to display markup safely as text.",
  keywords: [
    "html encoder",
    "html decoder",
    "html entities",
    "escape html",
    "convert special characters to html",
  ],
  icon: Code,
  processing: "client",
  status: "live",
  steps: [
    "Paste text or markup you want to display literally on a page.",
    "Choose minimal escaping for the five characters that matter, or full escaping for every non-ASCII character.",
    "Copy the result. Decoding goes the other way, resolving named and numeric entities.",
  ],
};

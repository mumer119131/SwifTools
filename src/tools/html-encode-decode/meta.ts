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
};

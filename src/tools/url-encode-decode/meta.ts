import { Link2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const urlEncodeDecode: Tool = {
  slug: "url-encode-decode",
  name: "URL Encode / Decode",
  category: "developer",
  description: "Percent-encode and decode URLs, query strings and path segments.",
  keywords: ["url encode", "url decode", "percent encoding", "query string encoder"],
  icon: Link2,
  processing: "client",
  status: "live",
  steps: [
    "Paste a URL, a query value or an encoded string.",
    "Choose component encoding for a single value, or full-URL encoding to leave the structure intact.",
    "Copy the result, or use the parsed breakdown to inspect each query parameter separately.",
  ],
};

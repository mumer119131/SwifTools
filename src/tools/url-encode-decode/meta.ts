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
};

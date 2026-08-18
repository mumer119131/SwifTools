import { Binary } from "lucide-react";

import type { Tool } from "@/config/tools";

export const base64EncodeDecode: Tool = {
  slug: "base64-encode-decode",
  name: "Base64 Encode / Decode",
  category: "developer",
  description: "Convert text and files to Base64 and back, with URL-safe output.",
  keywords: ["base64 encode", "base64 decode", "base64 converter", "url safe base64"],
  icon: Binary,
  processing: "client",
  status: "live",
};

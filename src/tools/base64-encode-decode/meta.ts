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
  steps: [
    "Paste text to encode, or a Base64 string to decode — or drop in a file.",
    "Switch on URL-safe mode for values that go in a query string or filename.",
    "Copy the result. Files are converted to a data URI you can paste straight into HTML or CSS.",
  ],
};

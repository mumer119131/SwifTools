import { Fingerprint } from "lucide-react";

import type { Tool } from "@/config/tools";

export const md5HashGenerator: Tool = {
  slug: "md5-hash-generator",
  name: "MD5 Hash Generator",
  category: "developer",
  description: "Generate an MD5 checksum for text or files, and verify a download against a known digest.",
  keywords: [
    "md5 generator",
    "md5 hash",
    "md5 checksum",
    "md5 online",
    "generate md5 hash",
  ],
  icon: Fingerprint,
  processing: "client",
  status: "live",
};

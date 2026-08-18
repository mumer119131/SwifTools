import { Fingerprint } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha1HashGenerator: Tool = {
  slug: "sha1-hash-generator",
  name: "SHA-1 Hash Generator",
  category: "developer",
  description: "Generate a SHA-1 hash for text or files, with a checksum comparison and HMAC mode.",
  keywords: [
    "sha1 generator",
    "sha1 hash",
    "sha-1 online",
    "sha1 checksum",
  ],
  icon: Fingerprint,
  processing: "client",
  status: "live",
};

import { Fingerprint } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha224HashGenerator: Tool = {
  slug: "sha224-hash-generator",
  name: "SHA-224 Hash Generator",
  category: "developer",
  description: "Generate a SHA-224 hash for text or files, and compare it against a published checksum.",
  keywords: [
    "sha224 generator",
    "sha-224 hash",
    "sha224 online",
  ],
  icon: Fingerprint,
  processing: "client",
  status: "live",
};

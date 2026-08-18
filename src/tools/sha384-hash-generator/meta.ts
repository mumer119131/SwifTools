import { ShieldCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha384HashGenerator: Tool = {
  slug: "sha384-hash-generator",
  name: "SHA-384 Hash Generator",
  category: "developer",
  description: "Generate a SHA-384 hash for text or files, with HMAC signing and checksum verification.",
  keywords: [
    "sha384 generator",
    "sha-384 hash",
    "sha384 online",
  ],
  icon: ShieldCheck,
  processing: "client",
  status: "live",
};

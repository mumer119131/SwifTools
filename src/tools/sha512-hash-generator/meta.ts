import { ShieldCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha512HashGenerator: Tool = {
  slug: "sha512-hash-generator",
  name: "SHA-512 Hash Generator",
  category: "developer",
  description: "Generate a SHA-512 hash for text or files, with HMAC signing and checksum verification.",
  keywords: [
    "sha512 generator",
    "sha512 hash",
    "sha-512 online",
    "hmac sha512",
  ],
  icon: ShieldCheck,
  processing: "client",
  status: "live",
};

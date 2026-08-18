import { ShieldCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sha256HashGenerator: Tool = {
  slug: "sha256-hash-generator",
  name: "SHA-256 Hash Generator",
  category: "developer",
  description: "Generate a SHA-256 hash for text or files, with HMAC signing and checksum verification.",
  keywords: [
    "sha256 generator",
    "sha256 hash",
    "sha-256 online",
    "sha256 checksum",
    "hmac sha256",
  ],
  icon: ShieldCheck,
  processing: "client",
  status: "live",
};

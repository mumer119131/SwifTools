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
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-384 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
};

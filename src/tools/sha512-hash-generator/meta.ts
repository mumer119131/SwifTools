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
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-512 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
};

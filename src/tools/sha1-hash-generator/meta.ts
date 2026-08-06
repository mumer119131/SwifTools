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
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-1 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
};

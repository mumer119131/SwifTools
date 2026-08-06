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
  steps: [
    "Type or paste your text, or drop in a file of any size.",
    "The SHA-224 digest is computed in your browser as you type — nothing is uploaded.",
    "Paste a published checksum into the compare field to verify a download byte-for-byte.",
  ],
};

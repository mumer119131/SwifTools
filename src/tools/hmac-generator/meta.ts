import { FileKey } from "lucide-react";

import type { Tool } from "@/config/tools";

export const hmacGenerator: Tool = {
  slug: "hmac-generator",
  name: "HMAC Generator",
  category: "developer",
  description: "Sign a message with a secret key, and verify a signature you have been sent.",
  keywords: [
    "hmac generator",
    "hmac sha256",
    "webhook signature",
    "verify webhook signature",
    "hmac calculator",
    "sign message with secret key",
    "hmac sha512",
  ],
  icon: FileKey,
  processing: "client",
  status: "live",
};

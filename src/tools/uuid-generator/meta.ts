import { Fingerprint } from "lucide-react";

import type { Tool } from "@/config/tools";

export const uuidGenerator: Tool = {
  slug: "uuid-generator",
  name: "UUID Generator",
  category: "developer",
  description: "Generate v4 and v7 UUIDs in bulk, ready to copy.",
  keywords: ["uuid generator", "guid generator", "uuid v4", "uuid v7", "random id"],
  icon: Fingerprint,
  processing: "client",
  status: "live",
};

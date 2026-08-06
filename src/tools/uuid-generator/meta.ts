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
  steps: [
    "Choose v4 for pure randomness, or v7 if you want IDs that sort by creation time.",
    "Set how many you need and pick a format — plain, uppercase, braced or as a quoted array.",
    "Copy them all at once, or download as a text file.",
  ],
};

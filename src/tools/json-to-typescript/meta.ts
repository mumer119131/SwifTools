import { FileCode2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsonToTypescript: Tool = {
  slug: "json-to-typescript",
  name: "JSON to TypeScript",
  category: "developer",
  description: "Turn an API response into TypeScript interfaces, with optional fields worked out from the sample.",
  keywords: [
    "json to typescript",
    "generate typescript interface",
    "json to interface",
    "typescript type generator",
    "api response to type",
    "json schema to typescript",
  ],
  icon: FileCode2,
  processing: "client",
  status: "live",
};

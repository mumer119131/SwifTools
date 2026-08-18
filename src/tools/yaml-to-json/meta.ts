import { ArrowLeftRight } from "lucide-react";

import type { Tool } from "@/config/tools";

export const yamlToJson: Tool = {
  slug: "yaml-to-json",
  name: "YAML to JSON Converter",
  category: "developer",
  description: "Convert YAML to JSON and back, with a note wherever the two formats disagree.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml converter",
    "yaml parser",
    "convert yaml online",
    "yaml validator",
    "docker compose to json",
  ],
  icon: ArrowLeftRight,
  processing: "client",
  status: "live",
};

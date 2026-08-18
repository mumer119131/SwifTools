import { Type } from "lucide-react";

import type { Tool } from "@/config/tools";

export const asciiArtGenerator: Tool = {
  slug: "ascii-art-generator",
  name: "ASCII Art Generator",
  category: "fun",
  description: "Turn text into big ASCII banners for READMEs, terminals and commit messages.",
  keywords: [
    "ascii art generator",
    "text to ascii art",
    "ascii banner generator",
    "figlet online",
    "ascii text generator",
    "big text generator",
  ],
  icon: Type,
  processing: "client",
  status: "live",
};

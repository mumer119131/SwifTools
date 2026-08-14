import { Tag } from "lucide-react";

import type { Tool } from "@/config/tools";

export const nicknameGenerator: Tool = {
  slug: "nickname-generator",
  name: "Nickname Generator",
  category: "fun",
  description: "Invent nicknames and gamertags — prefix and suffix combinations that read well.",
  keywords: ["nickname generator","gamertag generator","username ideas","cool nicknames","random nickname"],
  icon: Tag,
  processing: "client",
  status: "live",
  steps: [
    "Pick a style — short and punchy, or two-part gamertag.",
    "Generate as many as you like.",
    "Copy the one you want, or the whole list.",
  ],
};

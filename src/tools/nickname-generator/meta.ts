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
};

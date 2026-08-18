import { Flame } from "lucide-react";

import type { Tool } from "@/config/tools";

export const roastGenerator: Tool = {
  slug: "roast-generator",
  name: "Roast Generator",
  category: "fun",
  description: "Affectionate roasts for a leaving do or a group chat — teasing, never cruel.",
  keywords: ["roast generator","funny roasts","friendly insults","roast me","light-hearted roast"],
  icon: Flame,
  processing: "client",
  status: "live",
};

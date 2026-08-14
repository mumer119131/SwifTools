import { Heart } from "lucide-react";

import type { Tool } from "@/config/tools";

export const complimentGenerator: Tool = {
  slug: "compliment-generator",
  name: "Compliment Generator",
  category: "fun",
  description: "Compliments about character rather than looks — the kind that actually land.",
  keywords: ["compliment generator","random compliment","nice things to say","compliment ideas"],
  icon: Heart,
  processing: "client",
  status: "live",
  steps: [
    "Generate a batch of compliments.",
    "Pick the one that is actually true of the person.",
    "Copy it and send it.",
  ],
};

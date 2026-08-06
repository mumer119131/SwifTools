import { MessageSquare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const imessageChatGenerator: Tool = {
  slug: "imessage-chat-generator",
  name: "iMessage Chat Generator",
  category: "social",
  description: "Build an iMessage conversation mockup with blue bubbles and export it as a PNG.",
  keywords: [
    "imessage generator",
    "fake imessage conversation",
    "iphone text message generator",
    "imessage mockup",
  ],
  icon: MessageSquare,
  processing: "client",
  status: "live",
  steps: [
    "Set the contact name and avatar.",
    "Add messages from either side — yours render in iMessage blue, theirs in grey.",
    "Choose light or dark, then download at up to 3×.",
  ],
};

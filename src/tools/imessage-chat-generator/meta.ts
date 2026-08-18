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
};

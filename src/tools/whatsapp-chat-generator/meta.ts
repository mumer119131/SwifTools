import { MessageCircle } from "lucide-react";

import type { Tool } from "@/config/tools";

export const whatsappChatGenerator: Tool = {
  slug: "whatsapp-chat-generator",
  name: "WhatsApp Chat Generator",
  category: "social",
  description: "Build a realistic WhatsApp conversation mockup and export it as a PNG.",
  keywords: [
    "whatsapp chat generator",
    "fake whatsapp conversation",
    "whatsapp mockup",
    "whatsapp screenshot generator",
  ],
  icon: MessageCircle,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Set the contact name, status line and avatar.",
    "Add messages from either side, with timestamps and one, two or blue ticks.",
    "Switch between light and dark, then download at up to 3× for a crisp image.",
  ],
};

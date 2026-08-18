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
};

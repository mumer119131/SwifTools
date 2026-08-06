"use client";

import { ChatMockupShell } from "@/components/shared/ChatMockupShell";
import { defaultContact, defaultStatus, seedConversation } from "./logic";

export default function WhatsappChatGeneratorTool() {
  return (
    <ChatMockupShell
      themeId="whatsapp"
      defaultContact={defaultContact}
      defaultStatus={defaultStatus}
      seed={seedConversation}
    />
  );
}

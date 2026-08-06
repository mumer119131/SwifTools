"use client";

import { ChatMockupShell } from "@/components/shared/ChatMockupShell";
import { defaultContact, defaultStatus, seedConversation } from "./logic";

export default function ImessageChatGeneratorTool() {
  return (
    <ChatMockupShell
      themeId="imessage"
      defaultContact={defaultContact}
      defaultStatus={defaultStatus}
      seed={seedConversation}
    />
  );
}

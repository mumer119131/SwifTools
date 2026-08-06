"use client";

import { ChatMockupShell } from "@/components/shared/ChatMockupShell";
import { defaultContact, defaultStatus, seedConversation } from "./logic";

export default function InstagramDmGeneratorTool() {
  return (
    <ChatMockupShell
      themeId="instagram"
      defaultContact={defaultContact}
      defaultStatus={defaultStatus}
      seed={seedConversation}
    />
  );
}

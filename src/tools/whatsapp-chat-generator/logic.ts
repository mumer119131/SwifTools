import type { Side } from "@/lib/chat-mockup";

/**
 * WhatsApp-specific defaults. The rendering itself lives in
 * `@/lib/chat-mockup`, shared with the iMessage generator — the two differ only
 * in theme, bubble shape and how delivery is reported.
 */
export const defaultContact = "Ada Lovelace";
export const defaultStatus = "online";

export const seedConversation: { side: Side; text: string; time: string }[] = [
  { side: "in", text: "Did the deploy go out?", time: "09:38" },
  { side: "out", text: "Just finished. All green ✅", time: "09:41" },
  { side: "in", text: "Amazing, thank you!", time: "09:41" },
];

import type { Side } from "@/lib/chat-mockup";

/**
 * iMessage-specific defaults. Rendering is shared with the WhatsApp generator
 * via `@/lib/chat-mockup`; iMessage puts the timestamp outside the bubble and
 * reports delivery once, under the last outgoing message.
 */
export const defaultContact = "Grace Hopper";
export const defaultStatus = "";

export const seedConversation: { side: Side; text: string; time: string }[] = [
  { side: "in", text: "Are we still on for 3?", time: "14:02" },
  { side: "out", text: "Yes — I'll bring the deck.", time: "14:04" },
  { side: "in", text: "Perfect 👌", time: "14:05" },
];

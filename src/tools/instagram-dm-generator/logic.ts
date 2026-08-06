import type { Side } from "@/lib/chat-mockup";

/**
 * Instagram DMs are close enough to iMessage structurally — outgoing bubbles on
 * the right, no timestamp inside the bubble — that they reuse the same
 * renderer. Only the palette differs.
 */
export const defaultContact = "ada.builds";
export const defaultStatus = "Active 2h ago";

export const seedConversation: { side: Side; text: string; time: string }[] = [
  { side: "in", text: "loved the new shots 🔥", time: "18:20" },
  { side: "out", text: "thank you! shot them at golden hour", time: "18:22" },
  { side: "in", text: "it shows", time: "18:22" },
];

import { Keyboard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const typingSpeedTest: Tool = {
  slug: "typing-speed-test",
  name: "Typing Speed Test",
  category: "fun",
  description: "Measure your words per minute and accuracy on a real passage, not random letters.",
  keywords: [
    "typing speed test",
    "wpm test",
    "typing test online",
    "words per minute test",
    "free typing test",
    "typing accuracy test",
  ],
  icon: Keyboard,
  processing: "client",
  status: "live",
  popular: true,
};

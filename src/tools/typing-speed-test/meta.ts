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
  steps: [
    "Choose a length and start typing — the clock starts on your first keystroke.",
    "Mistakes are marked as you go, and you can correct them.",
    "You get gross and net WPM, accuracy, and your best score.",
  ],
};

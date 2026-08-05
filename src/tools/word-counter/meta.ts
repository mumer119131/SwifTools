import { WholeWord } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wordCounter: Tool = {
  slug: "word-counter",
  name: "Word Counter",
  category: "text",
  description: "Count words, sentences and paragraphs live, with reading time and keyword density.",
  keywords: [
    "word counter",
    "count words online",
    "word count tool free",
    "essay word counter",
    "reading time calculator",
  ],
  icon: WholeWord,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Paste or type your text into the box.",
    "Counts update as you type — words, characters, sentences, paragraphs and reading time.",
    "Scroll down for the most-used words, which is handy for spotting repetition.",
  ],
};

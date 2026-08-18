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
};

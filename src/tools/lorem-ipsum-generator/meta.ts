import { AlignLeft } from "lucide-react";

import type { Tool } from "@/config/tools";

export const loremIpsumGenerator: Tool = {
  slug: "lorem-ipsum-generator",
  name: "Lorem Ipsum Generator",
  category: "generator",
  description: "Generate placeholder paragraphs, sentences, words or list items.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
  icon: AlignLeft,
  processing: "client",
  status: "live",
  steps: [
    "Choose paragraphs, sentences, words or list items, and how many you need.",
    "Switch to plain English if Latin makes it harder to judge how the copy reads.",
    "Copy as plain text or wrapped in HTML tags, ready to paste into a mockup.",
  ],
};

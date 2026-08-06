import { ImageDown } from "lucide-react";

import type { Tool } from "@/config/tools";

export const codeToImage: Tool = {
  slug: "code-to-image",
  name: "Code to Image",
  category: "developer",
  description: "Turn a code snippet into a shareable image, with syntax highlighting and themes.",
  keywords: [
    "code to image",
    "code screenshot generator",
    "carbon alternative",
    "beautiful code images",
    "share code snippet image",
  ],
  icon: ImageDown,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Paste your snippet and pick its language — highlighting updates as you type.",
    "Choose a theme, a backdrop gradient and whether to show line numbers and window chrome.",
    "Download a PNG at up to 3× for a crisp result on high-DPI screens and slide decks.",
  ],
};

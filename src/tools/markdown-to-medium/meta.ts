import { PenLine } from "lucide-react";

import type { Tool } from "@/config/tools";

export const markdownToMedium: Tool = {
  slug: "markdown-to-medium",
  name: "Markdown to Medium",
  category: "text",
  description:
    "Paste Markdown, copy it as rich text, and Medium keeps the formatting instead of showing the syntax.",
  keywords: [
    "markdown to medium",
    "publish markdown on medium",
    "medium formatting from markdown",
    "paste markdown into medium",
    "medium article formatter",
    "does medium support markdown",
  ],
  icon: PenLine,
  processing: "client",
  status: "live",
};

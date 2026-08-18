import { SquareCode } from "lucide-react";

import type { Tool } from "@/config/tools";

export const markdownToHtml: Tool = {
  slug: "markdown-to-html",
  name: "Markdown to HTML",
  category: "developer",
  description: "Convert Markdown to clean, semantic HTML with a live preview.",
  keywords: ["markdown to html", "md to html", "markdown converter", "markdown preview"],
  icon: SquareCode,
  processing: "client",
  status: "live",
};

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
  steps: [
    "Paste or type Markdown — GitHub-flavoured syntax including tables and task lists is supported.",
    "The HTML and a rendered preview update as you type.",
    "Copy the HTML, or download it as a complete standalone page.",
  ],
  notes: [
    "Markdown is converted with marked, which follows the CommonMark specification. That matters because Markdown has no single definition: the original 2004 implementation left many cases undefined, and GitHub, Reddit and every static site generator resolved them differently. CommonMark is the attempt to pin those cases down precisely.",
    "GitHub Flavored Markdown extensions — tables, strikethrough, task lists and automatic links — are supported on top of CommonMark, because those are what most people are actually writing when they say Markdown.",
    "Raw HTML inside the Markdown is passed through, which is part of the specification and a security consideration if the source is user-supplied. Sanitise the output before rendering anything you did not write yourself; conversion and sanitisation are separate jobs and this does the first.",
  ],
  faq: [
    {
      question: "Which Markdown flavour is supported?",
      answer: "CommonMark, plus the GitHub extensions most people expect — tables, strikethrough, task lists and autolinks. CommonMark matters because the original Markdown left many cases undefined and every implementation resolved them differently.",
    },
    {
      question: "Why isn't my table rendering?",
      answer: "Tables need a header row and a separator row of dashes beneath it, with pipes at the start and end of each line. Missing the separator is the usual cause — without it the block is treated as ordinary paragraph text.",
    },
    {
      question: "Is HTML inside my Markdown preserved?",
      answer: "Yes, that is standard behaviour. It is also a security consideration: if the Markdown came from a user, sanitise the resulting HTML before rendering it. Conversion and sanitisation are separate steps.",
    },
    {
      question: "How do I write a line break in Markdown?",
      answer: "End the line with two spaces, or use a backslash. A single newline is treated as a continuation of the same paragraph, which surprises people coming from plain text editors.",
    },
    {
      question: "Is my document uploaded?",
      answer: "No. The conversion runs in your browser, so unpublished drafts and internal documentation stay on your device.",
    },
  ],
};

import { FileOutput } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wordToPdf: Tool = {
  slug: "word-to-pdf",
  name: "Word to PDF",
  category: "pdf",
  description: "Convert a .docx document into a clean, shareable PDF.",
  keywords: [
    "word to pdf",
    "docx to pdf",
    "convert word document to pdf free",
    "doc to pdf online",
    "save word as pdf",
  ],
  icon: FileOutput,
  processing: "client",
  status: "live",
  steps: [
    "Drop in your .docx file.",
    "The document's headings, paragraphs and lists are read in your browser and typeset onto A4 pages.",
    "Download the PDF — nothing is uploaded at any point.",
  ],
};

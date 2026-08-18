import { FileType } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pdfToWord: Tool = {
  slug: "pdf-to-word",
  name: "PDF to Word",
  category: "pdf",
  description: "Pull the text out of a PDF into an editable .docx document.",
  keywords: [
    "pdf to word",
    "pdf to docx",
    "convert pdf to word free",
    "editable pdf to word",
    "extract text from pdf",
  ],
  icon: FileType,
  processing: "client",
  status: "live",
  popular: true,
};

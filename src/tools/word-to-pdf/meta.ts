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
  notes: [
    "A .docx file is a zip archive of XML describing the document's content and styling. This reads that structure with mammoth, converts it to clean HTML, and lays the result out as a PDF. Headings, lists, bold and italic, links and tables survive; the reading order and paragraph structure are preserved because they are genuinely present in the source.",
    "What does not survive is anything that depends on Word's own layout engine: exact page breaks, headers and footers, floated text boxes, columns, and fonts you have installed locally but the browser does not. Word decides where a page ends by measuring text with those fonts, and a browser measuring different fonts will break the page somewhere else.",
    "For a CV, a letter, a report or an essay the result is faithful. For a designed document with precise pagination, exporting to PDF from Word itself will match better, because only Word knows exactly how Word would have drawn it.",
  ],
  faq: [
    {
      question: "Will my Word document look identical as a PDF?",
      answer: "Close, but not identical. Text, headings, lists, links and tables carry across accurately. Exact page breaks, headers and footers, and any font not available to the browser will differ, because page breaks depend on measuring text in specific fonts.",
    },
    {
      question: "Does it support .doc as well as .docx?",
      answer: "Only .docx. The older .doc format is a proprietary binary layout rather than structured XML and cannot be parsed reliably in a browser. Open it in Word or LibreOffice and save as .docx first.",
    },
    {
      question: "Are images in my document included?",
      answer: "Yes. Images embedded in the .docx are extracted and placed in the PDF. Images linked to an external file rather than embedded will be missing, because that data is not in the document.",
    },
    {
      question: "Is my document uploaded to a server?",
      answer: "No. The .docx is unzipped and parsed in your browser and the PDF is assembled locally, so a private CV or contract never leaves your device.",
    },
    {
      question: "Why are my headers and footers missing?",
      answer: "Headers and footers live outside the document body in the .docx structure and are positioned by Word's own pagination, which a browser does not reproduce. If they are essential, export from Word directly.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const pdfToWordContent: ToolContent = {
  steps: [
    "Drop in the PDF you want to convert.",
    "The text of every page is extracted in your browser and laid out into a Word document.",
    "Download the .docx and edit it in Word, Pages or Google Docs.",
  ],
  notes: [
    "This extracts the text of a PDF and rebuilds it as a .docx you can edit. It is worth being clear about what that means: a PDF describes where marks sit on a page, not what those marks are structurally. There is nothing in the file that says 'this is a heading' or 'this is a table row' — that meaning was discarded when the PDF was made.",
    "So the conversion recovers text, paragraph breaks and reading order well. It does not reliably recover multi-column layouts, complex tables, floated images or precise typography, because that information has to be inferred from coordinates rather than read. Expect a document you can edit, not a pixel-perfect replica of the original.",
    "A scanned PDF has no text at all — only a photograph of text — so nothing can be extracted from it. Optical character recognition is a different problem and is not what this does.",
  ],
  faq: [
    {
      question: "Will the formatting be preserved exactly?",
      answer: "No, and no converter can promise that honestly. A PDF stores glyph positions rather than document structure, so headings, tables and columns have to be inferred from coordinates. Text and paragraph flow come across well; complex layouts will need tidying.",
    },
    {
      question: "Why is my scanned PDF coming out empty?",
      answer: "A scan is an image of a page, not text — there are no characters in the file to extract. You need optical character recognition to turn the picture back into words, which is a different process from what this tool does.",
    },
    {
      question: "Can I convert a password-protected PDF?",
      answer: "Not while it is encrypted. The text cannot be read without the password, so remove the protection in whatever application created the file, then convert the unprotected copy.",
    },
    {
      question: "Does the file get uploaded to a server?",
      answer: "No. The PDF is parsed in your browser with pdf.js and the Word document is assembled locally, so a confidential contract or report never leaves your device.",
    },
    {
      question: "What format is the output?",
      answer: "A .docx file, which opens in Microsoft Word, Google Docs, LibreOffice and Pages. It is a real Word document rather than a renamed PDF, so the text is fully editable.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const splitPdfContent: ToolContent = {
  steps: [
    "Drop in the PDF you want to split.",
    "Choose whether to extract a range like 1-3, 8 or to burst every page into its own file.",
    "Press Split, then download the result — a single PDF, or a ZIP when there is more than one.",
  ],
  notes: [
    "Splitting extracts the pages you choose into a new document, leaving the original untouched. Ranges are written the way you would say them out loud — 1-3, 7, 12-15 — and the pages come out in the order the ranges are listed, so 5-6, 1-2 gives you a four-page file starting at page five.",
    "The work runs in your browser with pdf-lib. Each selected page is copied into a fresh document with its content, fonts and images intact, then serialised back out. Because the copy is exact, extracting three pages from a 200-page report gives you those three pages at full quality rather than a re-rendered approximation.",
    "One consequence worth knowing: fonts are embedded per document, so a three-page extract from a report using several typefaces can be larger than three-two-hundredths of the original. The font data has to travel with the pages that use it.",
  ],
  faq: [
    {
      question: "How do I extract specific pages from a PDF?",
      answer: "Enter the pages you want as a range list — 1-3, 7, 12-15 — and the tool builds a new document containing exactly those pages, in that order. The original file is not modified.",
    },
    {
      question: "Can I split one PDF into several separate files?",
      answer: "Yes. Run the tool once per output: extract pages 1-10 and download, then extract 11-20 and download again. Each run produces an independent PDF, and the source stays loaded between runs.",
    },
    {
      question: "Does splitting a PDF reduce quality?",
      answer: "No. The pages are copied byte-for-byte along with their fonts and images rather than being re-rendered, so an extracted page is identical to the page it came from.",
    },
    {
      question: "Why is my extracted file bigger than I expected?",
      answer: "Fonts are embedded per document. If the pages you extracted use several typefaces, the full font data has to be embedded in the new file, which can make a short extract disproportionately large compared with the original's page count.",
    },
    {
      question: "What page numbers should I use?",
      answer: "The numbers shown in your PDF reader, starting at 1 for the first page. If the document has a cover or roman-numeral front matter, count the physical pages rather than the printed numbers.",
    },
  ],
};

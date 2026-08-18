import type { ToolContent } from "@/config/tool-content";

export const organizePdfContent: ToolContent = {
  steps: [
    "Drop in the PDF. Every page is rendered as a thumbnail.",
    "Move pages with the arrows, rotate them, or mark the ones you do not want.",
    "Download. Only the pages you kept are written, in the order you left them.",
  ],
  notes: [
    "Reordering, rotating and deleting are all page-level operations, which makes them lossless. Pages are copied from one document into another whole — nothing inside them is decoded, redrawn or re-encoded. Text stays selectable, images keep their original quality, and the file can be run through this a dozen times without degrading.",
    "That is worth knowing because it is not true of every tool that offers the same thing. Anything that renders pages to images and reassembles them will produce a file that looks similar, is often larger, and has lost its text layer entirely — so it can no longer be searched, copied from, or read by a screen reader.",
    "Rotation is stored as an instruction rather than applied to the content, which is how PDFs have always handled it. A page already rotated in the original has your turn added to it rather than replacing it, so a sideways scan you rotate once ends up upright rather than back where it started.",
    "Deleting is only a mark until you download — nothing is removed from the file in front of you, and clicking again restores the page. The original on your disk is never modified either way.",
    "The whole thing runs in your browser. The PDFs people reorder are usually scanned contracts, applications and records, and none of that needs to be sent anywhere to move page 7 above page 3.",
  ],
  faq: [
    {
      question: "Does rotating or reordering reduce quality?",
      answer: "No. Pages are copied whole between documents and nothing inside them is re-encoded, so text stays selectable and images keep their original quality. You could run a file through this repeatedly without any degradation.",
    },
    {
      question: "How do I delete a page from a PDF?",
      answer: "Click the bin icon on its thumbnail. It is only marked until you download — clicking again restores it — and the file on your disk is never modified.",
    },
    {
      question: "Why is my scanned page still sideways after rotating?",
      answer: "Some scans already carry a rotation instruction. Your turn is added to that rather than replacing it, so one more press should bring it upright. If a page looks correct here it will be correct in the download.",
    },
    {
      question: "Can I combine this with merging?",
      answer: "Yes — merge the files first, then reorder the result here. Both are lossless, so doing them in two passes costs nothing.",
    },
    {
      question: "Does the PDF leave my computer at any point?",
      answer: "No. It is opened, rearranged and saved entirely by your browser, which matters given how often the PDFs people reorder are contracts, applications and medical records.",
    },
  ],
};

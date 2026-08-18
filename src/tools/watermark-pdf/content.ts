import type { ToolContent } from "@/config/tool-content";

export const watermarkPdfContent: ToolContent = {
  steps: [
    "Drop in the PDF and type the text — DRAFT and CONFIDENTIAL are one click away.",
    "Choose diagonal, horizontal or a small footer line, and set the opacity.",
    "Stamp every page, or give a range like 1,3-5.",
  ],
  notes: [
    "The watermark is drawn as real text into the page's content, not laid over it as an image. The document stays a normal PDF: the existing text is still selectable and searchable, nothing is rasterised, and the file does not balloon. Tools that flatten pages to images to add a watermark destroy the text layer, which makes the document unsearchable and unreadable to a screen reader.",
    "That has an honest consequence worth stating: because it is ordinary page content, anyone with a PDF editor can remove it. A watermark marks a document as a draft, a copy, or not for distribution. It does not protect it, prevent copying, or survive a determined recipient. Treating it as security is a mistake people make with real consequences.",
    "A diagonal stamp is sized to span the page rather than set to a fixed point size, so it looks right on A4, on US Letter and on a widescreen slide without adjustment. Tiling repeats the text in a grid instead, which is harder to crop out of a screenshot and considerably uglier — useful for genuinely sensitive drafts.",
    "Opacity around 15% is the usual choice: clearly legible, and not so heavy that the document underneath becomes hard to read. Anything above about 40% starts competing with the content.",
    "The document is stamped entirely in your browser. Marking something CONFIDENTIAL by uploading it to a stranger's server would be an unfortunate way to start.",
  ],
  faq: [
    {
      question: "Does a watermark stop someone copying the document?",
      answer: "No. It is ordinary page content and anyone with a PDF editor can remove it. A watermark labels a document as a draft or a copy; it is not protection, and treating it as such is a mistake.",
    },
    {
      question: "Will the text in my PDF still be selectable?",
      answer: "Yes. The watermark is drawn as text into the page rather than flattening the page to an image, so the existing content stays selectable and searchable. Tools that rasterise the page to add a watermark destroy that.",
    },
    {
      question: "Can I watermark only some pages?",
      answer: "Yes — give a range like 1,3-5. Leaving it blank stamps every page. Out-of-range numbers are ignored rather than causing an error.",
    },
    {
      question: "What opacity should I use?",
      answer: "About 15% for most documents: clearly visible without making the text underneath hard to read. Above roughly 40% it starts competing with the content.",
    },
    {
      question: "Is the file uploaded to add the watermark?",
      answer: "No, it is stamped in your browser. Which seems worth getting right for a tool whose most common use is marking something CONFIDENTIAL.",
    },
  ],
};

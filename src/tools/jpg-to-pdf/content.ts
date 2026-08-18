import type { ToolContent } from "@/config/tool-content";

export const jpgToPdfContent: ToolContent = {
  steps: [
    "Drop in your JPG, PNG or WEBP images — add as many as you like.",
    "Choose a page size and orientation, and whether images fit inside the page or fill it.",
    "Create the PDF and download it. Each image becomes its own page, in the order shown.",
  ],
  notes: [
    "Each image becomes one page. You can set the page size, orientation and margin, and choose whether images are scaled to fit within the page or fill it — fit keeps the whole image visible with whitespace around it, fill crops to the edges. For scanned documents, fit is almost always what you want.",
    "The images are embedded at their original resolution rather than re-encoded, so nothing is lost in the conversion and the PDF is roughly the size of the images that went into it. If that is too large, compress the images first, or run the result through the PDF compressor.",
    "Order matters and is set by dragging. A common use is turning a set of phone photographs of a document into a single file to email — for that, shoot them in order, set A4 or Letter with a small margin, and use fit rather than fill so nothing at the edges is cut off.",
  ],
  faq: [
    {
      question: "Can I combine several images into one PDF?",
      answer: "Yes. Add as many images as you like, drag them into the order you want, and each becomes a page of a single PDF in that order.",
    },
    {
      question: "What image formats can I use?",
      answer: "JPG, PNG, WebP and GIF. They can be mixed freely in the same document — the tool reads each one and embeds it as a page.",
    },
    {
      question: "Should I choose fit or fill?",
      answer: "Fit, in almost every case. It scales the image to sit entirely within the page, leaving margins. Fill scales it to cover the page and crops whatever overflows, which will cut the edges off a scanned document.",
    },
    {
      question: "Why is my PDF so large?",
      answer: "Images are embedded at full resolution with no re-encoding, so the PDF is about as big as the photos. Phone cameras produce several megabytes per shot. Resize or compress the images first if the file needs to be emailed.",
    },
    {
      question: "Are my photos uploaded anywhere?",
      answer: "No. Everything is read and assembled in your browser, which matters when the images are of a passport, a bank statement or anything else you would not want on someone else's server.",
    },
  ],
};

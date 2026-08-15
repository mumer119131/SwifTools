import { Shrink } from "lucide-react";

import type { Tool } from "@/config/tools";

export const compressPdf: Tool = {
  slug: "compress-pdf",
  name: "Compress PDF",
  category: "pdf",
  description: "Shrink a PDF's file size while keeping it readable, without uploading it anywhere.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "shrink pdf",
    "pdf compressor online free",
    "make pdf smaller",
  ],
  icon: Shrink,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in the PDF you want to shrink.",
    "Pick a level: Lossless keeps text selectable, while Strong and Maximum re-render each page as an image at a lower resolution.",
    "Press Compress, compare the before and after sizes, then download.",
  ],
  notes: [
    "Most of the weight in a typical PDF is images. Compression here re-encodes embedded images at a lower quality and, where they are larger than they need to be for the page, downsamples them — a 4000-pixel-wide photo placed in a 6-inch-wide frame only needs about 1800 pixels to print sharply, and the rest is stored for nothing.",
    "Text and vector graphics are left alone. They are already stored as instructions rather than pixels, so there is nothing to compress without changing what the page says. This is why a text-heavy document barely shrinks while a scanned brochure can lose most of its size: the savings come from the images, and a document with no images has none to give.",
    "Compression is lossy and cannot be undone. Work from a copy, and check the result at the size it will actually be viewed — a photo that looks soft at 400% zoom may be perfectly fine on screen or in print.",
  ],
  faq: [
    {
      question: "How much smaller will my PDF get?",
      answer: "It depends almost entirely on images. A scanned document or an image-heavy brochure often drops by 60 to 90 percent. A text-only report may barely change, because its text and vector content is already stored compactly and there is nothing to remove without altering the page.",
    },
    {
      question: "Will compressing a PDF make the text blurry?",
      answer: "No. Text stays as text — it is stored as font instructions, not pixels, so it is untouched and remains sharp and selectable at any zoom. Only embedded images are re-encoded.",
    },
    {
      question: "Can I undo the compression?",
      answer: "Not from the compressed file. Image re-encoding discards data permanently, so keep the original if you may need it. Compressing an already-compressed file again will lose more quality for very little size.",
    },
    {
      question: "Why didn't my PDF get any smaller?",
      answer: "Almost certainly because it contains little or no image data, or because its images were already compressed hard. There is nothing left to squeeze out of well-compressed text and vectors without changing the content.",
    },
    {
      question: "Is my file uploaded anywhere?",
      answer: "No. The document is read by your browser, re-encoded on your device and written back out locally. It never leaves the machine, which is also why the tool works with no size limit beyond your available memory.",
    },
  ],
};

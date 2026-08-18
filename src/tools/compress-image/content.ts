import type { ToolContent } from "@/config/tool-content";

export const compressImageContent: ToolContent = {
  steps: [
    "Drop in one or more images — JPG, PNG, WEBP or AVIF.",
    "Pick a quality level, or set a target file size and let the tool find the quality that hits it.",
    "Compare before and after, then download individually or as a ZIP.",
  ],
  notes: [
    "Compression re-encodes the image at a lower quality setting. For JPEG and WebP that means discarding detail the eye is least sensitive to — fine colour variation, subtle gradients in flat areas — while keeping the structure and edges that carry the picture. Dropping quality from 100 to 80 typically halves the file for a difference most people cannot see.",
    "The quality slider is not a percentage of anything. It is an encoder setting, and the relationship between it and file size is steeply non-linear: 100 to 90 saves a great deal for almost no visible change, 90 to 80 saves a good amount for very little, and below about 60 artefacts start to show around hard edges and in skies.",
    "WebP is worth trying. At the same visual quality it is usually 25 to 35 percent smaller than JPEG, and every browser released since 2020 supports it. The compression happens on a canvas in your own browser, so nothing is uploaded and there is no size limit beyond your device's memory.",
  ],
  faq: [
    {
      question: "What quality setting should I use?",
      answer: "Start at 80. That is the point where most photographs lose about half their file size with no visible difference at normal viewing size. Go to 90 for images that will be printed or examined closely, and no lower than 60 for anything with sky, skin or gradients, where artefacts show first.",
    },
    {
      question: "Will compressing an image reduce its dimensions?",
      answer: "No. Compression changes how the pixels are stored, not how many there are — the image comes out the same width and height. Use the image resizer if you want fewer pixels, which usually saves far more than compression alone.",
    },
    {
      question: "Can I get the original quality back?",
      answer: "No. Lossy compression permanently discards data. Always keep the original, and never compress an already-compressed file repeatedly — each pass degrades the last one's output.",
    },
    {
      question: "Should I use JPG or WebP?",
      answer: "WebP, for anything on the web. It produces files 25 to 35 percent smaller than JPEG at matching quality and is supported by every current browser. Keep JPEG for compatibility with older software and for files people will download and open locally.",
    },
    {
      question: "Is there a file size limit?",
      answer: "None beyond your device's memory. The image is processed on a canvas in your browser rather than uploaded, so there is no server-side cap to run into.",
    },
  ],
};

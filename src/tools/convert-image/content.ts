import type { ToolContent } from "@/config/tool-content";

export const convertImageContent: ToolContent = {
  steps: [
    "Drop in the images you want to convert — mix formats freely.",
    "Choose the output format. Converting to JPG flattens transparency onto a white background.",
    "Convert and download individually, or grab everything as a ZIP.",
  ],
  notes: [
    "Format choice is really a choice about what the image contains. JPEG is built for photographs and handles smooth gradients efficiently, but puts visible halos around hard edges and cannot store transparency. PNG is lossless and handles sharp edges and transparency perfectly, which makes it right for screenshots, logos and line art and wasteful for photographs. WebP does both jobs well and is smaller than either.",
    "Converting between lossy formats compounds the loss. A JPEG turned into a WebP is re-encoded from the already-degraded JPEG, not from the original scene — the artefacts of the first encoding are baked in and the second encoder faithfully preserves them. Convert from the highest-quality source you have, not from something that has already been through the mill.",
    "Converting a PNG with transparency to JPEG will flatten the transparent areas, because JPEG has no alpha channel. The tool composites onto white; if you need a different background, do that before converting.",
  ],
  faq: [
    {
      question: "Should I use PNG or JPG?",
      answer: "PNG for anything with hard edges or transparency — screenshots, logos, diagrams, line art. JPG for photographs, where its lossy compression works with the image rather than against it. Using JPG for a screenshot produces visible smearing around text.",
    },
    {
      question: "What happens to transparency when I convert PNG to JPG?",
      answer: "It is lost, because JPEG has no alpha channel. Transparent areas are composited onto white. If you need a different background colour, apply it before converting.",
    },
    {
      question: "Is WebP better than JPG and PNG?",
      answer: "For the web, generally yes — it is 25 to 35 percent smaller than JPEG at equal quality, supports transparency like PNG, and works in every current browser. JPEG and PNG remain safer for files that people download and open in older desktop software.",
    },
    {
      question: "Does converting an image lose quality?",
      answer: "Converting to a lossless format such as PNG does not. Converting to JPEG or WebP re-encodes and loses a little, and converting from an already-lossy source compounds it — always start from the best original you have.",
    },
    {
      question: "Can I convert HEIC photos from my iPhone?",
      answer: "Only if your browser can decode HEIC, which Safari on Apple devices can and most others cannot. On an iPhone, setting the camera to Most Compatible saves as JPEG instead and avoids the problem entirely.",
    },
  ],
};

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
};

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
};

import { Combine } from "lucide-react";

import type { Tool } from "@/config/tools";

export const mergePdf: Tool = {
  slug: "merge-pdf",
  name: "Merge PDF",
  category: "pdf",
  description: "Combine several PDFs into one file, in any order you choose.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf files",
    "pdf merger online free",
    "merge pdf without watermark",
  ],
  icon: Combine,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in the PDFs you want to combine — add as many as you need.",
    "Drag the arrows to put them in the order you want them merged.",
    "Press Merge. The files are combined on your own device, then download the result.",
  ],
};

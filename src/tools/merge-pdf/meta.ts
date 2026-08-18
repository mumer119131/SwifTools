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
};

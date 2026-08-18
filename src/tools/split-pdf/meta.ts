import { Split } from "lucide-react";

import type { Tool } from "@/config/tools";

export const splitPdf: Tool = {
  slug: "split-pdf",
  name: "Split PDF",
  category: "pdf",
  description: "Extract a page range, or split a PDF into separate one-page files.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "separate pdf pages",
    "pdf splitter online free",
    "delete pages from pdf",
  ],
  icon: Split,
  processing: "client",
  status: "live",
  popular: true,
};

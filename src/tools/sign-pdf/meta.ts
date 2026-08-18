import { PenLine } from "lucide-react";

import type { Tool } from "@/config/tools";

export const signPdfTool: Tool = {
  slug: "sign-pdf",
  name: "Sign PDF",
  category: "pdf",
  description: "Draw or type a signature and place it on a PDF, without uploading the document.",
  keywords: [
    "sign pdf",
    "sign pdf online",
    "add signature to pdf",
    "e-sign pdf",
    "electronic signature pdf",
    "sign a contract online",
    "draw signature on pdf",
  ],
  icon: PenLine,
  processing: "client",
  status: "live",
  popular: true,
};

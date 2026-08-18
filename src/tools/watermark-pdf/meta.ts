import { Stamp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const watermarkPdf: Tool = {
  slug: "watermark-pdf",
  name: "Watermark PDF",
  category: "pdf",
  description: "Stamp DRAFT, CONFIDENTIAL or your own text across a PDF, without re-encoding it.",
  keywords: [
    "watermark pdf",
    "add watermark to pdf",
    "stamp draft on pdf",
    "confidential watermark pdf",
    "pdf watermark free",
    "add text to pdf pages",
  ],
  icon: Stamp,
  processing: "client",
  status: "live",
};

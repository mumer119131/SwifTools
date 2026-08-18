import { ImagePlus } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jpgToPdf: Tool = {
  slug: "jpg-to-pdf",
  name: "JPG to PDF",
  category: "pdf",
  description: "Turn photos and scans into a single PDF, one image per page.",
  keywords: [
    "jpg to pdf",
    "image to pdf",
    "png to pdf",
    "convert photos to pdf free",
    "combine images into pdf",
  ],
  icon: ImagePlus,
  processing: "client",
  status: "live",
};

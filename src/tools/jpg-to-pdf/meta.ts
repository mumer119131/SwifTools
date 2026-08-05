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
  steps: [
    "Drop in your JPG, PNG or WEBP images — add as many as you like.",
    "Choose a page size and orientation, and whether images fit inside the page or fill it.",
    "Create the PDF and download it. Each image becomes its own page, in the order shown.",
  ],
};

import { FileImage } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pdfToJpg: Tool = {
  slug: "pdf-to-jpg",
  name: "PDF to JPG",
  category: "pdf",
  description: "Turn every page of a PDF into a high-quality JPG or PNG image.",
  keywords: [
    "pdf to jpg",
    "pdf to image",
    "convert pdf to png",
    "pdf to jpg converter free",
    "extract images from pdf",
  ],
  icon: FileImage,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Drop in your PDF.",
    "Choose the output format and resolution — 150 DPI suits the screen, 300 DPI suits print.",
    "Convert, then download a single image or a ZIP of every page.",
  ],
};

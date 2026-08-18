import { ScanEye } from "lucide-react";

import type { Tool } from "@/config/tools";

export const exifViewer: Tool = {
  slug: "exif-viewer",
  name: "EXIF Viewer and Remover",
  category: "image",
  description: "See the hidden data in a photo — including GPS coordinates — and strip it without re-encoding.",
  keywords: [
    "exif viewer",
    "remove exif data",
    "photo metadata",
    "strip gps from photo",
    "exif remover",
    "check photo location data",
    "image metadata viewer",
  ],
  icon: ScanEye,
  processing: "client",
  status: "live",
  popular: true,
};

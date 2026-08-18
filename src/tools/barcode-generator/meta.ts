import { Barcode } from "lucide-react";

import type { Tool } from "@/config/tools";

export const barcodeGenerator: Tool = {
  slug: "barcode-generator",
  name: "Barcode Generator",
  category: "generator",
  description: "Create Code 128, EAN-13, UPC-A, EAN-8 and Code 39 barcodes, and download them as SVG.",
  keywords: [
    "barcode generator",
    "create barcode",
    "ean 13 generator",
    "upc barcode generator",
    "code 128 generator",
    "barcode maker",
    "free barcode generator",
    "code 39 barcode",
  ],
  icon: Barcode,
  processing: "client",
  status: "live",
};

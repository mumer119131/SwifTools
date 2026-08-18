import { QrCode } from "lucide-react";

import type { Tool } from "@/config/tools";

export const qrCodeGenerator: Tool = {
  slug: "qr-code-generator",
  name: "QR Code Generator",
  category: "generator",
  description: "Create QR codes for links, text, Wi-Fi and contacts, then download as PNG or SVG.",
  keywords: ["qr code generator", "free qr code", "wifi qr code", "qr code png"],
  icon: QrCode,
  processing: "client",
  status: "live",
  popular: true,
};

import { Printer } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dpiCalculator: Tool = {
  slug: "dpi-calculator",
  name: "DPI and Print Size Calculator",
  category: "image",
  description: "How big an image prints, how many pixels a print needs, and whether yours is enough.",
  keywords: [
    "dpi calculator",
    "pixels to inches",
    "print size calculator",
    "how many pixels for a4",
    "image resolution for printing",
    "ppi calculator",
  ],
  icon: Printer,
  processing: "client",
  status: "live",
  popular: true,
};

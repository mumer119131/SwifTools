import { Receipt } from "lucide-react";

import type { Tool } from "@/config/tools";

export const vatCalculator: Tool = {
  slug: "vat-calculator",
  name: "VAT Calculator",
  category: "calculator",
  description: "Add VAT to a net price or work it back out of a gross one, at any rate.",
  keywords: [
    "vat calculator",
    "add vat",
    "remove vat",
    "vat backwards calculator",
    "sales tax calculator",
    "gst calculator",
    "reverse vat",
    "how to work out vat",
  ],
  icon: Receipt,
  processing: "client",
  status: "live",
  popular: true,
};

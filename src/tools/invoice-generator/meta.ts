import { FileSpreadsheet } from "lucide-react";

import type { Tool } from "@/config/tools";

export const invoiceGenerator: Tool = {
  slug: "invoice-generator",
  name: "Invoice Generator",
  category: "calculator",
  description: "Build a clean invoice with line items, tax and discount, then export it as a PDF.",
  keywords: ["invoice generator", "free invoice maker", "invoice template", "invoice pdf"],
  icon: FileSpreadsheet,
  processing: "client",
  status: "live",
};

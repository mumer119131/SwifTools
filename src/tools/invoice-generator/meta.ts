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
  steps: [
    "Fill in who the invoice is from and who it is for, with an invoice number and dates.",
    "Add line items — the totals, tax and discount update as you type.",
    "Download the PDF. It is typeset in your browser, so none of your client's details are uploaded.",
  ],
};

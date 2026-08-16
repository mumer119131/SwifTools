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
  notes: [
    "Builds a professional invoice and exports it as a PDF entirely in your browser. Line items, quantities, rates, tax and discounts are calculated as you type, and nothing is uploaded — which matters given an invoice carries your address, your client's details and your bank information.",
    "The details that get invoices paid are unglamorous: a unique invoice number, a clear issue date and due date, an itemised breakdown, and payment instructions that do not require the client to email you asking how to pay. Most late payments start as a query the invoice should have answered.",
    "Requirements vary by jurisdiction. A VAT-registered business in the UK or EU must show its registration number, the tax rate and the tax amount separately; US invoices generally need sales tax stated where it applies. Check what your own tax authority requires before relying on any template.",
  ],
  faq: [
    {
      question: "What has to be on an invoice?",
      answer: "Your name and address, the client's, a unique invoice number, the issue and due dates, an itemised list with quantities and rates, the total, and how to pay. Tax registration numbers are required where you are registered for VAT or equivalent.",
    },
    {
      question: "How should I number my invoices?",
      answer: "Sequentially and without gaps — INV-001, INV-002 — because most tax authorities expect an unbroken series. Adding a year prefix keeps them ordered across years without restarting the count.",
    },
    {
      question: "What payment terms should I use?",
      answer: "Net 30 is the common default, though 14 days is increasingly normal for small suppliers. Whatever you choose, state the due date explicitly rather than leaving the client to calculate it — invoices with a stated date are paid sooner.",
    },
    {
      question: "Do I need to charge tax on my invoice?",
      answer: "That depends on your registration status and where your client is. VAT and sales tax rules differ by jurisdiction and for cross-border work, so check with your tax authority rather than copying another invoice.",
    },
    {
      question: "Is my invoice data uploaded anywhere?",
      answer: "No. The PDF is generated in your browser, so your address, your client's details and your bank information never leave your device.",
    },
  ],
};

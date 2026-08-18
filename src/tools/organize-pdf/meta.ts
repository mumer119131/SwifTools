import { LayoutList } from "lucide-react";

import type { Tool } from "@/config/tools";

export const organizePdf: Tool = {
  slug: "organize-pdf",
  name: "Organise PDF Pages",
  category: "pdf",
  description: "Reorder, rotate and delete pages without re-encoding anything.",
  keywords: [
    "rotate pdf",
    "delete pages from pdf",
    "reorder pdf pages",
    "rearrange pdf",
    "remove page from pdf",
    "organize pdf",
    "pdf page editor",
  ],
  icon: LayoutList,
  processing: "client",
  status: "live",
  popular: true,
};

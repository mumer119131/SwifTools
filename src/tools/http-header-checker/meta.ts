import { FileSearch } from "lucide-react";

import type { Tool } from "@/config/tools";

export const httpHeaderChecker: Tool = {
  slug: "http-header-checker",
  name: "HTTP Header Checker",
  category: "developer",
  description: "Inspect response headers and redirects, and check the security headers a site sets.",
  keywords: [
    "http header checker",
    "response headers",
    "security headers checker",
    "redirect checker",
    "check hsts",
    "view http headers",
  ],
  icon: FileSearch,
  // Server-side: this needs something only the server can see or reach.
  processing: "server",
  status: "live",
};

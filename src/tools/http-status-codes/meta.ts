import { Server } from "lucide-react";

import type { Tool } from "@/config/tools";

export const httpStatusCodes: Tool = {
  slug: "http-status-codes",
  name: "HTTP Status Codes",
  category: "developer",
  description: "Every status code with what it actually means, and the pairs people confuse.",
  keywords: [
    "http status codes",
    "what does 404 mean",
    "301 vs 302",
    "401 vs 403",
    "http error codes list",
    "status code reference",
  ],
  icon: Server,
  processing: "client",
  status: "live",
  popular: true,
};

import { ShieldQuestion } from "lucide-react";

import type { Tool } from "@/config/tools";

export const robotsTxtTester: Tool = {
  slug: "robots-txt-tester",
  name: "Robots.txt Tester",
  category: "seo",
  description: "Check whether a URL is blocked, and see exactly which rule decided it.",
  keywords: [
    "robots.txt tester",
    "robots txt checker",
    "is url blocked by robots",
    "test robots.txt rules",
    "robots.txt validator",
    "crawler blocked",
  ],
  icon: ShieldQuestion,
  processing: "client",
  status: "live",
};

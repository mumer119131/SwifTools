import { Regex } from "lucide-react";

import type { Tool } from "@/config/tools";

export const regexTester: Tool = {
  slug: "regex-tester",
  name: "Regex Tester",
  category: "developer",
  description: "Test regular expressions live with match highlighting and capture groups.",
  keywords: ["regex tester", "regular expression tester", "regex match", "regexp online"],
  icon: Regex,
  processing: "client",
  status: "live",
  popular: true,
};

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
  steps: [
    "Type your pattern and pick the flags you need — global, ignore case, multiline and the rest.",
    "Paste test text below. Matches highlight as you type, and every capture group is listed.",
    "Use the replace field to preview a substitution with $1-style group references.",
  ],
};

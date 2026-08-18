import { Database } from "lucide-react";

import type { Tool } from "@/config/tools";

export const sqlFormatter: Tool = {
  slug: "sql-formatter",
  name: "SQL Formatter",
  category: "developer",
  description: "Make an unreadable query readable, in the dialect you actually use.",
  keywords: [
    "sql formatter",
    "format sql online",
    "sql beautifier",
    "prettify sql",
    "sql pretty print",
    "postgresql formatter",
    "mysql query formatter",
    "sql minifier",
  ],
  icon: Database,
  processing: "client",
  status: "live",
};

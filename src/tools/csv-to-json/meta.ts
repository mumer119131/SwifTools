import { Table } from "lucide-react";

import type { Tool } from "@/config/tools";

export const csvToJson: Tool = {
  slug: "csv-to-json",
  name: "CSV to JSON Converter",
  category: "developer",
  description: "Convert CSV to JSON and back, with proper quoting, type inference and a table preview.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv converter",
    "convert csv to json online",
    "csv parser",
    "tsv to json",
    "spreadsheet to json",
  ],
  icon: Table,
  processing: "client",
  status: "live",
  popular: true,
};

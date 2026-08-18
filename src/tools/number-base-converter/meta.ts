import { Hash } from "lucide-react";

import type { Tool } from "@/config/tools";

export const numberBaseConverter: Tool = {
  slug: "number-base-converter",
  name: "Number Base Converter",
  category: "converter",
  description: "Convert between binary, octal, decimal, hexadecimal and any base from 2 to 36.",
  keywords: ["binary to decimal", "hex converter", "number base converter", "octal converter"],
  icon: Hash,
  processing: "client",
  status: "live",
};

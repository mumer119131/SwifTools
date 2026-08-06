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
  steps: [
    "Type a number into any of the base fields — they all stay in sync.",
    "Use the custom base selector for anything from base 2 to base 36.",
    "Big integers are handled exactly, so 64-bit values don't lose their low digits.",
  ],
};

import { Columns3 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const romanNumeralConverter: Tool = {
  slug: "roman-numeral-converter",
  name: "Roman Numeral Converter",
  category: "converter",
  description: "Convert both ways, with malformed numerals refused rather than guessed at.",
  keywords: [
    "roman numeral converter",
    "roman numerals to numbers",
    "number to roman numerals",
    "what is mcmxciv",
    "roman numeral date",
    "roman numerals chart",
  ],
  icon: Columns3,
  processing: "client",
  status: "live",
  popular: true,
};

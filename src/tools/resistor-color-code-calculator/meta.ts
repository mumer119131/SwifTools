import { CircuitBoard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const resistorColorCodeCalculator: Tool = {
  slug: "resistor-color-code-calculator",
  name: "Resistor Color Code Calculator",
  category: "science",
  description: "Decode 4, 5 and 6-band resistors — or go the other way from a value to its bands.",
  keywords: ["resistor color code","resistor band calculator","4 band resistor","5 band resistor","decode resistor colours"],
  icon: CircuitBoard,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick how many bands your resistor has, then set each band's colour.",
    "The value, tolerance and range appear as you go, with a preview of the part.",
    "Or switch to reverse mode and enter a resistance to get the bands you need.",
  ],
};

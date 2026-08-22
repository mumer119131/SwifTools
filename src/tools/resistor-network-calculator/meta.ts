import { CircuitBoard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const resistorNetworkCalculator: Tool = {
  slug: "resistor-network-calculator",
  name: "Series and Parallel Resistor Calculator",
  category: "science",
  description: "Total resistance for any number of resistors, with the current and power each one takes.",
  keywords: [
    "parallel resistor calculator",
    "series resistance calculator",
    "total resistance",
    "resistors in parallel",
    "equivalent resistance",
  ],
  icon: CircuitBoard,
  processing: "client",
  status: "live",
};

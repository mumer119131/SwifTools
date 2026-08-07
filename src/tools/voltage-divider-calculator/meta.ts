import { GitFork } from "lucide-react";

import type { Tool } from "@/config/tools";

export const voltageDividerCalculator: Tool = {
  slug: "voltage-divider-calculator",
  name: "Voltage Divider Calculator",
  category: "science",
  description: "Work out the output of a two-resistor divider, or the resistors for a target output.",
  keywords: ["voltage divider calculator","resistor divider","vout formula","potential divider calculator"],
  icon: GitFork,
  processing: "client",
  status: "live",
  steps: [
    "Enter the input voltage and both resistor values to get the output.",
    "Or solve for either resistor when you know the output you need.",
    "Current draw and power dissipation are shown, since a low-value divider wastes both.",
  ],
};

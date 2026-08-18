import { Lightbulb } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ledResistorCalculator: Tool = {
  slug: "led-resistor-calculator",
  name: "LED Resistor Calculator",
  category: "science",
  description: "Find the current-limiting resistor for an LED, with the nearest standard value.",
  keywords: ["led resistor calculator","current limiting resistor","led series resistor","resistor for led 5v","led forward voltage"],
  icon: Lightbulb,
  processing: "client",
  status: "live",
  popular: true,
};

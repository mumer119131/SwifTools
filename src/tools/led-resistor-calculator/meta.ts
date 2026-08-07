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
  steps: [
    "Enter your supply voltage, the LED's forward voltage and the current you want through it.",
    "The exact resistance is calculated, then rounded up to the nearest standard E24 value.",
    "Check the power rating — a resistor dissipating more than it is rated for will cook.",
  ],
};

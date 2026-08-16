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
  notes: [
    "Two resistors in series divide a voltage in proportion to their values: the output across the lower resistor is Vin × R2/(R1+R2). It is the simplest way to scale a voltage down, and it appears in almost every analogue circuit somewhere.",
    "The catch is that it only holds when nothing meaningful is drawing current from the output. A divider is a high-impedance reference, not a power supply — connect a load comparable to R2 and the output sags, because the load is effectively in parallel with R2 and changes the ratio.",
    "The rule of thumb is that the load impedance should be at least ten times R2 for the ideal formula to be within a few percent. If you need a stable voltage under load, you need a regulator or a buffer amplifier, not a divider.",
  ],
  faq: [
    {
      question: "What is the voltage divider formula?",
      answer: "Vout = Vin × R2 / (R1 + R2), where R2 is the resistor the output is measured across. The output is in the same proportion to the input as R2 is to the total resistance.",
    },
    {
      question: "Why does my divider output drop when I connect something to it?",
      answer: "Because the load sits in parallel with R2 and changes the ratio. A divider is a reference, not a supply — it only behaves as calculated when almost nothing is drawn from it.",
    },
    {
      question: "How much current can a voltage divider supply?",
      answer: "Almost none, if the output is to stay accurate. As a rule the load impedance should be at least ten times R2. For anything drawing real current you need a regulator or a buffer.",
    },
    {
      question: "What resistor values should I use?",
      answer: "The ratio sets the voltage; the absolute values set the current wasted. Higher values waste less power but are more susceptible to noise and loading. Values in the kilohm range are a common compromise.",
    },
    {
      question: "Can I use a voltage divider to power a component?",
      answer: "No. Anything that draws current will pull the output down unpredictably. Use a linear or switching regulator, which holds its output steady as the load changes.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const resistorNetworkCalculatorContent: ToolContent = {
  steps: [
    "Choose series or parallel and enter your resistor values.",
    "Schematic notation works — 4k7, 2.2k, 1M.",
    "Add a supply voltage to see the current and power each resistor takes.",
  ],
  notes: [
    "Two rules. In series the resistances add, and the same current flows through every resistor while the voltage divides between them in proportion. In parallel the reciprocals add, every resistor sees the full voltage, and the current divides inversely.",
    "The parallel result is the one that defies intuition: the total is always smaller than the smallest resistor in the set. Adding another path for current can only make it easier to flow, never harder — obvious once stated, and consistently surprising the first time. Two equal resistors in parallel give exactly half their value, which is the case worth memorising.",
    "The per-resistor breakdown matters more than the total for anything you are actually building. A resistor rated at a quarter of a watt — which is what most people have in a drawer — will fail if asked to dissipate more, and it will do so in a way you smell before you see. Anything above that threshold is highlighted.",
    "The nearest standard value comes from the E24 series, which is what resistors are actually manufactured in. A calculated 68.75 Ω is not something you can buy; 68 Ω is. The comparison is made in logarithmic space rather than linearly, because resistor series are logarithmic — which is why 2.2k sits closer to 2.0k than to 2.4k on the scale that matters.",
  ],
  faq: [
    {
      question: "How do you calculate resistors in parallel?",
      answer: "Add the reciprocals and take the reciprocal of the total: 1/R = 1/R₁ + 1/R₂. Two equal resistors give half their value, and the result is always smaller than the smallest resistor in the set.",
    },
    {
      question: "Why is parallel resistance lower than any single resistor?",
      answer: "Because each extra resistor adds another path for current. More paths can only make it easier for current to flow, so the effective resistance falls. It is counterintuitive until you think of it as widening a pipe rather than lengthening one.",
    },
    {
      question: "How do resistors in series work?",
      answer: "The resistances simply add, and the same current flows through all of them. The supply voltage divides between them in proportion to resistance, which is exactly how a voltage divider works.",
    },
    {
      question: "What power rating do my resistors need?",
      answer: "Enough to dissipate what they are asked to. Most through-hole resistors are quarter-watt, and anything above that is highlighted here — exceeding the rating is how a resistor ends up smelling distinctive.",
    },
    {
      question: "What is 4k7 in ohms?",
      answer: "4,700 ohms. The multiplier stands in for the decimal point so the marking survives a smudged print — a convention from schematics that this tool accepts directly.",
    },
  ],
};

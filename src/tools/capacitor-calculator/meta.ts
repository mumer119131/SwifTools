import { Battery } from "lucide-react";

import type { Tool } from "@/config/tools";

export const capacitorCalculator: Tool = {
  slug: "capacitor-calculator",
  name: "Capacitor Calculator",
  category: "science",
  description: "RC time constant, capacitive reactance, stored energy and series/parallel totals.",
  keywords: ["capacitor calculator","rc time constant","capacitive reactance","capacitor energy","series parallel capacitors"],
  icon: Battery,
  processing: "client",
  status: "live",
  steps: [
    "Enter capacitance with its prefix — pF, nF and µF are all accepted.",
    "Add a resistance for the RC time constant, or a frequency for reactance.",
    "Series and parallel totals are shown for combining capacitors.",
  ],
  notes: [
    "Covers the four things people need from a capacitor: the RC time constant, capacitive reactance at a frequency, stored energy, and the combined value of capacitors in series or parallel.",
    "Capacitors combine the opposite way to resistors, which is the detail most often got backwards. In parallel the capacitances add; in series the reciprocals add, so two equal capacitors in series give half the value. The reason is physical — parallel plates in parallel are effectively one larger plate, while in series the plate separation adds up.",
    "The time constant τ = RC is the number to remember. After one time constant a capacitor has charged to 63.2 percent of the supply, after three to 95 percent, and after five to over 99 — which is why five time constants is the usual rule for 'fully charged'.",
  ],
  faq: [
    {
      question: "How do capacitors combine in series and parallel?",
      answer: "The opposite way to resistors. Parallel capacitances add directly; series capacitances add as reciprocals, so two equal capacitors in series give half the value of one.",
    },
    {
      question: "What is the RC time constant?",
      answer: "τ = R × C, the time to charge to 63.2 percent of the supply voltage. Three time constants reaches 95 percent and five exceeds 99, which is why five is the usual rule for treating something as fully charged.",
    },
    {
      question: "What is capacitive reactance?",
      answer: "The opposition a capacitor presents to alternating current, Xc = 1/(2πfC). It falls as frequency rises, which is why a capacitor blocks DC and passes high frequencies — the basis of every coupling and filtering application.",
    },
    {
      question: "How much energy does a capacitor store?",
      answer: "E = ½CV². The voltage is squared, so doubling it quadruples the stored energy — which is why large capacitors charged to high voltages are genuinely dangerous even after the supply is removed.",
    },
    {
      question: "Why does my capacitor measure less than its rating?",
      answer: "Electrolytic capacitors have wide tolerances, often −20% to +80%, and lose capacitance as they age and dry out. Ceramic capacitors also lose value under DC bias, sometimes dramatically.",
    },
  ],
};

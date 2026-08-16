import { Zap } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ohmsLawCalculator: Tool = {
  slug: "ohms-law-calculator",
  name: "Ohm's Law Calculator",
  category: "science",
  description: "Solve for voltage, current, resistance or power — any one from the others.",
  keywords: ["ohms law calculator","voltage current resistance","v=ir calculator","electrical power calculator","ohm law formula"],
  icon: Zap,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Choose which quantity you want — voltage, current, resistance or power.",
    "Enter any two of the others; the fourth is derived automatically.",
    "The formula used is shown beneath the answer so you can check the working.",
  ],
  notes: [
    "Ohm's law states that voltage equals current times resistance — V = IR. Any one of the three follows from the other two, which is why this solves in whichever direction you need rather than fixing an output field.",
    "Power comes with it: P = VI, and by substitution P = I²R and P = V²/R. The squared terms are the ones that matter in practice, because doubling the current through a resistor quadruples the heat it has to dissipate. A resistor that runs warm at 100 mA will fail at 200 mA.",
    "The law holds for ohmic components — resistors, wire, heating elements — where resistance is constant. It does not describe diodes, LEDs, transistors or filament bulbs, whose resistance changes with current or temperature. Applying it to an LED is the classic beginner's mistake and is why the LED resistor calculator exists separately.",
  ],
  faq: [
    {
      question: "What is Ohm's law?",
      answer: "Voltage equals current times resistance, written V = IR. Rearranged, current is voltage over resistance and resistance is voltage over current — three forms of one relationship, which is why knowing any two gives the third.",
    },
    {
      question: "How do I calculate power dissipation in a resistor?",
      answer: "P = I²R or P = V²/R, both derived from P = VI. The square is what catches people out: doubling the current quadruples the heat, so a resistor comfortable at 100 mA will burn out at 200 mA.",
    },
    {
      question: "Does Ohm's law apply to LEDs?",
      answer: "No. An LED's resistance changes drastically with voltage, so it is not an ohmic component. Connecting one without a current-limiting resistor destroys it — which is what the LED resistor calculator is for.",
    },
    {
      question: "What resistor wattage do I need?",
      answer: "Calculate the dissipation with P = I²R and choose a resistor rated at least twice that. Running a component at its rated maximum leaves no margin for ambient heat or a supply that drifts high.",
    },
    {
      question: "Why is my circuit drawing more current than calculated?",
      answer: "Usually because a component is not ohmic, or because resistance falls as things heat up. Filament bulbs and motors both draw a large inrush current at switch-on for exactly this reason.",
    },
  ],
};

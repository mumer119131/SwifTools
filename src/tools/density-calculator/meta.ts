import { Layers } from "lucide-react";

import type { Tool } from "@/config/tools";

export const densityCalculator: Tool = {
  slug: "density-calculator",
  name: "Density Calculator",
  category: "science",
  description: "Solve ρ = m/V for density, mass or volume, with common materials for comparison.",
  keywords: ["density calculator","mass volume density","calculate density formula","g/cm3 calculator","specific gravity"],
  icon: Layers,
  processing: "client",
  status: "live",
  steps: [
    "Choose density, mass or volume as the unknown.",
    "Enter the other two — kilograms and cubic metres, or grams and cubic centimetres, since the ratio is the same.",
    "Compare the result against common materials listed below.",
  ],
  notes: [
    "Density is mass divided by volume, and it is what determines whether something floats. An object floats in a fluid less dense than itself — which is why a steel ship floats: the hull encloses air, so the average density of the whole vessel is far below that of water.",
    "Water at 4°C is 1,000 kg/m³, which is the reference the metric system was built around: one gram per cubic centimetre, one kilogram per litre. That is not a coincidence but a definition, and it makes water a convenient benchmark for everything else.",
    "Density changes with temperature, and water is famously anomalous. It is densest at 4°C and expands as it freezes, which is why ice floats and why pipes burst. Almost every other substance is densest as a solid.",
  ],
  faq: [
    {
      question: "How do I calculate density?",
      answer: "Divide mass by volume. A 200 gram object occupying 50 cubic centimetres has a density of 4 g/cm³, or 4,000 kg/m³ — the units matter, but the arithmetic does not change.",
    },
    {
      question: "Why does a steel ship float?",
      answer: "Because what matters is the average density of the whole vessel, not of the steel. The hull encloses a great deal of air, bringing the average well below water's 1,000 kg/m³.",
    },
    {
      question: "What is the density of water?",
      answer: "1,000 kg/m³ at 4°C, equal to 1 g/cm³ and 1 kg per litre. The metric system was designed around that relationship, which is why the numbers are so clean.",
    },
    {
      question: "Why does ice float?",
      answer: "Because water is unusual: it is densest at 4°C and expands as it freezes, so ice is about 8 percent less dense than liquid water. Almost every other substance is denser as a solid.",
    },
    {
      question: "Does density change with temperature?",
      answer: "Yes. Most substances expand when heated and become less dense, which is what drives convection. Water reverses this below 4°C, which is why lakes freeze from the top down.",
    },
  ],
};

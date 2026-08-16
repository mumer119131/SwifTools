import { Droplet } from "lucide-react";

import type { Tool } from "@/config/tools";

export const phCalculator: Tool = {
  slug: "ph-calculator",
  name: "pH Calculator",
  category: "science",
  description: "Convert between pH, pOH and ion concentration, with a visual scale.",
  keywords: ["ph calculator","poh calculator","hydrogen ion concentration","acid base ph scale","calculate ph from molarity"],
  icon: Droplet,
  processing: "client",
  status: "live",
  steps: [
    "Enter any one of pH, pOH, [H⁺] or [OH⁻].",
    "The other three follow, since pH + pOH = 14 at 25 °C.",
    "The scale shows where the value sits and what everyday substance is nearby.",
  ],
  notes: [
    "pH is the negative base-10 logarithm of hydrogen ion concentration. Being logarithmic is the fact that matters: each whole pH unit is a tenfold change in acidity, so pH 3 is ten times more acidic than pH 4 and a hundred times more than pH 5.",
    "That is why small-sounding pH shifts are large. Ocean pH falling from 8.2 to 8.1 sounds trivial and represents about a 26 percent increase in hydrogen ion concentration. It is also why diluting a strong acid tenfold moves the pH by exactly one unit.",
    "pH and pOH always sum to 14 in water at 25°C, because the ion product of water is fixed. That relationship holds only at that temperature — pure water at 50°C has a neutral pH of about 6.6, which is still neutral even though it is below 7.",
  ],
  faq: [
    {
      question: "What does pH measure?",
      answer: "The concentration of hydrogen ions, on a negative logarithmic scale. pH 7 is neutral at 25°C, lower is acidic and higher is alkaline.",
    },
    {
      question: "Why is a pH change of 1 significant?",
      answer: "Because the scale is logarithmic. One unit is a tenfold change in hydrogen ion concentration, so pH 3 is a hundred times more acidic than pH 5 rather than slightly more.",
    },
    {
      question: "How do I convert pH to hydrogen ion concentration?",
      answer: "Concentration equals 10 to the power of negative pH, in moles per litre. pH 3 is 10⁻³, or 0.001 mol/L. The reverse is the negative logarithm of the concentration.",
    },
    {
      question: "What is the relationship between pH and pOH?",
      answer: "They sum to 14 in water at 25°C, because the ion product of water is fixed at that temperature. At other temperatures the sum differs, which is why neutral is not always exactly 7.",
    },
    {
      question: "Is neutral pH always 7?",
      answer: "Only at 25°C. Pure water at 50°C has a neutral pH of about 6.6 — still neutral, because hydrogen and hydroxide concentrations are still equal, even though the number is below 7.",
    },
  ],
};

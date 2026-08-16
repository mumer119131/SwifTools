import { FlaskConical } from "lucide-react";

import type { Tool } from "@/config/tools";

export const stoichiometryCalculator: Tool = {
  slug: "stoichiometry-calculator",
  name: "Stoichiometry Calculator",
  category: "science",
  description: "Balance the books on a reaction — limiting reagent, theoretical yield and leftovers.",
  keywords: [
    "stoichiometry calculator",
    "limiting reagent calculator",
    "theoretical yield calculator",
    "mole ratio calculator",
    "percent yield calculator",
  ],
  icon: FlaskConical,
  processing: "client",
  status: "live",
  steps: [
    "Type a balanced equation, like 2H2 + O2 -> 2H2O.",
    "Enter how much of each reactant you have, in grams or moles.",
    "The limiting reagent, theoretical yield and leftover amounts are worked out for you.",
  ],
  notes: [
    "Given a balanced equation and the amounts you have, this finds which reactant runs out first and how much product that allows. The limiting reagent is the one with the smallest moles-divided-by-coefficient ratio — not the smallest mass, and not the fewest moles, which is the mistake the tool exists to prevent.",
    "Burning 10 g of hydrogen with 64 g of oxygen makes the point. There is six times more oxygen by weight, and oxygen is still the limiting reagent, because each mole of oxygen needs two of hydrogen and the ratio is what governs.",
    "It also reports what is left over and, if you enter what you actually got, the percent yield. Real yields are almost always below 100 percent — reactions run to equilibrium rather than completion, side reactions consume material, and product is lost in filtering and transfer.",
  ],
  faq: [
    {
      question: "How do I find the limiting reagent?",
      answer: "Divide each reactant's moles by its coefficient in the balanced equation; the smallest result is the limiting reagent. It is not the one with the smallest mass or the fewest moles, which is where most errors come from.",
    },
    {
      question: "What is theoretical yield?",
      answer: "The maximum product obtainable if the reaction went perfectly to completion, calculated from the limiting reagent. Real yields are lower because reactions reach equilibrium, side reactions occur, and material is lost in handling.",
    },
    {
      question: "How do I calculate percent yield?",
      answer: "Actual yield divided by theoretical yield, times 100. Enter what you measured and it is worked out for you. Anything above 100 percent means the product is wet or contaminated.",
    },
    {
      question: "Does the equation need to be balanced?",
      answer: "Yes, and the tool checks. An unbalanced equation is flagged with which elements differ across the arrow, because the mole ratios it implies would be meaningless.",
    },
    {
      question: "Why is my percent yield over 100?",
      answer: "Because the product is not pure. Residual solvent, unreacted starting material or water are the usual causes — dry the product fully and weigh again before concluding anything.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const dilutionCalculatorContent: ToolContent = {
  steps: [
    "Enter any three of stock concentration, stock volume, final concentration and final volume.",
    "The fourth is solved, along with how much solvent to add.",
    "Any consistent units work — the units cancel.",
  ],
  notes: [
    "C₁V₁ = C₂V₂ says the amount of solute does not change when you dilute something; only the volume it is spread through does. Everything else follows from that, which is why the same equation covers molarity, percentages and parts per million without modification.",
    "Because both sides carry the same units, they cancel — so molarity with millilitres works exactly as well as molarity with litres, provided you do not mix the two within one calculation. Mixing them is the commonest source of an answer that is out by a factor of a thousand.",
    "The figure people actually need at the bench is not in the equation: how much solvent to add. That is the final volume minus the stock volume, and the tool gives it separately because V₂ is the total after dilution rather than the amount you pour in. Making 100 mL from 25 mL of stock means adding 75 mL, not 100.",
    "For very large dilutions, a single step is impractical — measuring 10 microlitres accurately is harder than measuring 1 mL. Serial dilution solves that by doing it in stages, and the factors multiply: three tenfold steps give a thousandfold dilution using volumes you can actually pipette.",
  ],
  faq: [
    {
      question: "How do you calculate a dilution?",
      answer: "C₁V₁ = C₂V₂ — the concentration times volume of the stock equals that of the final solution, because the amount of solute does not change. Diluting 25 mL of 2M to a final 100 mL gives 0.5M.",
    },
    {
      question: "How much water do I add?",
      answer: "The final volume minus the stock volume. To make 100 mL from 25 mL of stock you add 75 mL. V₂ is the total afterwards, not the amount you pour in — which is the step most often got wrong.",
    },
    {
      question: "Does the equation work with percentages?",
      answer: "Yes, and with parts per million or any other concentration unit. Both sides carry the same units so they cancel. The only rule is not to mix units within one calculation.",
    },
    {
      question: "What is serial dilution and when do I need it?",
      answer: "Diluting in stages rather than one step, used when a single step would need a volume too small to measure accurately. The factors multiply — three tenfold steps give a thousandfold dilution using practical volumes.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const hookesLawCalculatorContent: ToolContent = {
  steps: [
    "Enter any two of force, spring constant and extension.",
    "The third is calculated, along with the energy stored.",
    "Extension is measured from the spring's natural, unloaded length.",
  ],
  notes: [
    "F = kx says the force a spring exerts is proportional to how far it is stretched or compressed. The spring constant k is the stiffness — newtons of force per metre of extension — and a stiffer spring simply has a larger one.",
    "The figure people most often get wrong is the energy. Stored elastic energy is ½kx², not force times extension, because the force is not constant during the stretch: it starts at zero and rises linearly, so the average force over the stretch is half the final value. Using Fx overstates the energy by a factor of two, which matters for anything from a catapult to a suspension design.",
    "Hooke's law is an approximation valid up to the elastic limit. Past it a spring deforms permanently, stops returning to its original length, and the relationship stops being linear — which is why a spring that has been over-stretched never quite works again.",
    "Extension is measured from the natural length, not from wherever the spring happens to be sitting. A spring already carrying a load is already extended, and measuring from that position rather than its unloaded one is a common source of wrong answers.",
  ],
  faq: [
    {
      question: "What is Hooke's law?",
      answer: "F = kx — the force a spring exerts is proportional to its extension. The spring constant k is its stiffness in newtons per metre, so a 100 N/m spring pulls back with 20 N when stretched by 0.2 m.",
    },
    {
      question: "How much energy is stored in a stretched spring?",
      answer: "Half the spring constant times the extension squared — ½kx². Not force times extension, which doubles the answer, because the force rises from zero as the spring stretches and the average is half the final value.",
    },
    {
      question: "What is the spring constant?",
      answer: "Stiffness, in newtons per metre. It is how much force the spring exerts per metre of extension, so a larger constant means a stiffer spring. Divide a known force by the extension it produces to measure it.",
    },
    {
      question: "When does Hooke's law stop applying?",
      answer: "Beyond the elastic limit, where the spring deforms permanently and no longer returns to its original length. The relationship also stops being linear there, so any calculation past that point is meaningless.",
    },
  ],
};

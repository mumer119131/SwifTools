import type { ToolContent } from "@/config/tool-content";

export const molecularWeightCalculatorContent: ToolContent = {
  steps: [
    "Type a formula — brackets, subscripts and hydrates like CuSO4·5H2O all parse.",
    "The molar mass appears with each element's mass and percentage contribution.",
    "Enter a sample mass to convert straight to moles and molecules.",
  ],
  notes: [
    "Molar mass is the sum of the atomic weights of every atom in a formula, in grams per mole. Water is two hydrogens at 1.008 plus one oxygen at 15.999, giving 18.015 g/mol — so 18.015 grams of water contains Avogadro's number of molecules, 6.02214076 × 10²³.",
    "The formula parser handles nested brackets and hydrate notation, which a regular expression cannot: Ca(OH)₂ needs the subscript applied to the whole group, and CuSO₄·5H₂O needs the five waters counted as a separate unit and added. Element symbols are case-sensitive because they have to be — CO is carbon monoxide and Co is cobalt.",
    "Values are the IUPAC 2021 standard atomic weights. Where an element has no stable isotope, the mass number of its most stable one is used, which is the standard convention rather than an approximation.",
  ],
  faq: [
    {
      question: "How do I calculate molar mass?",
      answer: "Add the atomic weight of every atom in the formula. Water is 2 × 1.008 for hydrogen plus 15.999 for oxygen, giving 18.015 g/mol. Type the formula and the breakdown per element is shown.",
    },
    {
      question: "Why does capitalisation matter in a chemical formula?",
      answer: "Because element symbols are case-sensitive. CO is carbon monoxide, two elements; Co is cobalt, one. Writing 'co' or 'CO' for cobalt gives a completely different molar mass.",
    },
    {
      question: "How do I write a hydrate formula?",
      answer: "With a middot or a full stop before the water — CuSO4·5H2O. The five waters are counted as a separate unit and added, which raises the molar mass from 159.6 to 249.7 g/mol.",
    },
    {
      question: "What is a mole?",
      answer: "Avogadro's number of particles, exactly 6.02214076 × 10²³ since the 2019 SI redefinition. One mole of any substance has a mass in grams equal to its molar mass, which is what makes the unit useful.",
    },
    {
      question: "How do I convert grams to moles?",
      answer: "Divide the mass in grams by the molar mass. Fifty grams of water is 50 ÷ 18.015, about 2.78 moles — the conversion is shown alongside the result.",
    },
  ],
};

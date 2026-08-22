import type { ToolContent } from "@/config/tool-content";

export const idealGasLawCalculatorContent: ToolContent = {
  steps: [
    "Enter any three of pressure, volume, amount and temperature.",
    "The fourth is solved from PV = nRT.",
    "Pressure is converted into atmospheres, bar and psi alongside.",
  ],
  notes: [
    "PV = nRT relates the four properties of a gas, with R the universal gas constant at 8.3145 joules per mole per kelvin. Every gas law people learn separately is a special case of it: hold temperature fixed and you have Boyle's law, hold pressure fixed and you have Charles's. There is no need to remember them as distinct rules.",
    "The mistake that dominates all others is entering Celsius. The equation is a proportionality and kelvin has an absolute zero, so a temperature of 20°C entered as 20 rather than 293.15 gives an answer wrong by roughly a factor of fifteen — and, worse, a plausible-looking one. If a result seems absurd, the temperature is the first thing to check.",
    "The units have to be consistent too. In SI that means pascals, cubic metres, moles and kelvin. Litres and atmospheres work with a different value of R, and mixing the two conventions silently produces nonsense — so everything here is SI, with the familiar units offered as conversions rather than inputs.",
    "It is called the ideal gas law because real gases only approximate it. The model assumes molecules have no volume and do not attract one another, which holds well at ordinary pressures and temperatures and breaks down near condensation — at high pressure or low temperature, expect real behaviour to diverge.",
  ],
  faq: [
    {
      question: "What is the ideal gas law?",
      answer: "PV = nRT — pressure times volume equals the number of moles times the gas constant times absolute temperature. It relates all four properties of a gas, and Boyle's and Charles's laws are special cases of it with one variable held fixed.",
    },
    {
      question: "Why must temperature be in kelvin?",
      answer: "Because the relationship is proportional and Celsius has an arbitrary zero. Entering 20 instead of 293.15 gives an answer wrong by about fifteen times — and a plausible-looking one, which is what makes it dangerous.",
    },
    {
      question: "What is the volume of one mole of gas?",
      answer: "About 22.4 litres at 0°C and one atmosphere. That figure falls straight out of the equation and is worth recognising as a sanity check on any answer.",
    },
    {
      question: "When does the ideal gas law stop working?",
      answer: "Near condensation — high pressure or low temperature. The model assumes molecules occupy no volume and do not attract each other, which holds well in ordinary conditions and progressively fails as a gas approaches becoming a liquid.",
    },
  ],
};

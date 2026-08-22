import type { ToolContent } from "@/config/tool-content";

export const momentumCalculatorContent: ToolContent = {
  steps: [
    "Enter any two of momentum, mass and velocity.",
    "The third is calculated, along with the impulse needed to stop it.",
    "Stopping forces at one second and a tenth of a second show why crumple zones exist.",
  ],
  notes: [
    "Momentum is mass times velocity, and it is the quantity conserved in a collision. Kinetic energy generally is not — some of it goes into deforming metal and heating the air — which is why two cars that bounce apart and two that crumple together obey the same momentum arithmetic and produce very different outcomes for the people inside.",
    "The distinction between momentum and energy is worth holding onto, because they scale differently. Momentum rises in proportion to velocity; kinetic energy rises with its square. A heavy slow object and a light fast one can carry identical momentum while differing enormously in energy — which is why a lorry at walking pace and a bullet are not comparable hazards despite the arithmetic.",
    "The impulse figure is the same number read as a change rather than a state: to stop something, you must remove all of its momentum, and impulse is force multiplied by the time you take doing it. That product is fixed, so the only variable is how long you spread it over.",
    "Which is the entire principle behind crumple zones, airbags, crash mats and bending your knees when you land. Stopping in a tenth of a second rather than a full second needs ten times the force, and the tool shows both so the relationship is visible rather than asserted.",
  ],
  faq: [
    {
      question: "How do you calculate momentum?",
      answer: "Multiply mass by velocity. A 1,000 kg car at 1.5 m/s has a momentum of 1,500 kg·m/s. The units are kilogram-metres per second, and momentum is a vector — direction matters when combining them.",
    },
    {
      question: "What is the difference between momentum and kinetic energy?",
      answer: "Momentum is mass times velocity; kinetic energy is half mass times velocity squared. Momentum is conserved in every collision, energy usually is not, and energy rises far faster with speed. Both are shown here for the same inputs.",
    },
    {
      question: "What is impulse?",
      answer: "The change in momentum, equal to force multiplied by the time it acts. To stop something you must remove all its momentum, and that total is fixed — so a longer stop needs less force, which is why crumple zones and airbags work.",
    },
    {
      question: "Why does stopping faster need more force?",
      answer: "Because the impulse required is fixed. Halving the stopping time doubles the force, and stopping in a tenth of the time needs ten times the force. Both figures are shown so the relationship is concrete.",
    },
  ],
};

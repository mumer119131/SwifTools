import { Activity } from "lucide-react";

import type { Tool } from "@/config/tools";

export const kineticEnergyCalculator: Tool = {
  slug: "kinetic-energy-calculator",
  name: "Kinetic Energy Calculator",
  category: "science",
  description: "Solve KE = ½mv² for energy, mass or velocity, with everyday comparisons.",
  keywords: ["kinetic energy calculator","ke = 1/2mv2","calculate kinetic energy joules","energy of moving object"],
  icon: Activity,
  processing: "client",
  status: "live",
  steps: [
    "Choose energy, mass or velocity as the unknown.",
    "Enter the other two in kilograms and metres per second.",
    "See the result in joules, plus calories and watt-hours for a sense of scale.",
  ],
  notes: [
    "Kinetic energy is ½mv², and the square on velocity is the whole story. Doubling the speed of a car quadruples its kinetic energy — which is why stopping distances grow so much faster than speed, and why a crash at 60 mph is four times as violent as one at 30, not twice.",
    "Momentum, by contrast, is mv and scales linearly. The two behave differently in collisions: momentum is conserved, kinetic energy generally is not, and the difference is what goes into deformation, heat and sound. That is what a crumple zone is designed to absorb.",
    "The same square explains why speed limits near schools are set where they are. The energy a pedestrian has to absorb rises with the square of the impact speed, and survival rates fall correspondingly steeply between 20 and 40 mph.",
  ],
  faq: [
    {
      question: "What is the kinetic energy formula?",
      answer: "KE = ½mv², where m is mass in kilograms and v is velocity in metres per second. The result is in joules.",
    },
    {
      question: "Why does doubling speed quadruple energy?",
      answer: "Because velocity is squared in the formula. Twice the speed is four times the energy, which is why stopping distances and crash severity rise so much faster than speed does.",
    },
    {
      question: "What is the difference between kinetic energy and momentum?",
      answer: "Momentum is mv and scales linearly; kinetic energy is ½mv² and scales with the square. Momentum is conserved in a collision, kinetic energy usually is not — the difference becomes deformation, heat and sound.",
    },
    {
      question: "How much energy does a car have at motorway speed?",
      answer: "A 1,500 kg car at 70 mph, about 31 m/s, carries roughly 720 kilojoules — comparable to the energy of a stick of dynamite. All of it has to go somewhere in a crash.",
    },
    {
      question: "Why do speed limits matter so much near schools?",
      answer: "Because the energy a pedestrian absorbs scales with the square of the impact speed. The difference between 20 and 30 mph is more than double the energy, and survival rates reflect that.",
    },
  ],
};

import { Move } from "lucide-react";

import type { Tool } from "@/config/tools";

export const forceCalculator: Tool = {
  slug: "force-calculator",
  name: "Force Calculator",
  category: "science",
  description: "Solve F = ma for force, mass or acceleration, with weight on Earth shown.",
  keywords: ["force calculator","f=ma calculator","newtons second law","mass acceleration force","calculate newtons"],
  icon: Move,
  processing: "client",
  status: "live",
  steps: [
    "Pick whether you want force, mass or acceleration.",
    "Enter the other two values in SI units — kilograms and metres per second squared.",
    "The equivalent weight under Earth's gravity is shown alongside.",
  ],
  notes: [
    "Newton's second law states that force equals mass times acceleration. One newton is the force that accelerates one kilogram at one metre per second squared, which is roughly the weight of a small apple — the origin of the joke about how the unit was named.",
    "Weight and mass are different quantities and this is where the confusion lives. Mass is how much matter there is and does not change; weight is the force gravity exerts on it, and it does. A 70 kg person has a weight of about 687 newtons on Earth and 114 on the Moon, with the same 70 kg of mass in both places.",
    "Standard gravity is defined as exactly 9.80665 m/s², though the real value varies from about 9.78 at the equator to 9.83 at the poles. The difference is enough that a precision scale calibrated in one place reads slightly wrong in another.",
  ],
  faq: [
    {
      question: "What is the difference between mass and weight?",
      answer: "Mass is the amount of matter, measured in kilograms, and does not change with location. Weight is the force gravity exerts on that mass, measured in newtons, and it changes — a 70 kg person weighs 687 N on Earth and 114 N on the Moon.",
    },
    {
      question: "How do I calculate force?",
      answer: "Force equals mass times acceleration, F = ma. A 1,500 kg car accelerating at 3 m/s² needs 4,500 newtons of force, which is what the tyres have to transmit to the road.",
    },
    {
      question: "What is a newton?",
      answer: "The force that accelerates one kilogram at one metre per second squared. It is about the weight of a small apple on Earth, roughly 100 grams.",
    },
    {
      question: "Why does gravity vary across the Earth?",
      answer: "Because the planet is not a perfect sphere and rotates. Gravity is about 9.78 m/s² at the equator and 9.83 at the poles — enough that precision scales must be calibrated for their location.",
    },
    {
      question: "How do I convert kilograms to newtons?",
      answer: "Multiply by 9.80665, standard gravity. Strictly you are converting a mass to the weight force it experiences on Earth, which is why the two are not interchangeable units.",
    },
  ],
};

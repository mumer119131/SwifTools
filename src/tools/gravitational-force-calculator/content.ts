import type { ToolContent } from "@/config/tool-content";

export const gravitationalForceCalculatorContent: ToolContent = {
  steps: [
    "Enter any three of force, the two masses and the distance.",
    "Scientific notation works — 5.972e24 for the mass of the Earth.",
    "Distance is between centres of mass, not between surfaces.",
  ],
  notes: [
    "Newton's law of gravitation says the attraction between two masses is proportional to their product and inversely proportional to the square of the distance between them. G, the gravitational constant, is 6.6743 × 10⁻¹¹ — a very small number, which is why gravity is by far the weakest of the fundamental forces and only becomes noticeable when one of the masses is planetary.",
    "The inverse square is the part worth internalising rather than merely knowing. Doubling the distance leaves a quarter of the force; ten times the distance leaves a hundredth. It is why orbits are stable, why tides follow the Moon rather than the far more massive Sun, and why a satellite in low orbit experiences almost as much gravity as something on the ground.",
    "The mistake that produces the largest errors is measuring distance between surfaces rather than centres of mass. For two spheres the gravitational attraction behaves as though all the mass sat at the centre — a result Newton had to invent calculus to prove — so the separation of the surfaces is the wrong number, and badly wrong for anything close together.",
    "The forces on the two bodies are equal and opposite regardless of how different the masses are. The Earth pulls on you with exactly the force you pull on it; what differs is the acceleration that force produces, because acceleration is force divided by mass.",
  ],
  faq: [
    {
      question: "What is the formula for gravitational force?",
      answer: "F = G·m₁·m₂ / r², where G is 6.6743 × 10⁻¹¹ N·m²/kg². The force is proportional to both masses and falls with the square of the distance between their centres.",
    },
    {
      question: "Should distance be between surfaces or centres?",
      answer: "Centres of mass. For spheres the attraction behaves as though all the mass were concentrated at the centre, so surface separation gives a wrong answer — and a badly wrong one for objects close together.",
    },
    {
      question: "Why is gravity so weak?",
      answer: "Because G is tiny — 6.6743 × 10⁻¹¹. Gravity is by far the weakest fundamental force and only becomes significant when at least one mass is planetary. A small magnet overcomes the entire Earth's pull on a paperclip.",
    },
    {
      question: "Does the Earth pull on me more than I pull on it?",
      answer: "No — the forces are exactly equal and opposite. What differs is the resulting acceleration, since that is force divided by mass, and the Earth's mass is rather larger than yours.",
    },
  ],
};

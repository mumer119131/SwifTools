import type { ToolContent } from "@/config/tool-content";

export const torqueCalculatorContent: ToolContent = {
  steps: [
    "Enter any two of torque, force and lever arm length.",
    "The third is calculated and converted into pound-feet and the rest.",
    "Lever arm is the distance from the pivot to where the force acts.",
  ],
  notes: [
    "Torque is force multiplied by the distance from the pivot. It is why a longer spanner loosens a tighter bolt with the same effort — doubling the handle length doubles the torque for the same push, which is the whole reason breaker bars exist.",
    "This assumes the force acts perpendicular to the lever arm, which is the usual case and also the maximum. At any other angle the effective torque is F × r × sin θ, so a force pulled along the arm rather than across it produces no torque at all. That is why a spanner is pushed sideways and never outward, and why pulling a door handle towards its hinge does nothing.",
    "The units are newton-metres, which are dimensionally the same as joules and mean something completely different. A joule is energy transferred; a newton-metre of torque is a rotational tendency that may transfer no energy whatsoever — a bolt held under tension is carrying torque and doing no work at all. They are kept distinct by convention precisely because confusing them leads nowhere useful.",
    "Pound-feet and foot-pounds are used interchangeably in practice, though pound-feet is the more correct form for torque and foot-pounds for energy. Torque wrenches are usually marked in both newton-metres and pound-feet, which is why both are given here.",
  ],
  faq: [
    {
      question: "How do you calculate torque?",
      answer: "Multiply the force by the distance from the pivot. 200 N applied 0.25 m from the centre gives 50 N·m. This assumes the force is perpendicular to the lever arm, which is the usual case and the maximum.",
    },
    {
      question: "Why does a longer spanner make a bolt easier to undo?",
      answer: "Because torque is force times distance. Doubling the handle length doubles the torque for the same effort, which is why breaker bars work and why you should not use one on a bolt rated for less.",
    },
    {
      question: "What if the force is not at right angles?",
      answer: "The effective torque is force times radius times the sine of the angle. At 45 degrees you get about 71% of the maximum; along the arm you get none at all, which is why pushing a door towards its hinge achieves nothing.",
    },
    {
      question: "Is a newton-metre the same as a joule?",
      answer: "Dimensionally yes, in meaning no. A joule is energy transferred; a newton-metre of torque is a rotational tendency that may transfer no energy — a bolt under tension carries torque and does no work. The convention keeps them separate for good reason.",
    },
  ],
};

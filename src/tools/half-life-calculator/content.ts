import type { ToolContent } from "@/config/tool-content";

export const halfLifeCalculatorContent: ToolContent = {
  steps: [
    "Enter the starting amount, the half-life and how much time has passed.",
    "Or solve for the elapsed time or half-life instead — any one from the others.",
    "A decay table shows the amount after each successive half-life.",
  ],
  notes: [
    "Half-life is the time for half a sample to decay, and the crucial property is that it does not change as the sample shrinks. Half of what remains decays in the next half-life regardless of how much is left, which is what makes decay exponential rather than linear.",
    "Solving in any direction is what makes the tool useful: remaining amount from elapsed time, elapsed time from remaining amount, or the half-life itself from a measured before and after. Carbon dating is the second of these — 25 percent of the original carbon-14 remaining means exactly two half-lives, or 11,460 years.",
    "Mean lifetime is a different quantity that is often confused with half-life. It is the average survival time of a single atom, 1/λ rather than ln(2)/λ, which makes it about 44 percent longer than the half-life.",
  ],
  faq: [
    {
      question: "What is half-life?",
      answer: "The time for half of a sample to decay. It stays constant as the sample shrinks — half of whatever remains decays in the next half-life — which is what makes decay exponential rather than linear.",
    },
    {
      question: "How does carbon dating work?",
      answer: "Carbon-14 has a half-life of 5,730 years, so measuring how much remains relative to the original proportion gives the age. Twenty-five percent remaining is exactly two half-lives, or 11,460 years.",
    },
    {
      question: "How do I calculate remaining quantity after a given time?",
      answer: "Multiply the starting amount by one half raised to the power of elapsed time divided by half-life. Four half-lives leaves 6.25 percent — one sixteenth of the original.",
    },
    {
      question: "What is the decay constant?",
      answer: "λ = ln(2) divided by the half-life. It is the fraction of the sample decaying per unit time, and it is what appears in the exponential form of the decay equation.",
    },
    {
      question: "What is the difference between half-life and mean lifetime?",
      answer: "Half-life is when half the sample has gone; mean lifetime is the average survival time of an individual atom. Mean lifetime is 1/λ and half-life is ln(2)/λ, making the mean about 44 percent longer.",
    },
  ],
};

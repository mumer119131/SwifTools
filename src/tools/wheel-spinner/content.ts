import type { ToolContent } from "@/config/tool-content";

export const wheelSpinnerContent: ToolContent = {
  steps: [
    "Type your entries, one per line.",
    "Spin. The winner is chosen cryptographically before the animation starts.",
    "Turn on elimination to remove each winner and run a full draw.",
  ],
  notes: [
    "The winner is chosen from the browser's cryptographic random source before the wheel starts moving, and the rotation is then calculated to land on it. That is deliberately the opposite of how it appears, and it is the fairer arrangement: spinning by a random angle and reading whatever lands under the pointer is very slightly unfair, because floating-point rounding does not divide a circle perfectly evenly.",
    "Elimination mode removes each winner from the wheel, which turns it from a single pick into a full draw — useful for assigning an order, running a raffle down to the last name, or picking teams.",
    "Every entry has exactly the same chance regardless of where it sits on the wheel or how the segments happen to be coloured. Entries appearing twice in the list get two segments and therefore twice the chance, which is a way to weight the wheel if you want to.",
  ],
  faq: [
    {
      question: "Is the wheel spinner actually random?",
      answer: "Yes, and more so than it looks. The winner is picked cryptographically before the animation starts and the rotation is computed to land there — spinning by a random angle and reading the result is marginally unfair because of floating-point rounding at segment edges.",
    },
    {
      question: "Can I remove a winner after each spin?",
      answer: "Yes, with elimination mode. It turns the wheel into a full draw, which is what you want for assigning an order, running a raffle, or picking teams one by one.",
    },
    {
      question: "Do entries near the pointer have a better chance?",
      answer: "No. Position on the wheel has no effect at all, because the winner is chosen first and the rotation follows. Every entry has exactly the same probability.",
    },
    {
      question: "How do I weight the wheel towards an option?",
      answer: "List it more than once. Two entries with the same name get two segments and therefore twice the chance, which is the simplest way to give something extra weight.",
    },
    {
      question: "How many entries can the wheel hold?",
      answer: "As many as you like, though labels are truncated once the segments get narrow. Past about twenty the wheel becomes hard to read, and the random name picker is a better fit.",
    },
  ],
};

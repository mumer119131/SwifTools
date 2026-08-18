import type { ToolContent } from "@/config/tool-content";

export const randomNumberGeneratorContent: ToolContent = {
  steps: [
    "Set the range and how many numbers you want.",
    "Turn off repeats for a draw where each number can only come out once.",
    "Numbers come from the browser's cryptographic source, with the bias removed.",
  ],
  notes: [
    "Numbers come from the browser's cryptographic random source with the modulo bias removed, so every value in the range is equally likely. That is enough for a prize draw someone might dispute, which a Math.random-based tool is not.",
    "Drawing without repeats uses a partial Fisher–Yates shuffle over the range rather than re-rolling until a new number appears. The naive approach degrades badly as the count approaches the range size and never terminates when it exceeds it — which is why asking for 49 of 49 here returns instantly.",
    "For anything with a prize attached, keep a record of what was drawn and when. The randomness is defensible; the process around it is what people actually dispute.",
  ],
  faq: [
    {
      question: "Is this random number generator fair for a prize draw?",
      answer: "The numbers come from the Web Crypto API with modulo bias removed, so every value is equally likely. That is defensible for a draw — though keeping a record of what was drawn and when matters just as much as the randomness.",
    },
    {
      question: "How do I draw numbers without repeats?",
      answer: "Turn repeats off and each number can only come out once, which is what you want for a lottery or a raffle. Asking for more numbers than the range contains is refused rather than looping forever.",
    },
    {
      question: "What is modulo bias?",
      answer: "When a random value is reduced with a remainder operation and the range does not divide evenly, some outcomes become slightly more likely. Rejecting values in the uneven tail removes it entirely, at the cost of an occasional extra draw.",
    },
    {
      question: "Can I generate lottery numbers?",
      answer: "Yes — presets for common formats are included, and repeats are off by default so no number is drawn twice. It will not improve your odds, which are fixed regardless of how the numbers are chosen.",
    },
    {
      question: "Is Math.random good enough for this?",
      answer: "For a game, yes. For anything anyone might dispute, no — it is not designed to be unpredictable and its output can be inferred from previous values in some engines.",
    },
  ],
};

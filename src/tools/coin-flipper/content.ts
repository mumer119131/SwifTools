import type { ToolContent } from "@/config/tool-content";

export const coinFlipperContent: ToolContent = {
  steps: [
    "Press flip. The result uses the browser's cryptographic randomness, not Math.random.",
    "Flip many at once to see the tally converge on 50/50.",
    "The running history and streaks are kept for the session.",
  ],
  notes: [
    "Each flip comes from the browser's cryptographic random source with the modulo bias removed, so it is genuinely 50/50 — not approximately, and not dependent on Math.random, which is not designed to be unpredictable.",
    "The streak counter is there because it is where intuition fails hardest. In 100 fair flips, a run of six the same way happens more often than not, and people read that as evidence the coin is rigged. It is not; genuinely random sequences are far more clustered than invented ones.",
    "Flipping a few thousand at once shows the law of large numbers doing its work: the percentage settles towards 50 as the count rises. It says nothing whatever about what the next flip will do, which is the gambler's fallacy in one sentence.",
  ],
  faq: [
    {
      question: "Is this coin flip actually random?",
      answer: "Yes. It uses the Web Crypto API rather than Math.random and rejects the biased portion of the range, so heads and tails are exactly equally likely on every flip.",
    },
    {
      question: "Why do I keep getting the same result?",
      answer: "Because streaks are normal. In 100 fair flips a run of six is more likely than not, and genuinely random sequences look far more clustered than people expect. A run is not evidence of bias.",
    },
    {
      question: "If I get five heads, is tails more likely next?",
      answer: "No. The coin has no memory — the next flip is 50/50 regardless of what came before. Believing otherwise is the gambler's fallacy, and it is the single most expensive misconception in probability.",
    },
    {
      question: "Can I flip many coins at once?",
      answer: "Yes, up to ten thousand. Watching the percentage settle towards 50 as the count rises is the law of large numbers made visible.",
    },
    {
      question: "Is a real coin flip actually 50/50?",
      answer: "Close, but not exactly. Physical coins are slightly biased towards the face they started on, and a spun coin is more biased still. A cryptographic random source has no such physical asymmetry.",
    },
  ],
};

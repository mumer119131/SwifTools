import type { ToolContent } from "@/config/tool-content";

export const decisionMakerContent: ToolContent = {
  steps: [
    "Type your options, or start from a preset like yes/no.",
    "Pick instantly, or run a head-to-head where you choose between two at a time.",
    "The head-to-head tells you what you actually prefer, not what the coin says.",
  ],
  notes: [
    "Two modes, and the second is the one worth using. A random pick answers the question instantly; a head-to-head shows you two options at a time and eliminates until one is left.",
    "The reason head-to-head works is that choosing between two things is easy and choosing between eight is not. Answering seven easy questions gets you an answer you believe, which a coin flip never does.",
    "The random pick still has a use, and it is not the obvious one. The value of flipping a coin was never the result — it is noticing, while the coin is in the air, which way you were hoping it would land.",
  ],
  faq: [
    {
      question: "How do I decide between several options?",
      answer: "Use the head-to-head mode, which shows two at a time and eliminates until one is left. Choosing between two things is easy where choosing between eight is not, and seven easy choices give an answer you actually believe.",
    },
    {
      question: "Should I let a random pick make my decision?",
      answer: "Its real value is not the answer. Watching a coin in the air and noticing which result you are hoping for tells you what you actually wanted, which is usually the information you were missing.",
    },
    {
      question: "What is the difference between the two modes?",
      answer: "Random picks one instantly with equal probability. Head-to-head runs an elimination bracket where you make every choice yourself, so the result reflects your preferences rather than chance.",
    },
    {
      question: "How many options can I add?",
      answer: "As many as you like. The head-to-head takes roughly one round per doubling, so eight options need seven comparisons and sixteen need fifteen — it stays manageable.",
    },
    {
      question: "Does the order of options affect the result?",
      answer: "In random mode, no. In head-to-head the pairings are shuffled first, so the bracket is not determined by the order you typed them in.",
    },
  ],
};

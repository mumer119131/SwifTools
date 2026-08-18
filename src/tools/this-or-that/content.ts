import type { ToolContent } from "@/config/tool-content";

export const thisOrThatContent: ToolContent = {
  steps: [
    "Generate a round of pairs.",
    "Go round the group — everyone picks a side and says why.",
    "Copy the round to read from.",
  ],
  notes: [
    "Every pair is one where both answers are genuinely defensible. That is the entire design: a pair with an obvious right answer produces agreement, and agreement is not a game.",
    "The interesting part is never which side someone picks. It is the reason they give — which is why this works better as a conversation starter than as a poll.",
    "Each round is drawn without repeats, so no pair comes up twice within a set. Copy the round out to read from if you are running it with a group, or put it in the invite so people arrive with an opinion already formed.",
  ],
  faq: [
    {
      question: "How do you play this or that?",
      answer: "Read out a pair, everyone picks a side, and then — the part that matters — everyone says why. The reasons are the game; the choices on their own are just a poll.",
    },
    {
      question: "What makes a good this-or-that pair?",
      answer: "Both sides have to be genuinely defensible. A pair with an obvious right answer produces unanimous agreement and nothing to talk about.",
    },
    {
      question: "How many pairs should a round have?",
      answer: "Ten is about right for a group. Past that people stop explaining their answers and start just picking, which is where the value goes.",
    },
    {
      question: "Is this suitable for a work team?",
      answer: "Yes — the pairs avoid anything personal or divisive, so nobody has to reveal more than they want to in front of colleagues.",
    },
    {
      question: "Can I get the same pair twice?",
      answer: "Not in one round. Pairs are drawn without repeats, so a round of ten gives ten different ones.",
    },
  ],
};

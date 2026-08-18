import type { ToolContent } from "@/config/tool-content";

export const icebreakerQuestionsContent: ToolContent = {
  steps: [
    "Generate a set of questions.",
    "Read them out, or copy them into the invite.",
    "Regenerate for a different set.",
  ],
  notes: [
    "These are chosen to be answerable by someone who does not want to be there. The usual icebreakers fail because they demand a performance — 'tell us a fun fact about yourself' puts the burden of being interesting on the person least comfortable in the room.",
    "A question with a concrete answer gets a real one. 'What is the best thing you have bought for under twenty pounds' is answerable by anyone in about four seconds, and the answers are genuinely interesting in a way that a rehearsed fun fact never is.",
    "Each set is drawn without repeats, so a round never asks the same question twice. Copy the set into a meeting invite so people can think before they arrive.",
  ],
  faq: [
    {
      question: "What makes a good icebreaker question?",
      answer: "One with a concrete answer that does not demand a performance. 'Tell us a fun fact about yourself' asks the least comfortable person in the room to be interesting on demand, which is why it always dies.",
    },
    {
      question: "How many icebreaker questions should I use?",
      answer: "One for a small group, since everyone answering takes longer than you expect. For a larger meeting, one question answered by two or three people beats a round-robin that eats twenty minutes.",
    },
    {
      question: "Are these suitable for a work meeting?",
      answer: "Yes. They avoid anything personal, political or intrusive, so nobody has to decide how much to disclose in front of colleagues.",
    },
    {
      question: "Can I use them for a class or a party?",
      answer: "Yes — they work in any group where people do not know each other well. Sharing them in advance also helps, since some people answer much better with a minute to think.",
    },
    {
      question: "Will I get the same question twice?",
      answer: "Not within a set. Each round is drawn without repeats, so a set of ten gives ten different questions.",
    },
  ],
};

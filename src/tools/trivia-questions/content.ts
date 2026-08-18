import type { ToolContent } from "@/config/tool-content";

export const triviaQuestionsContent: ToolContent = {
  steps: [
    "Choose a category and difficulty, and how many questions you want.",
    "Answers stay hidden until you reveal them.",
    "Copy the round out to read from, or print it.",
  ],
  notes: [
    "The questions come from a bank held in the page rather than from a trivia API, so a quiz never fails because someone else's server is down or a key has expired. Fifty-four questions across six categories and three difficulties, with every combination populated.",
    "Answers that are genuinely contested say so. The longest river depends on where you decide the Amazon begins, and the tool says that rather than picking a side and sounding confident.",
    "Answers stay hidden until revealed, individually or all at once, so a round can be read out from the screen without spoiling it.",
  ],
  faq: [
    {
      question: "Where do the trivia questions come from?",
      answer: "A curated bank held in the page itself rather than a third-party API, so a quiz night never fails because someone else's server is down or a rate limit was hit.",
    },
    {
      question: "Can I choose a category and difficulty?",
      answer: "Yes — six categories and three difficulty levels, with every combination populated so no selection returns an empty round.",
    },
    {
      question: "How do I hide the answers while reading questions out?",
      answer: "Answers stay hidden until you reveal them, one at a time or all at once. That lets you read a round from the screen without spoiling it for the room.",
    },
    {
      question: "Are the answers definitely correct?",
      answer: "They are checked, and where an answer is genuinely contested the question says so — the world's longest river depends on where you decide the Amazon begins, and pretending otherwise would be worse than explaining it.",
    },
    {
      question: "How many questions should a quiz round have?",
      answer: "Eight to ten per round is the usual format, with a break between rounds for scoring. Much beyond that and attention drops noticeably.",
    },
  ],
};

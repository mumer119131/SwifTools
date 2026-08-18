import type { ToolContent } from "@/config/tool-content";

export const complimentGeneratorContent: ToolContent = {
  steps: [
    "Generate a batch of compliments.",
    "Pick the one that is actually true of the person.",
    "Copy it and send it.",
  ],
  notes: [
    "These are about what someone does rather than how they look, which is the difference between a compliment that lands and one that gets a polite nod. Character and behaviour are specific, unexpected and hard to dismiss; appearance is none of those things.",
    "Pick the one that happens to be true. A specific observation from a real person is worth more than any generated line, and the purpose here is to help you notice which one fits rather than to supply the words wholesale.",
    "The best use is as a starting point — read the list, find the one you recognise in someone, then say it in your own words with the example that made you think of it.",
  ],
  faq: [
    {
      question: "What makes a good compliment?",
      answer: "Specificity, and being about what someone does rather than how they look. 'You explain complicated things without making anyone feel slow' lands because it is observable and unexpected; 'you look nice' does not.",
    },
    {
      question: "Why compliment character instead of appearance?",
      answer: "Because appearance compliments are easy to dismiss and often unwelcome in a work setting. A compliment about behaviour is evidence you were paying attention, which is what makes it worth something.",
    },
    {
      question: "Should I use these word for word?",
      answer: "Better to find the one you recognise in someone and then say it in your own words, with the example that made you think of it. The specific example is what makes it credible.",
    },
    {
      question: "Are these suitable for colleagues?",
      answer: "Yes — they are about how someone works and behaves rather than anything personal, so they are safe to say in a team setting or in a performance review.",
    },
    {
      question: "How do I give a compliment that doesn't sound forced?",
      answer: "Tie it to something that actually happened. 'You asked the question everyone else was avoiding in that meeting' is a compliment; the same sentence without the meeting is a greetings card.",
    },
  ],
};

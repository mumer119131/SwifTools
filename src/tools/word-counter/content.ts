import type { ToolContent } from "@/config/tool-content";

export const wordCounterContent: ToolContent = {
  steps: [
    "Paste or type your text into the box.",
    "Counts update as you type — words, characters, sentences, paragraphs and reading time.",
    "Scroll down for the most-used words, which is handy for spotting repetition.",
  ],
  notes: [
    "Words are counted by splitting on whitespace, which is the same rule Microsoft Word and Google Docs use. That means a hyphenated compound counts as one word and an em-dash between two words counts as none, which is worth knowing if you are close to a limit someone else will check with different software.",
    "Characters are counted twice over: with spaces and without. Which one matters depends on where the text is going — Twitter and SMS count everything including spaces, while some academic and legal limits exclude them. The counts update as you type, so you can see a limit approaching rather than discovering it afterwards.",
    "Reading time assumes 200 to 250 words per minute, which is the usual figure for adult reading of general prose on screen. Technical material is slower and skimming is faster, so treat it as a rough guide rather than a measurement.",
  ],
  faq: [
    {
      question: "How are words counted?",
      answer: "By splitting the text on whitespace, the same rule Word and Google Docs apply. A hyphenated compound like 'well-known' counts as one word; numbers and standalone symbols count as words too if they are surrounded by spaces.",
    },
    {
      question: "Why does my word count differ from Microsoft Word?",
      answer: "Usually because of how each handles hyphens, dashes, footnotes or text in tables and headers. Small differences of one or two percent are normal. If a limit is strict, check in the software the person reading it will use.",
    },
    {
      question: "How long does it take to read 1,000 words?",
      answer: "About four to five minutes at a typical adult reading speed of 200 to 250 words per minute. Technical or unfamiliar material takes considerably longer, and skim-reading is much faster.",
    },
    {
      question: "Is my text sent anywhere?",
      answer: "No. The counting happens as you type, in your own browser. Nothing is transmitted, which matters when the text is unpublished work, a legal document or anything confidential.",
    },
    {
      question: "Does it count characters with or without spaces?",
      answer: "Both are shown separately. Social platforms and SMS count spaces; some academic and legal word limits do not, so having both means you do not have to guess which rule applies.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const findAndReplaceContent: ToolContent = {
  steps: [
    "Paste your text and type what to find.",
    "Turn on regex for patterns, or leave it off to search for exactly what you typed.",
    "Every match is counted before you copy, so you can see what will change.",
  ],
  notes: [
    "With regex off, your search term is escaped before it is used. That means searching for \"a.b\" finds the literal text a.b rather than treating the full stop as \"any character\" — which is what a find box should do, and what silently changes text you never meant to touch when a tool gets it wrong. The replacement is escaped too, so a replacement of \"$5\" inserts $5 rather than being read as a backreference.",
    "With regex on you get the full JavaScript flavour: capture groups, character classes, lookahead. Use $1 and $2 in the replacement to refer to groups, and $& for the whole match. The match count updates as you type, so you can confirm a pattern hits what you expect before applying it.",
    "A pattern that can match nothing — a*, ^, \\b on its own — matches at every position in the text, and replacing it inserts your replacement between every single character. That is refused with an explanation rather than performed, because the result is never what anyone wanted and it is not obvious why it happened.",
  ],
  faq: [
    {
      question: "How do I replace text using a regular expression?",
      answer: "Turn on regex mode and write your pattern in the find box. Capture groups become $1, $2 and so on in the replacement, and $& is the whole match. The count above the output tells you how many matches the pattern found before you commit to it.",
    },
    {
      question: "Why is my search finding more than I expected?",
      answer: "Almost always case-insensitivity, which is on by default, or a regex metacharacter being interpreted. Turn on case sensitivity, or turn regex off so the term is treated literally — a full stop, question mark or bracket all mean something in a pattern and nothing in a literal search.",
    },
    {
      question: "What does whole word matching do?",
      answer: "It wraps your term in word boundaries, so searching for \"cat\" matches cat but not category or concatenate. It is the fastest fix when a short search term is matching inside longer words.",
    },
    {
      question: "Can I replace across multiple lines?",
      answer: "Yes — the whole text is treated as one string, so a pattern spanning lines works. Turn on multiline if you want ^ and $ to anchor to each line rather than to the start and end of the whole document.",
    },
    {
      question: "Does my text leave the browser?",
      answer: "No. The replacement runs in your browser as you type, so you can safely work on drafts, contracts or source code without any of it leaving your machine.",
    },
  ],
};

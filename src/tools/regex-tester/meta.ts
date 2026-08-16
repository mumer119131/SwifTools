import { Regex } from "lucide-react";

import type { Tool } from "@/config/tools";

export const regexTester: Tool = {
  slug: "regex-tester",
  name: "Regex Tester",
  category: "developer",
  description: "Test regular expressions live with match highlighting and capture groups.",
  keywords: ["regex tester", "regular expression tester", "regex match", "regexp online"],
  icon: Regex,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Type your pattern and pick the flags you need — global, ignore case, multiline and the rest.",
    "Paste test text below. Matches highlight as you type, and every capture group is listed.",
    "Use the replace field to preview a substitution with $1-style group references.",
  ],
  notes: [
    "Patterns run against your test text as you type, with every match highlighted and each capture group listed separately. Seeing which group captured what is usually the fastest way to find the mistake, because a pattern that matches can still be capturing the wrong part.",
    "The flags change the meaning of a pattern more than people expect. Without the global flag only the first match is found. Without multiline, ^ and $ anchor to the whole string rather than to each line, which is the usual reason a line-based pattern silently matches nothing. The dotAll flag decides whether a dot matches a newline, which matters for anything spanning lines.",
    "Catastrophic backtracking is worth knowing about. Nested quantifiers such as (a+)+ can take exponential time on input that nearly matches, and a pattern that is instant on ten characters can hang the browser on thirty. If a pattern becomes slow as the test text grows, that is what is happening — rewrite it to avoid the nesting rather than accepting it.",
  ],
  faq: [
    {
      question: "Why does my regex only match the first result?",
      answer: "The global flag is off. Without g, the pattern stops at the first match. Turning it on finds every occurrence, which is what most people expect by default.",
    },
    {
      question: "Why do ^ and $ not match my lines?",
      answer: "Without the multiline flag they anchor to the start and end of the entire string, not each line. Turn on m and they match at every line boundary.",
    },
    {
      question: "What is the difference between greedy and lazy matching?",
      answer: "Greedy quantifiers take as much as possible then give back — .* matches to the end of the line and backtracks. Lazy ones, written .*?, take as little as possible. Matching HTML tags is the classic case where greedy swallows everything between the first and last bracket.",
    },
    {
      question: "Why did my regex freeze the page?",
      answer: "Catastrophic backtracking. Nested quantifiers like (a+)+ can take exponential time on input that almost matches, so a pattern that is instant on short text hangs on slightly longer text. Rewrite to remove the nesting.",
    },
    {
      question: "Which regex flavour does this use?",
      answer: "JavaScript's, which is what runs in the browser. It differs from PCRE and Python in places — no lookbehind in older engines, different named-group syntax — so test against the language you will deploy in.",
    },
  ],
};

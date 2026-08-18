import type { ToolContent } from "@/config/tool-content";

export const robotsTxtTesterContent: ToolContent = {
  steps: [
    "Paste your robots.txt and the path you want to check.",
    "Pick a crawler — the answer differs by agent more than people expect.",
    "The deciding rule is named, with its line number.",
  ],
  notes: [
    "Precedence is by length, not by order. The longest matching path wins regardless of where it sits in the file, and Allow beats Disallow when both match at the same length. Reading the file top to bottom and taking the first match — which is what almost everyone assumes — gives the wrong answer whenever a broad Disallow appears above a narrow Allow, which is exactly the shape most real robots.txt files have.",
    "A crawler uses one group and ignores every other, including the wildcard. This is the mistake that does the most damage: adding a Googlebot section means Googlebot stops reading the * section entirely, so every rule it still needs has to be repeated inside its own group. Sites regularly open up paths to Google that they believed were blocked, because the block only ever existed in the wildcard group.",
    "Consecutive User-agent lines share one set of rules. Two agents listed together followed by one Disallow applies that rule to both — not, as it reads, only to the second.",
    "Worth remembering what robots.txt is for. It stops crawling, not indexing: a URL that is linked from elsewhere can still appear in results, listed without a description, precisely because the crawler was forbidden from fetching it to find out more. To keep a page out of the index, let it be crawled and use a noindex tag — a blocked page is one whose noindex tag can never be read.",
  ],
  faq: [
    {
      question: "Why is my URL still blocked when I have an Allow rule for it?",
      answer: "Precedence goes to the longest matching path, not the first or last rule in the file. If a Disallow matches more characters of your URL than the Allow does, the Disallow wins wherever it appears. Make the Allow path more specific than the Disallow it needs to beat.",
    },
    {
      question: "Does a Googlebot section replace the wildcard section?",
      answer: "Yes, entirely. A crawler picks the single most specific group that names it and ignores all the others, so once a Googlebot group exists, Googlebot never reads the * group again. Every rule you still want applied has to be repeated inside it.",
    },
    {
      question: "Does robots.txt stop a page being indexed?",
      answer: "No — it stops it being crawled, which is different. A blocked URL that is linked from elsewhere can still be indexed and shown without a description. To keep something out of the index, allow crawling and use a noindex meta tag, because a blocked page is one whose noindex can never be read.",
    },
    {
      question: "What do the * and $ wildcards do?",
      answer: "An asterisk matches any run of characters, so /*.pdf matches any PDF at any depth. A dollar anchors the match to the end of the URL, so /*.pdf$ matches file.pdf but not file.pdf?download=1. Both are supported by the major crawlers, though not by the original standard.",
    },
    {
      question: "Is my robots.txt uploaded anywhere?",
      answer: "No. Parsing and matching both run in your browser, and nothing is fetched — you paste the file rather than giving a URL, which also means you can test a version before publishing it.",
    },
  ],
};

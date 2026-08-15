import { GitCompare } from "lucide-react";

import type { Tool } from "@/config/tools";

export const textDiff: Tool = {
  slug: "text-diff",
  name: "Text Diff Checker",
  category: "text",
  description: "Compare two texts side by side and see exactly what was added, removed or changed.",
  keywords: [
    "text diff checker",
    "compare two texts online",
    "text comparison tool",
    "find difference between texts",
    "diff tool free",
  ],
  icon: GitCompare,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Paste the original text on the left and the changed version on the right.",
    "Differences are highlighted line by line: green for additions, red for removals.",
    "Switch to unified view for a patch-style diff you can copy into a review.",
  ],
  notes: [
    "The comparison finds the longest common subsequence between the two texts and marks everything else as an addition or a deletion. That is the same approach git and most diff tools use, and it is why a paragraph moved from the top to the bottom of a document shows as one deletion and one addition rather than as a move — the algorithm has no concept of moving.",
    "Comparing line by line is right for code, configuration and structured lists, where a line is a meaningful unit. Word-level comparison is better for prose, where a single retyped sentence would otherwise light up as a whole changed line without saying which words changed.",
    "Whitespace-only differences are worth being able to ignore. A file that has been reindented, or converted between tabs and spaces or between Unix and Windows line endings, will otherwise show as entirely changed even though not a character of content has moved.",
  ],
  faq: [
    {
      question: "How do I compare two versions of a document?",
      answer: "Paste the old version on the left and the new one on the right. Additions and deletions are highlighted inline. Use word-level comparison for prose and line-level for code or configuration files.",
    },
    {
      question: "Why does a moved paragraph show as both deleted and added?",
      answer: "Because the algorithm matches sequences rather than tracking movement. A block that has moved is genuinely absent from where it was and present where it now is, and no standard diff — including git's — reports it any other way.",
    },
    {
      question: "Can I ignore whitespace differences?",
      answer: "Yes. That is essential when comparing files that have been reindented or converted between tabs and spaces, or between Windows and Unix line endings — otherwise every line shows as changed when nothing has.",
    },
    {
      question: "What is the difference between line and word comparison?",
      answer: "Line comparison marks whole lines as changed and suits code, where the line is the unit of meaning. Word comparison highlights the specific words that differ and suits prose, where one edited word should not light up an entire paragraph.",
    },
    {
      question: "Is my text sent to a server to be compared?",
      answer: "No. The diff is computed in your browser, so you can safely compare contracts, unpublished drafts or private source code.",
    },
  ],
};

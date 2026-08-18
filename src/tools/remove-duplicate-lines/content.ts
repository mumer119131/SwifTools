import type { ToolContent } from "@/config/tool-content";

export const removeDuplicateLinesContent: ToolContent = {
  steps: [
    "Paste your list — one item per line.",
    "Choose whether matching ignores case and surrounding spaces, and whether to sort or keep only the duplicates.",
    "Copy the cleaned list, or download it as a .txt file.",
  ],
  notes: [
    "Duplicates are detected on the whole line. Two lines that differ by a trailing space are different lines unless trimming is enabled, which is the single most common reason a deduplication seems not to have worked — the difference is invisible on screen.",
    "Case sensitivity matters for the same reason. 'Apple' and 'apple' are distinct strings, so with case sensitivity on they both survive. For email addresses, tags and most list-cleaning work you want it off; for code or identifiers you almost certainly want it on.",
    "Order is preserved: the first occurrence of each line stays where it was and later repeats are removed. That is usually what you want when cleaning a list you have curated. Sorting first, then deduplicating, groups repeats together and is a better fit for finding out how many distinct values a dataset contains.",
  ],
  faq: [
    {
      question: "Why are duplicate lines not being removed?",
      answer: "Almost always trailing whitespace or a case difference — both are invisible on screen but make the strings different. Turn on trimming and case-insensitive matching, and the lines you expected to match will.",
    },
    {
      question: "Does it keep the first or the last occurrence?",
      answer: "The first. Every line keeps its original position and later repeats are dropped, so a list you have deliberately ordered stays in that order.",
    },
    {
      question: "Can I remove empty lines too?",
      answer: "Yes, that is a separate option. It is useful after pasting from a document or spreadsheet, which often introduces blank lines between entries.",
    },
    {
      question: "How large a list can I process?",
      answer: "Comfortably tens of thousands of lines. Deduplication uses a hash set, so the work grows linearly with the input rather than quadratically, and it runs entirely in your browser.",
    },
    {
      question: "Is my list uploaded anywhere?",
      answer: "No. The processing happens locally in your browser, which matters when the list is customer emails, licence keys or anything else you would not paste into a stranger's server.",
    },
  ],
};

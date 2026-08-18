import type { ToolContent } from "@/config/tool-content";

export const sortLinesContent: ToolContent = {
  steps: [
    "Paste your list, one item per line.",
    "Pick how to sort it — alphabetical, natural, numeric, by length, or shuffle.",
    "Trim, deduplicate and drop blank lines in the same pass.",
  ],
  notes: [
    "Alphabetical sorting uses Intl.Collator rather than comparing strings directly. A plain comparison sorts by code point, which puts every capital letter before every lowercase one — so \"Zebra\" lands before \"apple\" — and files accented words like café in the wrong place entirely. Collator applies your locale's actual rules, which is what people mean by alphabetical.",
    "Natural order is the one worth knowing about. Plain alphabetical sorting compares character by character, so item10 comes before item2 because 1 is less than 2. Natural order reads runs of digits as numbers, which puts item2 first — the way a person would file them. It is the right choice for anything with a number in it: filenames, versions, chapter headings.",
    "Numeric mode sorts by the first number found on each line, which handles lists where the number is not at the start. Lines with no number at all sort to the end rather than being treated as zero, because scattering them through the middle of a numeric list makes them harder to find, not easier.",
  ],
  faq: [
    {
      question: "Why is my list sorting with capitals first?",
      answer: "That is what happens when a tool compares strings by code point, where every uppercase letter ranks below every lowercase one. Turn case sensitivity off here and A and a are treated as the same letter, which is what alphabetical order normally means.",
    },
    {
      question: "How do I get item2 before item10?",
      answer: "Use natural order. Plain alphabetical sorting compares one character at a time, so it sees the 1 in item10 as smaller than the 2 in item2. Natural order reads whole runs of digits as numbers instead.",
    },
    {
      question: "Can I sort and remove duplicates at once?",
      answer: "Yes — turn on remove duplicates and it runs in the same pass, before sorting. Trimming whitespace and dropping blank lines are separate toggles, and trimming first is usually what you want, since two lines differing only by a trailing space are not really duplicates.",
    },
    {
      question: "What does sorting by length do?",
      answer: "Shortest line first, with ties broken alphabetically so the result is stable rather than arbitrary. It is useful for finding outliers in a list — the one malformed entry is usually much longer or much shorter than the rest.",
    },
    {
      question: "Is the shuffle actually random?",
      answer: "It uses Fisher–Yates driven by the browser's cryptographic random source, which is the only method that makes every ordering equally likely. The common shortcut of sorting by a random comparator is measurably biased and varies between browsers.",
    },
  ],
};

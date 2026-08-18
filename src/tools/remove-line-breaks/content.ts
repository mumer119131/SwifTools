import type { ToolContent } from "@/config/tool-content";

export const removeLineBreaksContent: ToolContent = {
  steps: [
    "Paste text that has been broken at the end of every visual line.",
    "Use unwrap to join only the accidental breaks and keep real paragraphs.",
    "Or flatten everything to a single line if that is what you need.",
  ],
  notes: [
    "Text copied out of a PDF, an email client or a terminal usually carries a hard line break at the end of every visual line, because that is where the display wrapped it. Pasting it anywhere else leaves a ragged column that reflows badly. Removing every break fixes the raggedness and destroys the paragraphs; unwrap mode is the middle option that does what people actually want.",
    "Unwrap joins a break only where it looks accidental — the line before it does not end a sentence, and the line after does not start something new like a bullet, a number or a heading. That heuristic is occasionally wrong, which is exactly why the blunt modes are still there, but it repairs a page of PDF text in one paste instead of a hundred manual joins.",
    "Line endings are normalised first, so Windows CRLF, old Mac CR and Unix LF all behave the same. That matters more than it sounds: a file with mixed endings will otherwise have some breaks removed and others left, which looks like the tool working intermittently rather than working correctly on inconsistent input.",
  ],
  faq: [
    {
      question: "How do I fix text copied from a PDF?",
      answer: "Use unwrap mode. A PDF puts a hard break at the end of every visual line, so the text arrives as a ragged column. Unwrap joins the lines that were only broken by wrapping and leaves the real paragraph breaks alone, which is what makes it readable again.",
    },
    {
      question: "What is the difference between the three modes?",
      answer: "Every break flattens the whole text to one line. Keep paragraphs joins lines within each paragraph but keeps blank lines between them. Unwrap is the smart one — it joins a break only when the surrounding lines suggest it was accidental.",
    },
    {
      question: "Why are some of my line breaks left behind?",
      answer: "In unwrap mode, a break is kept when the previous line ends in a full stop or other terminator, or when the next line starts a bullet, a number or a heading. Those look deliberate rather than accidental. Switch to keep paragraphs or every break if you want them gone regardless.",
    },
    {
      question: "Does it handle Windows and Mac line endings?",
      answer: "Yes. CRLF, lone CR and LF are all normalised before anything else runs, so a file with mixed endings is handled consistently rather than having some breaks removed and others missed.",
    },
    {
      question: "Can I join lines with a comma instead of a space?",
      answer: "Yes — choose the separator. Comma or pipe is useful for turning a column of values into a single delimited line you can paste into a spreadsheet or a query.",
    },
  ],
};

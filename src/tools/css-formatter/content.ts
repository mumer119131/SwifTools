import type { ToolContent } from "@/config/tool-content";

export const cssFormatterContent: ToolContent = {
  steps: [
    "Paste CSS, SCSS or Less and pick the matching syntax.",
    "It is parsed and reprinted by Prettier — the same engine your editor runs — so the result matches your project's own tooling.",
    "Adjust indentation and line width, then copy or download.",
  ],
  notes: [
    "Formatting re-indents CSS with consistent spacing and one declaration per line, which is what makes a stylesheet reviewable. It is the inverse of minification and the usual reason to reach for it is inspecting compiled or third-party CSS that arrived as a single line.",
    "The formatter normalises structure but does not reorder or merge anything. Declaration order matters in CSS — later rules of equal specificity win — so a formatter that helpfully sorted properties could silently change which rule applies.",
    "Formatting is not linting. It will not tell you about unused selectors, specificity conflicts, or a property that is misspelled and therefore ignored. For that you want stylelint; use this to make the file readable first.",
  ],
  faq: [
    {
      question: "Can I format minified CSS?",
      answer: "Yes, that is the main use — turning a single-line compiled stylesheet back into something you can read and review. Comments cannot be restored, since minification removed them entirely.",
    },
    {
      question: "Does formatting change how my styles apply?",
      answer: "No. Only whitespace and line breaks change. Declaration order is preserved exactly, which matters because later rules of equal specificity override earlier ones.",
    },
    {
      question: "Will it sort my properties alphabetically?",
      answer: "No, deliberately. Reordering declarations can change which rule wins in an override chain, so the formatter leaves order alone. Property sorting is a job for a linter with rules you have chosen.",
    },
    {
      question: "Does it check my CSS for errors?",
      answer: "No — it formats rather than validates. A misspelled property that browsers silently ignore will be indented neatly along with everything else. Use stylelint for correctness.",
    },
    {
      question: "Is my CSS sent to a server?",
      answer: "No. Parsing and formatting happen locally in your browser, so proprietary or unreleased stylesheets never leave the device.",
    },
  ],
};

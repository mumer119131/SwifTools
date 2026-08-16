import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const jsFormatter: Tool = {
  slug: "js-formatter",
  name: "JavaScript Formatter",
  category: "developer",
  description: "Beautify JavaScript or TypeScript with Prettier, including JSX.",
  keywords: [
    "javascript formatter",
    "js beautifier",
    "prettify javascript",
    "format typescript online",
    "prettier online",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
  steps: [
    "Paste JavaScript, TypeScript or JSX and pick the matching parser.",
    "Prettier reprints it from the AST, so the output is genuinely reformatted rather than nudged.",
    "Set quote style, semicolons and line width to match your project.",
  ],
  notes: [
    "Formatting uses Prettier, which does not attempt to preserve your original layout. It parses the code into a syntax tree and prints it back according to its own rules, which is why the output is identical no matter how the input was spaced. That is the whole design: the formatting stops being a matter of opinion.",
    "The one thing it respects is where you put blank lines between statements, because those carry intent that the tree does not. Everything else — line breaks, indentation, quote style, trailing commas — is decided by the printer.",
    "It formats rather than fixes. Syntactically invalid code cannot be parsed and will report an error instead of being repaired, and valid code that is logically wrong will be laid out beautifully. Linting and formatting are different jobs.",
  ],
  faq: [
    {
      question: "Why did the formatter change my line breaks?",
      answer: "Prettier reprints from the syntax tree rather than adjusting your layout, so line breaks are decided by its own rules and the print width. The only original spacing it preserves is blank lines between statements.",
    },
    {
      question: "Can it format TypeScript and JSX?",
      answer: "Yes. Both are parsed natively, including type annotations, generics and JSX elements, and printed with the same rules as plain JavaScript.",
    },
    {
      question: "Why won't my code format?",
      answer: "It has a syntax error. The code must parse before it can be printed, so a missing brace or bracket stops the process. The error message points at where parsing failed, which is often just after the real mistake.",
    },
    {
      question: "Does formatting fix bugs or style problems?",
      answer: "No. It changes layout only. Unused variables, missing awaits and logic errors survive formatting untouched — that is what a linter is for.",
    },
    {
      question: "Is my source code sent anywhere?",
      answer: "No. Prettier runs in your browser, so you can format proprietary or unreleased code without it leaving your machine.",
    },
  ],
};

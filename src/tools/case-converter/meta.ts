import { CaseSensitive } from "lucide-react";

import type { Tool } from "@/config/tools";

export const caseConverter: Tool = {
  slug: "case-converter",
  name: "Case Converter",
  category: "text",
  description: "Switch text between sentence, title, camel, snake, kebab and eight more cases.",
  keywords: [
    "case converter",
    "uppercase to lowercase",
    "title case converter",
    "camelcase converter",
    "snake case converter",
  ],
  icon: CaseSensitive,
  processing: "client",
  status: "live",
  steps: [
    "Paste your text into the box.",
    "Every case is generated at once — pick the one you want.",
    "Copy it with one click, or send it back into the input to chain conversions.",
  ],
  notes: [
    "The straightforward cases — upper, lower, sentence and title — are for prose. The programming cases are for identifiers: camelCase for JavaScript variables, PascalCase for classes and React components, snake_case for Python and SQL, kebab-case for URLs, CSS classes and filenames, and CONSTANT_CASE for compile-time constants.",
    "Title case is the one with no single correct answer. Different style guides disagree about which short words stay lowercase — Chicago capitalises prepositions of five letters or more, AP uses four, and some publications capitalise everything. What matters is picking one and applying it consistently, not finding the right one.",
    "Sentence case is genuinely hard to automate, because knowing where a sentence ends means distinguishing a full stop from an abbreviation. 'Dr. Smith arrived.' has one sentence and two full stops. Check the output rather than trusting it on text with abbreviations, decimals or ellipses.",
  ],
  faq: [
    {
      question: "What is the difference between camelCase and PascalCase?",
      answer: "Both join words without spaces; the difference is the first letter. camelCase starts lowercase (userName) and is conventional for variables and functions. PascalCase starts uppercase (UserName) and is conventional for classes, types and React components.",
    },
    {
      question: "When should I use snake_case or kebab-case?",
      answer: "snake_case for Python variables, database columns and SQL identifiers. kebab-case for URLs, CSS class names and filenames, because hyphens are safe in URLs and underscores can be hidden by a text underline.",
    },
    {
      question: "Why is my title case different from what I expected?",
      answer: "Style guides disagree about which short words to capitalise — Chicago lowercases prepositions under five letters, AP under four. Neither is wrong. Pick one convention and use it consistently across the publication.",
    },
    {
      question: "Does converting case affect punctuation or line breaks?",
      answer: "No. Only letters are changed. Punctuation, numbers, whitespace and line breaks are preserved exactly, so pasting a formatted list back in place keeps its structure.",
    },
    {
      question: "Is there a limit on how much text I can convert?",
      answer: "None beyond what your browser can hold. The conversion runs locally as you type, so tens of thousands of words are no problem and nothing is uploaded.",
    },
  ],
};

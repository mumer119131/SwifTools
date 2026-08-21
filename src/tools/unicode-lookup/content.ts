import type { ToolContent } from "@/config/tool-content";

export const unicodeLookupContent: ToolContent = {
  steps: [
    "Paste a character, or type a code point like U+00E9 or 8364.",
    "Or search by name — em dash, tick, degree.",
    "Copy whichever form you need: entity, escape or raw character.",
  ],
  notes: [
    "Two jobs in one place. Anything you paste is broken down completely — code point, UTF-8 bytes, UTF-16 units, HTML entity, CSS and JavaScript escapes, URL encoding — which needs no lookup table at all, just arithmetic. And the symbols people actually hunt for are searchable by name, because shipping the full Unicode name table to a browser is not sensible and nobody is looking up an obscure mathematical alphanumeric.",
    "The byte count is the figure worth noticing. ASCII characters cost one byte in UTF-8, accented Latin two, most CJK three, and emoji four. That is why a 280-character limit is not 280 bytes, why a database column sized in bytes silently truncates non-English text, and why emoji count as two towards some length limits — they occupy two UTF-16 units, which is what JavaScript's `length` counts.",
    "There is a real ambiguity in what a bare number means. `8364` could be hexadecimal or decimal, and the two give completely different characters. The rule here is stated rather than guessed: a run of digits alone is decimal, and anything containing a letter or carrying a `U+`, `0x` or `\\u` prefix is hex.",
    "The non-breaking space is the one people arrive looking for without knowing its name. It looks exactly like an ordinary space, does not break across lines, and is what gets pasted invisibly out of word processors and web pages — where it then breaks searches and comparisons that expect a normal space.",
  ],
  faq: [
    {
      question: "How do I find the Unicode code point of a character?",
      answer: "Paste it in. The code point appears in U+ notation along with the decimal value, the UTF-8 bytes and every escape form you might need.",
    },
    {
      question: "Why does an emoji count as two characters?",
      answer: "Because it sits above the Basic Multilingual Plane and needs two UTF-16 units to represent. JavaScript's string length counts those units, so a single emoji reports as length 2 — and naive truncation can cut between them and produce a broken character.",
    },
    {
      question: "How many bytes is a character in UTF-8?",
      answer: "One for ASCII, two for most accented Latin and Greek, three for most CJK, four for emoji and rarer scripts. It is shown for whatever you look up, and it is why a byte-sized database column truncates non-English text unexpectedly.",
    },
    {
      question: "What is a non-breaking space?",
      answer: "U+00A0 — a space that will not break across a line. It looks identical to an ordinary space and is routinely pasted invisibly out of word processors and web pages, where it breaks searches and string comparisons that expect a normal one.",
    },
    {
      question: "Does 8364 mean hex or decimal?",
      answer: "Here it is read as decimal, giving the euro sign. A run of digits alone is treated as decimal; anything with a letter in it, or a U+, 0x or backslash-u prefix, is treated as hex. The two readings genuinely differ, so the rule is stated rather than guessed.",
    },
  ],
};

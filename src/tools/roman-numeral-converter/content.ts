import type { ToolContent } from "@/config/tool-content";

export const romanNumeralConverterContent: ToolContent = {
  steps: [
    "Type a number to get the numeral, or a numeral to get the number.",
    "Malformed numerals are refused with an explanation rather than guessed at.",
    "The rules below cover the four that people get wrong.",
  ],
  notes: [
    "Encoding is straightforward. Decoding is where most converters fail, because a naive left-to-right scan happily accepts things that are not numerals at all. `IIII`, `VV`, `IC` and `XXXX` all produce a number under that approach — 4, 10, 99 and 40 respectively — and every one of them is invalid. Returning 99 for `IC` is worse than refusing it, because the reader has no reason to doubt the answer.",
    "Rather than checking a list of rules, which is how these implementations get long and still miss cases, this decodes the input and then re-encodes the result. If the canonical spelling of that number is not what was typed, the input was not a valid numeral. There is exactly one correct way to write any number, so a single comparison catches every malformed case at once.",
    "The subtractive rule is narrower than people assume. Only I, X and C are ever subtracted, and only from the next two values up — I from V and X, X from L and C, C from D and M. That is why 99 is XCIX, ninety plus nine, and never IC. V, L and D are never subtracted from anything.",
    "There is no zero and no way to write beyond 3999 in plain text. Larger numbers used an overbar meaning multiply by a thousand, which has no plain-character equivalent — so 3999, MMMCMXCIX, is the practical ceiling.",
    "One genuine exception to the rules: clock faces have used IIII for 4 rather than IV for centuries. The reasons offered are aesthetic — balance against the VIII opposite — and it is a convention rather than arithmetic. This tool follows the arithmetic.",
  ],
  faq: [
    {
      question: "Why is 99 not IC?",
      answer: "Because only I, X and C can be subtracted, and only from the next two values up. I may precede V and X, nothing larger. 99 is XCIX — ninety (XC) plus nine (IX).",
    },
    {
      question: "Why do clocks show IIII instead of IV?",
      answer: "Convention rather than correctness. It balances the VIII on the opposite side of the dial and keeps the numerals visually even. IV is the arithmetically correct form, and it is what this converter produces.",
    },
    {
      question: "What is the largest Roman numeral?",
      answer: "MMMCMXCIX — 3999 — in plain text. Beyond that the system used an overbar meaning multiply by a thousand, which cannot be written with ordinary characters.",
    },
    {
      question: "How do I write the current year?",
      answer: "2026 is MMXXVI — two thousands (MM), two tens (XX), a five (V) and a one (I). Years are written straight through with no special rules, which is why film credits and building datestones are readable once you know the values.",
    },
    {
      question: "Why does it reject numerals that other converters accept?",
      answer: "Because those converters are wrong. A left-to-right scan gives a number for IIII, VV and IC, none of which are valid numerals. An answer you have no reason to doubt is worse than an error message.",
    },
  ],
};

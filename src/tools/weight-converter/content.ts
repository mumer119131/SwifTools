import type { ToolContent } from "@/config/tool-content";

export const weightConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between kilograms, pounds, ounces, stones and grams in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "A pound is exactly 0.45359237 kilograms by the 1959 international agreement, which is why the conversion is precise rather than the familiar rough 2.2. Working the other way, one kilogram is 2.2046226 pounds — the difference from 2.2 is about a fifth of a percent, enough to matter over a shipment and not over a bag of flour.",
    "Stones are still in everyday use in Britain and Ireland for body weight and nowhere else. One stone is 14 pounds, or 6.35029318 kilograms, and the convention is to write eleven stone four rather than 158 pounds.",
  ],
  faq: [
    {
      question: "How many pounds are in a kilogram?",
      answer: "2.2046226 pounds. The familiar 2.2 is close enough for a bag of shopping and off by about a fifth of a percent, which becomes real money over a freight shipment.",
    },
    {
      question: "How do I convert stones and pounds to kilograms?",
      answer: "Multiply the stones by 14, add the pounds, then multiply by 0.45359237. Eleven stone four is 158 pounds, or 71.67 kilograms.",
    },
    {
      question: "What is the difference between an ounce and a fluid ounce?",
      answer: "One is weight and the other is volume, and they are unrelated. An ounce is 28.35 grams; a US fluid ounce is 29.57 millilitres. They coincide only for water, which is why recipes confuse them.",
    },
    {
      question: "Is a US pound the same as a UK pound?",
      answer: "Yes for weight — both are exactly 0.45359237 kilograms since 1959. The difference between the two systems is in volume measures, where a US pint is 473 millilitres and an imperial pint 568.",
    },
    {
      question: "How many grams are in an ounce?",
      answer: "28.349523125 grams exactly, since the ounce is defined as one sixteenth of the international pound. Most kitchen use rounds it to 28.35.",
    },
  ],
};

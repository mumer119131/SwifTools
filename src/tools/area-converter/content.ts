import type { ToolContent } from "@/config/tool-content";

export const areaConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between square metres, square feet, acres, hectares and more in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "Area units scale as the square of their length units, which is the thing people get wrong. A yard is 3 feet, but a square yard is 9 square feet, not 3. A metre is about 3.28 feet, so a square metre is about 10.76 square feet.",
    "The land measures are historical and oddly specific. An acre is 4,840 square yards — originally the area a yoke of oxen could plough in a day — and a hectare is a clean 10,000 square metres, which is why one acre is the untidy 0.4047 hectares.",
  ],
  faq: [
    {
      question: "How many square feet are in a square metre?",
      answer: "10.7639. The conversion is the square of the linear ratio, which is why it is not 3.28 — squaring both dimensions is the step people skip.",
    },
    {
      question: "How big is an acre?",
      answer: "4,840 square yards, or 43,560 square feet, or 0.4047 hectares. It began as roughly the area a team of oxen could plough in a day, which is why it is not a round number in any modern unit.",
    },
    {
      question: "How many acres are in a hectare?",
      answer: "2.471. A hectare is a clean 10,000 square metres by definition; the acre is a historical measure, so the relationship between them is untidy in both directions.",
    },
    {
      question: "Why can't I just multiply by the length conversion?",
      answer: "Because area is two-dimensional. Both sides scale, so the factor is squared — 1 metre is 3.28 feet, but 1 square metre is 3.28 squared, or 10.76 square feet.",
    },
    {
      question: "How do I work out the area of a room?",
      answer: "Multiply length by width for a rectangle. For an L-shaped room, split it into rectangles at the corner and add them — that is how a builder measures, and it needs no geometry beyond multiplication.",
    },
  ],
};

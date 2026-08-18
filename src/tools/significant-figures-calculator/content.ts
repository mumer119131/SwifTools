import type { ToolContent } from "@/config/tool-content";

export const significantFiguresCalculatorContent: ToolContent = {
  steps: [
    "Type a number — scientific notation and trailing zeros are handled correctly.",
    "The count appears with each digit marked significant or not, and why.",
    "Round to any number of figures, with the scientific-notation form alongside.",
  ],
  notes: [
    "Significant figures record how precisely something was measured. Writing 4.50 rather than 4.5 claims you measured to the hundredth, and that claim carries through every calculation the number is used in — which is why the rules matter beyond exam questions.",
    "The rules that trip people up: leading zeros are never significant, so 0.0045 has two figures. Zeros between non-zero digits always count, so 1002 has four. Trailing zeros count only when there is a decimal point — 4.50 has three, 450 has two.",
    "That last rule leaves a genuine ambiguity. 1200 could be two, three or four significant figures and nothing in the notation says which, which is exactly why scientific notation exists: 1.2 × 10³ removes the doubt.",
  ],
  faq: [
    {
      question: "How many significant figures does 0.00450 have?",
      answer: "Three. Leading zeros are placeholders and never count; the 4 and 5 count, and the trailing zero counts because there is a decimal point present.",
    },
    {
      question: "Are trailing zeros significant?",
      answer: "Only with a decimal point. 4.50 has three significant figures because the zero would not be written otherwise; 450 has two, because the zero may just be marking magnitude.",
    },
    {
      question: "How many significant figures does 1200 have?",
      answer: "Genuinely ambiguous — two, three or four, and the notation cannot say. Writing 1.2 × 10³ or 1.200 × 10³ removes the doubt, which is the main reason scientific notation exists.",
    },
    {
      question: "What are the rules for calculations?",
      answer: "When multiplying or dividing, the answer carries the fewest significant figures of any input. When adding or subtracting, it carries the fewest decimal places — a different rule, and mixing them is the usual error.",
    },
    {
      question: "Do leading zeros ever count?",
      answer: "No. In 0.0045 the zeros only place the decimal point and carry no information about precision, so the number has two significant figures.",
    },
  ],
};

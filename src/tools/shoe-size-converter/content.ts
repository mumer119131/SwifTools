import type { ToolContent } from "@/config/tool-content";

export const shoeSizeConverterContent: ToolContent = {
  steps: [
    "Pick men's, women's or kids' — the scales differ, not just the range.",
    "Enter a size you know, in whichever region it came from.",
    "Read across. The centimetre figure is the one to trust.",
  ],
  notes: [
    "There is no international standard for shoe sizes, and that is not a caveat tucked at the bottom — it is the most important thing on this page. UK and US sizes both derive from the barleycorn, a third of an inch, but count from different starting points, which is why they differ by roughly one for men and two for women. EU sizes use the Paris point, two thirds of a centimetre, measured on the last rather than the foot. The three scales do not align exactly, and manufacturers then deviate from all of them by half a size in either direction as a matter of routine.",
    "So the foot length in centimetres is the only figure that means anything. Use it to check against a brand's own size chart, which most publish, rather than assuming your usual number transfers. Two pairs marked UK 9 from different makers genuinely are different sizes.",
    "The centimetre figure in the table is your foot, not the inside of the shoe. Add roughly a centimetre of room in front of the longest toe when comparing against a manufacturer's internal length.",
    "Measure in the evening. Feet swell over the course of a day by a noticeable amount, and a shoe fitted first thing can be uncomfortable by six. Measure both feet too — they differ in most people, and you fit the larger one.",
    "Children's sizing deserves its own warning: feet grow in unpredictable bursts rather than steadily, and the gap between whole sizes is small. Measure before each purchase rather than extrapolating from the last pair.",
  ],
  faq: [
    {
      question: "What is a UK 9 in US sizes?",
      answer: "US 10 in men's, and the men's and women's scales differ — a women's UK 9 is a US 11. That two-size offset between men's and women's is the commonest source of confusion when buying across the divide.",
    },
    {
      question: "Why do shoes from different brands fit differently at the same size?",
      answer: "Because there is no standard they are obliged to follow. The published tables are conventions, and manufacturers deviate by half a size routinely. Comparing the foot length in centimetres against a brand's own chart is the only reliable approach.",
    },
    {
      question: "How do I measure my foot properly?",
      answer: "In the evening, standing with your weight on the foot, heel against a wall. Mark the end of the longest toe — not always the big one — and measure heel to mark. Do both feet and use the larger.",
    },
    {
      question: "Should I buy the size that matches my foot length exactly?",
      answer: "No — the table figure is your foot, not the shoe's interior. Allow about a centimetre in front of the longest toe, and more for running shoes, where feet swell over distance.",
    },
  ],
};

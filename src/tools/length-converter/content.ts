import type { ToolContent } from "@/config/tool-content";

export const lengthConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between metres, feet, inches, miles and eight more in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "The awkward ones are all defined exactly rather than measured. An inch is precisely 25.4 millimetres by international agreement since 1959, a foot is 0.3048 metres and a mile is 1,609.344 metres — so these conversions are exact, not approximations, and any rounding you see is display precision only.",
    "The nautical mile is the odd one out: 1,852 metres exactly, chosen because it is close to one minute of latitude, which is what makes it useful for navigation and useless for anything else.",
  ],
  faq: [
    {
      question: "How many centimetres are in an inch?",
      answer: "Exactly 2.54. The inch has been defined as precisely 25.4 millimetres by international agreement since 1959, so this is a definition rather than a measurement and the conversion carries no error.",
    },
    {
      question: "Why is a nautical mile different from a mile?",
      answer: "A nautical mile is 1,852 metres, chosen to approximate one minute of latitude, which makes chart work straightforward. A statute mile is 1,609.344 metres and has no such relationship to the globe.",
    },
    {
      question: "How do I convert feet and inches to metres?",
      answer: "Convert the whole thing to inches first — multiply feet by 12 and add the inches — then multiply by 0.0254. Six foot two is 74 inches, or 1.8796 metres.",
    },
    {
      question: "Is a US inch the same as a UK inch?",
      answer: "Yes, since 1959, when both adopted the international inch of exactly 25.4 millimetres. Before that they differed by a few millionths, which mattered only in precision engineering.",
    },
    {
      question: "What is the difference between a yard and a metre?",
      answer: "A yard is 0.9144 metres, so a metre is about 9 percent longer. The two are close enough that they are often confused and far enough apart to matter over any distance.",
    },
  ],
};

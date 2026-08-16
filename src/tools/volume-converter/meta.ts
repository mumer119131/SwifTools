import { Beaker } from "lucide-react";

import type { Tool } from "@/config/tools";

export const volumeConverter: Tool = {
  slug: "volume-converter",
  name: "Volume Converter",
  category: "units",
  description: "Convert litres, gallons, cups, pints, spoons and fluid ounces.",
  keywords: [
    "volume converter",
    "litres to gallons",
    "ml to oz",
    "cups to ml",
    "liquid measurement converter",
  ],
  icon: Beaker,
  processing: "client",
  status: "live",
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between litres, millilitres, gallons, cups, pints and more in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "The trap here is that US and imperial measures share names and differ in size. A US gallon is 3.785 litres and an imperial gallon is 4.546 — a 20 percent difference. A US pint is 473 millilitres, an imperial pint 568. Recipes and fuel figures cross the Atlantic constantly and the units rarely announce which system they mean.",
    "Cups are worse still: a US cup is 236.6 millilitres, a metric cup 250, and an Australian tablespoon is 20 millilitres against 15 everywhere else. For baking, weight is simply more reliable than volume — which is why serious recipes give grams.",
  ],
  faq: [
    {
      question: "How many millilitres are in a cup?",
      answer: "236.6 for a US cup and 250 for a metric one. That six percent difference is enough to matter in baking, which is part of why weight-based recipes are more reliable than volume-based ones.",
    },
    {
      question: "Why is a US gallon different from an imperial gallon?",
      answer: "They descend from different historical standards. A US gallon is 3.785 litres, based on an old English wine gallon; an imperial gallon is 4.546 litres, defined in 1824. The 20 percent gap catches out anyone comparing fuel economy figures.",
    },
    {
      question: "How many ounces are in a litre?",
      answer: "About 33.8 US fluid ounces, or 35.2 imperial ones. Fluid ounces differ between the systems as well, which is why the same bottle carries two different numbers.",
    },
    {
      question: "How do I convert litres to gallons?",
      answer: "Divide by 3.785411784 for US gallons or by 4.54609 for imperial. Which one you want depends entirely on where the other number came from.",
    },
    {
      question: "Is a pint the same everywhere?",
      answer: "No. A US pint is 473 millilitres and an imperial pint is 568 — nearly 20 percent more, which is why a pint in a British pub is noticeably larger than one in an American bar.",
    },
  ],
};

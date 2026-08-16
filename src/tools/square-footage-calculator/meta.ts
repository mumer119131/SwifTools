import { Square } from "lucide-react";

import type { Tool } from "@/config/tools";

export const squareFootageCalculator: Tool = {
  slug: "square-footage-calculator",
  name: "Square Footage Calculator",
  category: "home",
  description: "Measure the area of a room in square feet or metres, including L-shaped spaces.",
  keywords: [
    "square footage calculator",
    "square feet calculator",
    "room area calculator",
    "sq ft calculator",
    "how to calculate square footage",
    "square meters calculator",
  ],
  icon: Square,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Enter the length and width of each rectangular section.",
    "Add a second section for an L-shaped room, or a third for anything odder.",
    "The total appears in square feet, square metres and square yards.",
  ],
  notes: [
    "Area is length times width, and the only complication is that real rooms are rarely one rectangle. An L-shaped room is two, a bay window adds a third, and an alcove a fourth. Splitting the floor into rectangles and adding them is how a builder measures it and needs no geometry beyond multiplication.",
    "The result is given in square feet, square metres and square yards, because different trades quote in different units. Carpet is still sold by the square yard in some markets, flooring by the square foot or square metre, and land by the acre or hectare.",
    "Measure at the widest point of each section and round up to the nearest inch. Leaving out closets, alcoves and bay windows is the usual reason a materials order comes in short, and coming up short is far more expensive than a little waste.",
  ],
  faq: [
    {
      question: "How do I calculate the square footage of a room?",
      answer: "Multiply length by width. For an L-shaped or irregular room, divide it into rectangles at the corners, measure each, and add the areas — that is how a builder does it, and it needs no geometry.",
    },
    {
      question: "How do I convert square feet to square metres?",
      answer: "Divide by 10.764. The factor is the square of the linear conversion, because both dimensions scale — a step people miss when they divide by 3.28 instead.",
    },
    {
      question: "Should I include closets in the square footage?",
      answer: "For a materials order, yes — you are flooring or painting them too. For a property listing, local convention decides, and it varies, so check what your market expects.",
    },
    {
      question: "How many square feet are in a square yard?",
      answer: "Nine, since a yard is three feet and area scales as the square. Carpet is still sold by the square yard in some markets, which is why the conversion still comes up.",
    },
    {
      question: "Why does my materials order come up short?",
      answer: "Almost always an omitted section — a closet, an alcove, a bay window — or measuring at the narrowest point. Measure at the widest point of each rectangle and count everything you will actually cover.",
    },
  ],
};

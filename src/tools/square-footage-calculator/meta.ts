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
};

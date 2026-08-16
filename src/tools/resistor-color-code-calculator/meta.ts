import { CircuitBoard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const resistorColorCodeCalculator: Tool = {
  slug: "resistor-color-code-calculator",
  name: "Resistor Color Code Calculator",
  category: "science",
  description: "Decode 4, 5 and 6-band resistors — or go the other way from a value to its bands.",
  keywords: ["resistor color code","resistor band calculator","4 band resistor","5 band resistor","decode resistor colours"],
  icon: CircuitBoard,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick how many bands your resistor has, then set each band's colour.",
    "The value, tolerance and range appear as you go, with a preview of the part.",
    "Or switch to reverse mode and enter a resistance to get the bands you need.",
  ],
  notes: [
    "Resistor values are printed as coloured bands because a resistor is too small to carry legible digits and can be soldered in any rotation. Each colour is a digit, black through white for 0 to 9, and the multiplier band gives the power of ten.",
    "Reading direction is the practical problem. The bands are grouped closer together at one end, with the tolerance band set slightly apart at the other — that gap is what tells you which way round to read. Gold and silver never encode digits, only multipliers or tolerances, so seeing either tells you immediately which end you are looking at.",
    "Four bands is the common case: two digits, a multiplier and a tolerance. Five and six bands add a third significant digit and a temperature coefficient for precision parts. A resistor with no tolerance band at all is ±20% by convention.",
  ],
  faq: [
    {
      question: "How do I read resistor colour bands?",
      answer: "From the end where the bands are grouped closest together. The first two or three are digits, the next is the multiplier, and the band set slightly apart at the other end is the tolerance.",
    },
    {
      question: "Which end of a resistor do I start reading from?",
      answer: "The end with the bands grouped tightly together. If you cannot tell, look for gold or silver — neither is ever a digit, so a gold or silver band marks the tolerance end.",
    },
    {
      question: "What do the colours mean?",
      answer: "Black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. The same colours give the multiplier as a power of ten, with gold and silver dividing by 10 and 100.",
    },
    {
      question: "What does a resistor with only three bands mean?",
      answer: "Two digits and a multiplier, with no tolerance band — which by convention means ±20%. Modern resistors almost always have at least four bands.",
    },
    {
      question: "What is the temperature coefficient band?",
      answer: "The sixth band on precision resistors, giving parts per million per degree Celsius. It matters in circuits where the value must stay stable across a temperature range, such as measurement references.",
    },
  ],
};

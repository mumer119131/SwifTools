import { Percent } from "lucide-react";

import type { Tool } from "@/config/tools";

export const percentageCalculator: Tool = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "calculator",
  description: "Percentage of a number, increase, decrease, difference, discounts and tips.",
  keywords: [
    "percentage calculator",
    "percent increase",
    "percent difference",
    "discount calculator",
    "tip calculator",
  ],
  icon: Percent,
  processing: "client",
  status: "live",
  steps: [
    "Pick the kind of percentage question you have.",
    "Fill in the two numbers you know.",
    "The answer appears immediately, with the working shown so you can check it.",
  ],
  notes: [
    "Four different questions get called percentage calculations and they need different arithmetic: what is 15 percent of 200, 30 is what percent of 150, what is the percentage change from 80 to 100, and what number is 25 when it is 20 percent of the total. All four are here as separate modes so you do not have to work out which formula you need.",
    "Percentage change and percentage points are not the same thing, and conflating them is how statistics get misreported. A rate rising from 2 percent to 3 percent has risen by one percentage point and by fifty percent — both are true, and the second sounds far more dramatic.",
    "Percentage changes also do not cancel. A price cut of 20 percent followed by a rise of 20 percent leaves you below where you started, because the increase applies to the smaller number. Undoing a 20 percent cut takes a 25 percent rise.",
  ],
  faq: [
    {
      question: "How do I calculate a percentage of a number?",
      answer: "Multiply the number by the percentage and divide by 100 — 15 percent of 200 is 200 × 15 ÷ 100, or 30. Enter both values and the result appears without the arithmetic.",
    },
    {
      question: "How do I work out percentage increase?",
      answer: "Subtract the old value from the new, divide by the old value, and multiply by 100. From 80 to 100 is 20 ÷ 80, which is a 25 percent increase. Dividing by the new value instead is the usual mistake.",
    },
    {
      question: "What is the difference between percent and percentage points?",
      answer: "A rise from 2 percent to 3 percent is one percentage point and a 50 percent increase. Both are correct, which is why the second phrasing turns up whenever someone wants a change to sound larger.",
    },
    {
      question: "Why doesn't a 20% discount cancel out a 20% increase?",
      answer: "Because each applies to a different base. Take 20 percent off 100 and you have 80; add 20 percent to 80 and you have 96. Recovering a 20 percent cut needs a 25 percent rise.",
    },
    {
      question: "How do I calculate a tip?",
      answer: "Multiply the bill by the tip percentage and divide by 100, or take 10 percent by moving the decimal one place and scale from there. Fifteen percent is 10 percent plus half of it again.",
    },
  ],
};

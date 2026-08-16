import { TrendingUp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const compoundInterestCalculator: Tool = {
  slug: "compound-interest-calculator",
  name: "Compound Interest Calculator",
  category: "calculator",
  description: "Project savings growth with regular contributions and compounding.",
  keywords: ["compound interest calculator", "investment growth", "savings calculator"],
  icon: TrendingUp,
  processing: "client",
  status: "live",
  steps: [
    "Enter your starting balance, what you add each month, the expected annual return and the term.",
    "Choose how often interest compounds — monthly is typical for savings, annually for bonds.",
    "See the final balance split into contributions and growth, year by year.",
  ],
  notes: [
    "Compound interest means earning interest on interest already earned. The difference from simple interest is small over a year and enormous over decades: £10,000 at 7 percent simple becomes £31,000 over 30 years, and compounded it becomes £76,000.",
    "Compounding frequency matters less than people expect. Moving from annual to monthly compounding at 7 percent adds about a fifth of a percentage point to the effective rate; moving from monthly to daily adds almost nothing. The rate and the time horizon are what dominate.",
    "Regular contributions usually matter more than the rate. Over 30 years, adding £200 a month to a £10,000 starting balance contributes far more to the final figure than an extra percentage point of return, and unlike the rate it is something you control.",
  ],
  faq: [
    {
      question: "What is the difference between simple and compound interest?",
      answer: "Simple interest is calculated only on the original amount; compound interest is calculated on the balance including interest already earned. Over 30 years at 7 percent, the compounded total is more than double the simple one.",
    },
    {
      question: "How often should interest compound?",
      answer: "More often is better, but the gain shrinks fast. Annual to monthly at 7 percent adds about 0.2 percentage points of effective return; monthly to daily adds a rounding error. The rate and the number of years dominate everything else.",
    },
    {
      question: "What is the rule of 72?",
      answer: "Divide 72 by the annual percentage return to estimate the years until money doubles — 72 divided by 8 is 9 years. It is an approximation that holds well between about 4 and 12 percent and is accurate enough for mental arithmetic.",
    },
    {
      question: "Do these figures account for inflation?",
      answer: "No, they are nominal. At 3 percent inflation, money loses about half its purchasing power over 24 years, so subtract your inflation assumption from the return to see the figure in today's money.",
    },
    {
      question: "Is it better to invest a lump sum or contribute monthly?",
      answer: "A lump sum wins on average, because more money is invested for longer. Monthly contributions reduce the risk of investing everything just before a fall, which is why most people choose them despite the lower expected outcome.",
    },
  ],
};

import { Tags } from "lucide-react";

import type { Tool } from "@/config/tools";

export const unitPriceCalculator: Tool = {
  slug: "unit-price-calculator",
  name: "Unit Price Calculator",
  category: "home",
  description: "Compare package sizes on price per unit and see which one is actually cheaper.",
  keywords: [
    "unit price calculator",
    "price per unit calculator",
    "cost per ounce calculator",
    "which is cheaper calculator",
    "grocery price comparison",
    "price per 100g",
  ],
  icon: Tags,
  processing: "client",
  status: "live",
  steps: [
    "Enter the price and size of each package you are comparing.",
    "Sizes can be in different units — grams against ounces works.",
    "The cheapest per unit is marked, with how much more the others cost.",
  ],
  notes: [
    "Compares package sizes by price per unit, converting across mass and volume units so a 750 g box and a 16 oz box can be compared honestly. Shelf labels often use different units for competing products, which is exactly when the comparison is hardest to do in your head.",
    "The bigger package is not always cheaper, which is why the tool is worth using rather than assuming. Retailers price for perceived value, and a family size can carry a higher unit price than the standard one — particularly on promotion, where the smaller pack is the one being discounted.",
    "Mass and volume are still different things. A product sold by weight and a competitor sold by volume cannot be compared honestly, whatever number comes out — the density differs, and the comparison is meaningless.",
  ],
  faq: [
    {
      question: "How do I work out the price per unit?",
      answer: "Divide the price by the size, in the same unit for every option. The tool converts across grams, ounces, litres and fluid ounces so packages labelled differently can be compared directly.",
    },
    {
      question: "Is the bigger package always cheaper per unit?",
      answer: "No, and that is the reason to check. Retailers price for perceived value, and family sizes sometimes carry a higher unit price — especially when the smaller pack is on promotion.",
    },
    {
      question: "Can I compare items sold by weight and by volume?",
      answer: "Not meaningfully. A product sold in grams and one sold in millilitres differ in density, so any per-unit comparison between them is arbitrary. Compare like with like.",
    },
    {
      question: "Why do shops use different units for similar products?",
      answer: "Partly convention within a category, partly because a smaller-looking unit price reads better. Many jurisdictions now require a standardised unit price on the shelf label for exactly this reason.",
    },
    {
      question: "How many items can I compare at once?",
      answer: "As many as you like — add a row for each. The cheapest is marked and every other option shows how much more it costs per unit, in percent.",
    },
  ],
};

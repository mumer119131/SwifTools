import { ChefHat } from "lucide-react";

import type { Tool } from "@/config/tools";

export const recipeScaler: Tool = {
  slug: "recipe-scaler",
  name: "Recipe Scaler",
  category: "home",
  description: "Scale a recipe up or down and get quantities in measures you can actually use.",
  keywords: [
    "recipe scaler",
    "recipe converter",
    "halve a recipe",
    "double a recipe",
    "recipe multiplier",
    "adjust recipe servings",
  ],
  icon: ChefHat,
  processing: "client",
  status: "live",
  steps: [
    "Paste the ingredient list — one per line, straight from the recipe.",
    "Set the servings it makes and the servings you want.",
    "Every quantity is rescaled and rounded to a measure that exists.",
  ],
  notes: [
    "Scales every quantity in an ingredient list by the ratio between the servings you have and the servings you want, and rounds the result to measures that exist. Scaling by 1.5 produces numbers no measuring cup has, so cups and spoons are rounded to usable fractions while grams and millilitres stay decimal.",
    "Lines with no leading number — 'salt to taste', 'a pinch of nutmeg' — are left alone, which is correct: they never scaled linearly anyway.",
    "Two other things do not scale with the ingredients. Cooking times barely move — doubling a stew does not double its cooking time — and pan size matters enormously, because doubling a cake into the same tin gives you a raw middle. In baking, salt and leavening should also be increased more gently than the flour.",
  ],
  faq: [
    {
      question: "How do I double or halve a recipe?",
      answer: "Set the servings it makes and the servings you want, and every quantity is rescaled. Cup and spoon measures are rounded to fractions a measuring set actually has rather than left as decimals.",
    },
    {
      question: "Do cooking times scale with the recipe?",
      answer: "Barely. Doubling a stew does not double its cooking time — heat penetration depends on depth and surface area, not total quantity. Check for doneness rather than trusting the multiplied time.",
    },
    {
      question: "Does everything in a recipe scale linearly?",
      answer: "No. Salt and leavening in baking should be increased more gently than the flour, and anything measured to taste does not scale at all. The tool leaves lines with no quantity untouched for that reason.",
    },
    {
      question: "What about pan size when scaling a cake?",
      answer: "It has to scale too. Doubling a cake batter into the same tin gives a raw middle and a burnt outside — use two tins, or one with roughly double the area, and expect the time to change.",
    },
    {
      question: "Can it handle fractions like 1 1/2 cups?",
      answer: "Yes, along with unicode fractions and decimals. Mixed numbers, simple fractions and plain decimals are all parsed and rescaled correctly.",
    },
  ],
};

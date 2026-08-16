import { CalendarDays } from "lucide-react";

import type { Tool } from "@/config/tools";

export const mealPlanner: Tool = {
  slug: "meal-planner",
  name: "Meal Planner",
  category: "home",
  description: "Plan a week of meals in a grid and turn it straight into a shopping list.",
  keywords: [
    "meal planner",
    "weekly meal planner",
    "meal plan template",
    "dinner planner",
    "meal prep planner",
    "food planner",
  ],
  icon: CalendarDays,
  processing: "client",
  status: "live",
  steps: [
    "Fill in the week's meals — breakfast, lunch, dinner and snacks.",
    "Add ingredients under any meal and they collect into one shopping list.",
    "Copy the plan or the list out. Everything is saved in this browser.",
  ],
  notes: [
    "A week of meals in a grid — breakfast, lunch, dinner and snacks across seven days — with ingredients recorded under each meal. Those ingredients collect into a single shopping list, merged so that the same item appearing on Tuesday and Friday is one thing to buy.",
    "The count is kept as well as the name, because knowing chicken thighs are needed twice changes how much you buy even though it is one line on the list.",
    "Planning ahead is what stops the midweek shop and the takeaway, and the ingredient list is the part that makes it work — a plan without a shopping list tends to collapse on Wednesday when something is missing.",
  ],
  faq: [
    {
      question: "How does the shopping list get built?",
      answer: "From the ingredients you type under each meal. They are collected across the whole week and merged case-insensitively, with a count where the same item appears in more than one meal.",
    },
    {
      question: "Can I plan more than one week?",
      answer: "The grid covers one week at a time. Copy the plan out before clearing it if you want to keep it, or reuse the same week and adjust — most people cycle a handful of meals anyway.",
    },
    {
      question: "Why plan meals in advance?",
      answer: "Because it removes the daily decision and the midweek shop, which is where most food budgets leak. The shopping list is the part that makes it stick — a plan without one fails on the first missing ingredient.",
    },
    {
      question: "Is my meal plan saved?",
      answer: "Yes, in this browser. It persists between visits but does not sync anywhere, so copy it out if you want it on another device.",
    },
    {
      question: "Can I add ingredients to any meal?",
      answer: "Yes — click a meal and an ingredient field appears. Separate items with commas or new lines, and they are all collected into the week's list.",
    },
  ],
};

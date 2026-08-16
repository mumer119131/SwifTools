import { NotebookPen } from "lucide-react";

import type { Tool } from "@/config/tools";

export const calorieTracker: Tool = {
  slug: "calorie-tracker",
  name: "Calorie Tracker",
  category: "home",
  description: "Log what you eat against a daily target, with protein, carbs and fat totalled.",
  keywords: [
    "calorie tracker",
    "food diary",
    "calorie counter",
    "macro tracker",
    "daily calorie log",
    "food log",
  ],
  icon: NotebookPen,
  processing: "client",
  status: "live",
  steps: [
    "Set a daily calorie target and macro split.",
    "Log foods as you eat them, by meal.",
    "Totals update as you go and each day is kept separately in this browser.",
  ],
  notes: [
    "Logs food against a daily calorie target with protein, carbohydrate and fat totalled. Each day is kept separately and the log rolls over at midnight in your own timezone rather than UTC, which is a common bug in date-based tools and would reset the day at the wrong hour.",
    "The macros are cross-checked against the calorie figure. Protein and carbohydrate are 4 kcal per gram and fat is 9, so if the macros you entered imply a very different total from the calories you entered, one of the numbers is wrong — usually a mistyped label.",
    "This is a log, not nutrition advice. It records what you tell it and does nothing else. If you are tracking for a medical reason, work with someone who can see the whole picture; and if tracking is making your relationship with food worse rather than better, that is a reason to stop.",
  ],
  faq: [
    {
      question: "How do I know what my daily calorie target should be?",
      answer: "The calorie calculator estimates it from your height, weight, age and activity level. Treat the result as a starting point and adjust from what your weight actually does over two or three weeks.",
    },
    {
      question: "How many calories are in a gram of protein, carbs and fat?",
      answer: "Protein and carbohydrate are about 4 kcal per gram and fat about 9. That is why the macros you log are cross-checked against the calorie total — a large mismatch means a mistyped number.",
    },
    {
      question: "Is my food diary private?",
      answer: "Entirely. Everything is stored in this browser with no account and nothing uploaded, which also means it does not sync to your phone and clearing site data deletes it.",
    },
    {
      question: "Does the log reset at midnight?",
      answer: "Yes, at midnight in your own timezone rather than UTC. Each day is kept separately, so yesterday's entries are not lost when today begins.",
    },
    {
      question: "Should I be tracking calories at all?",
      answer: "It helps some people build awareness of portions and helps others not at all. If logging is making your relationship with food worse rather than better, stopping is a reasonable decision, and a professional is better placed to advise than any calculator.",
    },
  ],
};

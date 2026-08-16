import { Flame } from "lucide-react";

import type { Tool } from "@/config/tools";

export const calorieCalculator: Tool = {
  slug: "calorie-calculator",
  name: "Calorie Calculator",
  category: "calculator",
  description: "Estimate daily calorie needs from BMR and activity level, with macro splits.",
  keywords: ["calorie calculator", "tdee calculator", "bmr calculator", "daily calories"],
  icon: Flame,
  processing: "client",
  status: "live",
  steps: [
    "Enter your age, height, weight and how active you are.",
    "Your BMR and total daily energy expenditure are calculated with the Mifflin–St Jeor equation.",
    "Pick a goal to see the adjusted target, along with a suggested protein, carb and fat split.",
  ],
  notes: [
    "This estimates the calories you burn in a day: basal metabolic rate — what your body uses at complete rest — multiplied by an activity factor. The Mifflin-St Jeor equation is used for the BMR, as it is more accurate than the older Harris-Benedict formula for modern populations.",
    "The result is an estimate with real error bars. Individual metabolic rates vary by 10 to 15 percent from what any equation predicts, and the activity multiplier is the largest source of uncertainty — most people overestimate how active they are, which is why the calculated maintenance figure often sits above the real one.",
    "Treat it as a starting point to test rather than a target to hit. Eat at the estimate for two or three weeks, track weight, and adjust from what actually happened. That feedback loop is more reliable than any equation, because it measures you rather than the average of a study population.",
  ],
  faq: [
    {
      question: "How many calories do I need per day?",
      answer: "It depends on your size, age, sex and activity. The calculation multiplies your basal metabolic rate by an activity factor, but individual rates vary 10 to 15 percent either way — so use the result as a starting point and adjust from what your weight actually does.",
    },
    {
      question: "What is BMR and how is it different from TDEE?",
      answer: "BMR is what you would burn lying still all day. TDEE adds everything else — moving, digesting, exercising — and is what you actually need. TDEE is typically 1.2 to 1.9 times BMR depending on how active you are.",
    },
    {
      question: "How many calories should I cut to lose weight?",
      answer: "A deficit of 300 to 500 a day gives steady loss of around half a kilo a week and is sustainable. Larger deficits cost muscle alongside fat and become very hard to maintain, which is why most aggressive diets end in a rebound.",
    },
    {
      question: "Why am I not losing weight at this calorie level?",
      answer: "Usually because the activity multiplier is too generous or intake is being underestimated — logged portions are consistently smaller than actual ones in every study that has measured it. Adjust from observed results rather than from the equation.",
    },
    {
      question: "Which equation does this use?",
      answer: "Mifflin-St Jeor, which predicts basal metabolic rate more accurately than the older Harris-Benedict equation for contemporary populations. Neither accounts for body composition, which is the largest remaining source of individual variation.",
    },
  ],
};

import { Wallpaper } from "lucide-react";

import type { Tool } from "@/config/tools";

export const wallpaperCalculator: Tool = {
  slug: "wallpaper-calculator",
  name: "Wallpaper Calculator",
  category: "home",
  description: "Rolls of wallpaper for a room, with pattern repeat and drop matching accounted for.",
  keywords: [
    "wallpaper calculator",
    "how many rolls of wallpaper",
    "wallpaper rolls calculator",
    "pattern repeat wallpaper",
    "wallpaper estimator",
  ],
  icon: Wallpaper,
  processing: "client",
  status: "live",
  steps: [
    "Enter the room size and the roll's width and length.",
    "Add the pattern repeat — it is the number that decides how many rolls you waste.",
    "You get rolls to buy, drops per roll and the offcut you will be left with.",
  ],
  notes: [
    "Wallpaper is not an area calculation. It hangs in full-height strips, so what decides the order is how many whole drops you can cut from a roll — and that is governed by the pattern repeat, not by the square footage of the walls.",
    "Every drop has to start at the same point in the pattern, so each is cut to the next whole repeat above the wall height. A 21-inch repeat on an 8-foot wall turns a 8.25-foot drop into an 8.75-foot one, which takes a 33-foot roll from four drops to three. That is two extra rolls on an ordinary room, and it is why area-based estimates come up short.",
    "An offset or drop match is worse again, because alternate strips are staggered by half a repeat. Buy all rolls with the same batch number and buy one spare — a discontinued paper cannot be topped up later.",
  ],
  faq: [
    {
      question: "How many rolls of wallpaper do I need?",
      answer: "Work out the perimeter, divide by the roll width to get the number of drops, then see how many whole drops fit in a roll's length. It is not area divided by roll coverage, which consistently underestimates.",
    },
    {
      question: "What is a pattern repeat and why does it matter?",
      answer: "The vertical distance before the pattern starts again. Every drop must begin at the same point in it, so each is cut to the next whole repeat above the wall height — which can turn four drops per roll into three.",
    },
    {
      question: "What is the difference between a straight match and an offset match?",
      answer: "A straight match lines the pattern up level across every drop. An offset or drop match staggers alternate drops by half a repeat, which needs extra length on half the strips and wastes noticeably more.",
    },
    {
      question: "Should I buy extra wallpaper?",
      answer: "Yes, at least one roll, and all with the same batch number. Dye lots vary between batches, and a paper that has been discontinued cannot be matched at all.",
    },
    {
      question: "Do I subtract doors and windows?",
      answer: "Yes, converted back into the width of wall they remove rather than as area — an opening reduces how many drops you need, which is the unit wallpaper is actually bought in.",
    },
  ],
};

import { Dices } from "lucide-react";

import type { Tool } from "@/config/tools";

export const diceRoller: Tool = {
  slug: "dice-roller",
  name: "Dice Roller",
  category: "fun",
  description: "Roll any dice — 3d6, 1d20+5, 4d6 drop lowest — with the full breakdown.",
  keywords: ["dice roller","roll dice online","d20 roller","dnd dice roller","3d6","virtual dice"],
  icon: Dices,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Type standard dice notation like 2d6+3, or tap a preset.",
    "Every individual die is shown, not just the total.",
    "Advantage, disadvantage and drop-lowest are built in.",
  ],
  notes: [
    "Dice notation is written NdS, where N is how many dice and S is how many sides each has. 2d6 is two six-sided dice; d20 is a single twenty-sided die, with the 1 left off. A trailing number is a flat modifier added after the roll, so 2d6+3 rolls two d6 and adds three. Groups can be combined — 1d8+2d6+4 is one roll of three parts, which is how weapon damage is written in most tabletop systems.",
    "Every die comes from the browser's cryptographic random source with the modulo bias removed. That distinction matters more than it sounds: the obvious implementation, taking a random number and applying % 20, is not uniform, because 20 does not divide evenly into the generator's range. The first few faces come up very slightly more often than the rest. Rejecting the values that fall outside a clean multiple removes the skew entirely, at the cost of an occasional extra draw.",
    "Advantage rolls the dice twice and keeps the higher result; disadvantage keeps the lower. Drop-lowest rolls the stated number and discards the worst, which is how ability scores are generated with 4d6. In all three modes the discarded dice stay on screen, struck through, so you can see what was thrown away rather than trusting a total.",
  ],
  faq: [
    {
      question: "Is this dice roller actually random?",
      answer: "Yes. It uses the Web Crypto API — the same source used for cryptographic keys — rather than Math.random, and it rejects the biased tail of the range so every face is equally likely. A naive implementation that takes a random number modulo 20 is measurably skewed towards the lower faces; this one is not.",
    },
    {
      question: "What does 4d6 drop lowest mean?",
      answer: "Roll four six-sided dice, discard the lowest, and add the remaining three. It is the standard way to generate ability scores in Dungeons & Dragons, and it gives a range of 3 to 18 with an average of about 12.24 — noticeably higher than the 10.5 you would get from 3d6.",
    },
    {
      question: "What is the difference between advantage and disadvantage?",
      answer: "Advantage rolls the die twice and takes the higher number; disadvantage rolls twice and takes the lower. On a d20, advantage raises the average from 10.5 to about 13.8, and disadvantage lowers it to about 7.2. It is a much bigger swing than a flat modifier, which is why it is used for circumstance rather than skill.",
    },
    {
      question: "Can I roll more than one type of die at once?",
      answer: "Yes. Combine groups with a plus sign — 1d8+2d6+4 rolls one eight-sided die, two six-sided dice, and adds four. Each group is shown separately in the breakdown so you can check the parts as well as the total.",
    },
    {
      question: "Why do I keep rolling the same number?",
      answer: "Streaks are normal and are not evidence of anything. In a hundred d20 rolls you should expect several repeats and the occasional run of three the same. Human intuition badly underestimates how clustered genuinely random sequences look, which is why a fair roller often feels rigged and a rigged one often feels fair.",
    },
  ],
};

import { BookOpen } from "lucide-react";

import type { Tool } from "@/config/tools";

export const storyPlotGenerator: Tool = {
  slug: "story-plot-generator",
  name: "Story Plot Generator",
  category: "fun",
  description: "A protagonist, a want, an obstacle and a twist — a story premise you could actually write.",
  keywords: ["story plot generator","story idea generator","writing prompt generator","plot ideas","story premise generator"],
  icon: BookOpen,
  processing: "client",
  status: "live",
  steps: [
    "Generate a premise: who, what they want, what stops them, and the turn.",
    "Regenerate until one snags.",
    "Copy it out and start writing.",
  ],
  notes: [
    "Each premise is built from the four pieces a story actually needs: someone specific, something they want, something concrete in the way, and a turn that changes what the want was really about.",
    "Generators that shuffle nouns and genres give you a setting, not a story. A setting is easy and worth very little; the want and the obstacle are what make a premise something you could sit down and write.",
    "Treat the output as a prompt rather than a plan. The value is in the collision — an unexpected pairing of protagonist and obstacle that suggests a scene you would not otherwise have thought of.",
  ],
  faq: [
    {
      question: "How do I come up with a story idea?",
      answer: "Start with someone specific who wants something concrete, and put something real in the way. That is what makes a premise writable — a setting or a genre alone gives you nothing to write towards.",
    },
    {
      question: "What makes a good story premise?",
      answer: "A want and an obstacle that are in genuine tension, and a turn that changes what the want was really about. Without the obstacle there is no story, only a description.",
    },
    {
      question: "Can I use these ideas for a novel?",
      answer: "Yes — they are prompts rather than plots, so there is nothing to infringe. What you write from one is entirely yours, and two people starting from the same premise will produce nothing alike.",
    },
    {
      question: "Why do other story generators feel useless?",
      answer: "Because they generate settings and genres, which are the easy part. A haunted lighthouse is not a story until someone wants something there and cannot have it.",
    },
    {
      question: "Can I generate several premises at once?",
      answer: "Yes. Generating a batch and reading through is often more useful than one at a time — the one that snags is usually obvious, and it is rarely the first.",
    },
  ],
};

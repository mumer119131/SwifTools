import { Lightbulb } from "lucide-react";

import type { Tool } from "@/config/tools";

export const triviaQuestions: Tool = {
  slug: "trivia-questions",
  name: "Trivia Questions",
  category: "fun",
  description: "Pull a round of trivia by category and difficulty, with answers you can hide.",
  keywords: [
    "trivia questions",
    "pub quiz questions",
    "trivia generator",
    "quiz questions and answers",
    "free trivia questions",
    "random trivia",
  ],
  icon: Lightbulb,
  processing: "client",
  status: "live",
  steps: [
    "Choose a category and difficulty, and how many questions you want.",
    "Answers stay hidden until you reveal them.",
    "Copy the round out to read from, or print it.",
  ],
};

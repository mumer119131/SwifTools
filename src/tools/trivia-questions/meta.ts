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
};

import { ClipboardList } from "lucide-react";

import type { Tool } from "@/config/tools";

export const quizBuilder: Tool = {
  slug: "quiz-builder",
  name: "Quiz Builder",
  category: "fun",
  description: "Write a multiple-choice quiz, then take it and be marked — all in the browser.",
  keywords: [
    "quiz builder",
    "quiz maker",
    "create a quiz",
    "multiple choice quiz maker",
    "free quiz creator",
    "make your own quiz",
  ],
  icon: ClipboardList,
  processing: "client",
  status: "live",
  steps: [
    "Write your questions and mark the correct answer on each.",
    "Switch to play mode to take the quiz and be marked.",
    "Your quiz is saved in this browser as you write it.",
  ],
};

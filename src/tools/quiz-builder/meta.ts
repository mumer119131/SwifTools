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
  notes: [
    "Write multiple-choice questions, mark the correct answer, then switch to play mode and be marked. The quiz is saved in this browser as you write it, so a half-finished set survives closing the tab.",
    "Unanswered questions are marked wrong rather than skipped. A score out of the questions someone happened to attempt tells you nothing, which is why every quiz platform scores this way.",
    "There is no link to send anyone, because there is no server. Use the copy button to get the quiz out as text if you want to share it, or run it on screen with a group.",
  ],
  faq: [
    {
      question: "How do I make a multiple-choice quiz?",
      answer: "Write each question, add two to six options, and click the circle beside the correct one. Switch to play mode to take the quiz and be marked automatically.",
    },
    {
      question: "How are unanswered questions scored?",
      answer: "As wrong. Scoring out of only the questions someone attempted would make a partly finished quiz look like a good result, which is why every quiz platform marks skipped questions as incorrect.",
    },
    {
      question: "Can I share my quiz with other people?",
      answer: "Not as a link — there is no server behind this. Copy the quiz out as text to share it, or run it on screen with a group in front of you.",
    },
    {
      question: "Is my quiz saved while I write it?",
      answer: "Yes, in this browser as you type, so a half-finished set survives closing the tab. It does not sync to another device.",
    },
    {
      question: "How many options can a question have?",
      answer: "Two to six. Four is the usual choice — enough that guessing is unlikely to succeed, few enough that the options stay readable and distinct.",
    },
  ],
};

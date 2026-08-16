import { CalendarCheck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const habitTracker: Tool = {
  slug: "habit-tracker",
  name: "Habit Tracker",
  category: "fun",
  description: "Track daily habits on a grid, with streaks — saved in your browser, no account.",
  keywords: [
    "habit tracker",
    "daily habit tracker",
    "streak tracker",
    "habit tracker online",
    "printable habit tracker",
  ],
  icon: CalendarCheck,
  processing: "client",
  status: "live",
  steps: [
    "Add the habits you want to keep up.",
    "Tick each day as you do it — the last five weeks are shown at once.",
    "Current and best streaks are worked out for you.",
  ],
  notes: [
    "Habits are tracked on a grid of the last five weeks, one square per day. Streaks and completion rate are worked out for each, and everything is stored in this browser with no account.",
    "A streak stays alive until a whole day is missed — not ticking today before lunch does not break it. That is deliberate: a counter that reads zero at nine in the morning is discouraging rather than motivating, and the point of the streak is to keep you going.",
    "Two or three habits is plenty to start. Tracking a dozen produces a wall of mostly empty squares, which teaches you that you failed at eleven things rather than that you succeeded at one.",
  ],
  faq: [
    {
      question: "When does a habit streak break?",
      answer: "When a whole day is missed. Not having ticked today does not break it — a counter that reads zero every morning is discouraging, and the streak exists to keep you going rather than to judge you.",
    },
    {
      question: "How many habits should I track at once?",
      answer: "Two or three to begin with. Tracking a dozen produces a grid of mostly empty squares, which reads as eleven failures rather than one success.",
    },
    {
      question: "How long does it take to build a habit?",
      answer: "The often-quoted 21 days has no good evidence behind it. The best study found a median of 66 days with a range from 18 to 254, depending heavily on the habit and the person.",
    },
    {
      question: "Is my habit data private?",
      answer: "Entirely. It is stored in this browser only, with no account and nothing uploaded — which also means it does not sync and is lost if you clear site data.",
    },
    {
      question: "Can I see more than five weeks?",
      answer: "The grid shows the last five weeks, which fits on screen and covers the period where a streak is still meaningful. Total completions and best streak are calculated across your whole history.",
    },
  ],
};

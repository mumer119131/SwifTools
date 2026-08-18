import type { ToolContent } from "@/config/tool-content";

export const pomodoroTimerContent: ToolContent = {
  steps: [
    "Press start. The default is 25 minutes of focus followed by a 5-minute break.",
    "After four rounds you get a longer break. Durations are adjustable in settings.",
    "The tab title counts down too, so you can leave it in the background and still see the time.",
  ],
  notes: [
    "The Pomodoro technique is 25 minutes of focused work followed by a 5-minute break, with a longer break after four cycles. Francesco Cirillo devised it as a student in the late 1980s, named after the tomato-shaped kitchen timer he used.",
    "The interval length matters less than the commitment. What makes it work is deciding in advance that you will not check anything else until the timer ends — the technique is a device for making that decision once rather than fifty times an hour. Adjust the length to suit the work; deep technical work often runs better at 50 minutes.",
    "The break is not optional and is the part people skip. Its purpose is to make the next interval possible, and skipping it to keep momentum is what turns a productive morning into an unproductive afternoon. Stand up and look at something further than an arm's length away.",
  ],
  faq: [
    {
      question: "How long is a pomodoro?",
      answer: "25 minutes of work then a 5-minute break, with a longer 15 to 30 minute break after four cycles. The numbers are a starting point rather than a rule — many people find 50 minutes suits deep technical work better.",
    },
    {
      question: "Why does the Pomodoro technique work?",
      answer: "Because it turns a hundred small decisions about whether to check something into one decision made in advance. The timer is a commitment device; the specific interval matters far less than sticking to it.",
    },
    {
      question: "Should I skip breaks if I'm in flow?",
      answer: "Occasionally finishing a thought is fine, but skipping breaks routinely is what turns a productive morning into a flat afternoon. The break exists to make the next interval possible, not as a reward.",
    },
    {
      question: "What should I do during the break?",
      answer: "Stand up and look at something further away than your screen. Staying seated and switching to social media gives your attention no rest at all, which is why it does not feel like a break.",
    },
    {
      question: "Does the timer keep running if I switch tabs?",
      answer: "Yes. It tracks elapsed time rather than counting frames, so it stays accurate in a background tab where browsers throttle timers heavily.",
    },
  ],
};

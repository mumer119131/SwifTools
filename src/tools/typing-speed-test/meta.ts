import { Keyboard } from "lucide-react";

import type { Tool } from "@/config/tools";

export const typingSpeedTest: Tool = {
  slug: "typing-speed-test",
  name: "Typing Speed Test",
  category: "fun",
  description: "Measure your words per minute and accuracy on a real passage, not random letters.",
  keywords: [
    "typing speed test",
    "wpm test",
    "typing test online",
    "words per minute test",
    "free typing test",
    "typing accuracy test",
  ],
  icon: Keyboard,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Choose a length and start typing — the clock starts on your first keystroke.",
    "Mistakes are marked as you go, and you can correct them.",
    "You get gross and net WPM, accuracy, and your best score.",
  ],
  notes: [
    "A word here is five characters including the space, which is the convention every typing test uses. Counting real words would let a passage of short words score far higher than one of long words at the same physical speed.",
    "Net WPM deducts a word for each uncorrected error, and it is the number worth quoting. Gross speed with 85 percent accuracy is slower in practice than a steadier pace you do not have to go back and fix, because every correction costs more time than typing the character correctly would have.",
    "The passages are real prose with ordinary punctuation rather than random words, because that is what people actually type. A test on lowercase common words measures something narrower than typing.",
  ],
  faq: [
    {
      question: "What is a good typing speed?",
      answer: "Around 40 WPM is average, 60 to 70 is a competent office speed, and above 90 is fast. Accuracy matters more than raw speed — 60 WPM at 98 percent beats 80 at 90 in real work.",
    },
    {
      question: "How is WPM calculated?",
      answer: "Characters typed divided by five, divided by minutes elapsed. A word is defined as five characters including the space, which is the standard convention — counting real words would favour passages of short words.",
    },
    {
      question: "What is the difference between gross and net WPM?",
      answer: "Gross is raw speed; net deducts a word for each uncorrected error. Net is the number worth quoting, because errors you have to go back and fix cost more time than typing correctly would have.",
    },
    {
      question: "How can I type faster?",
      answer: "Accuracy first, speed second. Touch typing without looking, using all ten fingers and keeping your eyes on the text rather than the keyboard is what raises the ceiling — pushing speed at the cost of accuracy makes you slower overall.",
    },
    {
      question: "Are my results saved?",
      answer: "Your best score per passage is kept in this browser. Nothing is uploaded and there is no leaderboard, so the only person you are competing with is yourself.",
    },
  ],
};

import { CalendarDays } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ageCalculator: Tool = {
  slug: "age-calculator",
  name: "Age Calculator",
  category: "calculator",
  description: "Find an exact age in years, months and days — and when the next birthday lands.",
  keywords: ["age calculator", "date of birth calculator", "how old am i"],
  icon: CalendarDays,
  processing: "client",
  status: "live",
  steps: [
    "Enter a date of birth, and optionally a date to measure to instead of today.",
    "The exact age is shown in years, months and days, plus the same span in weeks, days and hours.",
    "The next birthday and the weekday it falls on are worked out too.",
  ],
  notes: [
    "Age is calculated in calendar terms — years, months and days — rather than by dividing total days by 365.25, because that is how people actually reckon it. Someone born on 29 February is treated as having a birthday on 28 February in common years, which matches the convention most legal systems use.",
    "The total-days figure is also shown, and it is the one that reveals how odd calendar arithmetic is. Two people born a day apart can differ by a whole month in the month-and-day reckoning if the boundary falls across a month end.",
    "All arithmetic uses local dates rather than UTC. Using UTC would shift the date by a day for anyone west of Greenwich in the evening, which is a surprisingly common bug in date tools and turns a birthday into the day before.",
  ],
  faq: [
    {
      question: "How do I calculate my exact age?",
      answer: "Enter your date of birth and the age appears in years, months and days, along with the total in days, weeks and hours. The calculation uses calendar months rather than an average, which is how age is normally reckoned.",
    },
    {
      question: "How is age calculated for someone born on 29 February?",
      answer: "Their birthday falls on 28 February in common years, which matches the convention most legal systems use. They gain a calendar year every year like anyone else — only the celebration date is unusual.",
    },
    {
      question: "How many days old am I?",
      answer: "The total is shown alongside the years and months. It accounts for leap years exactly rather than multiplying by 365.25, so the figure is the real count of days elapsed.",
    },
    {
      question: "Why does my age in months seem inconsistent?",
      answer: "Because months vary in length. Someone born on the 31st has no birthday in months with 30 days, and conventions differ on whether that counts on the 30th or the 1st. The calculation uses calendar months, which is why the day figure can jump.",
    },
    {
      question: "Can I calculate the time between two dates?",
      answer: "Yes — set both dates and the difference is broken down into years, months and days as well as totals. It works for future dates too, for counting down to an event.",
    },
  ],
};

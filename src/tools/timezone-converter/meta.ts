import { Clock } from "lucide-react";

import type { Tool } from "@/config/tools";

export const timezoneConverter: Tool = {
  slug: "timezone-converter",
  name: "Timezone Converter",
  category: "converter",
  description: "Compare a time across cities and find a slot that works for everyone.",
  keywords: ["timezone converter", "time zone calculator", "utc converter", "meeting planner"],
  icon: Clock,
  processing: "client",
  status: "live",
  steps: [
    "Set a date and time, and the zone it is in — your own is detected automatically.",
    "Add the zones you care about. Each shows the local time, the UTC offset and the day difference.",
    "Use the day strip to spot the hours that fall inside working time everywhere at once.",
  ],
  notes: [
    "Times are converted using the browser's own IANA timezone database, which is the same data operating systems use. That matters because timezone rules change — governments move daylight saving dates, and occasionally abolish or introduce them entirely — and hardcoded offsets go wrong the moment they do.",
    "The reason to convert against a real database rather than an offset is daylight saving. New York is UTC−5 in January and UTC−4 in July, and the switch dates differ from Europe's by a fortnight, so for two weeks each spring and autumn the usual five-hour gap between London and New York is four or six.",
    "For scheduling across regions, the safest habit is to state the timezone explicitly and, where possible, use UTC as the reference. 'Wednesday 14:00 UTC' cannot be misread; 'Wednesday 2pm' has been the cause of more missed meetings than any other four words in business.",
  ],
  faq: [
    {
      question: "How do I convert a meeting time between timezones?",
      answer: "Enter the time and its zone, then add the other zones you need. Every one updates together, and daylight saving is applied for the specific date rather than as a fixed offset.",
    },
    {
      question: "Why is the time difference between London and New York not always five hours?",
      answer: "Because the two regions change their clocks on different dates. For about two weeks each spring and autumn the gap is four or six hours instead of five, which is exactly when cross-Atlantic meetings go wrong.",
    },
    {
      question: "What is UTC and how is it different from GMT?",
      answer: "UTC is the atomic-clock time standard the world coordinates on; GMT is a timezone that happens to equal UTC in winter. Britain moves to UTC+1 in summer, so GMT and UK local time are not the same all year.",
    },
    {
      question: "Does this handle daylight saving automatically?",
      answer: "Yes, using the IANA timezone database via your browser. Rules are applied for the specific date you enter, which is why converting a date in July gives a different offset from one in January.",
    },
    {
      question: "What time should I propose for an international meeting?",
      answer: "State a UTC time alongside the local one, and check it against every participant's zone for that specific date. Naming a bare local time is the most common cause of someone joining an hour out.",
    },
  ],
};

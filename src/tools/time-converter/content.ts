import type { ToolContent } from "@/config/tool-content";

export const timeConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Convert between seconds, minutes, hours, days, weeks, months and years in one place. Values update as you type, and the result is calculated by converting to a base unit and back — so the arithmetic is the same in both directions and round-tripping a number returns exactly what you started with.",
    "Everything up to a week is exact: 60 seconds to a minute, 24 hours to a day, 7 days to a week. Beyond that the units stop being fixed. A month is 28, 29, 30 or 31 days, and a year is 365 days except when it is 366.",
    "The conversions here use the average Gregorian year of 365.2425 days and a month of 30.436875 days, which is that year divided by twelve. That makes twelve months equal one year exactly, which arithmetic using 30 or 365 does not — a difference that compounds visibly over any multi-year calculation.",
  ],
  faq: [
    {
      question: "How many seconds are in a day?",
      answer: "86,400 — 60 × 60 × 24. It is exact for a civil day, though the occasional leap second means a rare day is 86,401 seconds long in UTC.",
    },
    {
      question: "How many days are in a year exactly?",
      answer: "365.2425 in the Gregorian calendar, which is why there is a leap year every four years except centuries not divisible by 400. That correction keeps the calendar aligned with the seasons to within a day over 3,000 years.",
    },
    {
      question: "How many weeks are in a month?",
      answer: "About 4.35, not 4. The rounding is why twelve months of four weeks gives 48 weeks rather than 52, and why monthly and weekly budgets never quite reconcile.",
    },
    {
      question: "Why isn't a month a fixed number of days?",
      answer: "Because the calendar descends from lunar months of about 29.5 days fitted awkwardly into a solar year. The result is months of 28 to 31 days, which is why any monthly calculation needs an averaging convention.",
    },
    {
      question: "How many hours are in a work year?",
      answer: "About 2,080 for a 40-hour week over 52 weeks, before holidays. Subtracting typical leave and public holidays brings it closer to 1,850 to 1,900.",
    },
  ],
};

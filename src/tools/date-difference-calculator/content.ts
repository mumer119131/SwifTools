import type { ToolContent } from "@/config/tool-content";

export const dateDifferenceCalculatorContent: ToolContent = {
  steps: [
    "Pick a start and an end date to get the difference in every unit.",
    "Working days exclude weekends, counted day by day rather than estimated.",
    "Switch to add or subtract mode to find a date a given period away.",
  ],
  notes: [
    "The calendar difference is worked out by borrowing, not by dividing. Months are not a fixed length, so dividing the total days by 30.44 gives an average that matches no actual pair of dates — a month from 31 January is 28 days, and a month from 1 March is 31. Borrowing from the previous month is how a person counts it and it is what this does.",
    "Both dates are read at local midday rather than midnight. That sidesteps a classic bug: on a daylight-saving transition a whole-day difference is really 23 or 25 hours, and midnight-based arithmetic rounds it to the wrong number of days. Starting from midday leaves an hour of slack in either direction, so the count stays right across the change.",
    "Working days are counted a day at a time rather than estimated as total days divided by seven and multiplied by five. That estimate is wrong whenever the range does not begin on a Monday, and it is out by up to two days on any range shorter than a few weeks — which is exactly the range people use it for. Public holidays are not deducted, since they differ by country and often by region.",
    "Adding a month clamps to the end of a short month rather than overflowing. Left alone, 31 January plus one month becomes 3 March in JavaScript, because the extra days roll forward. Clamping to 28 or 29 February is what people mean by a month later, and it is what payment terms and notice periods assume.",
  ],
  faq: [
    {
      question: "How many days are between two dates?",
      answer: "Enter both and the total appears in days, weeks, hours and minutes, alongside the calendar difference in years, months and days. The end date is exclusive — from the 1st to the 8th is seven days, which is how date arithmetic is normally counted.",
    },
    {
      question: "How do I count working days between two dates?",
      answer: "The weekday total excludes Saturdays and Sundays, counted one day at a time. The common shortcut of dividing by seven and multiplying by five is wrong whenever the range does not start on a Monday, and can be out by two days on a short range.",
    },
    {
      question: "Are public holidays excluded from working days?",
      answer: "No. Holidays vary by country, by region and by year, so any built-in list would be wrong for most people. Subtract the ones that apply to you from the weekday total.",
    },
    {
      question: "What happens when I add a month to the 31st?",
      answer: "It clamps to the last day of the target month, so 31 January plus one month is 28 or 29 February rather than 2 or 3 March. Left alone, JavaScript rolls the surplus days forward, which is almost never what a contract or a notice period means.",
    },
    {
      question: "Does the calculation handle leap years?",
      answer: "Yes. Both the day count and the calendar difference use real calendar dates, so a range crossing 29 February includes it. Adding a year to 29 February clamps to 28 February in a non-leap year.",
    },
  ],
};

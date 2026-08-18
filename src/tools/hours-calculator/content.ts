import type { ToolContent } from "@/config/tool-content";

export const hoursCalculatorContent: ToolContent = {
  steps: [
    "Enter each shift's start and end. Any format works — 9, 9:30, 9.30, 5:45pm.",
    "Set the unpaid break for each day.",
    "Add an hourly rate and an overtime threshold if you want the pay worked out too.",
  ],
  notes: [
    "The calculation people get wrong is the overnight shift. A shift from 22:00 to 06:00 is eight hours, but subtracting one clock time from the other gives minus sixteen — and a spreadsheet will show that as a blank, a negative, or a cheerful zero depending on how it is formatted. Here an end time at or before the start is read as crossing midnight, and the row is marked so you can see it was interpreted that way rather than having to trust it.",
    "Times can be written however you naturally write them. 9, 09, 9:30, 9.30, 09:30, 5pm and 5:45pm all parse. The two that catch out most implementations are 12am and 12pm — midnight and noon respectively, which is the one case where the usual rule of adding twelve is wrong in both directions.",
    "Totals are given in hours and minutes and in decimal hours, because payroll systems want the second. 7 hours 30 minutes is 7.5, not 7.3, and that particular slip is a persistent source of short pay.",
    "Overtime is applied to the weekly total rather than per day, which is how most agreements define it. Set the threshold and the multiplier to match yours — the defaults are a starting point, not advice about your contract.",
    "Your timesheet is kept in this browser so it survives closing the tab, because nobody fills one in a single sitting. It is never sent anywhere, and clearing your browser data clears it.",
  ],
  faq: [
    {
      question: "How do I calculate hours for an overnight shift?",
      answer: "Enter the times as they are — 22:00 to 06:00. An end at or before the start is treated as crossing midnight, giving eight hours rather than a negative number, and the row is marked with a moon so you can see it was read that way.",
    },
    {
      question: "What is 7 hours 30 minutes in decimal?",
      answer: "7.5. Thirty minutes is half an hour, not 0.3 of one. Both figures are shown here because payroll systems almost always want the decimal, and converting by hand is where short pay comes from.",
    },
    {
      question: "Does it subtract unpaid breaks?",
      answer: "Yes, per day. Enter the break in minutes and it comes off that shift's total. A break longer than the shift is flagged rather than silently producing a negative.",
    },
    {
      question: "How is overtime worked out?",
      answer: "Against the weekly total, which is how most agreements define it. Anything above the threshold you set is paid at the multiplier you set. Check both against your own contract — the defaults are a starting point, not advice.",
    },
    {
      question: "Is my timesheet saved?",
      answer: "In this browser only, so it survives closing the tab. It is never transmitted, and clearing your browser data clears it.",
    },
  ],
};

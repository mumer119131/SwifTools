import type { ToolContent } from "@/config/tool-content";

export const cronExpressionBuilderContent: ToolContent = {
  steps: [
    "Type a cron expression, or build one from the fields.",
    "Read the plain-English description to check it says what you meant.",
    "Look at the next run times — they settle any remaining doubt.",
  ],
  notes: [
    "Five fields, in order: minute, hour, day of month, month, day of week. Each takes a number, a range like `1-5`, a list like `1,15`, a step like `*/15`, or `*` for every value. Month and day-of-week also accept three-letter names, and `7` means Sunday as well as `0`.",
    "The rule that catches people out is what happens when you restrict both day fields. `0 0 1 * 1` does not mean the first of the month when it falls on a Monday — it means the first of the month **or** any Monday, whichever comes round. Cron treats those two fields as OR when both are set, and AND everywhere else. The description here says so explicitly, and the next-run list proves it.",
    "Those next run times are the part worth trusting. A description can be read the way you already expected; a list of timestamps cannot. They are calculated in your own timezone — which is worth remembering, because the server running your job may well be on UTC, and that is the commonest reason a schedule fires an unexpected number of hours off.",
    "Shorthands like `@daily` and `@hourly` are expanded so you can see what they actually mean.",
  ],
  faq: [
    {
      question: "What do the five fields in a cron expression mean?",
      answer: "Minute, hour, day of month, month, day of week — in that order. `0 3 * * 1` is 03:00 every Monday.",
    },
    {
      question: "Does restricting both the day of month and day of week mean AND or OR?",
      answer: "OR, which surprises nearly everyone. `0 0 1 * 1` fires on the first of the month and on every Monday, not only on first-of-the-months that are Mondays. Every other combination of fields is AND.",
    },
    {
      question: "How do I run something every 15 minutes?",
      answer: "`*/15 * * * *`. The step syntax means \"every nth value\", so that expands to minutes 0, 15, 30 and 45 of every hour.",
    },
    {
      question: "Is Sunday 0 or 7?",
      answer: "Both, in most implementations. `0` is standard and `7` is widely accepted as an alias. This tool treats them the same.",
    },
    {
      question: "What timezone do the next run times use?",
      answer: "Yours, as your browser reports it. Your server very likely runs on UTC instead, and that mismatch is the usual explanation for a job firing at an unexpected hour.",
    },
    {
      question: "Why does my schedule show no upcoming runs?",
      answer: "Because it can never fire. `0 0 30 2 *` asks for the thirtieth of February, which does not exist. The tool scans four years ahead — enough to catch a 29 February schedule — and reports nothing rather than pretending.",
    },
  ],
};

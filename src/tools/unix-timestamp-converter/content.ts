import type { ToolContent } from "@/config/tool-content";

export const unixTimestampConverterContent: ToolContent = {
  steps: [
    "Paste a timestamp in any unit, or type a date — the unit is detected for you.",
    "Every format appears at once: seconds, milliseconds, ISO 8601, UTC and your local time.",
    "The current timestamp is always on screen, one click from being copied.",
  ],
  notes: [
    "Unix time counts the seconds since 1 January 1970 UTC, and it deliberately ignores leap seconds — which is why it is a count of seconds that does not quite match the number of seconds actually elapsed. That trade buys a value that is trivial to compare and arithmetic on, at the cost of being a fraction out from atomic time.",
    "The unit is guessed from the number of digits, and that guess is the reason so many bugs land in January 1970. A seconds timestamp handed to JavaScript's Date, which expects milliseconds, gives a date a few days after the epoch; a millisecond timestamp handed to a seconds-based API gives a date fifty thousand years out. Ten digits is seconds and thirteen is milliseconds for any date in this era, so the two separate cleanly — but the detected unit is shown here so you can see what was assumed.",
    "Two dates worth knowing. 2,147,483,647 is 19 January 2038, the moment a signed 32-bit time_t overflows and wraps round to 1901 — still live in embedded systems and old file formats. And 0 is the epoch itself, which is where an unset, null or mis-scaled timestamp almost always shows up.",
  ],
  faq: [
    {
      question: "What is a Unix timestamp?",
      answer: "The number of seconds since 1 January 1970 at 00:00:00 UTC, with leap seconds ignored. It is the standard way computers store an instant, because it is a single number that sorts and subtracts correctly with no timezone attached.",
    },
    {
      question: "How do I tell seconds from milliseconds?",
      answer: "Count the digits. Ten digits is seconds for any date between 2001 and 2286; thirteen is milliseconds over the same span. If a date comes out in 1970 you have passed seconds where milliseconds were expected, and if it lands fifty thousand years out you have done the reverse.",
    },
    {
      question: "Why does my timestamp show 1 January 1970?",
      answer: "Almost always a zero, a null that became zero, or a seconds value read as milliseconds. The epoch is the default value for an unset timestamp in most systems, so a date of 1970 usually means the field was never populated rather than that the maths is wrong.",
    },
    {
      question: "What is the year 2038 problem?",
      answer: "Systems storing Unix time in a signed 32-bit integer can only reach 2,147,483,647 seconds, which is 19 January 2038. One second later the value overflows to negative and the date reads as 1901. Modern systems use 64-bit time, but embedded devices and older file formats still hit it.",
    },
    {
      question: "Are Unix timestamps affected by timezones?",
      answer: "No, and that is the point. A timestamp is an instant in UTC, identical everywhere in the world. Timezones only matter when you render it for a person — which is why storing timestamps and formatting late is the standard advice.",
    },
  ],
};

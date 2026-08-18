import type { ToolContent } from "@/config/tool-content";

export const paceCalculatorContent: ToolContent = {
  steps: [
    "Pick what you want to work out — pace, time or distance.",
    "Enter the other two. Race distances are one click away.",
    "Read your pace in both units, plus splits and equivalent race times.",
  ],
  notes: [
    "Pace and speed are the same information the other way up. Pace is time per distance — minutes per kilometre — and gets smaller as you get faster. Speed is distance per time and gets larger. Runners think in pace because it is what you hold in your head during a race; cyclists think in speed. Both are shown, in both units.",
    "One thing to watch when reading a watch or a spreadsheet: times and paces are both written minutes-first. `50:00` in a time field means fifty minutes, and `5:00` in a pace field means five minutes per kilometre — the same notation meaning different magnitudes. Add a third part for hours: `1:45:30`.",
    "The race predictions are a straight extrapolation of your current pace, not a forecast. Nobody holds their 5K pace for a marathon — the usual rule of thumb is that each doubling of distance costs a few percent of pace, and the marathon costs considerably more than that if you have not trained for the distance. Treat the marathon row as an upper bound on optimism.",
    "The splits are even pacing, which is a useful target and rarely what happens. Most races are run slightly faster over the first kilometre than is wise, and the difference between an even split and a positive one is where most of the difficulty in the second half comes from.",
    "Nothing is stored or sent. Close the tab and it is gone.",
  ],
  faq: [
    {
      question: "What pace do I need to run a sub-4-hour marathon?",
      answer: "About 5:41 per kilometre, or 9:09 per mile. Set the distance to marathon and the time to 4:00:00 and the tool gives the exact figure — and the splits to hold it to.",
    },
    {
      question: "How do I convert min/km to min/mile?",
      answer: "Multiply by 1.609. Five minutes per kilometre is about 8:03 per mile. Both are shown here whichever unit you enter, so there is nothing to convert by hand.",
    },
    {
      question: "Are the race predictions reliable?",
      answer: "They are a straight extrapolation of the pace you entered, not a trained prediction. Real performance drops as distance rises — nobody holds 5K pace for a marathon — so treat longer distances as an optimistic ceiling rather than a target.",
    },
    {
      question: "Why does my time field read as minutes and not hours?",
      answer: "Because that is how runners write times. 50:00 is fifty minutes; for anything over an hour add a third part, as in 1:45:30. Pace fields are always minutes and seconds.",
    },
  ],
};

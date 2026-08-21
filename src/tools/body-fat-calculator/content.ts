import type { ToolContent } from "@/config/tool-content";

export const bodyFatCalculatorContent: ToolContent = {
  steps: [
    "Pick metric or imperial, and enter your height, waist and neck.",
    "Women also need a hip measurement — the formula differs.",
    "Add weight and age for the fat and lean mass split.",
  ],
  notes: [
    "This is the US Navy circumference method, which is the one worth implementing: it needs nothing but a tape measure and its published accuracy is around ±3–4% against hydrostatic weighing. That makes it genuinely useful for tracking a direction over months, and genuinely not precise enough to agonise over a single reading. A centimetre out on the waist moves the result by roughly a percentage point, so measure the same way each time and watch the trend rather than the number.",
    "How you hold the tape matters more than people expect. At the navel, level all the way round, at the end of a normal breath out — not pulled tight, and not with your stomach held in. Both of those make the number wrong in the flattering direction, which defeats the purpose of measuring at all.",
    "The BMI-derived estimate is included because people ask for it, and it is the weaker of the two. BMI cannot distinguish muscle from fat, so it overstates body fat for anyone muscular and understates it for someone sedentary at a normal weight. Where the two disagree, the tape is the one to trust.",
    "Worth saying about the categories: below the essential-fat range is a medical concern rather than an achievement. Essential fat is what the body needs to function, and people arriving at a page like this with a target in mind should know that the bottom of the scale is not the goal.",
    "An estimate rather than advice, and nothing you type leaves your browser.",
  ],
  faq: [
    {
      question: "How accurate is the Navy body fat method?",
      answer: "Around ±3–4% against hydrostatic weighing, which is good for a tape measure and not good enough to treat a single reading as precise. Its real value is consistency: measured the same way each time, the trend over months is reliable even if any one figure is a little off.",
    },
    {
      question: "How do I measure my waist correctly?",
      answer: "At the navel, tape level all the way round, at the end of a normal breath out. Do not pull it tight or hold your stomach in — both flatter the result and make the measurement useless for tracking.",
    },
    {
      question: "Why do women need a hip measurement?",
      answer: "Because the formula is different. The female version uses waist plus hip minus neck, where the male version uses waist minus neck, reflecting differences in where fat is typically distributed.",
    },
    {
      question: "Is body fat percentage better than BMI?",
      answer: "For most purposes yes, because BMI cannot tell muscle from fat. A muscular person is routinely classed as overweight by BMI and is nothing of the sort. The tape method measures something closer to what people actually mean.",
    },
    {
      question: "What is a healthy body fat percentage?",
      answer: "Broadly 14–24% for men and 21–31% for women, with athletic ranges below that. Essential fat — around 2–5% for men and 10–13% for women — is the physiological minimum, and going below it is a medical problem rather than a goal.",
    },
  ],
};

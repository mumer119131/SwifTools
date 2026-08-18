import type { ToolContent } from "@/config/tool-content";

export const sleepCalculatorContent: ToolContent = {
  steps: [
    "Choose whether you know your wake time or your bedtime.",
    "Enter it — 07:00, 7am and 10:45pm all work.",
    "Pick one of the suggested times to wake between cycles rather than inside one.",
  ],
  notes: [
    "Sleep runs in cycles of roughly ninety minutes, moving from light sleep down into deep sleep and back up again. Waking near the top of a cycle feels straightforward; being pulled out of deep sleep partway through produces the heavy, disoriented feeling known as sleep inertia, which can last twenty minutes or more. That is why six hours sometimes leaves you sharper than seven and a half.",
    "The suggestions add fifteen minutes for falling asleep, because going to bed is not the same as being asleep — counting from the moment your head hits the pillow puts every cycle boundary out by however long you lie there. Adjust that figure if you know you take longer.",
    "Ninety minutes is an average and not a constant. Real cycles run anywhere from seventy to a hundred and twenty minutes, vary between people, and lengthen across the night as deep sleep gives way to more REM. Treat these as sensible targets rather than precise instructions.",
    "The larger point is that timing does not create sleep. Five cycles well timed is still seven and a half hours; three cycles perfectly timed is still four and a half, and no amount of arithmetic makes that enough. Most adults need seven to nine hours, and the cycle counts marked as recommended here are the ones inside that range.",
  ],
  faq: [
    {
      question: "What time should I go to bed to wake up at 7am?",
      answer: "For six full cycles — about nine hours of sleep — around 21:45, allowing fifteen minutes to fall asleep. For five cycles, around 23:15. Both are shown here along with the shorter options.",
    },
    {
      question: "Why do I feel worse after more sleep sometimes?",
      answer: "Because an alarm went off in the middle of a cycle rather than between two. Being woken from deep sleep produces sleep inertia — grogginess that can last twenty minutes or more — and it happens regardless of how long you were asleep in total.",
    },
    {
      question: "Is a sleep cycle really ninety minutes?",
      answer: "On average. Individual cycles run roughly seventy to a hundred and twenty minutes and lengthen over the course of a night. Ninety is a reasonable planning figure, not a measurement of your own physiology.",
    },
    {
      question: "Does this mean six hours is better than seven?",
      answer: "Only in the narrow sense that four well-timed cycles may feel better on waking than an alarm mid-cycle. Total sleep still matters more — most adults need seven to nine hours, and good timing does not substitute for enough of it.",
    },
  ],
};

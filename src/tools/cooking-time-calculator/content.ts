import type { ToolContent } from "@/config/tool-content";

export const cookingTimeCalculatorContent: ToolContent = {
  steps: [
    "Choose what you are roasting and enter the weight in kilograms.",
    "Pick how you like it, where that applies — poultry and pork have one safe answer.",
    "Give a serving time and it works backwards to when it goes in.",
  ],
  notes: [
    "Time per kilogram is how recipes are written and it is a guide rather than a rule. A joint's thickness matters more than its mass — a long thin piece cooks faster than a compact one of the same weight — and a joint straight from the fridge takes noticeably longer than one that has stood at room temperature for an hour. Oven dials are also frequently 10 to 20°C out.",
    "Which is why the internal temperature is given the same prominence as the time. It is the only thing that actually determines whether meat is cooked, and a thermometer in the thickest part, away from bone, settles in seconds what a timer only estimates. If you roast more than a few times a year it is the single most useful thing you can buy for the job.",
    "Resting is not optional and it is not idle time. Muscle fibres contract during cooking and squeeze juices toward the centre; resting lets them relax and redistribute. Carve straight from the oven and a good deal of what you cooked ends up on the board. Twenty minutes for a joint, fifteen for a chicken, half an hour for a turkey — and the internal temperature continues to rise a few degrees during it, which is worth allowing for.",
    "Poultry and pork have no doneness setting here because there is only one safe answer. Chicken, turkey and duck want 75°C throughout; pork wants 71°C. Beef and lamb are the ones where preference genuinely applies.",
    "If your oven has a fan, use the lower temperature shown. A fan oven at the conventional figure runs hot, browning the outside well before the middle is done.",
  ],
  faq: [
    {
      question: "How long does a chicken take to cook?",
      answer: "About 45 minutes per kilogram at 190°C, plus 20 minutes — so roughly an hour and forty for a 1.8kg bird — then 15 minutes resting. What matters is 75°C in the thickest part of the thigh; the time is an estimate of when that will happen.",
    },
    {
      question: "What temperature should beef be inside?",
      answer: "50°C for rare, 55°C medium rare, 60°C medium, 70°C well done. Take it out a few degrees below your target — the temperature keeps climbing while it rests.",
    },
    {
      question: "Why does my roast take longer than the calculator says?",
      answer: "Usually because it went in cold. A joint straight from the fridge can take considerably longer than one left out for an hour. Oven dials being 10–20°C low is the other common reason, and an oven thermometer settles it.",
    },
    {
      question: "Do I really need to rest the meat?",
      answer: "Yes. Cooking drives juices toward the centre and resting lets them redistribute — carving immediately loses a noticeable amount onto the board. The internal temperature also rises a few degrees during the rest, which is part of the calculation.",
    },
    {
      question: "Why is there no rare option for pork or chicken?",
      answer: "Because there is only one safe answer. Poultry needs 75°C throughout and pork 71°C. Doneness is a genuine preference for beef and lamb, and a food safety question for the rest.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const ovenTemperatureConverterContent: ToolContent = {
  steps: [
    "Enter the temperature the recipe gives you.",
    "Say which scale it is in — Celsius, Fahrenheit, gas mark, or a fan setting.",
    "Read across. If your oven has a fan, use the fan figure, not the first one.",
  ],
  notes: [
    "The conversion that actually matters is the fan one, and it is the one recipes most often omit. A fan or convection oven circulates air, and moving air transfers heat far more effectively than still air — so a fan oven set to the temperature a conventional recipe specifies runs genuinely hot. The standard adjustment is 20°C lower. Ignore it and cakes brown before they rise, pastry colours before it cooks through, and a roast develops a crust while the middle is still raw.",
    "If you would rather keep the temperature than lower it, reduce the time instead — roughly three quarters of what the recipe says, checking early. What you cannot do is neither.",
    "Gas marks are not a formula. They are a defined table with uneven steps, so there is no arithmetic that converts one to a temperature — anything claiming otherwise is fitting a line to points that were never on one. The table here is the standard British one.",
    "The Fahrenheit figures are the rounded ones recipes actually print rather than exact conversions. 140°C is written as 275°F in every cookbook, though the precise conversion is 284°F. Following the printed convention keeps you aligned with the recipe you are reading.",
    "One thing no converter can fix: oven dials are frequently 10 to 20°C out, and older ovens can be further. An oven thermometer costs very little and is the only way to know what your oven is actually doing — which matters far more than the precision of any conversion.",
  ],
  faq: [
    {
      question: "What is gas mark 4 in Celsius?",
      answer: "180°C in a conventional oven, or 160°C in a fan oven. It is the most common baking temperature — most cakes and biscuits are written for it.",
    },
    {
      question: "What temperature should I use for a fan oven?",
      answer: "20°C lower than the recipe states. A recipe calling for 200°C needs 180°C in a fan oven. Alternatively keep the temperature and cut the time to about three quarters — but do one or the other, not neither.",
    },
    {
      question: "Why does my fan oven burn things?",
      answer: "Almost certainly because the recipe's temperature is being used unadjusted. Circulating air transfers heat much more efficiently than still air, so the same dial setting cooks considerably harder — browning the outside before the inside is done.",
    },
    {
      question: "Is there a formula for gas marks?",
      answer: "No. The scale has uneven steps and is defined by a table rather than an equation, so any formula is an approximation fitted to points that were never on a line. This uses the standard table and interpolates only between marks.",
    },
    {
      question: "Why is 140°C given as 275°F rather than 284°F?",
      answer: "Because that is what recipes print. The exact conversion is 284°F, but cookbooks use rounded conventional settings, and following them keeps you consistent with whatever recipe you are reading.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const energyConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "All of these measure the same quantity, and the joule is the SI unit against which the rest are defined. The variety exists because different fields settled on different scales before anyone unified them — chemistry took the calorie, electricity the kilowatt-hour, and heating engineering the BTU.",
    "The calorie is the one that causes genuine confusion, because there are two. The scientific calorie is 4.184 joules, the energy to warm a gram of water by one degree. The food Calorie — capitalised, and what every nutrition label means — is a kilocalorie, a thousand of those. So a 250 Calorie snack is 250 kcal, or about 1,046 kJ, which is why European labels showing kilojoules produce such alarming numbers for the same food.",
    "The kilowatt-hour is not a rate despite containing a rate. It is a power multiplied by a time, so a 1 kW appliance running for one hour uses one kWh — and it is the unit your electricity bill counts, which makes it the most economically significant energy unit most people encounter.",
    "For a sense of scale: a kilowatt-hour is 3.6 million joules, roughly the energy in a large chocolate bar, and about what it takes to boil ten kettles of water.",
  ],
  faq: [
    {
      question: "Is a food Calorie the same as a calorie?",
      answer: "No, and the difference is a factor of a thousand. A food Calorie is a kilocalorie — the scientific calorie is the energy to warm one gram of water by one degree. A 250 Calorie snack is 250 kcal, or about 1,046 kJ.",
    },
    {
      question: "How many joules is 1 kWh?",
      answer: "3.6 million. A kilowatt-hour is a kilowatt sustained for an hour, so 1,000 watts times 3,600 seconds. It is the unit your electricity meter counts.",
    },
    {
      question: "Why do European food labels show kilojoules?",
      answer: "Because the kilojoule is the SI unit and EU labelling requires it. The numbers look alarming only because a kilojoule is smaller than a Calorie — 2,000 Calories is about 8,400 kJ, describing exactly the same food.",
    },
    {
      question: "What is a BTU?",
      answer: "The energy to raise one pound of water by one degree Fahrenheit — about 1,055 joules. It survives in heating and air conditioning, where equipment is still sized in BTU or BTU per hour.",
    },
  ],
};

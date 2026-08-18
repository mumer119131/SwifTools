import type { ToolContent } from "@/config/tool-content";

export const electricityCostCalculatorContent: ToolContent = {
  steps: [
    "Pick an appliance or type in its wattage.",
    "Set how many hours a day it runs and your rate per kWh.",
    "You get the cost per day, month and year, and the energy used.",
  ],
  notes: [
    "Cost is watts times hours divided by 1,000, times your rate per kilowatt-hour — because the kilowatt-hour is the only unit an electricity bill is actually charged in. A 1,500 W heater running six hours a day uses 9 kWh, which at 17 cents is about $1.53 a day and $559 a year.",
    "Nameplate wattage is the maximum draw, not the average. Anything that cycles — a fridge, a freezer, an air conditioner — runs its compressor perhaps a third of the time, so its real consumption is well below the rating.",
    "Anything with a heating element is the opposite: a kettle, a dryer, an oven or a space heater draws close to its full rating for the entire time it is on. That is why a handful of appliances dominate a bill while a dozen low-power devices barely register.",
  ],
  faq: [
    {
      question: "How do I calculate the cost of running an appliance?",
      answer: "Watts times hours used, divided by 1,000, times your rate per kilowatt-hour. A 1,500 W heater for six hours is 9 kWh a day, which at 17 cents is about $1.53.",
    },
    {
      question: "What uses the most electricity in a home?",
      answer: "Heating and cooling, then water heating, then anything else with a heating element — dryer, oven, kettle. Electronics and lighting are usually a small fraction by comparison.",
    },
    {
      question: "Does leaving things on standby cost much?",
      answer: "Individually, very little — a few watts each. Collectively across a whole house it typically adds up to 5 to 10 percent of a bill, which is real but far less than a single space heater.",
    },
    {
      question: "Why is my actual bill higher than this estimate?",
      answer: "Because a bill includes standing charges, taxes and often tiered rates that rise above a usage threshold. This calculates the energy cost of one appliance, not the whole bill.",
    },
    {
      question: "Do appliances use their full rated wattage?",
      answer: "Only those with heating elements. Anything with a compressor — fridge, freezer, air conditioner — cycles on and off and averages roughly a third of its rating over a day.",
    },
  ],
};

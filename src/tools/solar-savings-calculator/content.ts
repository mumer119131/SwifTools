import type { ToolContent } from "@/config/tool-content";

export const solarSavingsCalculatorContent: ToolContent = {
  steps: [
    "Enter your monthly bill or kWh usage and your electricity rate.",
    "Set the peak sun hours where you live and the system cost per watt.",
    "You get system size, panel count, payback period and 25-year savings.",
  ],
  notes: [
    "System size comes from your annual consumption divided by the energy one kilowatt of panels produces where you live: peak sun hours times 365, times a derate factor of about 0.8 for inverter losses, wiring, dust, heat and shading. That 20 percent loss is standard and leaving it out overstates production badly.",
    "Payback is not cost divided by first-year savings. Electricity prices rise while panel output slowly falls — about half a percent a year — and the two do not cancel. The year-by-year table is where the break-even point is actually read from.",
    "The largest uncertainty is what you are paid for what you export. Where net metering credits at the full retail rate, every kilowatt-hour offsets one you would have bought. Where export is paid at a lower rate, savings are materially lower and depend on how much you use during daylight. A quote from an installer who has seen your roof beats any of this.",
  ],
  faq: [
    {
      question: "How many solar panels do I need?",
      answer: "Divide annual consumption by peak sun hours times 365 times 0.8 to get the kilowatts needed, then divide by panel wattage. A home using 12,000 kWh with 4.5 sun hours needs about 9 kW, or 23 panels at 400 W.",
    },
    {
      question: "How long does solar take to pay for itself?",
      answer: "Typically 7 to 12 years depending on your rate, sun hours, system cost and incentives. It is not cost divided by first-year savings — prices rise and output falls, so the break-even year has to be read from a year-by-year projection.",
    },
    {
      question: "What are peak sun hours?",
      answer: "The equivalent hours per day of full-strength sunlight, accounting for the sun's angle through the day. It ranges from about 3.2 in northern Europe or the Pacific Northwest to 6 in desert regions.",
    },
    {
      question: "Why is 20 percent deducted from the panel rating?",
      answer: "Because inverter losses, wiring resistance, dust, heat and shading all reduce real output below the laboratory rating. A derate factor of 0.8 is the industry standard first approximation.",
    },
    {
      question: "Does net metering affect the savings?",
      answer: "Substantially. Where exports are credited at the full retail rate, everything you generate offsets what you would have bought. Where they are paid less, savings depend on how much you consume during daylight hours.",
    },
  ],
};

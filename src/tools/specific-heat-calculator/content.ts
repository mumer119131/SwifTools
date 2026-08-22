import type { ToolContent } from "@/config/tool-content";

export const specificHeatCalculatorContent: ToolContent = {
  steps: [
    "Enter any three of heat energy, mass, specific heat capacity and temperature change.",
    "Common materials are listed below if you need a capacity.",
    "The result is converted into calories, watt-hours and kettle seconds.",
  ],
  notes: [
    "Q = mcΔT gives the energy needed to change something's temperature. Specific heat capacity is the property that distinguishes materials — how much energy a kilogram of it needs to warm by one degree — and the range is wider than people expect.",
    "Water is the outlier, at 4,181 joules per kilogram per kelvin, roughly ten times copper. That single fact explains a great deal: why water is used as a coolant, why coastal climates are milder than inland ones, why a kettle takes a couple of minutes when a hair dryer heats air instantly, and why the sea is still cold in June.",
    "A useful detail: ΔT can be entered in Celsius or kelvin interchangeably, because it is a difference rather than a temperature. The two scales have the same size degree and differ only in where zero sits, so the offset cancels. That is not true of the ideal gas law, where absolute temperature genuinely matters.",
    "One limitation worth knowing: this covers heating and cooling within a single phase. Melting or boiling needs the latent heat instead, which is energy that changes state at constant temperature — and for water the latent heat of vaporisation is more than five times the energy needed to take it from freezing to boiling.",
  ],
  faq: [
    {
      question: "How do you calculate heat energy?",
      answer: "Q = mcΔT — mass times specific heat capacity times temperature change. Heating one kilogram of water by ten degrees takes 41,810 joules, which a 3 kW kettle supplies in about fourteen seconds.",
    },
    {
      question: "What is the specific heat capacity of water?",
      answer: "4,181 J/kg·K, which is unusually high — around ten times copper. It is why water is used as a coolant, why coastal climates are mild, and why kettles take as long as they do.",
    },
    {
      question: "Can I use Celsius for the temperature change?",
      answer: "Yes. A change of one kelvin is a change of one degree Celsius, so a difference is the same number in either scale. That is not true of absolute temperature, which is why the ideal gas law insists on kelvin.",
    },
    {
      question: "Does this work for melting or boiling?",
      answer: "No — those need latent heat, which changes state at constant temperature. This covers heating and cooling within one phase. For water, boiling it takes over five times the energy needed to warm it from freezing to boiling point.",
    },
  ],
};

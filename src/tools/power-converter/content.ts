import type { ToolContent } from "@/config/tool-content";

export const powerConverterContent: ToolContent = {
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
  notes: [
    "Power is the rate of doing work — energy per unit of time — which is why watts and horsepower measure the same thing despite feeling like they belong to different worlds. A watt is one joule per second, and everything else here is a multiple of it.",
    "There are two horsepowers and they differ by about 1.4%, which sounds trivial and is not when comparing car figures. Mechanical horsepower is 745.7 W and is what British and American figures use. Metric horsepower — written PS in Germany or CV in France and Italy — is 735.5 W, defined as the power to lift 75 kg by one metre in one second. A car quoted at 200 PS is about 197 hp, so the German figure always looks slightly better.",
    "BTU per hour is the unit air conditioning and heating are sold in, particularly in North America. A 12,000 BTU/h unit — often called a one-ton unit, from the rate at which it would melt a ton of ice in a day — is about 3.5 kW.",
    "One practical note about electrical appliances: the wattage on a label is the power it draws, and multiplying by hours gives the energy in watt-hours, which is what the bill is based on. A 2 kW heater run for three hours uses 6 kWh regardless of how warm the room gets.",
  ],
  faq: [
    {
      question: "How many kW is 1 horsepower?",
      answer: "0.7457 kW for mechanical horsepower, which is what British and American figures use. Metric horsepower — PS or CV — is 0.7355 kW, about 1.4% smaller, so a car quoted in PS always looks marginally more powerful than the same car quoted in hp.",
    },
    {
      question: "What is the difference between hp and PS?",
      answer: "Mechanical horsepower is 745.7 W; metric horsepower is 735.5 W, defined as lifting 75 kg one metre in one second. A car rated 200 PS is about 197 hp. Both are converted here.",
    },
    {
      question: "What does BTU per hour mean on an air conditioner?",
      answer: "It is the rate at which the unit moves heat. 12,000 BTU/h is about 3.5 kW, and is often called a one-ton unit — from the rate that would melt a ton of ice in a day.",
    },
    {
      question: "Is power the same as energy?",
      answer: "No. Power is the rate of using energy. A 2 kW heater draws 2 kW whenever it is on; run it for three hours and it uses 6 kWh of energy, which is what the bill counts.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const pressureCalculatorContent: ToolContent = {
  steps: [
    "Enter a pressure and choose the units to convert between.",
    "Every other unit is listed underneath, so you rarely need a second conversion.",
    "Common reference pressures are shown for a sense of scale.",
  ],
  notes: [
    "Pressure is force per unit area, so the same force spread over a smaller area produces higher pressure. That is why a drawing pin works and why snowshoes stop you sinking — neither changes the force involved, only the area it acts over.",
    "The units are a mess for historical reasons. The SI unit is the pascal, one newton per square metre, which is tiny — atmospheric pressure is about 101,325 pascals. So bar, atmospheres, PSI, millimetres of mercury and inches of water all persist in different industries, and converting between them is most of the work.",
    "Gauge and absolute pressure are the distinction that causes real errors. A tyre gauge reads gauge pressure, meaning pressure above atmospheric, so a tyre at 32 PSI is actually at about 47 PSI absolute. Mixing the two in a calculation is a classic and expensive mistake.",
  ],
  faq: [
    {
      question: "What is the difference between gauge and absolute pressure?",
      answer: "Gauge pressure is measured relative to atmospheric; absolute is measured from a vacuum. A tyre reading 32 PSI on a gauge is at about 47 PSI absolute — the two differ by one atmosphere, roughly 14.7 PSI.",
    },
    {
      question: "How do I convert PSI to bar?",
      answer: "Divide by 14.5038. One bar is 100,000 pascals and very close to one atmosphere, which is why European tyre pressures in bar look so much smaller than the same pressure in PSI.",
    },
    {
      question: "What is atmospheric pressure?",
      answer: "101,325 pascals at sea level by definition, which is 1.01325 bar, 14.696 PSI or 760 mmHg. It falls with altitude — roughly 12 percent lower in Denver and about a third of sea level at the summit of Everest.",
    },
    {
      question: "Why are there so many pressure units?",
      answer: "Because different industries standardised separately before SI existed. Medicine uses mmHg, meteorology uses hectopascals, tyres use PSI or bar, and plumbing uses feet or inches of water — each convenient for its own measurements.",
    },
    {
      question: "How does pressure relate to force and area?",
      answer: "Pressure is force divided by area, so reducing the area raises the pressure for the same force. That is the whole principle behind a knife blade, a drawing pin and, in reverse, snowshoes.",
    },
  ],
};

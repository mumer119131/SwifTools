import type { ToolContent } from "@/config/tool-content";

export const tipCalculatorContent: ToolContent = {
  steps: [
    "Enter the bill, and the tax separately if you want to tip on the pre-tax amount.",
    "Pick a tip percentage and how many people are splitting it.",
    "Round the total or each share up so the collected money covers the bill.",
  ],
  notes: [
    "Whether the tip goes on the subtotal or the full bill is a real choice, not a rounding detail. In a US state with 9% sales tax, tipping 20% on the total rather than the subtotal adds about 1.8% of the bill — trivial on a coffee and meaningful on a table of eight. Tipping on the pre-tax amount is the more common convention and is what this defaults to when a tax figure is entered.",
    "Rounding per person is the option worth knowing about. Rounding the total up and dividing still leaves fractional shares, so somebody ends up owing 14.37 and the collection comes up short. Rounding each share up to the next whole unit means the money collected always covers the bill, with the small surplus going to the tip — which is what happens in practice when everyone hands over a round number anyway.",
    "The effective tip percentage is shown after rounding, because rounding changes it. Rounding a £47.30 total up to £48 on a £40 subtotal turns an intended 12.5% into 20%, and it is worth seeing that rather than discovering it later.",
  ],
  faq: [
    {
      question: "Should I tip on the pre-tax or post-tax amount?",
      answer: "Pre-tax is the more common convention, and it is the one that makes sense — the tax is not part of the service. On a bill with 9% sales tax, tipping 20% post-tax rather than pre-tax adds roughly 1.8% of the total, which matters more as the bill grows.",
    },
    {
      question: "How much should I tip?",
      answer: "It depends entirely on where you are. 18 to 22 percent is expected in the United States and Canada, 10 to 12.5 in the UK where it is often already added as a service charge, 5 to 10 in much of Europe where service is included, and nothing at all in Japan, where tipping can cause offence.",
    },
    {
      question: "How do I split a bill evenly?",
      answer: "Enter the number of people and each share is shown. Turning on per-person rounding rounds each share up to the next whole unit, so the money collected always covers the bill — the alternative leaves the organiser making up a shortfall of a few pence per head.",
    },
    {
      question: "What is a service charge and should I still tip?",
      answer: "A service charge is a percentage the restaurant adds itself, common in the UK and parts of Europe and usually 12.5 percent. If one is on the bill you have already tipped, and adding more is optional. Check the bill before assuming — it is often printed in small type.",
    },
    {
      question: "Does rounding change the tip percentage?",
      answer: "Yes, sometimes considerably. Rounding a total up on a small bill can turn an intended 12.5 percent into 20. The effective percentage after rounding is shown so you can see what you are actually leaving.",
    },
  ],
};

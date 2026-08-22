import type { ToolContent } from "@/config/tool-content";

export const clothingSizeConverterContent: ToolContent = {
  steps: [
    "Choose women's or men's, and tops or bottoms — the scales differ.",
    "Enter a size you know, or a body measurement in centimetres.",
    "Check the measurement column against the brand's own chart before ordering.",
  ],
  notes: [
    "Clothing sizes are less standardised than shoes, which is saying something. UK, US and EU numbering derive from nothing consistent, there is no body that enforces them, and manufacturers set their own. Vanity sizing — the slow drift of a given number toward larger measurements — means a size 12 today is a materially different garment from a size 12 twenty years ago, and the drift has not stopped.",
    "So the body measurement is the figure that means anything, and the number is a convention. The tables here say what the labels usually correspond to; the chest and waist columns say what will actually fit. Most brands publish their own chart in centimetres, and comparing against that is the only approach that reliably works.",
    "A single alpha size routinely covers two numeric ones — a women's small spans UK 8 and 10, a medium spans 12 and sometimes 14. That is why S/M/L is the least reliable way to buy anything, and why a medium from one brand and a medium from another can be a full size apart.",
    "Italian sizing runs four above the EU number for women's clothing, which catches people out buying from Italian labels: an EU 40 is an Italian 44. Men's Italian sizing follows the EU convention more closely.",
    "Measure over the underwear you would wear with the garment, with the tape level and not pulled tight. Measuring over a jumper adds several centimetres and produces a size that will be loose on everything else.",
  ],
  faq: [
    {
      question: "What is a UK 12 in US sizes?",
      answer: "A US 8 for women's clothing, or EU 40 and Italian 44. Bear in mind these are conventions rather than standards — the chest measurement of 92–95cm is what will actually determine the fit.",
    },
    {
      question: "Why do sizes vary so much between brands?",
      answer: "Because nothing obliges them to agree. There is no enforced standard, each manufacturer chooses its own measurements, and vanity sizing has been shifting the numbers larger for decades. Checking the brand's own chart in centimetres is the only reliable method.",
    },
    {
      question: "Why is Italian sizing different?",
      answer: "Italian women's sizing runs four above the EU number — an EU 40 is an Italian 44. It catches people out ordering from Italian labels. Men's Italian sizing follows the EU convention much more closely.",
    },
    {
      question: "Is a medium the same everywhere?",
      answer: "No, and it is the least reliable size label there is. A single alpha size covers two numeric sizes in most charts, so two mediums from different brands can be a full size apart before any brand-specific variation.",
    },
    {
      question: "How should I measure myself?",
      answer: "Over the underwear you would wear with the garment, tape level and not pulled tight. Chest at the fullest part with arms down, waist at the narrowest point, hips at the fullest. Measuring over a jumper adds centimetres and gives a size that fits nothing.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const vatCalculatorContent: ToolContent = {
  steps: [
    "Choose whether you are adding VAT to a net price or taking it out of a gross one.",
    "Enter the amount and the rate — the common ones are one click away.",
    "Copy whichever of the three figures your invoice needs.",
  ],
  notes: [
    "Adding VAT is the easy direction and almost nobody gets it wrong: multiply by the rate and add it on. Taking VAT back out of a tax-inclusive price is where the mistake lives, and it is close to universal.",
    "To remove 20% VAT from £120 you divide by 1.2, giving £100. Subtracting 20% instead gives £96, which is wrong — the percentage was applied to the £100, not to the £120, so taking it off the larger number takes too much. The error is only about 4%, which is exactly what makes it dangerous: it survives a glance at the figure, and across a year of invoices it adds up to real money and a real correction. This tool shows the wrong answer alongside the right one when you are working backwards, because seeing the difference is what makes it stick.",
    "There is a shortcut worth knowing. At 20%, VAT is exactly one sixth of the gross price — so the tax on a £30 receipt is £5, in your head, with no calculator. That works because 20/120 reduces to 1/6. At 23% it is not tidy, which is why the tool shows the fraction when there is one.",
    "The rates listed are current standard rates for common jurisdictions, but which rate applies depends entirely on what is being sold — food, books, children's clothing, energy and medical supplies are all treated differently in most systems. Nothing here is tax advice, and an unusual product is worth checking against your own tax authority.",
    "Everything is calculated in your browser. Nothing you type about your invoices goes anywhere.",
  ],
  faq: [
    {
      question: "How do I remove VAT from a price?",
      answer: "Divide by 1 plus the rate. For 20% VAT, divide the gross price by 1.2 — £120 becomes £100. Do not subtract 20%, which gives £96 and is wrong, because the percentage applies to the net figure rather than the gross one.",
    },
    {
      question: "Why is subtracting the percentage wrong?",
      answer: "Because the VAT was calculated on the smaller number. £100 plus 20% is £120, so the £20 of tax is 20% of £100 — but only about 16.7% of £120. Taking 20% off £120 removes too much and leaves you 4% short.",
    },
    {
      question: "What is the quick way to work out 20% VAT in my head?",
      answer: "It is one sixth of the gross price. A £30 total contains £5 of VAT. That works because 20/120 simplifies to 1/6, and it makes checking a receipt trivial.",
    },
    {
      question: "Does this work for GST and sales tax?",
      answer: "Yes — the arithmetic is identical whatever it is called. Set the rate to your own and use the same two directions. Note that US sales tax is normally quoted exclusive of tax, so adding is usually the direction you want there.",
    },
    {
      question: "Which VAT rate should I use?",
      answer: "It depends on what you are selling, not just where. Most systems have reduced or zero rates for food, books, children's clothing and energy. The presets here are standard rates; check anything unusual with your tax authority.",
    },
  ],
};

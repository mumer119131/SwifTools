import type { ToolContent } from "@/config/tool-content";

export const taxCalculatorContent: ToolContent = {
  steps: [
    "Enter your gross annual income and pick a tax system.",
    "See the tax owed in each band, your effective rate and what lands in your account.",
    "Or build your own bands to model a system that isn't listed.",
  ],
  notes: [
    "Income tax in most countries is progressive, which means the rate applies to bands rather than to the whole income. Entering a higher tax bracket does not tax everything you earn at the higher rate — only the portion inside that band — so a pay rise can never leave you with less money after tax.",
    "This is the single most persistent misconception about income tax, and it causes people to turn down raises and overtime. The marginal rate is what you pay on the next pound; the effective rate is what you pay across the whole income, and it is always lower.",
    "The figures here are an estimate from the bands you choose. Real tax depends on allowances, pension contributions, student loan repayments, national insurance or social security, and any credits you qualify for — none of which a general calculator can know.",
  ],
  faq: [
    {
      question: "Will a pay rise put me in a higher tax bracket and leave me worse off?",
      answer: "No. Tax bands apply to portions of income, not the whole of it, so only the amount above the threshold is taxed at the higher rate. You always keep more after a rise than before it.",
    },
    {
      question: "What is the difference between marginal and effective tax rate?",
      answer: "The marginal rate is what you pay on the next pound earned; the effective rate is total tax divided by total income. Because lower bands are taxed less, the effective rate is always below the marginal one.",
    },
    {
      question: "Why is my take-home pay lower than this estimate?",
      answer: "Because income tax is only part of the deduction. National insurance or social security, pension contributions and student loan repayments come out separately and are not included in a tax-band calculation.",
    },
    {
      question: "Are tax deductions the same as tax credits?",
      answer: "No. A deduction reduces the income being taxed, so it saves you your marginal rate on that amount. A credit reduces the tax bill directly, so it is worth its full value — which usually makes a credit the more valuable of the two.",
    },
    {
      question: "Can I rely on this for filing a tax return?",
      answer: "No. It is an estimate from standard bands and cannot know your allowances, reliefs or circumstances. Use your tax authority's own calculator or an accountant for anything you have to file.",
    },
  ],
};

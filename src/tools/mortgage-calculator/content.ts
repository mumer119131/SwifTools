import type { ToolContent } from "@/config/tool-content";

export const mortgageCalculatorContent: ToolContent = {
  steps: [
    "Enter the property price, your deposit, the rate and the term.",
    "Add property tax, insurance and anything else recurring for the real monthly figure.",
    "Try an overpayment to see how much time and interest it removes.",
  ],
  notes: [
    "Three questions come up around a mortgage, and only the first is a payment calculation. How much am I actually borrowing once the deposit is counted, and what LTV band does that put me in. What does the house cost me every month once tax and insurance are added. And what happens if I pay a bit extra. This answers all three; a plain loan calculator answers the first.",
    "Loan to value matters more than people expect, because lenders price it in steps rather than smoothly. The rate available at 80% is meaningfully better than at 81%, and the gap between 90% and 85% is usually larger than a year of saving feels like it should be. If you are close to a boundary, a slightly larger deposit can be worth more than negotiating on the rate.",
    "The overpayment figures are the ones worth sitting with. Every extra pound comes off the balance immediately, so all the interest that pound would have attracted for the remaining twenty-odd years disappears with it. That is why the effect looks disproportionate, and why the same money paid early is worth far more than paid late. Check your lender's terms first: most allow overpayments of up to 10% of the balance a year without penalty, and charge for anything above that.",
    "The total monthly outlay is the figure to compare against rent, rather than the mortgage payment on its own. Tax, insurance, service charges and ground rent are not optional and not part of the loan, and leaving them out is how a budget that looked comfortable stops being one.",
    "This is an estimate. Lenders apply their own affordability rules, arrangement fees and stress tests — a rate quoted today is checked against your ability to pay at a considerably higher one. Nothing here is advice, and nothing you type is sent anywhere.",
  ],
  faq: [
    {
      question: "How much difference does overpaying actually make?",
      answer: "More than most people expect. An overpayment comes off the balance immediately, so it removes every year of interest that money would otherwise have attracted. On a 25-year mortgage a modest monthly overpayment commonly takes several years off the term and saves tens of thousands in interest.",
    },
    {
      question: "What is loan to value and why does it matter?",
      answer: "The loan as a percentage of the property price — borrow £240,000 on a £300,000 house and your LTV is 80%. It matters because lenders price in bands, so crossing from 81% to 80% can move you to a better rate in a way that gradual improvement does not.",
    },
    {
      question: "Should I compare the mortgage payment against my rent?",
      answer: "Compare the total monthly outlay instead. Property tax, insurance, service charges and maintenance are not part of the loan and not optional, and a payment that looks lower than rent often is not once they are counted.",
    },
    {
      question: "Is there a limit on overpayments?",
      answer: "Usually. Most lenders permit up to 10% of the outstanding balance each year without penalty and charge an early repayment fee above that. Check your own terms before committing to a figure.",
    },
    {
      question: "How is this different from the loan calculator?",
      answer: "The loan calculator answers what a given amount costs per month and produces a full amortisation schedule. This one starts from a property price and deposit, works out the LTV band, adds the running costs that are not part of the loan, and shows what overpaying would save.",
    },
  ],
};

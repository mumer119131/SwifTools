import { Landmark } from "lucide-react";

import type { Tool } from "@/config/tools";

export const loanCalculator: Tool = {
  slug: "loan-calculator",
  name: "Loan & EMI Calculator",
  category: "calculator",
  description: "Work out monthly payments, total interest and a full amortisation schedule.",
  keywords: ["loan calculator", "emi calculator", "mortgage calculator", "amortisation schedule"],
  icon: Landmark,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Enter the amount borrowed, the annual interest rate and the term in years.",
    "The monthly payment, total interest and total repaid are calculated instantly.",
    "Expand the schedule to see how each payment splits between interest and principal.",
  ],
  notes: [
    "The monthly payment comes from the standard amortisation formula, which finds the fixed amount that pays off the principal and all the interest over the term. Because the balance shrinks with every payment, the interest portion falls and the principal portion rises even though the payment itself never changes.",
    "That shape is why the early years of a long loan feel like they achieve nothing. On a 30-year mortgage at typical rates, roughly two thirds of the first year's payments are interest, and it takes close to two decades before more than half of a payment is going to the principal.",
    "It is also why overpaying early is so much more effective than overpaying late. A pound of extra principal in year one saves interest on that pound for 29 remaining years; the same pound in year 25 saves five years of interest. The schedule here shows exactly where that crossover sits for your numbers.",
  ],
  faq: [
    {
      question: "How is a monthly loan payment calculated?",
      answer: "From the amortisation formula, which solves for the fixed payment that clears both principal and interest over the term. The payment stays constant while its split shifts — mostly interest early on, mostly principal later.",
    },
    {
      question: "Why is so much of my early payment interest?",
      answer: "Interest is charged on the outstanding balance, which is at its largest at the start. On a 30-year mortgage about two thirds of the first year goes to interest, and it takes nearly two decades before the majority goes to principal.",
    },
    {
      question: "Is it better to overpay a loan early or late?",
      answer: "Early, and by a wide margin. Extra principal in year one avoids interest on that amount for every remaining year; the same amount in the final years avoids very little. The schedule shows the effect on your own figures.",
    },
    {
      question: "What is the difference between APR and interest rate?",
      answer: "The interest rate is the cost of borrowing alone. APR folds in arrangement fees and compulsory charges, so it is the fairer number for comparing offers — a low rate with a high fee can be the more expensive loan.",
    },
    {
      question: "Does a shorter term save money?",
      answer: "Substantially. A 15-year mortgage has a higher monthly payment but often less than half the total interest of a 30-year one, because the balance is being reduced far faster throughout.",
    },
  ],
};

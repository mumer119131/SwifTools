import { PiggyBank } from "lucide-react";

import type { Tool } from "@/config/tools";

export const budgetTracker: Tool = {
  slug: "budget-tracker",
  name: "Budget Tracker",
  category: "fun",
  description: "A monthly budget: income against categorised spending, with what's left over.",
  keywords: [
    "budget tracker",
    "monthly budget planner",
    "expense tracker",
    "budget calculator",
    "50 30 20 budget",
    "personal budget spreadsheet",
  ],
  icon: PiggyBank,
  processing: "client",
  status: "live",
  steps: [
    "Enter your monthly income and list what you spend.",
    "Each line is categorised, and the split is shown against the 50/30/20 rule.",
    "Everything is saved in this browser — nothing is uploaded.",
  ],
  notes: [
    "Income against categorised spending, with everything sorted into needs, wants and savings. The 50/30/20 split is shown as a reference point, and it is worth saying that it is a starting shape rather than a rule — it was written for a housing market that no longer exists in most cities, and needs routinely run past 50 percent through no fault of the person paying them.",
    "The number worth improving is the savings share, and unspent income counts towards it. Money not allocated to anything is money not yet spent.",
    "Everything stays in this browser. No account, no bank connection, nothing uploaded — which is the only arrangement under which typing your actual income into a web page is sensible.",
  ],
  faq: [
    {
      question: "What is the 50/30/20 budget rule?",
      answer: "Fifty percent of after-tax income to needs, thirty to wants and twenty to savings and debt repayment. It is a useful starting shape rather than a rule, and needs commonly exceed 50 percent in expensive housing markets.",
    },
    {
      question: "What counts as a need versus a want?",
      answer: "Needs are what you cannot stop paying without serious consequence — housing, utilities, food, transport, minimum debt payments. Wants are everything discretionary, including the subscriptions that feel automatic.",
    },
    {
      question: "Is my financial data uploaded?",
      answer: "No. There is no bank connection and no server — everything stays in this browser, which is the only sensible arrangement for typing your real income into a web page.",
    },
    {
      question: "What should my savings rate be?",
      answer: "Twenty percent is the conventional target, and any consistent figure beats an inconsistent larger one. Unspent income counts too — money left unallocated at the end of the month is money not yet spent.",
    },
    {
      question: "Why does my budget never balance?",
      answer: "Usually because irregular costs are not budgeted — annual insurance, car repairs, gifts. Dividing those by twelve and treating them as monthly is what turns a budget that keeps failing into one that holds.",
    },
  ],
};

import { ListChecks } from "lucide-react";

import type { Tool } from "@/config/tools";

export const toDoList: Tool = {
  slug: "to-do-list",
  name: "To-Do List",
  category: "fun",
  description: "A simple to-do list with priorities that stays in your browser — no account.",
  keywords: [
    "to do list",
    "todo list online",
    "task list maker",
    "simple todo app",
    "checklist online",
    "free to do list",
  ],
  icon: ListChecks,
  processing: "client",
  status: "live",
  steps: [
    "Add tasks and set a priority on the ones that need it.",
    "Tick them off as you go — everything is saved as you type.",
    "Filter to what is left, or clear the done ones out.",
  ],
  notes: [
    "Tasks with three priority levels, saved in this browser as you type. The list sorts unfinished work first and then by priority, which is the order you would actually read it in.",
    "There is no account and nothing is uploaded. That is the trade: it works instantly and asks nothing of you, and it is gone if you clear site data or switch device. Copy the list out if it matters.",
    "Three priority levels is deliberate. More than that and the distinction stops meaning anything — every task drifts towards the top, which is the failure mode of every priority system with too many levels.",
  ],
  faq: [
    {
      question: "Is my to-do list saved between visits?",
      answer: "Yes, in this browser's local storage. It survives closing the tab but does not sync to other devices, and clearing site data removes it.",
    },
    {
      question: "Why only three priority levels?",
      answer: "Because more stops meaning anything. With five or six levels everything drifts upward until the top band is full, which is the standard failure mode of over-granular priority systems.",
    },
    {
      question: "Can I filter to just unfinished tasks?",
      answer: "Yes — all, active or done. Completed tasks can also be cleared in one action once you no longer want to see them.",
    },
    {
      question: "Does it need an account?",
      answer: "No. There is no sign-up, no server and nothing uploaded, which is why it opens and works immediately — and why it cannot follow you to another device.",
    },
    {
      question: "Can I export my list?",
      answer: "Copy it as plain text with tick boxes, which pastes into a note, an email or a document. That is more portable than any format tied to this page.",
    },
  ],
};

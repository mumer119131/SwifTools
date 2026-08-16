import { Truck } from "lucide-react";

import type { Tool } from "@/config/tools";

export const movingChecklist: Tool = {
  slug: "moving-checklist",
  name: "Moving Checklist",
  category: "home",
  description: "A week-by-week moving house checklist that remembers what you have ticked off.",
  keywords: [
    "moving checklist",
    "moving house checklist",
    "relocation checklist",
    "packing checklist",
    "change of address checklist",
    "moving day timeline",
  ],
  icon: Truck,
  processing: "client",
  status: "live",
  steps: [
    "Set your moving date and the timeline reflows around it.",
    "Tick things off as you go — everything is saved in this browser.",
    "Add your own tasks to any stage, and copy the whole list out when you need it.",
  ],
  notes: [
    "The tasks are ordered by when they have to happen rather than by category, because the failure mode when moving is not forgetting something — it is doing it too late for it to help. Cancelling broadband a week out is fine; booking a mover a week out is not.",
    "Set your moving date and each stage gets a real deadline. Eight weeks out is for decisions that get more expensive the longer they are left; the final week is packing and the essentials box; the fortnight after is meter readings, registrations and anything the movers damaged.",
    "Everything is stored in this browser only — no account, nothing uploaded. That means it will not follow you to another device and clearing site data clears the list, so copy it out if you want it somewhere permanent.",
  ],
  faq: [
    {
      question: "When should I start planning a house move?",
      answer: "About eight weeks out for the decisions that get more expensive with delay — quotes, booking a mover, time off work. The tasks here are ordered by deadline rather than by category for that reason.",
    },
    {
      question: "What should go in a moving essentials box?",
      answer: "Kettle, mugs, toilet roll, chargers, basic tools, medicines and a change of clothes — everything you need in the first twelve hours before you find anything else. Load it last so it comes off first.",
    },
    {
      question: "When should I tell the utility companies?",
      answer: "About two weeks before, with closing meter readings taken on the day and photographed. Broadband needs longer — installation appointments are often several weeks out.",
    },
    {
      question: "What should I do on moving day?",
      answer: "Take and photograph final meter readings, walk every room and cupboard before the van leaves, keep documents and valuables with you rather than in the van, and get a receipt for the keys.",
    },
    {
      question: "Is my checklist saved if I close the tab?",
      answer: "Yes, in this browser's local storage. It will not appear on another device and clearing site data will remove it, so copy it out if you need it elsewhere.",
    },
  ],
};

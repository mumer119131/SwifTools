import { Users } from "lucide-react";

import type { Tool } from "@/config/tools";

export const teamNameGenerator: Tool = {
  slug: "team-name-generator",
  name: "Team Name Generator",
  category: "fun",
  description: "Names for quiz teams, sports sides and work squads — adjective plus noun, done right.",
  keywords: ["team name generator","quiz team names","funny team names","sports team name ideas","group name generator"],
  icon: Users,
  processing: "client",
  status: "live",
  steps: [
    "Generate a batch of adjective-and-noun team names.",
    "Regenerate until one makes the group laugh.",
    "Copy the whole list to put to a vote.",
  ],
  notes: [
    "Names are built adjective-plus-plural-noun, because that is the shape almost every real team name takes. It scans when shouted, which is the only test that actually matters for a team name.",
    "Forty adjectives against forty nouns gives sixteen hundred combinations, so a batch of twenty rarely repeats and regenerating gives genuinely different options rather than variations on the last set.",
    "Adding a prefix — your town, department or year group — is what turns a generic name into yours. Camden Iron Foxes reads as a real team in a way that Iron Foxes alone does not.",
  ],
  faq: [
    {
      question: "What makes a good team name?",
      answer: "Something that scans when shouted. Adjective plus plural noun is the shape almost every real team name takes, because it has a rhythm that works from the sideline.",
    },
    {
      question: "Can I add our town or department to the name?",
      answer: "Yes, as a prefix. It is what turns a generic name into yours — Camden Iron Foxes reads as a real team where Iron Foxes alone reads as a generator output.",
    },
    {
      question: "How many different names can it produce?",
      answer: "Around sixteen hundred combinations from the word lists, so a batch of twenty rarely repeats and regenerating gives genuinely different options rather than near-variants.",
    },
    {
      question: "Are these suitable for a work quiz team?",
      answer: "Yes — the word lists are chosen to be safe for a work setting, so nothing in the output will need explaining to anyone.",
    },
    {
      question: "How do we choose between the options?",
      answer: "Generate a batch, copy the list, and put it to a vote. Reading them out loud is the useful test — the one that gets a laugh in the room is the one that will stick.",
    },
  ],
};

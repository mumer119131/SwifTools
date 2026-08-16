import { UserRoundPlus } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomNameGenerator: Tool = {
  slug: "random-name-generator",
  name: "Random Name Generator",
  category: "fun",
  description: "Invent names for characters, test data and accounts — first, last or both.",
  keywords: [
    "random name generator",
    "fake name generator",
    "character name generator",
    "random first and last name",
    "name ideas generator",
  ],
  icon: UserRoundPlus,
  processing: "client",
  status: "live",
  steps: [
    "Choose the style and how many names you want.",
    "Generate. Names are combined from curated lists, never scraped.",
    "Copy them all out in one go.",
  ],
  notes: [
    "Names are combined from curated lists of given names and surnames drawn from several regions. Nothing is scraped from real people, and duplicates are avoided within a batch — the same name twice in a list of twenty reads as a bug whether or not it is one.",
    "Useful for characters in fiction, placeholder data in a design, test accounts, and any situation where you need a name that is plausible and definitely not someone's. Any resemblance to a real person is coincidence, which is inevitable when combining common names.",
    "If you need a whole record — address, email, phone number, company — rather than just a name, the fake data generator produces all of it at once in a form you can import.",
  ],
  faq: [
    {
      question: "Are these names based on real people?",
      answer: "No. They are assembled from lists of given names and surnames, so any resemblance to a real person is coincidence — which is unavoidable when combining common names, and is why they should not be treated as unique identifiers.",
    },
    {
      question: "Can I generate only first names or only surnames?",
      answer: "Yes, both separately as well as full names. That is useful when you already have half the name and need the other, or when populating a single database column.",
    },
    {
      question: "Are the names from a particular country?",
      answer: "They are drawn from several regions rather than one, which gives a realistic mix for most purposes. For locale-specific test data, the fake data generator lets you pick a region.",
    },
    {
      question: "Can I get the same name twice?",
      answer: "Not within a single batch — duplicates are filtered out. Across separate batches repeats are possible, since the pools are finite.",
    },
    {
      question: "What if I need addresses and emails too?",
      answer: "Use the fake data generator, which produces complete records — name, address, email, phone, company — and exports them as JSON, CSV or SQL for seeding a database.",
    },
  ],
};

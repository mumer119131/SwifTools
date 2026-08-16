import { Trophy } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tournamentBracket: Tool = {
  slug: "tournament-bracket",
  name: "Tournament Bracket Generator",
  category: "fun",
  description: "Build a single-elimination bracket from a list of players, seeded or drawn at random.",
  keywords: [
    "tournament bracket generator",
    "bracket maker",
    "single elimination bracket",
    "playoff bracket generator",
    "knockout bracket",
    "tournament draw",
  ],
  icon: Trophy,
  processing: "client",
  status: "live",
  steps: [
    "Paste the entrants, one per line.",
    "Seed them in the order given, or draw the bracket at random.",
    "Click a name to advance them. The bracket fills in as you go.",
  ],
  notes: [
    "Seeds are paired first against last, second against second-last, and so on, so the two strongest entrants can only meet in the final. That is what seeding is for, and it is why a bracket built by listing people in the order they signed up produces a lopsided tournament.",
    "An awkward number of entrants is padded with byes in the first round rather than given an extra round. Seven players means one walks straight into round two, which is how a real draw handles it — and the bye goes to the top seed.",
    "Clicking a name advances it; clicking it again undoes the result and clears everything downstream, because a changed result invalidates the matches that depended on it.",
  ],
  faq: [
    {
      question: "How does tournament seeding work?",
      answer: "The top seed is paired against the bottom seed, second against second-last, and so on. That keeps the strongest entrants apart until the later rounds, which is the entire purpose of seeding.",
    },
    {
      question: "What happens with an odd number of players?",
      answer: "The field is padded with byes up to the next power of two, and the byes go to the top seeds. Seven players means one walks into round two rather than the tournament gaining an extra round.",
    },
    {
      question: "How many matches are in a single-elimination tournament?",
      answer: "One fewer than the number of entrants, because every match eliminates exactly one player and all but the winner must be eliminated. Sixteen players means fifteen matches.",
    },
    {
      question: "Can I undo a result?",
      answer: "Yes — click the winner again. Everything downstream that depended on it is cleared as well, since a changed result invalidates the matches that followed from it.",
    },
    {
      question: "Can I draw the bracket at random instead of seeding?",
      answer: "Yes, with the random draw option. It shuffles the field before pairing, which is what you want when there is no meaningful ranking to seed by.",
    },
  ],
};

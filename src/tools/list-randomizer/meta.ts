import { Shuffle } from "lucide-react";

import type { Tool } from "@/config/tools";

export const listRandomizer: Tool = {
  slug: "list-randomizer",
  name: "List Randomizer",
  category: "fun",
  description: "Shuffle a list into a fair random order, or split it into random groups.",
  keywords: [
    "list randomizer",
    "shuffle a list",
    "random order generator",
    "randomize list",
    "team generator",
    "random group generator",
  ],
  icon: Shuffle,
  processing: "client",
  status: "live",
  steps: [
    "Paste your list, one item per line.",
    "Shuffle it into a random order, or split it into groups or teams.",
    "Fisher–Yates is used, so every ordering is equally likely.",
  ],
  notes: [
    "The shuffle is Fisher–Yates driven by the browser's cryptographic random source, which is the only method that makes every possible ordering equally likely. The common shortcut — sorting with a random comparator — is measurably biased and gives different results in different browsers, which matters when someone is going to argue about the outcome.",
    "Splitting into groups deals round-robin rather than slicing into blocks, so eleven people into three teams gives 4, 4 and 3 rather than an uneven split by luck.",
    "The other mode, groups of a fixed size, suits pairing people up or breaking a class into tables. The last group takes the remainder.",
  ],
  faq: [
    {
      question: "How do I randomly shuffle a list?",
      answer: "Paste it one item per line and shuffle. The order is produced by Fisher–Yates using the browser's cryptographic random source, so every possible ordering is equally likely.",
    },
    {
      question: "Why not just sort with a random comparator?",
      answer: "Because it is measurably biased. Sorting with a comparator that returns random values does not produce a uniform permutation, and the result differs between browsers depending on the sort implementation.",
    },
    {
      question: "How do I split a group into random teams?",
      answer: "Choose the number of groups and the shuffled list is dealt round-robin, so sizes stay within one of each other. Eleven people into three teams gives 4, 4 and 3.",
    },
    {
      question: "Can I make groups of a specific size?",
      answer: "Yes — set the size instead of the count, and the list is divided into groups of that many with the remainder in the last group. That suits pairing people up or filling tables.",
    },
    {
      question: "Is the shuffle repeatable?",
      answer: "No, deliberately. Each shuffle uses fresh cryptographic randomness, so running it twice gives different orders. That is what makes it a fair draw rather than a fixed arrangement.",
    },
  ],
};

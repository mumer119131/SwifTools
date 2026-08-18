import type { ToolContent } from "@/config/tool-content";

export const nicknameGeneratorContent: ToolContent = {
  steps: [
    "Pick a style — short and punchy, or two-part gamertag.",
    "Generate as many as you like.",
    "Copy the one you want, or the whole list.",
  ],
  notes: [
    "Prefixes and suffixes are chosen so the joins read cleanly. Most nickname generators concatenate random syllables and produce something unpronounceable; picking from parts designed to sit together is what makes the difference between a usable handle and a keyboard mash.",
    "Three styles: a two-part gamertag, a single short word, and a prefix attached to a name. Which reads best depends where it is going — a gamertag wants to be memorable and typeable, a nickname among friends wants to be short.",
    "Check availability before committing to one. A good handle is almost always taken on the platforms that matter, and finding that out after you have told people is worse than checking first.",
  ],
  faq: [
    {
      question: "How do I come up with a good gamertag?",
      answer: "Short, typeable and memorable beats clever. Generate a batch and read them out loud — anything you stumble over saying is something people will get wrong when they type it.",
    },
    {
      question: "Why do other nickname generators produce unpronounceable results?",
      answer: "Because they concatenate random syllables. Picking from prefixes and suffixes designed to join cleanly is what keeps the output sayable, which is most of what makes a handle usable.",
    },
    {
      question: "Should I use numbers in a username?",
      answer: "Only if you have to. Trailing numbers usually signal that the name was taken and are harder to communicate verbally. A different word is almost always better than the same word with 87 after it.",
    },
    {
      question: "How do I check if a nickname is available?",
      answer: "Search for it on the platforms you care about before committing. Good handles are almost always taken somewhere, and finding out after you have told people is the worse order to do it in.",
    },
    {
      question: "Can I generate a lot at once?",
      answer: "Yes — set the count and generate a batch. Duplicates are filtered within a batch, so a list of twenty gives you twenty distinct options.",
    },
  ],
};

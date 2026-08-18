import type { ToolContent } from "@/config/tool-content";

export const uuidGeneratorContent: ToolContent = {
  steps: [
    "Choose v4 for pure randomness, or v7 if you want IDs that sort by creation time.",
    "Set how many you need and pick a format — plain, uppercase, braced or as a quoted array.",
    "Copy them all at once, or download as a text file.",
  ],
  notes: [
    "Version 4 UUIDs are 122 bits of randomness in a fixed 128-bit layout, with six bits reserved to mark the version and variant. Generated here with the Web Crypto API rather than Math.random, which matters when a UUID is used as an unguessable identifier as well as a unique one.",
    "The collision odds are the reason they work without coordination. You would need to generate about 2.7 quintillion version 4 UUIDs before a collision became as likely as not — enough that a system can mint identifiers independently on many machines and simply assume they will not clash.",
    "Version 7 is worth considering for database primary keys. It puts a millisecond timestamp in the high bits, so UUIDs sort in creation order — which keeps B-tree indexes appending at the end rather than writing into random pages, a substantial difference in insert performance on a large table.",
  ],
  faq: [
    {
      question: "What is the chance of two UUIDs colliding?",
      answer: "Negligible. Version 4 carries 122 random bits, so you would need to generate roughly 2.7 quintillion of them before a collision became more likely than not. That is what makes it safe to generate them independently on many machines with no coordination.",
    },
    {
      question: "Are these UUIDs cryptographically random?",
      answer: "Yes. They come from the Web Crypto API rather than Math.random, so they are unpredictable as well as unique — which matters if the identifier is also acting as an unguessable token.",
    },
    {
      question: "What is the difference between UUID v4 and v7?",
      answer: "v4 is entirely random. v7 puts a millisecond timestamp in the leading bits so identifiers sort by creation time, which keeps database indexes appending at the end instead of writing into random pages. v7 is the better choice for primary keys.",
    },
    {
      question: "Can I use a UUID as a database primary key?",
      answer: "Yes, and it lets clients generate ids without a round trip. The cost is index fragmentation with v4, because random values scatter writes across the B-tree. v7 solves that by making them time-ordered.",
    },
    {
      question: "Are the UUIDs generated on a server?",
      answer: "No. They are generated in your browser with crypto.getRandomValues, so nothing is transmitted and no one else ever sees the values you generate.",
    },
  ],
};

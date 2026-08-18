import type { ToolContent } from "@/config/tool-content";

export const jsonToTypescriptContent: ToolContent = {
  steps: [
    "Paste a JSON sample — a whole array of records gives a better result than one.",
    "Choose interfaces or a single nested type, and whether fields should be readonly.",
    "Copy the generated types into your project.",
  ],
  notes: [
    "Paste an array rather than a single object whenever you can. Every element is compared against the others, so a key present in some records and missing from others comes out optional rather than required — which is the difference between a type that holds up against real data and one that quietly lies to you.",
    "This is inference from an example, and an example cannot tell you everything. A field that happens to be `null` in your sample might be a string in every other record; an empty array says nothing at all about what it holds. Both cases are called out above the output rather than guessed at silently, because a wrong type you were not warned about is worse than an honest `unknown`.",
    "Nested objects each get their own interface, named from the key that holds them, and plural keys are singularised — so `users` becomes `User[]` rather than `Users[]`. Keys that are not valid TypeScript identifiers are quoted.",
    "The whole thing runs in your browser, which matters here more than it looks: the JSON people paste into a type generator is usually a real response from a real API, complete with real customer data.",
  ],
  faq: [
    {
      question: "Should I paste one object or an array?",
      answer: "An array, if you have one. The generator compares elements against each other, so fields that appear in some records but not others come out optional. From a single object every field looks required, which is rarely true of a real API.",
    },
    {
      question: "How does it decide a field is optional?",
      answer: "By seeing it missing from at least one record in the sample. That only works when there is more than one record to compare, which is the argument for pasting the full array.",
    },
    {
      question: "What happens to null values?",
      answer: "A field that is null in some records and a value in others becomes a union with `null`. A field that is null in every record cannot be resolved from the sample at all, so it is typed `null` and flagged for you to widen by hand.",
    },
    {
      question: "Why is my array typed unknown[]?",
      answer: "Because it was empty in the sample. There is nothing in it to infer an element type from, so `unknown` is the honest answer — guessing would give you a type that compiles and does not describe your data.",
    },
    {
      question: "Should I use interfaces or a type alias?",
      answer: "Interfaces for anything you will reuse or extend, which is most API models. A single nested type alias is handier for a one-off shape you want to keep in one place.",
    },
  ],
};

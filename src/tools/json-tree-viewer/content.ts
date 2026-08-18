import type { ToolContent } from "@/config/tool-content";

export const jsonTreeViewerContent: ToolContent = {
  steps: [
    "Paste a JSON document, however large or deeply nested.",
    "Expand and collapse branches to explore it, or search to filter to matching keys and values.",
    "Copy any node's value, or its dot-notation path, straight from the tree.",
  ],
  notes: [
    "A large JSON document is hard to read as text because the structure is carried entirely by punctuation. The tree view turns that structure into something you can collapse and expand, so you can close the parts you do not care about and see the shape of what remains.",
    "Every node shows its path, which is the practical payoff. Knowing that a value lives at data.items[3].attributes.name is what you need to write the accessor in code, and counting brackets by hand in a 2,000-line response is exactly the kind of task people get wrong.",
    "Arrays show their length and objects their key count before you expand them, so you can tell an empty array from a missing field at a glance. That distinction matters more than it looks — an API returning [] means something quite different from one returning null.",
  ],
  faq: [
    {
      question: "How do I find the path to a value in JSON?",
      answer: "Expand to the value and its full path is shown — something like data.items[3].attributes.name. That is the accessor you would write in code, worked out for you rather than counted through brackets by hand.",
    },
    {
      question: "Can I collapse parts of the document?",
      answer: "Yes. Any object or array can be collapsed, and arrays show their length and objects their key count while closed, so you can navigate a large response without expanding everything.",
    },
    {
      question: "What is the difference between an empty array and null?",
      answer: "An empty array means the field exists and currently has no entries; null means it has no value at all. APIs use the distinction deliberately, and the viewer shows both explicitly rather than hiding the difference.",
    },
    {
      question: "Why won't my document load?",
      answer: "It has to be valid JSON to be parsed into a tree. If it fails, run it through the JSON formatter first — that reports the exact position where parsing stopped.",
    },
    {
      question: "Is my data uploaded?",
      answer: "No. The document is parsed and rendered in your browser, so API responses containing tokens or personal data stay on your machine.",
    },
  ],
};

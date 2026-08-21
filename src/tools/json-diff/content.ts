import type { ToolContent } from "@/config/tool-content";

export const jsonDiffContent: ToolContent = {
  steps: [
    "Paste the two documents — an API response before and after, two config files.",
    "Differences are reported as paths rather than line numbers.",
    "Key order and formatting are ignored, because they are not differences.",
  ],
  notes: [
    "A line-based diff on JSON is close to useless, and it is what most people reach for. Reorder the keys and every line shows as changed while nothing changed at all. Reformat the file and the whole document is different. Change one value six levels down and you are told a line differs rather than which path to look at.",
    "This compares the parsed values instead. Whitespace and key order are irrelevant by construction, and every difference is reported as the path where it lives — `config.retries`, `users[2].email` — which is something you can act on directly.",
    "Type changes are separated from value changes, because they usually mean something different. A number becoming the string \"3\" is almost always a serialisation bug rather than an intentional edit, and burying it among ordinary value changes is how it gets missed.",
    "One honest limitation: arrays are compared by position. Insert an item at the front and every later index reports as changed, because working out that it was an insertion rather than a wholesale rewrite is a substantially harder problem and any attempt at it guesses at intent. Comparing by index and saying so is more useful than a clever answer that is sometimes wrong.",
    "Both documents are parsed and compared in your browser. API responses are exactly the sort of thing that carries real customer data, and none of it goes anywhere.",
  ],
  faq: [
    {
      question: "Why not just use a text diff on JSON?",
      answer: "Because key order and formatting are not differences, and a text diff cannot tell. Reordering keys shows every line as changed; reformatting shows the entire file as different. Comparing the parsed values sidesteps both.",
    },
    {
      question: "Does key order matter?",
      answer: "No. Two documents with the same data in different key order are reported as identical, which is correct — JSON objects are unordered by definition.",
    },
    {
      question: "How are arrays compared?",
      answer: "By position. That means inserting an item at the front shows every later index as changed. Detecting the insertion instead is a much harder problem and any solution guesses at intent, so this compares by index and tells you it does.",
    },
    {
      question: "What is a type change?",
      answer: "The value at a path changed kind rather than content — a number became a string, or an object became null. It is called out separately because it is usually a serialisation bug rather than a deliberate edit, and it is easy to miss among ordinary changes.",
    },
    {
      question: "Are my documents uploaded?",
      answer: "No. Both are parsed and compared in your browser, which matters because API responses routinely contain real customer data.",
    },
  ],
};

import type { ToolContent } from "@/config/tool-content";

export const jsonFormatterContent: ToolContent = {
  steps: [
    "Paste your JSON — valid or not.",
    "It is parsed as you type. Errors report the exact line and column, with the offending text highlighted.",
    "Switch between beautified and minified output, then copy or download the result.",
  ],
  notes: [
    "Formatting parses the JSON into a real structure and prints it back with consistent indentation, which means a document that formats successfully is definitely valid. That is the useful part: the formatter doubles as a validator, and a parse error tells you the exact character offset where the document stopped making sense.",
    "The errors people hit most often are the same three: a trailing comma after the last item in an object or array, single quotes instead of double quotes, and unquoted keys. All three are legal in JavaScript and illegal in JSON, which is why code that works in a browser console fails when saved to a .json file.",
    "Minifying strips whitespace without changing meaning, which matters for payload size over the wire but makes the document unreadable. Keep formatted JSON in source control and minify at the point of transmission, not the other way round.",
  ],
  faq: [
    {
      question: "Why is my JSON invalid?",
      answer: "The three usual causes are a trailing comma after the last element, single quotes instead of double quotes, and keys without quotes. All are valid JavaScript and none are valid JSON. The error message gives the character position where parsing stopped.",
    },
    {
      question: "Does formatting change my data?",
      answer: "No. The document is parsed into a structure and printed back out, so only whitespace changes. Key order is preserved, and values are untouched. If the output differs in any other way, the input was not valid JSON.",
    },
    {
      question: "What indentation should I use?",
      answer: "Two spaces is the most common convention and what most linters default to. Four is easier to scan for deeply nested documents. Tabs are unusual in JSON and some tooling renders them inconsistently.",
    },
    {
      question: "Can I format very large JSON files?",
      answer: "Files of a few megabytes are fine. Beyond that the browser has to hold both the text and the parsed structure in memory at once, so very large documents may be slow — a streaming parser on the command line is better suited to those.",
    },
    {
      question: "Is my JSON sent to a server?",
      answer: "No. Parsing and formatting happen in your browser, which matters because JSON pasted into a formatter routinely contains API keys, tokens and customer records.",
    },
  ],
};

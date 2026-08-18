import type { ToolContent } from "@/config/tool-content";

export const sqlFormatterContent: ToolContent = {
  steps: [
    "Paste the query.",
    "Pick your dialect — the keyword sets differ enough to matter.",
    "Copy the formatted result, or minify it back to one line for embedding in code.",
  ],
  notes: [
    "Formatting only ever changes whitespace, line breaks and keyword casing. Nothing is rewritten, no clauses are reordered and nothing inside a string literal is touched — a formatter that changed what a query meant would be considerably worse than no formatter at all.",
    "The dialect matters more than it looks. Each has its own keywords and its own quoting rules, and a formatter using the wrong set will treat a keyword as an identifier or break on syntax it does not recognise. If your query uses backticks it is MySQL or MariaDB; square brackets mean SQL Server.",
    "Minifying back to one line is the other half of the job. Queries embedded in application code often need to be a single string, and collapsing a formatted query is safer than writing it flat by hand.",
    "A long query that has become unreadable is usually one worth reading carefully. Formatting it is often the fastest way to notice the join condition that was quietly dropped.",
  ],
  faq: [
    {
      question: "Does formatting change what my query does?",
      answer: "No. Only whitespace, line breaks and keyword casing change. Clauses are not reordered, nothing is rewritten, and the contents of string literals are left exactly as they are.",
    },
    {
      question: "Which SQL dialect should I choose?",
      answer: "The one your database speaks — the keyword sets and quoting rules genuinely differ. Backticks around identifiers mean MySQL or MariaDB; square brackets mean SQL Server. Standard SQL is a reasonable default if you are unsure.",
    },
    {
      question: "Can I convert a formatted query back to one line?",
      answer: "Yes, that is what the minify option does. It is the form you want when embedding a query in application code as a single string.",
    },
    {
      question: "Is my query sent to a server?",
      answer: "No. Formatting happens entirely in your browser, which matters because production queries routinely contain table names, schema details and sometimes literal values you would not want to paste elsewhere.",
    },
  ],
};

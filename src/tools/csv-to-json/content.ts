import type { ToolContent } from "@/config/tool-content";

export const csvToJsonContent: ToolContent = {
  steps: [
    "Paste CSV, or JSON if you want to go the other way.",
    "Pick the delimiter and whether numbers and booleans should be typed.",
    "Check the table preview, then copy or download the result.",
  ],
  notes: [
    "The parser reads character by character rather than splitting on commas, which is the only approach that handles quoting correctly. A CSV field may be quoted, and a quoted field may contain commas, line breaks and doubled quotes — all of which a naive split gets wrong, usually silently, producing rows with the wrong number of columns instead of an error. Rows whose column count does not match the header are flagged by line number rather than quietly dropped.",
    "Type inference is deliberately conservative. A CSV holds only text, so turning \"42\" into a number is a guess, and the wrong guess corrupts data — a product code of 007 becomes 7, a phone number becomes a float, and an ID like 1e5 becomes 100000. Values are only converted when the number round-trips back to exactly the original string, which keeps leading zeros and formatted numbers as text.",
    "Going the other way, the header is the union of every object's keys rather than the first object's. A sparse array where later records carry fields the first one lacks would otherwise lose those columns entirely — and nested objects are serialised as JSON rather than stringified to the useless \"[object Object]\".",
  ],
  faq: [
    {
      question: "How do I convert CSV to JSON?",
      answer: "Paste the CSV and the JSON appears alongside it. The first row is treated as the header and becomes the object keys; every following row becomes one object in an array. Quoted fields containing commas or line breaks are handled correctly.",
    },
    {
      question: "Why are my numbers coming out as strings?",
      answer: "Type inference only converts a value when the number round-trips back to the exact original text. \"007\" and \"1.50\" stay strings on purpose, because converting them would destroy a product code or a formatted price. Turn inference off entirely if you want everything as text.",
    },
    {
      question: "Does it handle commas inside quoted fields?",
      answer: "Yes. The parser tracks quote state character by character, so a field like \"Hopper, Grace\" stays one value. It also handles doubled quotes as an escaped quote and line breaks inside quoted fields, which is what RFC 4180 specifies and what spreadsheets actually produce.",
    },
    {
      question: "Can I convert TSV or semicolon-separated files?",
      answer: "Yes — choose tab, semicolon or pipe as the delimiter. Semicolons are the default CSV separator across much of Europe, where the comma is the decimal mark, so a file exported from a European spreadsheet usually needs that setting.",
    },
    {
      question: "Why does it say my rows are ragged?",
      answer: "Some rows have a different number of columns from the header, which is flagged by line number. It usually means an unescaped quote earlier in the file has thrown the parser's quote state off, so the fault is often several lines above the one reported.",
    },
    {
      question: "Is my CSV uploaded to a server?",
      answer: "No. Parsing and conversion both run in your browser, which matters because CSV exports are usually customer lists, transactions or analytics extracts.",
    },
  ],
};
